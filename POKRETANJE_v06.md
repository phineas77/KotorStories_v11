# Kotor Stories v0.6 — Voice Studio

Ovo je **kompletan nastavak v0.5**, sa svim postojećim mapama, GPS proba/uživo režimima i audio-plejerom. **Nijedan novi profesionalni MP3 nije unaprijed generisan**, zato su stari probni snimci još uključeni. v0.6 dodaje bezbjedan proces za generisanje prvih 3 engleskih snimaka sa izabranim MUŠKIM glasom, bez promjene GPS mehanizma.

## 1. Otvori aplikaciju kao ranije

Raspakuj u novi folder, recimo `KotorStories_v06`, i u VS Code terminalu pokreni:

```powershell
npm.cmd install
npx.cmd expo install --fix
npx.cmd expo-doctor
npx.cmd expo start --clear
```

Skeniraj QR kod iPhoneom. Vidi se oznaka `0 / 3 EN VOICE TESTS` dok nijedan novi MP3 nije ubačen.

## 2. Izaberi naratora

Na **https://elevenlabs.io/** otvori nalog, poslušaj nekoliko **male / English / narration** glasova i izaberi jedan sa prirodnom dikcijom. Ne smijemo nasumično fiksirati Voice ID: glas moraš prvo poslušati. Izaberi glas kojim želiš snimiti cijelu turu. Pogledaj njegov `Voice ID`.

Koristi `eleven_multilingual_v2`, stabilnost 0,78, sličnost 0,75, stil 0; to su **početna podešavanja za test**, nijesu garancija najboljeg rezultata. Kontroliši izgovor riječi Kotor, Saint Tryphon i godina.

Besplatan ElevenLabs plan je za **nekomercijalne probe**, nije dozvoljen za komercijalnu distribuciju. Za prodajnu aplikaciju snimke generiši uz odgovarajući plaćeni plan i poštuj uslove licence. https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform

## 3A. Najlakše — preko ElevenLabs sajta (bez API ključa)

U folderu `narration_texts/` postoje gotovi EN tekstovi za `01_sea-gate`, `05_clock-tower`, `09_st-tryphon`. Kopiraj **samo tekst** prvog poglavlja u ElevenLabs Text to Speech, generiši i preuzmi MP3. Smjesti ga u folder `voice_previews` pod imenom `sea-gate-en.mp3` (kreiraj folder ako ne postoji). Ponovi za `clock-tower-en.mp3` i `st-tryphon-en.mp3` kada budemo zadovoljni glasom.

Poslije preslušavanja (nemoj instalirati prije provjere):

```powershell
py scripts\elevenlabs_narration.py --install-only --chapters 1
```

Za preostala dva:

```powershell
py scripts\elevenlabs_narration.py --install-only --chapters 5 9
```

## 3B. Automatski preko ElevenLabs API-ja (opciono)

Otvori ElevenLabs nalog → API Keys i napravi ključ za Text-to-Speech. **Nemoj ga unositi u kod, slati u chat, niti dijeliti screenshot na kome se vidi.** Naš Python program ga po potrebi traži u skrivenom unosu i **ne upisuje na disk**.

Iz novog foldera u VS Code terminalu:

```powershell
py scripts\elevenlabs_narration.py --list-voices
py scripts\elevenlabs_narration.py --dry-run --chapters 1 5 9
py scripts\elevenlabs_narration.py --voice-id TVOJ_VOICE_ID --chapters 1
```

Ako je rezultat dobar, možeš instalirati snimak:

```powershell
py scripts\elevenlabs_narration.py --install-only --chapters 1
```

Zatim generiši naredne dvije priče istim glasom:

```powershell
py scripts\elevenlabs_narration.py --voice-id TVOJ_VOICE_ID --chapters 5 9
py scripts\elevenlabs_narration.py --install-only --chapters 5 9
```

*Svaka generacija može potrošiti kredite na ElevenLabs nalogu.* Skripta ne regeneriše postojeći MP3 bez `--overwrite`.

## 4. Uključi novi zvuk u Expo

Zaustavi Metro/Expo pomoću `Ctrl+C`, pokreni:

```powershell
npx.cmd expo start --clear
```

Izaberi **EN**, pa **DEMO AT HOME**, `Reset progress` ako je potrebno, zatim `SIMULATE ARRIVAL AT NEXT STOP`. Prvi stop treba da čita punu originalnu priču, a u audio-plejeru se pojavljuje zelena oznaka `NEW EN NARRATION`. Ostali jezici još imaju stare testne snimke. GPS ni vanjski internet nije potreban za slušanje već ubačenih MP3 fajlova; **mapa i dalje traži internet**.

Prilikom prve ugradnje skripta čuva originalne kratke MP3 fajlove u `assets/demo_audio_backup/`. **Nemoj objavljivati aplikaciju dok ne provjerimo izgovor, prava, sve jezike i rad u pozadini.**

## Ako `py` nije pronađen

Pokušaj `python` umjesto `py`. Potreban je Python 3.10+ za automatizaciju; ako ga nema, koristi postupak preko sajta i ručno zamijeni tri MP3 fajla u `assets/audio/`, uz rezervnu kopiju starih. Za usklađivanje prikazanog tekstа tada ipak pokreni `--install-only` kada instaliraš Python.

## Šta radi, a šta tek treba uraditi

- **Radi kao ranije:** svi stari probni MP3 fajlovi, izbor jezika, GPS test simulacija, mapa, navigacija, lista 29 tekstova.
- **Novo:** postupak za proizvodnju i ugradnju 3 engleska MP3 fajla uz jedan odabrani muški glas. Dok ne generišeš zvuk, **aplikacija nema novi profesionalni audio**.
- **Sljedeće:** kvalitet prvog glasa, istorijska redaktura, tek onda 29×6 naracija, licenca i komercijalna izdanja.
- **Nije potvrđeno:** automatizacija preko stvarnog ElevenLabs naloga, nativni background GPS/lock-screen behavior i terenske GPS lokacije. Naš kod nije bio izvršen na tvojoj mašini.
