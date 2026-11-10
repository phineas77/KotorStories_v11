# Kotor Stories v0.8 — besplatne naracije za komercijalnu aplikaciju

## Zašto mijenjamo glas?

Snimci napravljeni na ElevenLabs FREE planu NEMAJU dozvolu za komercijalnu upotrebu. Ako želiš da prodaješ Kotor Stories, te MP3 fajlove ne smiješ isporučiti u aplikaciji. Naš model je **Qwen3-TTS-12Hz-0.6B-CustomVoice**, sa licencom **Apache-2.0**. Ovo ne kopira Maxov zaštićeni glas. Probaj **Aiden** i **Ryan**, pa izaberi prirodniji glas.

Izvori: https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice , https://github.com/QwenLM/Qwen3-TTS , https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform

## Windows 11 — podešavanje (u folderu KotorStories_v08)

1. Instaliraj **Python 3.12** sa python.org (nije isto što i Node.js). U VS Code Terminal / PowerShell:

```powershell
py -3.12 -m venv .venv-tts
.\.venv-tts\Scripts\python.exe -m pip install --upgrade pip
.\.venv-tts\Scripts\python.exe -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu128
.\.venv-tts\Scripts\python.exe -m pip install -U qwen-tts numpy soundfile imageio-ffmpeg
```

Ako se PyTorch CUDA instalacija promijeni, preuzmi komandu sa zvaničnog https://pytorch.org/get-started/locally/. Ne instaliraj `flash-attn` za ovu probu.

2. Prvo napravi **samo prvi besplatan MP3** (možda će trebati preuzeti nekoliko gigabajta modela, ali to nije pretplata):

```powershell
.\.venv-tts\Scripts\python.exe scripts\free_local_voices.py --preview --speaker Aiden
```

Snimak će biti u `local_qwen_audio/en/01-en.mp3`. Pusti ga na računaru i uporedi s Maxom. Model nije identičan Maxu, pa će se kvalitet i naglasak razlikovati.

3. Ako je glas zadovoljavajući, generiši sva 29 EN poglavlja:

```powershell
.\.venv-tts\Scripts\python.exe scripts\free_local_voices.py --all --speaker Aiden
.\.venv-tts\Scripts\python.exe scripts\free_local_voices.py --check
```

Ima 29, ne 28, jer i naš prvi Maxov snimak mora biti zamijenjen prije prodaje. Ako se generisanje prekine, ponovi `--all`: već gotove datoteke će se preskočiti bez troškova.

4. Tek kada imamo svih 29 MP3 snimaka:

```powershell
.\.venv-tts\Scripts\python.exe scripts\free_local_voices.py --install
npm.cmd install
npx.cmd expo start --clear
```

Na iPhoneu otvori `Route & Stories` i poslušaj svako poglavlje.

## Napomene

- MP3 se generiše na računaru, **ne** na iPhoneu. Kada su ubačeni, korisnik ih može slušati offline.
- AI model i njegov programski paket su Apache 2.0, ali prije objave treba završno provjeriti prava na tekst, model, upotrijebljene glasove i obaveze vezane za licence.
- Model Qwen trenutno podržava EN, DE, IT, FR, ES, ali **ne crnogorski**. Za crnogorski ćemo odabrati drugi glas sa komercijalno kompatibilnom licencom ili snimiti stvarnog naratora.
- Ako je engleski izgovor lokalnih naziva čudan, ispravićemo tekst za govor, a ne istorijski sadržaj; preslušati sve izlaze prije objave.
- **VAŽNO:** alat čuva stari ElevenLabs zvuk u `assets/noncommercial_audio_backup/`. Taj folder NE SMIJE da bude dio konačne distribuirane aplikacije. Izbriši ga iz produkcionog projekta nakon što potvrdiš sve nove snimke.
- Nisam izvršio pravi Qwen model u ovom okruženju (model se mora preuzeti na tvom računaru); kod je pripremljen i prošao je sintaksne i suve provjere.
