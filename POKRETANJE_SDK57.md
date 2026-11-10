# Kotor Stories v0.2 – Expo SDK 57

Ova verzija cilja Expo Go SDK 57 na iPhoneu.

## Windows / VS Code / PowerShell

1. Zaustavi stari terminal sa Ctrl+C.
2. Raspakuj ZIP u nov folder, npr. `C:\Users\Veljko\KotorStories_SDK57`.
3. Otvori taj folder u VS Code (File > Open Folder).
4. U terminalu upiši redom:

```powershell
node --version
npm.cmd install
npx.cmd expo install --fix
npx.cmd expo-doctor
npx.cmd expo start --tunnel --clear
```

SDK 57 traži Node.js 22.13 ili noviji. Instaliraj Node 22 LTS/noviji ako je stara verzija.
Na iPhoneu otvori Expo Go i skeniraj novi QR kod.

**Napomena:** Ova verzija je usklađena na nivou deklarisanih zavisnosti prema Expo SDK 57 dokumentaciji. Nije mogla biti pokrenuta/testirana u ovom okruženju bez pristupa npm registru ili fizičkom iPhoneu. Expo Doctor na tvom računaru je dodatna provjera. GPS okidači rade samo dok je app otvoren u ovom MVP-u.
