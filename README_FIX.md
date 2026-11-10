# Kotor Stories v1.1.1 – ispravka tekstova i otključavanja

Ovo je **PATCH**, nije novi kompletan projekat. Primijeniti na postojeći
`C:\Users\Veljko\KotorStories_v11` kako bi svi generisani Aidenovi
MP3 fajlovi i `server_qwen_audio` ostali netaknuti.

## Primjena (Windows PowerShell)

1. Zaustaviti Expo (`Ctrl+C`). Lokalni audio server može ostati uključen.
2. U `KotorStories_v11` sačuvati postojeće fajlove (komande dolje).
3. Raspakovati ZIP preko postojećeg `KotorStories_v11` (sadrži `App.tsx`, `src`, `content`, `tsconfig.json`).
4. Pokrenuti `npx.cmd expo start --clear`.

Backup, pokrenuto iz `C:\Users\Veljko\KotorStories_v11`:

```powershell
Copy-Item .\App.tsx .\App_before_fix.tsx
Copy-Item .\src\storiesContent.ts .\src\storiesContent_before_fix.ts
Copy-Item .\src\securePacks.ts .\src\securePacks_before_fix.ts
Copy-Item .\content\stories.json .\content\stories_before_fix.json
```

Ako je ZIP sačuvan u Downloads pod imenom `KotorStories_v1.1.1_FIX_TEXT_UNLOCK.zip`:

```powershell
Expand-Archive "$env:USERPROFILE\Downloads\KotorStories_v1.1.1_FIX_TEXT_UNLOCK.zip" -DestinationPath . -Force
npx.cmd expo start --clear
```

Za provjeru da su tekstovi ažurni:

```powershell
Get-Content .\content\stories.json -TotalCount 10
```

Prva engleska naracija počinje sa `The Sea Gate is Kotor's principal western entrance.`

## Unlock test

Uz uključen audio server, otvori `http://<TVOJ-LAN-IP>:8787/health` u
Safariju na iPhoneu. Rezultat treba da bude JSON sa `status: development-only`.
Zatim unesi **istovjetnu** IP adresu u Audio Packs, razvojni PIN i DEV UNLOCK.
Ako URL ne radi u Safariju, nema smisla ponavljati PIN: provjeri Wi-Fi,
Windows Firewall i da audio-server i dalje radi. IP adresa se može promijeniti.
Sada unlock vraća jasnu grešku nakon 10 sekundi umjesto da ostane na "Activating...".

## Važno

- Ne briši `local_qwen_audio`, `server_qwen_audio` niti `server-private`.
- Ne pokreći generisanje novih MP3 fajlova: 29 već pripremljenih su sačuvani.
- `src/storiesContent.ts` sada direktno uvozi `content/stories.json`: isti tekst
  koriste i Qwen generator i mobilni UI. Prethodno je aplikacija prikazivala
  zasebnu staru kopiju tekstova.
- Ostalih 4 jezika trenutno i dalje nemaju završene prevode.
- Ovo je razvojna verzija, ne sistem naplate za javno objavljivanje.
