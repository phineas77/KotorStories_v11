# Kotor Stories v1.1 – Protected Audio + Free Local Voice Tests

Ovo je nastavak stabilne razvojne verzije v1.0. Dodato je:

- `scripts/qwen_local_narrator.py` – lokalni Qwen3-TTS Aiden/Ryan preview; bez ElevenLabs naloga, API ključa i trošenja kredita
- `server_qwen_audio/en/` – izbor teksta koji će naš zaštićeni server servirati za iPhone (inicijalno je prazan)
- `KOTOR_AUDIO_SOURCE=qwen` – poseban režim za Qwen-only audio, bez Max/demo fallback-a
- testovi koji provjeravaju da Qwen režim servira samo izabrane šifrovane fajlove

**Prvo pročitaj `POKRETANJE_v11_QWEN.md`.**

Nijedan Qwen MP3 nije unaprijed generisan. To moraš izvršiti na svom NVIDIA laptopu. Svi audio fajlovi koji su došli iz prethodnih testova služe isključivo privatnom razvoju; nisu dozvoljeni za komercijalnu distribuciju bez odgovarajućih prava.

Za provjeru serverske zaštite: `npm.cmd run audio:test` i `npm.cmd run audio:test:qwen`.
