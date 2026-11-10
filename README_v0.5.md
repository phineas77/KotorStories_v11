# Kotor Stories v0.5 — 29 naracija (urednička verzija)

**Ovo je nadogradnja postojeće funkcionalne v0.4 aplikacije; audio GPS mehanizam i postojeći MP3 fajlovi nijesu mijenjani.** DEMO MP3 snimci su povezani sa 5 postojećih stanica i ne predstavljaju gotove tekstove poglavlja.

## Novo
- 29 autorskih tekstova na engleskom i crnogorskom (ukupno 3506 EN i 2987 ME riječi).
- Pregled svih 29 tekstova u samoj aplikaciji: skroluj do **Route & Stories / Ruta i priče**, pritisni dugme za svih 29 poglavlja, pa dodirni željeno poglavlje.
- Ostala četiri jezika u interfejsu koriste engleski tekst za sada; ovo je označeno kao **EN fallback**.
- `content/NARACIJE_29_EN_ME.md` — za urednički pregled i buduće TTS snimanje.
- `content/stories.json` — strukturisani podaci za kasniju integraciju.
- `content/UREDNIČKA_KONTROLA_29.csv` — urednička kontrolna lista.
- `content/sources.json` — referentni linkovi za istorijske činjenice.

## Vrijeme
- Engleski tekstovi: približno 25 min 59 s na pretpostavljenih 135 riječi u minutu.
- Crnogorski tekstovi: približno 22 min 6 s pri istom tempu.
- Ostatak do ciljnih 60 minuta otpada na hodanje, pauze, fotografisanje i čekanje pokretanja na lokaciji; stvarno trajanje zavisi od terenske provjere.

## Šta NIJE završeno
- **Nema 29 finalnih MP3 snimaka.** Postoji samo pet DEMO lokacija × šest jezika sa starim kratkim probnim MP3 fajlovima.
- GPS tačke i pješačka putanja nijesu terenski potvrđeni. 29 poglavlja ne treba aktivirati kao 29 međusobno bliskih GPS geofence krugova.
- Nijesu urađeni profesionalni prevodi DE, IT, FR i ES, niti je izvršena lokalna stručna redaktura.
- Lock-screen GPS na iOS i dalje zahtijeva development build i stvarni test, van Expo Go.

## Pokretanje
Na računaru (iz ovog foldera) pokreni:

```powershell
npm.cmd install
npx.cmd expo install --fix
npx.cmd expo-doctor
npx.cmd expo start --clear
```

i skeniraj QR kod kroz Expo Go. Sačuvaj v0.4 folder kao rezervnu kopiju.

## Izvori
Linkovi su u `content/sources.json`. Tekstovi nijesu prepisani sa izvora; izvorni podaci služe za provjeru činjenica. Naročito označiti priče o tradicijama kao tradiciju, a ne nedvosmisleno utvrđenu činjenicu.
