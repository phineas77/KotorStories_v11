"""Pure-Python generator staging tests; do NOT download or invoke the AI model."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT=Path(__file__).resolve().parent.parent
SPEC=importlib.util.spec_from_file_location('localvoice',ROOT/'scripts'/'qwen_local_narrator.py')
voice=importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(voice)

class VoiceStageTests(unittest.TestCase):
    def test_chapter_texts_and_sentence_chunks(self):
        chapters=voice.chapters()
        self.assertEqual(len(chapters),29)
        for c in chapters:
            segments=voice.segments(c['en'])
            self.assertTrue(segments)
            self.assertTrue(all(len(x)<=290 for x in segments))
            self.assertEqual(' '.join(' '.join(segments).split()), ' '.join(c['en'].split()))

    def test_stage_speaker_selection_and_mismatched_source(self):
        with tempfile.TemporaryDirectory() as temp:
            folder=Path(temp)
            with patch.object(voice,'GENERATED',folder/'generated'),patch.object(voice,'SERVER_AUDIO',folder/'server'):
                chapter=voice.chapters()[0]
                for name in ('Aiden','Ryan'):
                    file=voice.output_path(1,name)
                    file.parent.mkdir(parents=True,exist_ok=True)
                    # Synthetic ID3 fixture; NOT a Qwen recording. Staging integrity only.
                    file.write_bytes(b'ID3'+b'fake-audio-fixture'*500)
                    voice.meta_path(file).write_text(json.dumps({
                      'model':voice.MODEL_ID,'speaker':name,
                      'sourceTextSha256':voice.sha_text(chapter['en'])
                    }))
                voice.stage_voice(voice.chapters(),'Aiden',[1])
                self.assertTrue((voice.SERVER_AUDIO/'01.mp3').exists())
                self.assertEqual(json.loads((voice.SERVER_AUDIO/'selected-voice.json').read_text())['speaker'],'Aiden')
                voice.stage_voice(voice.chapters(),'Ryan',[1])
                self.assertEqual(json.loads((voice.SERVER_AUDIO/'selected-voice.json').read_text())['speaker'],'Ryan')
                file=voice.meta_path(voice.output_path(1,'Aiden'))
                j=json.loads(file.read_text());j['sourceTextSha256']='bogus';file.write_text(json.dumps(j))
                with self.assertRaises(ValueError):voice.stage_voice(voice.chapters(),'Aiden',[1])
                self.assertEqual(json.loads((voice.SERVER_AUDIO/'selected-voice.json').read_text())['speaker'],'Ryan')

if __name__=='__main__':unittest.main()
