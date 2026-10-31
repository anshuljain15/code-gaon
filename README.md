# 🤖 Code Gaon (कोड गाँव)

**Free, offline-first, voice-led coding and AI adventures for Indian students, in Hindi and English.**

Students help **Chintu Bot** solve problems in a small Indian town: walking to school, lighting Diwali diyas, sorting mangoes in Dadi's orchard, billing at the kirana shop, scoring a gully cricket match. Along the way they learn real programming, how AI actually works, and the tools professional developers use every day.

> No ads. No upselling. No sign-up. No personal data. Works on a shared ₹7,000 Android phone, even without internet.

---

## Three tracks, one platform

| Track | For | What they learn | How |
|---|---|---|---|
| 🌱 **Chintu's Journey** | Classes 3–5 | Sequencing, debugging, loops, nested loops | Drag-and-drop blocks ([Blockly](https://developers.google.com/blockly)) that move Chintu around a map |
| 🌿 **Teach Chintu: AI** | Classes 6–9 | Training data, testing, prediction confidence, **bias** | Label fruit to train a real classifier in the browser, test it on fruit it has never seen, catch its mistakes and fix them |
| 🌳 **Real-World Coder** | Class 9–12 & college | Terminal, Git, Python: variables, loops, functions, conditionals, automated tests | A safe simulated terminal with real commands and real Git, plus real Python running in the browser ([Pyodide](https://pyodide.org)) |

Every level has:
- a short **story** read aloud in Hindi or English (🔊), plus a mission goal
- up to 3 **hints**; fewer hints earn more ⭐ (stars reward understanding, not time spent)
- an **"unplugged" twin**: the same idea as a classroom activity needing no device (one phone, 40 children)
- a **zero-prep teacher note**, so a maths teacher who has never coded can run the class

## Why this exists

CBSE has made Computational Thinking & AI part of the curriculum for Classes 3–8 from 2026–27, but many Tier 2/3 schools have no lab, unreliable internet and no trained CS teacher. Free tools like Scratch and Code.org are excellent, but they are mostly English-first, built for laptops, or one-hour activities. Code Gaon aims to be the missing delivery vehicle: localized, voice-first, works offline on a phone, and free forever.

The full research and build plan is in [`Building a FGame-Like Coding and AI App for Tier 2 and 3 India_ Landscape, Gaps and Build Plan.md`](./Building%20a%20FGame-Like%20Coding%20and%20AI%20App%20for%20Tier%202%20and%203%20India_%20Landscape,%20Gaps%20and%20Build%20Plan.md).

## Quick start

Requires [Node.js](https://nodejs.org) 20+.

```bash
npm install
npm run dev        # open http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm test` | Run the test suite (engines + "every level is solvable" content checks) |
| `npm run build` | Type-check and build the offline PWA into `dist/` |
| `npm run preview` | Serve the production build locally (to test offline mode) |

To test on a phone on the same Wi-Fi: `npm run dev -- --host`, then open the printed network address.

### Deploy for free

- **GitHub Pages:** push to `main`. The included workflow (`.github/workflows/deploy.yml`) builds and publishes automatically. In your repo, go to **Settings → Pages → Source: GitHub Actions** once.
- **Cloudflare Pages / Netlify:** build command `npm run build`, output folder `dist`.
- **School lab with no internet:** copy `dist/` to any computer and serve it (`npx serve dist`), or put it on a Raspberry Pi. The build uses relative paths, so it works from any folder.

## How it works

```
src/
  core/          types (module-pack contract), i18n, voice, progress storage
  content/       the levels: junior.ts, senior.ts, realworld.ts
  engines/
    grid/        block-coding world: pure interpreter + Blockly host (lazy-loaded)
    ml/          colour feature extraction from pixels + k-nearest-neighbours
    terminal/    in-memory file system + Git simulator
    python/      Pyodide in a Web Worker, with a timeout for infinite loops
  ui/            screens: players, map, pack, level
public/
  py-worker.js   Python sandbox
tests/           Vitest suites
```

**Design choices that matter for low-end phones:**
- First load is about **35 KB gzipped**. Blockly (about 175 KB) loads only when a block level opens; Python (about 10 MB) downloads only when a Python level opens, then is cached for offline use.
- A service worker (Workbox) caches the whole app, about 0.8 MB, after the first visit, so it then works in airplane mode.
- Progress is stored on the device in IndexedDB. Several children can share one phone with separate nickname profiles.
- Voice uses the phone's built-in text-to-speech. Recorded [AI4Bharat Indic-TTS](https://github.com/AI4Bharat/Indic-TTS) audio packs are on the roadmap.
- The AI model is deliberately **transparent**: one feature (the fruit's average colour, measured from the drawn pixels) and k-nearest-neighbours. Students can see every training example on a colour line and understand exactly *why* Chintu guessed what it guessed.

## Privacy and child safety

Under India's DPDP Act, everyone under 18 is a child, and verifiable parental consent rules apply from about May 2027. Code Gaon is **anonymous by design**:

- No name, phone number, email or photo is collected. Profiles are a nickname and an animal avatar.
- Nothing leaves the device. There is no backend, no analytics, no third-party trackers, no ads and no chat.
- The only network request is the one-time Pyodide download from the jsDelivr CDN when a Python level is opened.

Any future feature that stores data in the cloud (teacher dashboards, parent WhatsApp updates) must go through an adult account with a consent flow, and get legal review first. See [CONTRIBUTING.md](./CONTRIBUTING.md#privacy-rules).

## Add your own levels

Levels are plain data plus small check functions. Adding a block-coding level is about 30 lines. See **[docs/module-packs.md](./docs/module-packs.md)**. The test suite automatically checks that every level is solvable, its map is valid and every string is translated.

## Roadmap

- [x] **MVP slice:** 3 tracks, 10 levels, 4 engines, Hindi + English, offline PWA, multiple profiles
- [ ] More levels: conditionals with blocks (monsoon), variables (kirana), events (cricket scoreboard)
- [ ] "Show me the code": see the Python or JavaScript behind your blocks (Classes 6–8 bridge)
- [ ] Real-World track: "Using AI tools well" (prompting, checking AI answers, privacy), HTML/CSS mini-site, APIs and JSON
- [ ] Recorded Indic-TTS voice packs; more languages (Marathi, Bengali, Tamil, Telugu…)
- [ ] Camera-based training with TensorFlow.js MobileNet (optional, on-device only)
- [ ] Teacher mode: class codes, printable unplugged worksheets, certificates, CBSE CT & AI outcome mapping
- [ ] Adaptive difficulty ("teaching at the right level")
- [ ] Parent updates via WhatsApp (opt-in, consent-first)
- [ ] Pilot with 3–5 schools and a pre/post computational-thinking test

## Contributing

Teachers, translators, illustrators, students and developers are all welcome. Writing a level in your language is a great first contribution. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

- **Code:** [Apache License 2.0](./LICENSE)
- **Learning content** (stories, hints, teacher notes, unplugged activities): [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Use it, translate it, print it for your classroom.

Built on the shoulders of [Blockly](https://github.com/google/blockly), [Pyodide](https://github.com/pyodide/pyodide), [Preact](https://preactjs.com) and [Vite](https://vitejs.dev), and inspired by Scratch, Code.org's AI for Oceans, Teachable Machine and Pratham's Teaching at the Right Level.
