# Kotor Stories v1.3 – šest jezika (razvojna zakrpa)

**Nastavljamo na postojećem `KotorStories_v11`**. Nije novi projekat, ne briše 29 Aidenovih MP3 fajlova i ne mijenja uspješno testirani iOS EAS audio sa zaključanim ekranom. Koristimo istu iPhone development aplikaciju.

## Šta patch donosi

- Jezici: EN, ME, IT, DE, FR, ES; tekstovi se više ne prebacuju na engleski bez upozorenja.
- Izvorni i posljednji revidirani **engleski i crnogorski tekstovi (29/29)** ostaju u `content/stories.json`.
- Napravljen je **urednički uzorak prve priče** na IT, DE, FR i ES (1/29 po jeziku). Ostalih 28 po jeziku nisu prevedeni u ZIP-u, već se generišu lokalno pomoću priloženog alata.
- `scripts/translate_tours.py` automatski priprema 29 nacrta po jeziku. Nakon generisanja traži redakturu datuma, prezimena i naziva, naročito *Muštrica, pašta, dobrotska čipka, Bokeljska mornarica*.
- `scripts/qwen_local_narrator.py` podržava generisanje po jeziku; **Aiden** je podrazumijevani glas. Ne dira postojeći EN paket.
- Zaštićeni server sada čita lokalne pakete **posebno po jeziku** i isporučuje isključivo šifrovane fajlove nakon testnog otključavanja.
- Crnogorski tekstovi su gotovi. Crnogorski zvuk još **nije generisan**; za njega treba vlastiti snimak ili glas sa dokazivim komercijalnim pravima.

## 1. Sačuvaj kopiju postojećeg projekta

U VS Code, unutar `C:\Users\Veljko\KotorStories_v11`, napravi rezervnu kopiju foldera (Windows Explorer → Copy/Paste ili komandama). Zaustavi Expo server (`Ctrl+C`) i zaštićeni audio-server. **Ne briši** `local_qwen_audio`, `server_qwen_audio`, `.venv-tts` ili `server-private`.

Raspakuj ovaj ZIP. Njegove fajlove (`App.tsx`, `src/`, `content/`, `scripts/`, `tests/`) kopiraj u korijen postojećeg `KotorStories_v11`, tako da zamijeniš samo fajlove istog naziva. **Ne zamjenjuj `app.config.js`, `eas.json` ili `app.json`.** Oni ostaju kao u tvojoj testiranoj EAS verziji.

## 2. Testiraj italijanski uzorak

Prva priča za IT/DE/FR/ES već ima prevod koji se može vidjeti u aplikaciji, bez instaliranja novih biblioteka. Na računaru pokreni (PowerShell):

```powershell
$tts = 'C:\Users\Veljko\KotorStories_v10\.venv-tts\Scripts\python.exe'
& $tts .\scripts\qwen_local_narrator.py --one --language it --speaker Aiden --chapter 1
& $tts .\scripts\qwen_local_narrator.py --stage --language it --speaker Aiden --chapter 1
```

Ovo pravi `local_qwen_audio/it/aiden/01-it.mp3` i ubacuje taj snimak u `server_qwen_audio/it/01.mp3`. **Ne regeneriše engleske snimke.** Poslušaj italijanski izgovor: Aiden je izvorno engleski glas, pa može imati akcenat. Ako se ne dopada, prvo izaberi drugi dozvoljen glas.

## 3. Pripremi nacrte svih prevoda, lokalno i bez TTS kredita

Instaliraj dva mala Python paketa u postojeće Qwen okruženje:

```powershell
& $tts -m pip install sentencepiece sacremoses
```

Zatim generiši četiri jezika:

```powershell
& $tts .\scripts\translate_tours.py --all-languages
& $tts .\scripts\translate_tours.py --check
```

Ovaj alat prvi put preuzima **četiri zasebna Helsinki-NLP OPUS-MT modela** sa Hugging Facea. Njihovi model-kartoni navode: IT Apache-2.0, DE CC-BY-4.0, FR Apache-2.0, ES Apache-2.0. Za njemački model provjeri uslove atribucije. Generisani prevodi su **samo nacrti**; rezultati se čuvaju u:

- `content/translations/it.json`
- `content/translations/de.json`
- `content/translations/fr.json`
- `content/translations/es.json`
- `content/translation_review/<jezik>_review.csv`

Skripta automatski označava godine koje su nestale iz prevoda. **Ne može garantovati istorijsku niti jezičku tačnost.** Za prodaju je potrebna ljudska redaktura. Ne objavljuj neprovjerene tekstove.

Ako se proces prekine, ponovo pokreni istu komandu: već sačuvani prevodi neće biti nepotrebno ponavljani ako se engleski izvor nije promijenio.

## 4. Generiši audio po jeziku (nakon provjere prevoda)

Za jednu probnu priču:

```powershell
& $tts .\scripts\qwen_local_narrator.py --one --language de --speaker Aiden --chapter 1
```

Za svih 29 na jednom jeziku, npr. italijanskom:

```powershell
& $tts .\scripts\qwen_local_narrator.py --all --language it --speaker Aiden
& $tts .\scripts\qwen_local_narrator.py --stage-all --language it --speaker Aiden
```

Ponovi za `de`, `fr`, `es`. **Kvalitet i izgovor ovih jezika nisu još testirani na telefonu.** Kod `--check` prikazuje broj lokalnih snimaka:

```powershell
& $tts .\scripts\qwen_local_narrator.py --check --speaker Aiden
```

Ako popraviš neki prevod, generiši samo promijenjeno poglavlje koristeći `--one --chapter N --overwrite`, pa ponovi `--stage-all`. Generator čuva SHA-256 hash teksta uz svaki snimak i neće neprimjetno koristiti zastarjeli MP3.

## 5. Provjeri na iPhoneu

U jednom terminalu:

```powershell
$env:KOTOR_DEV_PIN='492731'
$env:KOTOR_AUDIO_SOURCE='qwen'
npm.cmd run audio:serve
```

U drugom terminalu:

```powershell
npx.cmd expo start --dev-client --clear
```

Otvori već instaliranu **Kotor Stories development aplikaciju**, a ne Expo Go. U sekciji jezika izaberi IT/DE/FR/ES, upiši trenutnu LAN adresu audio-servera, razvojni PIN, zatim `DEV UNLOCK → CHECK PACK → DOWNLOAD`. Ako si već preuzimao testni paket tog jezika, prethodno izaberi `DELETE ENCRYPTED LANGUAGE` da ukloniš staru verziju. Engleski paket ostaje zaseban.

**Ne pravimo novi EAS build:** mijenjamo JavaScript, JSON i lokalni DEV audio-server, a ne iOS nativna podešavanja. Zato bi postojeći razvojni build trebalo da radi nakon osvježavanja Metro servera. Ako se kasnije promijene nativne biblioteke, potreban je novi build.

## 6. Crnogorski zvuk

Za crnogorski već imamo 29 tekstova. Qwen3-TTS ne navodi naš jezik na spisku podržanih. Popularni `facebook/mms-tts` i neki srpski Piper glasovi imaju *non-commercial* licencu. **Ne koristiti ih u proizvodu koji se prodaje bez izričitih odgovarajućih prava.**

Ako snimiš svih 29 crnogorskih priča sopstvenim glasom ili nabaviš snimke uz dozvolu za komercijalnu distribuciju, sačuvaj ih kao `01-me.mp3` do `29-me.mp3` u poseban folder, pa:

```powershell
& $tts .\scripts\stage_montenegrin_audio.py --source 'C:\putanja\do\snimaka' --rights-confirmed
```

Naš server će tako prikazati i ME paket od 29 poglavlja, šifrovano.

## Bezbednosna i urednička napomena

Server i testni PIN su **samo za lokalni razvoj**; ovo nije komercijalni sistem za provjeru kupovine. Nije implementirano plaćanje, server na HTTPS-u ni prava Apple/Google kupovine. Ne izlagati port 8787 na internetu. Čak ni šifrovanje ne garantuje da zvuk ne može biti snimljen. Uz konačnu aplikaciju treba uključiti atribucije otvorenih modela gdje je propisano i završnu provjeru izgovora imena, datuma i lokalnih običaja.
