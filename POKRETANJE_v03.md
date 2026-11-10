# Kotor Stories v0.3 – kako pokrenuti na iPhoneu (Windows + VS Code)

**Ovo je novi folder/projekat.** Stari KotorStories_SDK57 v0.2 ne mijenjaš.

1. U prethodnom terminalu zaustavi Metro server sa `Ctrl + C`.
2. Raspakuj ZIP u svoj `C:\Users\Veljko\` i otvori **KotorStories_v03** u VS Codeu.
3. U PowerShell terminalu pokreni sljedeće komande **jednu po jednu**:

```powershell
npm.cmd install
npx.cmd expo install --fix
npx.cmd expo-doctor
npx.cmd expo start --clear
```

4. Ako sve provjere prolaze, iPhone + Windows na istu Wi-Fi mrežu. Otvori Expo Go prijavljenim Expo nalogom, skeniraj QR kod.
5. **Proba kod kuće:** odaberi `DEMO AT HOME`, pritisni `SIMULATE ARRIVAL AT NEXT STOP`, slušaj svih pet priča. `Test weak GPS` ne smije označiti stanicu kao pređenu.
6. **Pravi GPS:** odaberi `REAL GPS WALK`, pritisni `START GPS TOUR`, dozvoli preciznu lokaciju. Ako nisi u Starom gradu, nijedna priča ne smije se aktivirati.
7. Zatvori i ponovo otvori aplikaciju: jezik i odvojeni demo/GPS napredak i slušane priče treba da se sačuvaju.

Ako terminal opet zatraži instalaciju `expo-doctor`, upiši `y`. Ako `--clear` ne može povezati telefon, tada koristi `npm.cmd install --save-dev "@expo/ngrok@^4.1.0"` pa `npx.cmd expo start --tunnel --clear`.

### Šta je urađeno

- Razdvojena je **simulacija** od **stvarne GPS šetnje**. Simulator koristi ista pravila GPS aktivacije, ali nikad ne glumi stvarnu lokaciju u produkcionom režimu.
- Novi engine zahtijeva dva pouzdana uzastopna GPS očitavanja sa razmakom ≥700 ms; odbacuje GPS grešku preko 30 m, lokacije starije od 15 sekundi i lokacije van zone.
- Čuvanje odslušanih priča, jezika i zasebnog napretka demo / stvarni GPS (`expo-sqlite` lokalno na telefonu).
- Bolja i preglednija mapa, brojevi stanica, fokusiranje mape, sljedeća stanica, pregled uredničkog plana 29 poglavlja.
- Ručno puštanje priče je **preview** i ne označava automatski stvarnu posjetu.
- Lokalno uključeno 30 DEMO MP3 fajlova (5 × 6 jezika).
- Čisti lokalni GPS testovi: `npm.cmd run test:gps`.

### Važno: još nije produkciona verzija

- Auto-GPS trenutno radi **samo dok je aplikacija otvorena**. Pozadinsko praćenje na iOS-u nije podržano u Expo Go. Za to kasnije pravimo poseban iOS development build sa `expo-task-manager`, background permissions i fizičkim testom.
- Mapa i dalje koristi online pločice (audio radi offline); **nije offline mapa**.
- Aktivacione koordinate i radiusi su **približni**, tek ih moramo precizno izmjeriti na terenu.
- Samo 5 od 29 priča ima audio. Glasovi su **demo sintetički**, ne prodajni kvalitet. Preostalih 24 su urednički naslovi, a ne snimljene priče.
- Nema kupovine, trgovinske integracije ni objave u App Store-u.
- Kod je statički provjeren, a GPS engine testiran u Nodeu; **mobilna verzija v0.3 nije pokrenuta na stvarnom uređaju u ovom okruženju**.

Za komercijalni proizvod istorijske skripte, prevode, rutu, GPS i dozvole/privatnost treba finalno provjeriti. Nijedna GPS lokacija korisnika ne šalje se serveru u v0.3.
