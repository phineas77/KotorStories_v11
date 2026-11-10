#!/usr/bin/env python3
"""Kotor Stories – Qwen3-TTS local narration, preview/batch and staging for DEV server.

Examples:
    python scripts/qwen_local_narrator.py --preview
    python scripts/qwen_local_narrator.py --stage --speaker Aiden --chapter 1
    python scripts/qwen_local_narrator.py --all --speaker Aiden
    python scripts/qwen_local_narrator.py --stage-all --speaker Aiden
    python scripts/qwen_local_narrator.py --check

Does not use ElevenLabs, never uploads speech, never modify pre-existing MP3 demos.
Produces Qwen audio *outside* the mobile bundle and stages an explicit selection
for the protected local development server.
"""
import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STORIES = ROOT / "content" / "stories.json"
GENERATED = ROOT / "local_qwen_audio" / "en"
SERVER_AUDIO = ROOT / "server_qwen_audio" / "en"
MODEL_ID = "Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice"


def chapters():
    data = json.loads(STORIES.read_text(encoding="utf-8"))
    nums = [x["number"] for x in data]
    if nums != list(range(1, 30)):
        raise RuntimeError("Expected exactly 29 chapters, sorted 1...29, in content/stories.json")
    for chapter in data:
        if not chapter["en"].strip():
            raise ValueError(f"Missing English narration in {chapter['number']}")
    return data


def segments(text, max_chars=290):
    """Maintain sentence boundaries where possible; avoid long generation prompts."""
    text = " ".join(text.split())
    result, current = [], ""
    for sent in re.split(r"(?<=[.!?])\s+", text):
        words = sent.split()
        if len(sent) > max_chars:
            for word in words:
                if len(current) + len(word) + 1 > max_chars and current:
                    result.append(current.strip())
                    current = ""
                current += word + " "
            continue
        if len(current) + len(sent) + 1 > max_chars and current:
            result.append(current.strip())
            current = ""
        current += sent + " "
    if current.strip():
        result.append(current.strip())
    return result


def output_path(number, speaker):
    return GENERATED / speaker.lower() / f"{number:02d}-en.mp3"


def meta_path(path):
    return path.with_suffix(".json")


def mp3_ok(path):
    if not path.is_file() or path.stat().st_size < 3000:
        return False
    with path.open("rb") as fp:
        start = fp.read(3)
    return start == b"ID3" or (len(start) >= 2 and start[0] == 255 and start[1] & 224 == 224)


def sha_text(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def model_load(device):
    import torch
    from qwen_tts import Qwen3TTSModel
    chosen = device if device != "auto" else ("cuda:0" if torch.cuda.is_available() else "cpu")
    dtype = torch.bfloat16 if chosen.startswith("cuda") else torch.float32
    print(f"Loading {MODEL_ID} on {chosen}; dtype={dtype}", flush=True)
    model = Qwen3TTSModel.from_pretrained(
        MODEL_ID, device_map=chosen, dtype=dtype, attn_implementation="sdpa"
    )
    return model


def synthesize_one(model, chapter, speaker, overwrite=False):
    import numpy as np
    import soundfile as sf
    import imageio_ffmpeg

    number, text = chapter["number"], chapter["en"]
    dest = output_path(number, speaker)
    target_hash = sha_text(text)
    if mp3_ok(dest) and meta_path(dest).is_file() and not overwrite:
        info = json.loads(meta_path(dest).read_text(encoding="utf-8"))
        if info.get("sourceTextSha256") == target_hash and info.get("speaker") == speaker:
            print(f"SKIP {number:02d} {speaker}: already generated")
            return
        raise RuntimeError(f"Source text changed for {dest}; use --overwrite to regenerate")

    print(f"Generating chapter {number:02d} · {chapter['title_en']} · {speaker}", flush=True)
    wave_parts, sample_rate = [], None
    for idx, part in enumerate(segments(text), 1):
        print(f"  sentence group {idx}, {len(part)} chars", flush=True)
        # 0.6B does not reliably support instruction/style prompts. Use neutral
        # standard synthesis; narration quality must be reviewed by listening.
        wavs, sr = model.generate_custom_voice(text=part, language="English", speaker=speaker)
        arr = np.asarray(wavs[0], dtype=np.float32).reshape(-1)
        if arr.size == 0 or not np.isfinite(arr).all():
            raise RuntimeError(f"Invalid generated waveform for chapter {number}")
        if sample_rate is not None and sample_rate != sr:
            raise RuntimeError("Unexpected Qwen sample-rate change")
        sample_rate = sr
        wave_parts.append(arr)
        wave_parts.append(np.zeros(int(sr * 0.18), dtype=np.float32))

    dest.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "voice.wav"
        mp3 = Path(tmp) / "voice.mp3"
        sf.write(wav, np.concatenate(wave_parts), sample_rate)
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
        subprocess.run([
            ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav),
            "-ac", "1", "-c:a", "libmp3lame", "-b:a", "64k", str(mp3)
        ], check=True)
        if not mp3_ok(mp3):
            raise RuntimeError("Generated file is not a valid MP3")
        shutil.copy2(mp3, dest)
    meta = {
        "model": MODEL_ID,
        "modelLicense": "Apache-2.0 (verify license and accompanying files before sale)",
        "speaker": speaker,
        "language": "en",
        "chapter": number,
        "sourceTextSha256": target_hash,
        "generatedUtc": datetime.now(timezone.utc).isoformat(),
        "commercialReady": False,
        "note": "AI speech requires editorial and licensing review; no ElevenLabs content used."
    }
    meta_path(dest).write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  Saved {dest.relative_to(ROOT)} ({dest.stat().st_size / 1024:.0f} KB)")


def stage_voice(data, speaker, numbers):
    # Validate everything before modifying the staged selection.
    for number in numbers:
        dest = output_path(number, speaker)
        if not mp3_ok(dest) or not meta_path(dest).exists():
            raise FileNotFoundError(f"Qwen MP3/metadata missing for {number:02d} {speaker}. Generate it first.")
        meta = json.loads(meta_path(dest).read_text(encoding="utf-8"))
        chapter = data[number - 1]
        if (meta.get("model") != MODEL_ID or meta.get("speaker") != speaker
                or meta.get("sourceTextSha256") != sha_text(chapter["en"])):
            raise ValueError(f"Audio metadata mismatch for chapter {number:02d}")
    # Atomic selection: never mix Aiden, Ryan, or old demo MP3s in Qwen mode.
    SERVER_AUDIO.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=SERVER_AUDIO.parent, prefix="staging-") as tmp:
        staged_dir = Path(tmp) / "en"
        staged_dir.mkdir()
        for number in numbers:
            shutil.copy2(output_path(number, speaker), staged_dir / f"{number:02d}.mp3")
        (staged_dir / "selected-voice.json").write_text(json.dumps({
            "speaker": speaker, "chapters": list(numbers), "model": MODEL_ID,
            "purpose": "Local DEV encrypted-pack server ONLY. Do not redistribute before review."
        }, indent=2), encoding="utf-8")
        for old in SERVER_AUDIO.glob("[0-9][0-9].mp3"):
            old.unlink()
        for file in staged_dir.iterdir():
            shutil.copy2(file, SERVER_AUDIO / file.name)
    print("Staged Qwen chapters for LOCAL encrypted server:", ", ".join(map(str, numbers)))
    print("Restart server with KOTOR_AUDIO_SOURCE=qwen to load these tracks.")


def main():
    ap = argparse.ArgumentParser(description="Local Qwen3-TTS – Kotor Stories")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--preview", action="store_true", help="Generate chapter 01 with BOTH Aiden and Ryan")
    g.add_argument("--all", action="store_true", help="Generate all 29 with --speaker")
    g.add_argument("--stage", action="store_true", help="Stage one selected recording for encrypted server")
    g.add_argument("--stage-all", action="store_true", help="Stage all currently ready recordings for selected voice")
    g.add_argument("--check", action="store_true", help="List ready files without loading the AI model")
    ap.add_argument("--speaker", choices=("Aiden", "Ryan"), default="Aiden")
    ap.add_argument("--chapter", type=int, default=1)
    ap.add_argument("--device", choices=("auto", "cuda:0", "cpu"), default="auto")
    ap.add_argument("--overwrite", action="store_true")
    args = ap.parse_args()
    if not 1 <= args.chapter <= 29:
        ap.error("--chapter must be 1..29")
    data = chapters()
    if args.check:
        for voice in ("Aiden", "Ryan"):
            ready = [n for n in range(1,30) if mp3_ok(output_path(n,voice))]
            print(f"{voice}: {len(ready)}/29 tracks: {ready}")
        return
    if args.stage:
        stage_voice(data,args.speaker,[args.chapter]);return
    if args.stage_all:
        ready = [n for n in range(1,30) if mp3_ok(output_path(n,args.speaker))]
        if not ready:
            raise RuntimeError("No Qwen tracks are available to stage")
        stage_voice(data,args.speaker,ready);return
    model = model_load(args.device)
    speakers = ("Aiden", "Ryan") if args.preview else (args.speaker,)
    numbers = [1] if args.preview else range(1,30)
    for number in numbers:
        for voice in speakers:
            synthesize_one(model,data[number-1],voice,args.overwrite)
    print("Done. Listen to the files in local_qwen_audio/en/<speaker>/.")
    print("After choosing a speaker, run --stage --speaker NAME --chapter 1")


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
