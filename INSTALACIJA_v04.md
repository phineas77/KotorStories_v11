# Kotor Stories v0.4 — test kod kuće

## Pokretanje na Windowsu i iPhoneu

1. Zaustavi staru aplikaciju u VS Code terminalu (`Ctrl + C`).
2. Raspakuj ZIP u novi folder `KotorStories_v04`, **ne briši v0.3**.
3. U VS Code otvori taj folder.
4. Izvrši redom:

```powershell
npm.cmd install
npx.cmd expo install --fix
npx.cmd expo-doctor
npx.cmd expo start --clear
```

5. Skeniraj QR kod iPhone kamerom i otvori kroz Expo Go.

## Šta je stvarno novo i šta sada testiraš

- U DEMO AT HOME testiraj dolazak na prvih 5 stanica kao u v0.3.
- Na audio plejeru probaj dugmad `↶ 10s`, `10s ↷`, `1×`/`1.25×`, pauzu i nastavak.
- Promijeni jezik dok svira priča i provjeri da naslov, tekst i snimak odgovaraju jeziku.
- Otvori pregled svih 29 poglavlja: sada imaju zonu i planirano trajanje.
- Restartuj aplikaciju: sačuvani DEMO i REAL GPS napredak ostaju odvojeni.
- U REAL GPS daleko od Starog grada ne smije biti automatske aktivacije.

## Šta Expo Go *ne može* dokazati

U `app.json` je uključeno `enableBackgroundPlayback`, a aplikacija tokom reprodukcije pokušava da postavi kontrole zaključanog ekrana. Nativni `app.json` plugin se ne primjenjuje retroaktivno u Expo Go. Stabilnu reprodukciju sa zaključanim ekranom može potvrditi **razvojni build**. Slično, automatski GPS okidači sa zaključanim ekranom **još nijesu implementirani**: trenutno se obrađuju samo GPS lokacije dok je aplikacija aktivna i vidljiva. Ne tvrdimo suprotno.

Za izradu iOS development builda na Windowsu preko EAS Cloud potreban je odgovarajući Apple Developer nalog i iOS potpisivanje. To nije potrebno za Expo Go i ovu fazu.

## Sadržaj

- 5 postojećih kratkih probnih MP3 snimaka × 6 jezika (30 fajlova)
- `PRVIH_5_NARACIJA_RADNE.md`: **novi** duži radni tekstovi na engleskom i crnogorskom; nijesu snimljeni u MP3
- `UREDNICKI_PLAN_29.csv`: urednički plan, zone i okvirna trajanja (26 min 23 s naracije, ostatak šetnja/fotografisanje)

## Poznati rizici

- Lokacije pet GPS tačaka su približne i zahtijevaju terenski test.
- Za sada nema offline mape, samo offline audio fajlova.
- Nema naplate, produkcionih prevoda ni provjere u App Storeu.
- U nedostupnom npm okruženju nije bilo moguće pokrenuti `expo-doctor` i puni TypeScript typecheck; obavezno to uradi lokalno prije nego što verziju smatraš stabilnom.
