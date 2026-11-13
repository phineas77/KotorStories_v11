#!/usr/bin/env python3
"""Bezbedna, idempotentna dopuna postojećeg Kotor Stories Qwen generatora.

Pokrenuti iz korijena projekta: python enable_chinese_qwen.py
Ne briše i ne prepisuje ru, en, it, es, de, fr postavke.
"""
from pathlib import Path
import re
import shutil
from datetime import datetime

root = Path.cwd()
script = root / "scripts" / "qwen_local_narrator.py"
if not script.exists():
    raise SystemExit("ERROR: Run from KotorStories_v11 folder. Missing scripts/qwen_local_narrator.py")
original = script.read_text(encoding="utf-8")
patched = original

# Add Chinese to dictionary without replacing existing languages, including manually added Russian.
pat_lang = re.compile(r"(?ms)^LANGUAGES\s*=\s*\{.*?\}")
match = pat_lang.search(patched)
if not match:
    raise SystemExit("Could not find one-line LANGUAGES dictionary. No changes made.")
if not re.search(r"['\"]zh['\"]\s*:",match.group(0)):
    old = match.group(0)
    newer = old[:-1].rstrip().rstrip(',') + ', "zh": "Chinese"}'
    patched = patched[:match.start()] + newer + patched[match.end():]

# Prefer a native Mandarin male voice. Add it to argparse choices; retain all current speakers.
pat_sp = re.compile(r'(ap\.add_argument\([\'\"]--speaker[\'\"],\s*choices=\()(.*?)(\))', re.S)
match = pat_sp.search(patched)
if not match:
    raise SystemExit("Could not find --speaker choices. No changes made.")
if "Uncle_Fu" not in match.group(2):
    patched = patched[:match.end(2)] + ', "Uncle_Fu"' + patched[match.end(2):]

# Chinese text has no spaces between sentences. Split at full-width punctuation.
if "def chinese_segments(" not in patched:
    marker = "\ndef output_path("
    if marker not in patched:
        raise SystemExit("Could not find output_path marker. No changes made.")
    helper = '''
def chinese_segments(text, max_chars=170):
    """Split Mandarin narrations at Chinese sentence boundaries, not on spaces."""
    import re
    text = " ".join(text.split())
    sentences = [s for s in re.split(r"(?<=[。！？])\\s*", text) if s]
    result, current = [], ""
    for sent in sentences:
        if len(current) + len(sent) > max_chars and current:
            result.append(current)
            current = ""
        while len(sent) > max_chars:
            if current:
                result.append(current)
                current = ""
            result.append(sent[:max_chars])
            sent = sent[max_chars:]
        current += sent
    if current:
        result.append(current)
    return result

'''
    patched = patched.replace(marker, '\n' + helper + 'def output_path(',1)

old_gen = 'enumerate(segments(spoken), 1)'
new_gen = 'enumerate(chinese_segments(spoken) if language == "zh" else segments(spoken), 1)'
if new_gen not in patched:
    if old_gen not in patched:
        raise SystemExit("Could not find segments(spoken) call. No changes made.")
    patched=patched.replace(old_gen,new_gen,1)

compile(patched,str(script),'exec')
if patched == original:
    print("Chinese support is already enabled, no changes needed.")
else:
    backup = script.with_name('qwen_local_narrator_before_chinese_'+datetime.now().strftime('%Y%m%d_%H%M%S')+'.py')
    shutil.copy2(script,backup)
    script.write_text(patched,encoding='utf-8')
    print('Updated',script)
    print('Backup:',backup)
print('Language: zh -> Chinese; recommended speaker: Uncle_Fu')
