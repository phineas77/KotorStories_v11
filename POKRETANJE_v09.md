# Kotor Stories v0.9 — audio-paketi za offline korišćenje

Ovo je razvojna verzija. Stabilne funkcije iz v0.8 su zadržane: 5 probnih GPS stanica, 29 tekstova EN/ME i probni ugrađeni audio.

## Zašto prvo arhitektura, pa glasovi?

Sistem preuzima samo onaj jezik koji turista izabere. Izvor zvuka je potpuno odvojen od aplikacije, tako da kasnije možemo koristiti Qwen, Piper ili drugi AI glas bez promjena u GPS dijelu. **Još nemamo 29 završenih snimaka ni server na internetu.**

## Pokretanje na Windows računaru

1. Sačuvaj prethodni folder v0.8 kao rezervu; raspakuj novi ZIP.
2. Otvori `KotorStories_v09` u VS Code i u terminalu pokreni:

```powershell
npm.cmd install
npx.cmd expo install --fix
npx.cmd expo-doctor
```

3. Otvori **drugi terminal** u istom folderu i pokreni lokalni demo audio-server:

```powershell
npm.cmd run audio:serve
```

Server će prikazati adresu kao `http://192.168.1.105:8787`. Tačna adresa zavisi od tvoje mreže. Telefon i računar moraju biti na istom Wi-Fi-ju. U Safariju na iPhoneu probaj `http://TVOJA-IP:8787/health`, treba da piše `Kotor Stories demo audio server OK`. Ako nije dostupno, provjeri Windows Defender Firewall i Wi-Fi mrežu. Ne otvaraj server na javni internet; služi samo za test.

4. U prvom terminalu pokreni:

```powershell
npx.cmd expo start --clear
```

5. Otvori projekat u Expo Go, izaberi English, pronađi **OFFLINE AUDIO PACKS**, unesi adresu servera bez `/health` i pritisni **CHECK PACK**. Trebalo bi da pokaže `5/29`. Zatim pritisni **DOWNLOAD**. Po završetku prikazuje broj sačuvanih fajlova i veličinu u MB.
6. Dok je aplikacija otvorena, ugasi Wi-Fi na telefonu, zatim u *Route & Stories* otvori jedan od 5 demo poglavlja (1,5,9,12,16). Audio bi trebalo da se reprodukuje lokalno.
7. Vrati internet, klikni **DELETE DOWNLOADED LANGUAGE**; status se vraća na 0/29. Prethodni ugrađeni demo-snimci i dalje rade jer su namjerno ostavljeni radi kompatibilnosti sa v0.8.

## Kako će ovo izgledati u finalnoj verziji?

- U produkcionoj aplikaciji uklanjamo ugrađene demo MP3 fajlove, a ostavljamo kratki promotivni uzorak. Tako početna aplikacija ostaje mala.
- Audio će biti dostupan preko **HTTPS** servisa, npr. Cloudflare R2/CDN. Lokalni HTTP je dozvoljen samo za razvoj.
- Kad napravimo svih 29 snimaka na jednom jeziku, stavljamo ih u folder `generated_audio/en/01.mp3` ... `29.mp3` ili uploadujemo na cloud server uz manifest. Server automatski označava paket kao `full` tek kada ima svih 29.
- Sadašnjim demo serverom možemo testirati 5/29 po jeziku. Za drugih 24 prikaza piše *Audio pending*, bez lažnog obećanja da su preuzeti.
- Svaki MP3 se provjerava po veličini i kontrolnom zbiru; preuzeti fajlovi čuvaju se u privatnom dokument folderu telefona. Ako internet nestane, već preuzeti fajlovi ostaju i sledeće preuzimanje nastavlja od nedostajućih fajlova.
- **Offline mapa nije još uključena.** GPS radi bez mreže kada je lokacija dostupna, ali pozadinska GPS aktivacija na zaključanom ekranu tek treba poseban development build i terenski test.
- **Prava zaštita plaćenog sadržaja, kupovina u aplikaciji i hosting** nijesu implementirani. Demo server je razvojni, bez autentifikacije. Prije prodaje će trebati kontrola pristupa i zaštita od kopiranja (uz realna ograničenja DRM-a).

## Jedan mali besplatni glas prije masovne produkcije

Nakon ovog testa probaj samo prvu priču sa Qwen3-TTS glasovima Aiden i Ryan. Sačuvaj generisani fajl kao `generated_audio/en/01.mp3` i ponovo pritisni **DOWNLOAD**. Tako ćemo potvrditi da aplikacija koristi novi MP3 bez dodatnog programiranja. Nemoj još praviti 29 snimaka dok ne izaberemo glas i provjerimo komercijalnu licencu modela i eventualnog voice paketa.

## Važno o licenci

Prvi Maxov snimak iz ElevenLabs besplatnog plana ostaje samo u razvojnom projektu. Ne smije završiti u komercijalno objavljenoj aplikaciji bez odgovarajućih prava. Besplatna generacija nije automatski komercijalno dozvoljena: provjeriti licencu svakog modela i glasa.
