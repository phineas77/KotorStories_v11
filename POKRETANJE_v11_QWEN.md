# Kotor Stories v1.1 – besplatna naracija uz Qwen3-TTS

**Svrha:** Napraviti dva uporediva engleska MP3 snimka prve priče (Aiden / Ryan) na Windows računaru, poslušati ih, odabrati glas i učitati ga preko **postojećeg zaštićenog lokalnog servera**.

**Oprez:** Ovo je razvojni, a ne komercijalni server. Ne otvarati port 8787 prema internetu. Apple/Google kupovina još nije povezana. Qwen AI model se izvršava samo na računaru; iPhone preuzima samo gotove šifrovane audio-pakete.

## A. Priprema Pythona i Qwena (samo prvi put)

1. Raspakuj ZIP u poseban folder `KotorStories_v11`. Otvori ga u VS Codeu. Ne briši funkcionalnu v1.0.
2. Provjeri Python: `py -3.12 --version`. Ako ga nemaš, instaliraj Python 3.12 sa https://www.python.org/downloads/ i ponovo otvori VS Code terminal.
3. U terminalu, iz korijena projekta:

```powershell
py -3.12 -m venv .venv-tts
.\.venv-tts\Scripts\python.exe -m pip install --upgrade pip
.\.venv-tts\Scripts\python.exe -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu130
.\.venv-tts\Scripts\python.exe -m pip install -U qwen-tts numpy soundfile imageio-ffmpeg
```

Ako CUDA 13.0 verzija nije kompatibilna sa instaliranim NVIDIA drajverom, provjeri preporučenu PyTorch komandu za Windows na https://pytorch.org/get-started/locally/ . Alternativno, probaj CUDA 12.6 (`cu126`) po njihovoj dokumentaciji, uz noviji drajver koji podržava tvoju grafičku. **Ne instaliraj flash-attn** za prvi test; naš kod koristi PyTorch `sdpa`.

4. Provjeri grafičku karticu:

```powershell
.\.venv-tts\Scripts\python.exe -c "import torch; print('CUDA:',torch.cuda.is_available()); print('GPU:',torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU')"
```

Ako piše `CUDA: False`, **za sada ne pokreći generisanje**, nego pošalji ispis greške da prvo uskladimo PyTorch i drajver. CPU način postoji, ali je znatno sporiji.

## B. Generiši oba uzorka (bez ElevenLabs kredita)

```powershell
.\.venv-tts\Scripts\python.exe scripts\qwen_local_narrator.py --preview
```

Prvo pokretanje preuzima model sa Hugging Face i zahtijeva internet. Lokalno generisanje može opteretiti GPU; ne zatvaraj terminal. Nakon završetka slušaj:

```
local_qwen_audio/en/aiden/01-en.mp3
local_qwen_audio/en/ryan/01-en.mp3
```

Snima se ista, originalna engleska priča o Morskim vratima. Qwen 0.6B ima fabrička muška glasa Aiden i Ryan; za ovaj model **ne oslanjamo se na prompt za stil**. Profesionalan tempo ćemo procijeniti slušanjem.

## C. Izabrani uzorak kroz naš šifrovani server

Recimo da želiš Aiden. Pokreni:

```powershell
.\.venv-tts\Scripts\python.exe scripts\qwen_local_narrator.py --stage --speaker Aiden --chapter 1
```

Ako ti se više sviđa Ryan, zamijeni `Aiden` sa `Ryan`. Ova komanda **ne dira** Maxov probni MP3, nego kopira Qwenov fajl u `server_qwen_audio/en/01.mp3`.

U terminalu za audio-server zaustavi stari proces pomoću `Ctrl + C`, pa pokreni:

```powershell
$env:KOTOR_DEV_PIN="492731"
$env:KOTOR_AUDIO_SOURCE="qwen"
npm.cmd run audio:serve
```

Koristi vlastiti lokalni testni PIN ako želiš. `qwen` režim se razlikuje od `demo` režima: server će ponuditi **samo generisane Qwen engleske snimke** (u početku 1/29). Neće automatski poslati prethodne ElevenLabs snimke.

U prvom terminalu pokreni aplikaciju kao i ranije:

```powershell
npm.cmd install
npx.cmd expo install --fix
npx.cmd expo-doctor
npx.cmd expo start --clear
```

Na iPhoneu: **English → Offline Audio Packs → DELETE ENCRYPTED LANGUAGE** (obriši prethodni razvojni paket da ostane samo Qwen); zatim unesi URL servera i PIN → **DEV UNLOCK → CHECK PACK → DOWNLOAD**. Očekuj **1/29** snimak. Zatim **Demo at Home → Reset Progress → Simulate Arrival at Next Stop**, ili ručno pusti poglavlje 01.

## D. Kada odaberemo kvalitetniji glas: svih 29

Primjer za Aiden:

```powershell
.\.venv-tts\Scripts\python.exe scripts\qwen_local_narrator.py --all --speaker Aiden
.\.venv-tts\Scripts\python.exe scripts\qwen_local_narrator.py --stage-all --speaker Aiden
```

Već gotove datoteke će biti preskočene. Po završetku restartuj audio-server (i dalje `KOTOR_AUDIO_SOURCE=qwen`). Aplikacija će ponuditi **29/29** šifrovanih engleskih audio-poglavlja. Možeš ih pokretati pojedinačno u *Route & Stories* prije obilaska Kotora.

## E. Važna ograničenja

- **Za komercijalnu upotrebu:** konkretni Qwen3-TTS 0.6B CustomVoice checkpoint navodi Apache 2.0, ali sačuvaj uslove licence, provjeri prava na tekstove i preslušaj sve snimke prije prodaje. Nije pravni savjet.
- **Crnogorski jezik:** ovaj Qwen model ne navodi crnogorski/srpski kao podržane jezike; ne računaj da će isti glasovi kvalitetno izgovarati lokalnu naraciju.
- **MP3 na računaru:** izlazni MP3 fajlovi su obični lokalni fajlovi namijenjeni tebi kao autoru. Na iPhone idu kao šifrovani `.kse` preko razvojne zaštite.
- **Bez interneta:** preuzeta šifrovana priča radi offline, ali mapa još nije potpuno offline.
- **Zaštita:** PIN nije prava provjera kupovine. iOS razvojna verzija i testiranje zaključanog ekrana su zaseban zadatak.
- **Bez obećanja o potpunoj zaštiti:** reprodukovani zvuk se uvijek može presnimiti; naš model sprječava jednostavno dijeljenje MP3, a ne sve oblike kopiranja.
- **Nema automatskog trošenja TTS kredita:** generisanje radi na lokalnom računaru, uz potrošnju električne energije i moguć saobraćaj za preuzimanje modela.

Ako dobiješ grešku `CUDA out of memory`, prije svega zatvori GPU-intenzivne aplikacije i pokreni samo jedan proces. Po potrebi ćemo smanjiti veličinu modela ili prilagoditi GPU režim.
