#!/usr/bin/env python3
"""Stage 29 legally cleared Montenegrin MP3 files for the DEV encrypted server.

This tool does not record, synthesize or grant rights to third-party voices.
Use only audio for which you hold appropriate commercial distribution rights.
"""
import argparse
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT/'server_qwen_audio'/'me'


def find_files(src):
    files=[]
    for n in range(1,30):
        p=next((src/f'{n:02d}{suffix}' for suffix in ('-me.mp3','.mp3') if (src/f'{n:02d}{suffix}').is_file()),None)
        if p is None:raise FileNotFoundError(f'Missing {n:02d}-me.mp3 (or {n:02d}.mp3) in {src}')
        if p.stat().st_size<3000:raise ValueError(f'Audio too small: {p}')
        with p.open('rb') as fp:
            header=fp.read(3)
        if not (header == b'ID3' or (header[0]==255 and (header[1]&224)==224)):
            raise ValueError(f'File does not look like MP3: {p}')
        files.append(p)
    return files


def main():
    parser=argparse.ArgumentParser(description='Stage Montenegrin audio for local testing')
    parser.add_argument('--source',type=Path,required=True)
    parser.add_argument('--rights-confirmed',action='store_true',help='You have permission to use the audio in a commercial app')
    args=parser.parse_args()
    if not args.rights_confirmed:
        parser.error('Provide --rights-confirmed only if you own or have licensed these 29 recordings.')
    files=find_files(args.source.resolve())
    DEST.mkdir(parents=True,exist_ok=True)
    for old in DEST.glob('[0-9][0-9].mp3'):old.unlink()
    for n,file in enumerate(files,1):shutil.copy2(file,DEST/f'{n:02d}.mp3')
    print(f'Staged 29 Montenegrin files for LOCAL DEV server in {DEST}')

if __name__=='__main__':
    try:main()
    except Exception as exc:print('ERROR:',exc,file=sys.stderr);sys.exit(1)
