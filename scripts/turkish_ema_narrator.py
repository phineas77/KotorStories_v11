#!/usr/bin/env python3
"""Generate independent Turkish narration MP3 files with EMA Lightning.

License note: EMA Lightning code/weights are Apache-2.0. This script does not
modify qwen_local_narrator.py or existing English/Italian/... audio files.
"""
from __future__ import annotations

import shutil
import argparse
import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXT_FILE = ROOT / "content" / "translations" / "tr.json"
OUTPUT_DIR = ROOT / "local_qwen_audio" / "tr" / "ema"


def get_chapters(path: Path) -> dict[int, dict]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if payload.get("language") != "tr":
        raise ValueError("Expected a Turkish JSON file with language=tr")
    chapters = payload.get("chapters", [])
    data = {c["number"]: c for c in chapters}
    if set(data) != set(range(1, 30)):
        raise ValueError("Expected chapters numbered 1 through 29")
    return data


def main() -> None:
    p = argparse.ArgumentParser(description="Kotor Stories: Turkish EMA Lightning narrator")
    group = p.add_mutually_exclusive_group()
    group.add_argument("--one", action="store_true", help="Only generate selected chapter (default 1)")
    group.add_argument("--all", action="store_true", help="Generate all 29 chapters; skips existing MP3")
    p.add_argument("--chapter", type=int, default=1)
    p.add_argument("--overwrite", action="store_true", help="Regenerate existing MP3 files")
    p.add_argument("--show-tts-text", action="store_true", help="Print input text without loading TTS")
    p.add_argument("--speed", type=float, default=1.0, help="Speech speed, default 1.0")
    p.add_argument("--json", type=Path, default=TEXT_FILE)
    p.add_argument("--output-dir", type=Path, default=OUTPUT_DIR)
    args = p.parse_args()
    if not 0.25 <= args.speed <= 4:
        p.error("--speed must be between 0.25 and 4")
    if not 1 <= args.chapter <= 29:
        p.error("--chapter must be 1..29")

    chapters = get_chapters(args.json)
    numbers = list(range(1, 30)) if args.all else [args.chapter]
    if args.show_tts_text:
        for number in numbers:
            ch = chapters[number]
            print(f"\n{number:02d} · {ch['title']}\n{ch['text']}\n")
        return

    output = args.output_dir
    output.mkdir(parents=True, exist_ok=True)
    needed = [n for n in numbers if args.overwrite or not (output / f"{n:02d}-tr.mp3").exists()]
    if not needed:
        print("Everything requested exists. Use --overwrite only to regenerate.")
        return
    try:
        from ema_lightning import EMA
        import imageio_ffmpeg
    except ImportError as exc:
        raise SystemExit("Install dependencies into the dedicated Turkish environment: pip install ema-lightning imageio-ffmpeg") from exc

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    print("Loading EMA Lightning Turkish voice...")
    tts = EMA()
    for number in needed:
        chapter = chapters[number]
        destination = output / f"{number:02d}-tr.mp3"
        print(f"Generating {number:02d}/29 · {chapter['title']}", flush=True)
        with tempfile.TemporaryDirectory(prefix="kotor_tts_") as d:
            wav = Path(d) / "raw.wav"
            mp3 = Path(d) / "audio.mp3"
            speech = tts.say(chapter["text"], speed=args.speed, path=str(wav))
            subprocess.run(
                [ffmpeg, "-hide_banner", "-loglevel", "error", "-y",
                 "-i", str(wav), "-ac", "1", "-ar", "24000",
                 "-codec:a", "libmp3lame", "-b:a", "96k", str(mp3)],
                check=True,
            )
            if not mp3.exists() or mp3.stat().st_size < 1024:
                raise RuntimeError(f"Could not produce MP3 for chapter {number}")
            shutil.copy2(mp3, destination)
            print(f"  Saved {destination} ({speech.duration:.1f}s)")
    print("Finished. Existing Qwen outputs were not touched.")


if __name__ == "__main__":
    main()
