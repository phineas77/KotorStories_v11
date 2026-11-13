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
from italian_tts_numbers import PREPROCESSOR_VERSION, spoken_italian

ROOT = Path(__file__).resolve().parent.parent
STORIES = ROOT / "content" / "stories.json"
GENERATED = ROOT / "local_qwen_audio"
SERVER_AUDIO = ROOT / "server_qwen_audio"
MODEL_ID = "Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice"
LANGUAGES = {"en":"English", "it":"Italian", "de":"German", "fr":"French", "es":"Spanish"}


def content_for(language, required_numbers=None):
    data = chapters()
    if language == 'en':
        return data
    path = ROOT / 'content' / 'translations' / f'{language}.json'
    if not path.exists():
        raise FileNotFoundError(f'Missing translations: {path}. Run translate_tours.py first.')
    translated = json.loads(path.read_text(encoding='utf-8'))
    items = {int(v['number']):v for v in translated.get('chapters',[])}
    if translated.get('language') != language:
        raise ValueError(f'Wrong translation file language for {language}')
    required = set(range(1,30)) if required_numbers is None else set(required_numbers)
    for item in data:
        if item['number'] not in required:
            continue
        val = items.get(item['number'])
        if not val or not val.get('text','').strip() or not val.get('title','').strip():
            raise ValueError(f'Incomplete translation {language} chapter {item["number"]}')
        item[f'text_{language}'] = val['text']
        item[f'title_{language}'] = val['title']
    return data



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


def output_path(number, speaker, language="en"):
    return GENERATED / language / speaker.lower() / f"{number:02d}-{language}.mp3"


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


def speech_input(text, language):
    """Only spoken Italian is normalized; displayed translations stay intact."""
    return spoken_italian(text) if language == "it" else text


def italian_meta_ok(meta, text, language):
    if language != "it":
        return True
    return (meta.get("ttsPreprocessor") == PREPROCESSOR_VERSION
            and meta.get("spokenTextSha256") == sha_text(speech_input(text, language)))


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


def synthesize_one(model, chapter, speaker, language="en", overwrite=False):
    import numpy as np
    import soundfile as sf
    import imageio_ffmpeg

    number, text = chapter["number"], chapter["en"] if language == "en" else chapter[f"text_{language}"]
    dest = output_path(number, speaker, language)
    target_hash = sha_text(text)
    spoken = speech_input(text, language)
    if mp3_ok(dest) and meta_path(dest).is_file() and not overwrite:
        info = json.loads(meta_path(dest).read_text(encoding="utf-8"))
        if (info.get("sourceTextSha256") == target_hash and info.get("speaker") == speaker
                and italian_meta_ok(info, text, language)):
            print(f"SKIP {number:02d} {speaker}: already generated")
            return
        raise RuntimeError(f"Source text changed for {dest}; use --overwrite to regenerate")

    print(f"Generating chapter {number:02d} · {chapter['title_en'] if language == "en" else chapter[f"title_{language}"]} · {speaker}", flush=True)
    wave_parts, sample_rate = [], None
    for idx, part in enumerate(segments(spoken), 1):
        print(f"  sentence group {idx}, {len(part)} chars", flush=True)
        # 0.6B does not reliably support instruction/style prompts. Use neutral
        # standard synthesis; narration quality must be reviewed by listening.
        wavs, sr = model.generate_custom_voice(text=part, language=LANGUAGES[language], speaker=speaker)
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
        "language": language,
        "chapter": number,
        "sourceTextSha256": target_hash,
        "generatedUtc": datetime.now(timezone.utc).isoformat(),
        "commercialReady": False,
        "note": "AI speech requires editorial and licensing review; no ElevenLabs content used."
    }
    if language == "it":
        meta["ttsPreprocessor"] = PREPROCESSOR_VERSION
        meta["spokenTextSha256"] = sha_text(spoken)
    meta_path(dest).write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  Saved {dest.relative_to(ROOT)} ({dest.stat().st_size / 1024:.0f} KB)")


def stage_voice(data, speaker, numbers, language="en"):
    # Validate everything before modifying the staged selection.
    for number in numbers:
        dest = output_path(number, speaker, language)
        if not mp3_ok(dest) or not meta_path(dest).exists():
            raise FileNotFoundError(f"Qwen MP3/metadata missing for {number:02d} {speaker}. Generate it first.")
        meta = json.loads(meta_path(dest).read_text(encoding="utf-8"))
        chapter = data[number - 1]
        if (meta.get("model") != MODEL_ID or meta.get("speaker") != speaker
                or meta.get("language") != language
                or meta.get("sourceTextSha256") != sha_text(chapter["en"] if language == "en" else chapter[f"text_{language}"])
                or not italian_meta_ok(meta, chapter["en"] if language == "en" else chapter[f"text_{language}"], language)):
            raise ValueError(f"Audio metadata mismatch for chapter {number:02d}")
    # Atomic selection: never mix Aiden, Ryan, or old demo MP3s in Qwen mode.
    server_audio = SERVER_AUDIO / language
    server_audio.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=SERVER_AUDIO, prefix="staging-") as tmp:
        staged_dir = Path(tmp) / language
        staged_dir.mkdir()
        for number in numbers:
            shutil.copy2(output_path(number, speaker, language), staged_dir / f"{number:02d}.mp3")
        (staged_dir / "selected-voice.json").write_text(json.dumps({
            "speaker": speaker, "language": language, "chapters": list(numbers), "model": MODEL_ID,
            "purpose": "Local DEV encrypted-pack server ONLY. Do not redistribute before review."
        }, indent=2), encoding="utf-8")
        for old in server_audio.glob("[0-9][0-9].mp3"):
            old.unlink()
        for file in staged_dir.iterdir():
            shutil.copy2(file, server_audio / file.name)
    print(f"Staged {language} chapters for LOCAL encrypted server:", ", ".join(map(str, numbers)))
    print("Restart server with KOTOR_AUDIO_SOURCE=qwen to load these tracks.")


def main():
    ap = argparse.ArgumentParser(description="Local Qwen3-TTS – Kotor Stories")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--preview", action="store_true", help="Generate one chapter with chosen --speaker and --language")
    g.add_argument("--one", action="store_true", help="Generate one --chapter with selected --language")
    g.add_argument("--all", action="store_true", help="Generate all 29 with --speaker")
    g.add_argument("--stage", action="store_true", help="Stage one selected recording for encrypted server")
    g.add_argument("--stage-all", action="store_true", help="Stage all currently ready recordings for selected voice")
    g.add_argument("--check", action="store_true", help="List ready files without loading the AI model")
    g.add_argument("--show-tts-text", action="store_true", help="Show exactly what Qwen will read, without loading the model")
    ap.add_argument("--speaker", choices=("Aiden", "Ryan"), default="Aiden")
    ap.add_argument("--language", choices=tuple(LANGUAGES), default="en")
    ap.add_argument("--chapter", type=int, default=1)
    ap.add_argument("--device", choices=("auto", "cuda:0", "cpu"), default="auto")
    ap.add_argument("--overwrite", action="store_true")
    args = ap.parse_args()
    if not 1 <= args.chapter <= 29:
        ap.error("--chapter must be 1..29")
    required = [args.chapter] if (args.preview or args.one or args.stage or args.show_tts_text) else None
    if args.stage_all:
        required = [n for n in range(1,30) if mp3_ok(output_path(n,args.speaker,args.language))]
    data = chapters() if args.check else content_for(args.language, required)
    if args.check:
        for lang in LANGUAGES:
            ready = [n for n in range(1,30) if mp3_ok(output_path(n,args.speaker,lang))]
            print(f"{lang} / {args.speaker}: {len(ready)}/29 tracks: {ready}")
        return
    if args.show_tts_text:
        chapter = data[args.chapter - 1]
        raw = chapter["en"] if args.language == "en" else chapter[f"text_{args.language}"]
        print(speech_input(raw, args.language))
        return
    if args.stage:
        stage_voice(data,args.speaker,[args.chapter], args.language);return
    if args.stage_all:
        ready = [n for n in range(1,30) if mp3_ok(output_path(n,args.speaker,args.language))]
        if not ready:
            raise RuntimeError("No Qwen tracks are available to stage")
        stage_voice(data,args.speaker,ready,args.language);return
    model = model_load(args.device)
    speakers = (args.speaker,)
    numbers = [args.chapter] if (args.preview or args.one) else range(1,30)
    for number in numbers:
        for voice in speakers:
            synthesize_one(model,data[number-1],voice,args.language,args.overwrite)
    print(f"Done. Listen to the files in local_qwen_audio/{args.language}/<speaker>/.")
    print("After choosing a speaker, run --stage --speaker NAME --chapter 1")


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
