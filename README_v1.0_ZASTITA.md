# Kotor Stories v1.0 – Protected Audio (DEVELOPMENT ONLY)

**Ovo NIJE aplikacija spremna za prodaju.** Prethodna verzija v0.9 koristila je obične MP3 datoteke. Ova verzija prenosi i čuva `.kse` datoteke šifrovane AES-256-GCM metodom. Na serveru se demo kodom simulira pravo pristupa; komercijalne Apple/Google kupovine **nijesu implementirane**.

## Šta konkretno radi

- Demo server ne daje obične MP3 fajlove kroz HTTP rute. Šalje samo šifrovani `.kse` audio i manifest koji ne sadrži ključ.
- Demo pristup zahtijeva vremenski ograničen token, povezan sa ID-jem aplikacijske instalacije. Ovo je **isključivo razvojna provjera PIN-om**.
- Ključ za dešifrovanje dobija se od servera uz token; aplikacija ga čuva u `expo-secure-store` (iOS Keychain, Android Keystore-backed storage).
- Šifrovani `.kse` fajlovi čuvaju se u privatnom Documents direktorijumu.
- Pri slušanju se **jedna priča** dešifruje u privremeni MP3 u privatnom Cache direktorijumu. Privremeni fajl se pokušava ukloniti poslije reprodukcije, na sljedećem pokretanju ili prije druge priče.
- Offline slušanje radi sa već preuzetim paketom i lokalnim ključem. Ako je ključ obrisan, moramo ponovo aktivirati pristup dok smo online.
- Stari nešifrovani paket iz v0.9 se automatski uklanja iz prostora iste Expo Go instalacije kada se v1.0 pokrene.
- Iz mobilnog bundle-a uklonjeni su stari probni MP3 fajlovi, uključujući Maxov zvuk sa ElevenLabs Free plana. Uzorci su sačuvani u `server_demo_source/` samo za lokalni razvoj na računaru — **ne za komercijalnu distribuciju**.

## Ograničenja

1. **Nema stopostotne zaštite od kopiranja.** Napredan korisnik može pokušati presresti zvuk pri reprodukciji ili koristiti root/jailbreak. Za snažnu DRM zaštitu bile bi potrebne druge nativne tehnologije i posebna procjena.
2. U sadašnjem Expo Audio API-ju audio se ne može direktno reprodukovati iz našeg AES šifrovanog fajla; kratkotrajni dešifrovani MP3 u Cache je poznat kompromis. U produkciji vrijedi procijeniti nativni streaming/decryption ako bude potreban viši nivo zaštite.
3. Lokalni **HTTP** i PIN su samo za kućni test na povjerljivoj mreži. Prije prodaje obavezni su HTTPS, server-side potvrda Apple/Google kupovine, korisnički nalog/povrat kupovine i zaštita od zloupotreba.
4. Aplikacija još ima pet demo GPS stanica i 29 tekstova, ali lokalni server ima samo pet **razvojnih** audio datoteka po jeziku.
5. Offline mapa i GPS u pozadini sa zaključanim ekranom još nijesu provjereni. Expo Go zahtijeva aktivnu mrežu za razvojni bundle; pravi offline test cijele aplikacije zahtijeva samostalni build.

## Pokretanje na Windowsu

1. Raspakuj ZIP i u VS Codeu otvori `KotorStories_v10`.
2. U **prvom terminalu** (korijenski folder projekta):

```powershell
npm.cmd install
npx.cmd expo install --fix
npx.cmd expo-doctor
```

> Ako `npm install` prijavi konflikt zbog novog Expo SDK-a, počni sa `npm.cmd install expo@^58.0.0`, zatim `npx.cmd expo install --fix`, pa `npm.cmd install`.

3. U **drugom terminalu** (isti folder) pokreni lokalni zaštićeni server:

```powershell
$env:KOTOR_DEV_PIN="492731"
npm.cmd run audio:serve
```

PIN `492731` je **samo primjer za lokalni razvoj**. Možeš izabrati sopstveni PIN od najmanje četiri znaka. Nemoj ovu uslugu izlagati javnom internetu. Zapiši IP adresu `http://192.168.1.x:8787` koja će se ispisati.

4. U **prvom terminalu**:

```powershell
npx.cmd expo start --clear
```

5. Na iPhoneu u Kotor Stories otvori **OFFLINE AUDIO PACKS** i unesi IP adresu lokalnog servera i isti razvojni PIN. Pritisni redom **DEV UNLOCK**, **CHECK PACK**, **DOWNLOAD**.
6. Treba da piše `5 / 29 ENCRYPTED chapters saved`. Izaberi **DEMO AT HOME**, resetuj napredak po potrebi i pokreni prvu priču. Snimak se dešifruje samo tokom slušanja. Možeš pokrenuti i poglavlje 01 u listi.
7. Dok aplikacija ostaje otvorena, isključi Wi-Fi i provjeri reprodukciju već preuzetog poglavlja. Expo Go razvojna aplikacija ne garantuje pokretanje aplikacije bez interneta nakon restartovanja.
8. Pritisni **DELETE ENCRYPTED LANGUAGE**; broj dostupnih lokalnih snimaka treba da padne na nulu. Ključ za taj jezik se briše.

### Lokalni serverski testovi

```powershell
npm.cmd run audio:test
npm.cmd run test:gps
```

## Kasnije prije objavljivanja

- Pretvoriti naš demo PIN u pravu server-side provjeru kupovine (App Store / Google Play), sa podrškom za obnovu kupovine i povraćaj.
- Preći na HTTPS i privatno skladište (npr. Cloudflare R2); ključevi samo na serveru, nikada u javnom manifestu ili repozitorijumu.
- Dodati kontrolu pristupa po korisniku, limitiranje zahteva, opcionalno ograničenja po uređaju, rotaciju ključeva i evidenciju pristupa.
- Ukloniti sve nekomercijalne testne naracije i generisati originalne audije sa odgovarajućim pravima.
- Testirati na stvarnom iPhoneu i Androidu, naročito obrisan privremeni fajl nakon reprodukcije, prekid preuzimanja i offline režim.
- Testirati i privremeno zaključan ekran, Bluetooth audio, izlaženje iz aplikacije i prekinutu mrežu.

**Napomena:** `server-private/pack-keys.json` se generiše pri prvom pokretanju servera, izuzet je iz ZIP-a i `.gitignore`. Ne dijeli i ne briši ga ako želiš zadržati mogućnost otključavanja već preuzetih šifrovanih snimaka. Server sada u memoriji drži token; PIN mora biti ponovo unijet nakon restartovanja servera.
