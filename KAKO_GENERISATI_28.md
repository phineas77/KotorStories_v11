# Kotor Stories v0.7 — svih 28 preostalih EN naracija

Ova verzija zadržava tvoj **prvi Max MP3** (`01`) i podržava čitanje ostalih 28 engleskih priča (`02–29`) sa istim Max glasom. **U ZIP-u nijesu unaprijed generisani tih 28 profesionalnih snimaka.** Alat ih proizvodi na tvom računaru preko **tvog** ElevenLabs naloga, pa ih bez ručnog povezivanja ubacuje u projekat.

## Zašto ovo nije potpuno besplatno odmah?

Preostalih 28 engleskih tekstova ima **20.515 znakova**. Model `eleven_multilingual_v2` tipično troši oko 1 kredit po znaku; to je približno 20.515 kredita (ne računajući ponovljene generacije). Free plan ima 10.000 kredita mjesečno. Možeš generisati dio sada i nastaviti kasnije; gotovi snimci se NE regenerišu pri sljedećem pokušaju. Alternativno, plaćeni Starter paket trenutno oglašava 30.000 kredita mjesečno — provjeri cijene u svom nalogu prije plaćanja.

**Važno za prodaju:** Snimci nastali na besplatnom planu nijesu licencirani za komercijalnu upotrebu. Za plaćenu aplikaciju treba regenerisati zvuk sa odgovarajućim komercijalnim pravima. Za sada su snimci isključivo razvojna/probna verzija.

## Priprema — jednom

1. Raspakuj ZIP i u VS Codeu otvori folder `KotorStories_v07`.
2. Prijavi se na https://elevenlabs.io/. Nađi izabrani glas **Max – E-learning and Documentary**.
3. U **My Voices** klikni tri tačkice pored Maxa i **Copy voice ID** (ID je običan identifikator glasa; nije API ključ).
4. Napravi **API key** za Text to Speech u ElevenLabs podešavanjima. Ako servis traži dozvolu za čitanje glasova, omogući i to. **Nikada ne šalji API ključ u chat niti ga stavljaj u izvorni kod.**
5. Potreban je Node.js 22+ (već si imao Node.js v24 na Windowsu).

## 1. Provjeri koliko treba kredita, bez trošenja

U VS Code terminalu:

```powershell
node scripts\batch_english_28.mjs
```

Treba da dobiješ 28 poglavlja i ~20.515 znakova. Komanda ne pravi API pozive.

## 2. Generiši 28 profesionalnih MP3 snimaka u jednoj seriji

Kopiraj Maxov **Voice ID**, pa zamijeni `TVOJ_MAX_VOICE_ID` u sljedećoj komandi:

```powershell
node scripts\batch_english_28.mjs --generate --confirm-spend --voice-id TVOJ_MAX_VOICE_ID --install
```

Program će u terminalu tražiti **ElevenLabs API key**. Dok ga unosiš neće se vidjeti znakovi; zalijepi ga i pritisni Enter. Program ga ne čuva u projektu.

Svaki uspješno generisan fajl ostaje u `voice_previews` (`02-en.mp3`, `03-en.mp3`...`29-en.mp3`). Ako dođe do prekida interneta ili nestane kredita, isti poziv sljedeći put nastavlja i **preskače postojeće MP3 fajlove**.

Opcije modela u skripti: `eleven_multilingual_v2`, stability 0.78, similarity 0.75, speed 1.0 (model podrazumijevano). Ako tvoja omiljena generacija Maxa ima drugačija podešavanja, probaj pojedinačno, npr. `--start 2 --end 2 --stability 0.70 --similarity 0.80`, pa tek onda cijelu seriju. Snimak koji već postoji neće se ponovo generisati bez `--overwrite`.

## 3. Ako nijesu završena sva poglavlja

Ako program stane zbog kredita, možeš instalirati sve što je do tada sačuvao:

```powershell
node scripts\batch_english_28.mjs --install-ready
```

To **ne koristi API ni kredite**. Kada ponovo budeš imao dovoljno kredita, pokreni istu naredbu za generisanje; nastaviće gdje je stala.

## 4. Ako preuzimaš snimke ručno sa ElevenLabs sajta

Umjesto API-ja možeš iskopirati svaki `en` tekst iz `content/stories.json`, napraviti MP3 kroz web editor i snimiti ih pod tačnim imenima `voice_previews/02-en.mp3`...`voice_previews/29-en.mp3`. Zatim samo pokreni `--install-ready`. Ovo je sporije, ali ne traži API ključ.

## 5. Pokretanje na iPhoneu

Ako ranije nijesi pokretao ovaj folder:

```powershell
npm.cmd install
npx.cmd expo install --fix
npx.cmd expo-doctor
```

Za pokretanje:

```powershell
npx.cmd expo start --clear
```

Na iPhoneu otvori Expo Go → EN → **ROUTE & STORIES** → **View all 29 planned chapters** → otvori poglavlje i izaberi **PLAY EN NARRATION**. Dostupne priče imaju oznaku `EN AUDIO READY`. Dok je poglavlje uključeno, u plejeru se pojavljuju tekst, pauza, premotavanje i dugme za sljedeću priču. Prvi MP3 već radi.

**Ovo je kućni audio-test, ne završna GPS tura:** i dalje imamo pet probnih GPS lokacija, a svih 29 audio-poglavlja moguće je ručno slušati. Auto-GPS sa zaključanim ekranom, offline mapa i stvarne GPS koordinate još čekaju zasebne testove.

## Brza provjera sadržaja

- 29 originalnih EN i ME tekstova u `content/stories.json`
- 1 već ugrađen originalni EN Max MP3
- 28 EN tekstova spremno za serijsko generisanje
- MP3 ne ide u bazu niti traži internet nakon što ga `--install-ready` ubaci u app
- Kredit troši samo eksplicitna komanda `--generate --confirm-spend`
- Nijedan API ključ se ne zapisuje u ZIP ili u kod.
