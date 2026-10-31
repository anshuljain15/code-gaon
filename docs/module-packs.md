# Writing levels and module packs

A **module pack** is one location on the Code Gaon map, such as "Chintu's Journey". It holds an ordered list of **levels**. Each level picks an **engine** (`grid`, `ml`, `terminal` or `python`) and provides plain data plus, sometimes, a tiny check function.

The types live in [`src/core/types.ts`](../src/core/types.ts). The existing packs in [`src/content/`](../src/content/) are the best examples.

## Fields every level has

| Field | Purpose |
|---|---|
| `id` | Unique within the pack, kebab-case, e.g. `diwali-ki-lights` |
| `title`, `story`, `goal` | `{ en, hi }`. The story is read aloud, so keep it to 2–3 short sentences. |
| `concepts` | Tags such as `loops` or `ai-bias`, used for future syllabus mapping |
| `hints` | 2–3 hints, from gentle to almost-the-answer |
| `unplugged` | Optional. The same idea as a no-device classroom activity |
| `teacherNote` | Optional. What the concept is and one question to ask the class, for a teacher who has never coded |

**Writing tips:** use Indian everyday settings. Use simple Hindi, and Hinglish words where children really say them ("chaat stall", "commit"). Feature girls and boys equally. Never shame mistakes: "Oops! Chintu bumped into a tree" beats "Wrong!".

## Engine: `grid` (block coding)

```ts
{
  id: 'my-level',
  engine: 'grid',
  map: ['S..#',
        '#..G'],         // '#' tree, '.' path, 'S' start, 'G' school, 'D' diya
  startDir: 1,           // 0 up, 1 right, 2 down, 3 left
  win: 'reach-goal',     // or 'light-all'
  blocks: ['forward', 'left', 'right', 'repeat', 'light'],
  maxBlocks: 4,          // optional: forces loops
  starter: [...],        // optional: preloaded (buggy) program for debugging levels
  solution: [{ op: 'forward' }, { op: 'repeat', times: 2, body: [{ op: 'right' }] }],
  ...
}
```

`solution` is required. The tests run it to prove the level can be solved within `maxBlocks`. If you give a `starter`, the tests also check that it does *not* already win.

## Engine: `ml` (train your own AI)

Fruits are drawn by code, so there are no image downloads. Chintu "sees" only the average colour (hue, 0–360°) measured from the pixels and uses k-nearest-neighbours.

```ts
{
  engine: 'ml',
  classes: [{ id: 'pakka', name: { en: 'Ripe', hi: 'पका' }, emoji: '🟡' }, ...],
  given: [],          // examples Chintu already knows (use biased ones for bias levels)
  pool: [...],        // fruit the child labels; each has its true label
  test: [...],        // held-out exam, never trained on
  passAccuracy: 0.75,
  minPerClass: 2,
  mustFailFirst: false, // true = the pool stays hidden until the child sees Chintu fail
  k: 3,
}
```

Use the `fruits(kind, label, hues, seed)` helper in `senior.ts`. Rough hues: red 350–10, orange 25–35, yellow 45–60, green 80–120. The tests check that perfect labelling passes and, for bias levels, that the starting data fails.

## Engine: `terminal` (terminal + Git)

```ts
{
  engine: 'terminal',
  home: { 'notes.txt': { type: 'file', content: 'hi\n' } },
  startIn: '',                       // folder under /home/student to start in
  tasks: [
    { text: { en: 'Make a folder: mkdir mela', hi: '...' }, check: (s) => s.at('mela')?.type === 'dir' },
  ],
  solution: ['mkdir mela'],          // the tests replay this and require every task to tick
}
```

Useful helpers on the `Shell` passed to `check`:

| Helper | Returns |
|---|---|
| `s.at('path/from/home')` | The file or folder at that path, if any |
| `s.cwdFromHome` | The current folder, relative to home |
| `s.ran(/^git status/)` | Whether a matching command has been typed |
| `s.repo` | Git state: `staged` and `commits` |

Tasks stay ticked once done.

## Engine: `python`

```ts
{
  engine: 'python',
  starter: 'def add(a, b):\n    pass\n',
  tests: [{ name: { en: '2 + 3 = 5', hi: '2 + 3 = 5' }, code: 'assert add(2, 3) == 5, "Expected 5"' }],
  solution: 'def add(a, b):\n    return a + b\n',
}
```

Each test is one `assert` line run after the student's code. The message after the comma is shown to the student when it fails. The solution is revealed after 3 failed runs.

## Adding a new pack

1. Create `src/content/my-pack.ts` exporting a `ModulePack` (`id`, `band`, `title`, `audience`, `description`, `icon`, `levels`).
2. Add it to `PACKS` in `src/content/index.ts`.
3. Run `npm test`. The content tests check every level and every translation automatically.

## Adding a new engine

1. Add a `XyzLevelDef` to the `LevelDef` union in `types.ts`.
2. Create `src/engines/xyz/XyzLevel.tsx`, taking `EngineProps<XyzLevelDef>`. Call `onComplete()` once when the student succeeds.
3. Add a `case` to `Engine` in `src/ui/LevelScreen.tsx`.
4. Keep the logic in a pure, testable module (like `world.ts` or `shell.ts`), and add tests plus a "solvable" check in `tests/content.test.ts`.
5. Keep it light. If it needs a big library, load it lazily with `import()`, like Blockly.
