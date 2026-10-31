# Contributing to Code Gaon

Thank you for helping children learn! You don't need to be a developer to help.

## Ways to help

- **Teachers:** try a level with your class and open an issue about what confused the children. Improve teacher notes and unplugged activities.
- **Translators:** improve the Hindi, or add a new language (see below). Native-speaker review is very valuable.
- **Content writers:** write new levels set in everyday Indian life. See [docs/module-packs.md](./docs/module-packs.md).
- **Developers:** pick an item from the README roadmap or an issue labelled `good first issue`.
- **Testers:** try the app on a cheap Android phone and report anything slow or broken. Include the phone model and Android version.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # must pass before opening a pull request
npm run build    # must succeed: type-check plus production build
```

Pull requests should:
1. Keep `npm test` and `npm run build` green.
2. Include both `en` and `hi` for every learner-facing string. The tests enforce this.
3. Stay light: no new runtime dependency without a reason, and big libraries must be lazy-loaded.
4. Work at phone width (360 px) and with touch.

## Adding a language

1. Add the code to `Lang` in `src/core/types.ts`, e.g. `'en' | 'hi' | 'mr'`.
2. TypeScript will now point at every string missing the new language. Fill them in.
3. Add the speech tag in `src/core/voice.ts` (e.g. `mr: 'mr-IN'`) and the Blockly locale in `src/engines/grid/blockly-host.ts`.
4. Add a button for it in the language toggle in `src/app.tsx`.

## Privacy rules

These are non-negotiable, because our users are children and India's DPDP Act treats everyone under 18 as a child.

- **No personal data from children:** no real names, phone numbers, emails, photos, location or device IDs.
- **No third-party scripts, analytics, ads or trackers.** The only allowed external request is the Pyodide CDN for Python levels.
- **No chat, public profiles or open sharing.**
- **Camera and microphone features must run fully on the device**, and the screen must say so plainly.
- Anything that sends data to a server needs an issue discussing consent and legal review *before* any code is written.

## Code of conduct

Be kind and patient, as you would be with a child learning something new. Harassment of any kind is not tolerated.
