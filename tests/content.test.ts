import { describe, expect, it } from 'vitest';
import { PACKS, isUnlocked, levelKey, findLevel } from '../src/content';
import { UI_STRINGS } from '../src/core/i18n';
import { countBlocks, runProgram } from '../src/engines/grid/world';
import { accuracy } from '../src/engines/ml/model';
import { Shell } from '../src/engines/terminal/shell';
import type { LevelDef, Text } from '../src/core/types';

/** Recursively collects every bilingual Text object in a value. */
const texts = (v: unknown, out: Text[] = []): Text[] => {
  if (v && typeof v === 'object') {
    if ('en' in v && 'hi' in v) out.push(v as Text);
    else Object.values(v).forEach((x) => texts(x, out));
  }
  return out;
};

const allLevels: [string, LevelDef][] = PACKS.flatMap((p) => p.levels.map((l) => [`${p.id}/${l.id}`, l] as [string, LevelDef]));

describe('content packs', () => {
  it('have unique ids', () => {
    const ids = allLevels.map(([k]) => k);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(PACKS.map((p) => p.id)).size).toBe(PACKS.length);
  });

  it('cover all three bands', () => {
    expect(new Set(PACKS.map((p) => p.band))).toEqual(new Set(['junior', 'senior', 'realworld']));
  });

  it('translate every learner-facing string into Hindi and English', () => {
    const missing = [...texts(PACKS), ...texts(UI_STRINGS)].filter((x) => !x.en.trim() || !x.hi.trim());
    expect(missing).toEqual([]);
  });

  it('give every level a story, a goal and at least two hints', () => {
    for (const [, l] of allLevels) {
      expect(l.hints.length).toBeGreaterThanOrEqual(2);
      expect(l.concepts.length).toBeGreaterThan(0);
    }
  });

  it('unlock levels in order', () => {
    const pack = PACKS[0];
    expect(isUnlocked(pack, 0, {})).toBe(true);
    expect(isUnlocked(pack, 1, {})).toBe(false);
    expect(isUnlocked(pack, 1, { [levelKey(pack.id, pack.levels[0].id)]: { stars: 3, completedAt: 0 } })).toBe(true);
    expect(findLevel(pack.id, pack.levels[1].id)?.index).toBe(1);
    expect(findLevel(pack.id, 'nope')).toBeUndefined();
  });
});

describe.each(allLevels)('level %s', (_, level) => {
  if (level.engine === 'grid') {
    it('is solvable by its reference solution within the block budget', () => {
      expect(runProgram(level, level.solution).outcome).toBe('win');
      if (level.maxBlocks) expect(countBlocks(level.solution)).toBeLessThanOrEqual(level.maxBlocks);
    });
    it('has rectangular map with exactly one start', () => {
      expect(new Set(level.map.map((r) => r.length)).size).toBe(1);
      expect(level.map.join('').split('S').length - 1).toBe(1);
    });
    if (level.starter) {
      it('starts with a program that does NOT already win (it is a debugging level)', () => {
        expect(runProgram(level, level.starter!).outcome).not.toBe('win');
      });
    }
  }

  if (level.engine === 'ml') {
    const feature = (f: { hue: number; label: string }) => ({ x: f.hue, label: f.label });
    const truth = level.test.map(feature);
    const fullTraining = [...level.given, ...level.pool].map(feature);

    it('passes when the child labels every example correctly', () => {
      expect(accuracy(fullTraining, truth, level.k)).toBeGreaterThanOrEqual(level.passAccuracy);
    });
    it('uses only known classes', () => {
      const ids = new Set(level.classes.map((c) => c.id));
      for (const f of [...level.given, ...level.pool, ...level.test]) expect(ids.has(f.label)).toBe(true);
    });
    if (level.mustFailFirst) {
      it('fails with only the biased starting data (so the child discovers the bias)', () => {
        expect(accuracy(level.given.map(feature), truth, level.k)).toBeLessThan(level.passAccuracy);
      });
    } else {
      it('has enough examples of every class in the pool', () => {
        for (const c of level.classes) expect(level.pool.filter((f) => f.label === c.id).length).toBeGreaterThanOrEqual(level.minPerClass);
      });
    }
  }

  if (level.engine === 'terminal') {
    it('is completed by its reference commands', () => {
      const sh = new Shell(level.home, level.startIn);
      const done = level.tasks.map(() => false);
      for (const cmd of level.solution) {
        sh.exec(cmd);
        level.tasks.forEach((t, i) => (done[i] ||= t.check(sh)));
      }
      expect(done).toEqual(level.tasks.map(() => true));
    });
    it('has no task already done at the start', () => {
      const sh = new Shell(level.home, level.startIn);
      expect(level.tasks.filter((t) => t.check(sh))).toHaveLength(0);
    });
  }

  if (level.engine === 'python') {
    it('has a starter that differs from the solution and checks for every test', () => {
      expect(level.starter).not.toBe(level.solution);
      expect(level.tests.length).toBeGreaterThan(0);
      for (const t of level.tests) expect(t.code).toMatch(/^assert /);
    });
  }
});
