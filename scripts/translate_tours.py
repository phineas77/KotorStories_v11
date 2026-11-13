#!/usr/bin/env python3
"""Local offline/online-on-first-download draft translation for Kotor Stories.

Produces 29 translation drafts with source SHA and QA year checks.
Uses explicit commercial-friendly model cards (see README). Translations
must be checked by a native speaker before the commercial app is published.
Never changes original EN/ME narrations or audio files.
"""
import argparse
import csv
import hashlib
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'content' / 'stories.json'
TARGET_DIR = ROOT / 'content' / 'translations'
MODELS = {
    'it': 'Helsinki-NLP/opus-mt-en-it',
    'de': 'Helsinki-NLP/opus-mt-en-de',
    'fr': 'Helsinki-NLP/opus-mt-en-fr',
    'es': 'Helsinki-NLP/opus-mt-en-es',
}
YEARS = re.compile(r'(?<!\d)(?:1\d{3}|20\d{2})(?!\d)')


def sha(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8'))


def write_json_atomic(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix('.json.part')
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    os.replace(temp, path)


def source_stories():
    data = read_json(SOURCE)
    if len(data) != 29 or [x['number'] for x in data] != list(range(1,30)):
        raise ValueError('content/stories.json must contain 29 ordered chapters')
    return data


def new_file(lang):
    path = TARGET_DIR / f'{lang}.json'
    data = read_json(path) if path.exists() else {}
    if data.get('language') != lang:
        data = {'language': lang, 'reviewStatus': 'machine_draft', 'chapters': []}
    return path, data


def get_flags(original, draft):
    years = sorted(set(YEARS.findall(original)))
    missing = [year for year in years if year not in draft]
    # A heuristic review queue, not a guarantee of semantic equivalence.
    return [f'CHECK_YEAR_{y}' for y in missing] + (["CHECK_EMPTY"] if not draft.strip() else [])


def chunks(text):
    # The OPUS models translate shorter sentences more reliably than long paragraphs.
    return [x.strip() for x in re.split(r'(?<=[.!?])\s+', ' '.join(text.split())) if x.strip()]


def load_model(lang):
    import torch
    from transformers import MarianMTModel, MarianTokenizer
    model_id = MODELS[lang]
    print(f'Downloading/loading {model_id} (first use needs internet)...', flush=True)
    tokenizer = MarianTokenizer.from_pretrained(model_id)
    model = MarianMTModel.from_pretrained(model_id)
    device = 'cuda:0' if torch.cuda.is_available() else 'cpu'
    model.to(device)
    model.eval()
    return tokenizer, model, device


def translate(tokenizer, model, device, text):
    import torch
    results=[]
    for part in chunks(text):
        inputs=tokenizer([part], return_tensors='pt', truncation=False)
        if inputs['input_ids'].shape[-1] >= 512:
            raise ValueError('A sentence exceeds 511 model tokens; split it manually before translation.')
        inputs={k:v.to(device) for k,v in inputs.items()}
        with torch.inference_mode():
            tokens=model.generate(**inputs, max_new_tokens=400, num_beams=4)
        results.append(tokenizer.batch_decode(tokens,skip_special_tokens=True)[0].strip())
    return ' '.join(results)


def save_review_report(lang, source, result):
    dest=ROOT/'content'/'translation_review'/f'{lang}_review.csv'
    dest.parent.mkdir(parents=True,exist_ok=True)
    index={e['number']:e for e in result['chapters']}
    with dest.open('w',newline='',encoding='utf-8-sig') as fp:
        w=csv.writer(fp)
        w.writerow(['chapter','title_en','title_translated','years_in_english','review_flags','status'])
        for row in source:
            e=index.get(row['number'])
            w.writerow([row['number'],row['title_en'],e.get('title','') if e else '', ','.join(YEARS.findall(row['en'])), ';'.join(e.get('qualityFlags',[])) if e else 'NOT_TRANSLATED', 'REVIEW_NEEDED'])


def do_language(lang, source, chapter_number, overwrite):
    path, result=new_file(lang)
    result['reviewStatus']='machine_draft'
    result['model']=MODELS[lang]
    index={x['number']:x for x in result.get('chapters',[])}
    selected=[x for x in source if chapter_number is None or x['number']==chapter_number]
    to_do=[row for row in selected if (overwrite or index.get(row['number'],{}).get('sourceTextSha256') != sha(row['en']) or not index.get(row['number'],{}).get('text'))]
    if to_do:
        tokenizer, model, device=load_model(lang)
        for row in to_do:
            print(f'{lang.upper()} {row["number"]:02d}/29 — {row["title_en"]}',flush=True)
            title=translate(tokenizer,model,device,row['title_en'])
            text=translate(tokenizer,model,device,row['en'])
            flags=get_flags(row['en'],text)
            index[row['number']]={'number':row['number'],'title':title,'text':text,'sourceTextSha256':sha(row['en']),'qualityFlags':flags,'humanReviewed':False}
            result['chapters']=sorted(index.values(),key=lambda x:x['number'])
            write_json_atomic(path,result)
            print(f'  saved draft (year warnings: {len(flags)})',flush=True)
    else:
        print(f'{lang.upper()}: all requested translations already match EN source; skipping.')
    save_review_report(lang,source,result)
    print(f'{lang.upper()} {len(result["chapters"])}/29 translated. Written to {path.relative_to(ROOT)}.')


def check(source):
    for lang in MODELS:
        _, result=new_file(lang)
        index={x['number']:x for x in result.get('chapters',[])}
        matching=sum(bool(index.get(row['number'],{}).get('text')) and index.get(row['number'],{}).get('sourceTextSha256')==sha(row['en']) for row in source)
        flagged=sum(bool(x.get('qualityFlags')) for x in result.get('chapters',[]))
        print(f'{lang}: {matching}/29 current text drafts, {flagged} flagged; reviewStatus={result.get("reviewStatus")}')


def main():
    parser=argparse.ArgumentParser(description='Kotor Stories English-to-4-language draft translator')
    g=parser.add_mutually_exclusive_group(required=True)
    g.add_argument('--language', choices=tuple(MODELS))
    g.add_argument('--all-languages',action='store_true')
    g.add_argument('--check',action='store_true')
    parser.add_argument('--chapter',type=int,choices=range(1,30),metavar='1..29')
    parser.add_argument('--overwrite',action='store_true')
    args=parser.parse_args()
    source=source_stories()
    if args.check:return check(source)
    for lang in (MODELS if args.all_languages else [args.language]):
        do_language(lang,source,args.chapter,args.overwrite)


if __name__=='__main__':
    try:main()
    except Exception as err:
        print('ERROR:', err, file=sys.stderr)
        sys.exit(1)
