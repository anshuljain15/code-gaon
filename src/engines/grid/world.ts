import type { Dir, GridLevelDef, Stmt } from '../../core/types';

export interface Pos {
  x: number;
  y: number;
}

export interface WorldState {
  robot: Pos;
  dir: Dir;
  lit: string[];
  /** Id of the block that produced this state, for highlighting while animating. */
  blockId?: string;
}

export type RunOutcome = 'win' | 'crash' | 'incomplete' | 'too-long';

export interface RunResult {
  frames: WorldState[];
  outcome: RunOutcome;
}

const MAX_STEPS = 400;
const DELTA: Record<Dir, Pos> = { 0: { x: 0, y: -1 }, 1: { x: 1, y: 0 }, 2: { x: 0, y: 1 }, 3: { x: -1, y: 0 } };

export const key = (p: Pos) => `${p.x},${p.y}`;

export const tileAt = (map: string[], p: Pos): string => map[p.y]?.[p.x] ?? '#';

export const findTiles = (map: string[], ch: string): Pos[] => {
  const out: Pos[] = [];
  map.forEach((row, y) => [...row].forEach((c, x) => c === ch && out.push({ x, y })));
  return out;
};

export const initialState = (level: Pick<GridLevelDef, 'map' | 'startDir'>): WorldState => {
  const [start] = findTiles(level.map, 'S');
  if (!start) throw new Error('Grid map has no start tile S');
  return { robot: start, dir: level.startDir, lit: [] };
};

export const isWin = (level: Pick<GridLevelDef, 'map' | 'win'>, s: WorldState) =>
  level.win === 'reach-goal'
    ? tileAt(level.map, s.robot) === 'G'
    : findTiles(level.map, 'D').every((d) => s.lit.includes(key(d)));

export const countBlocks = (program: Stmt[]): number =>
  program.reduce((n, s) => n + 1 + (s.op === 'repeat' ? countBlocks(s.body) : 0), 0);

/** Pure interpreter: same program + same level always gives the same frames. */
export const runProgram = (level: Pick<GridLevelDef, 'map' | 'startDir' | 'win'>, program: Stmt[]): RunResult => {
  let state = initialState(level);
  const frames: WorldState[] = [state];
  let crashed = false;

  const exec = (stmts: Stmt[]): boolean => {
    for (const s of stmts) {
      if (crashed || frames.length > MAX_STEPS) return false;
      if (s.op === 'repeat') {
        for (let i = 0; i < s.times; i++) if (!exec(s.body)) return false;
        continue;
      }
      const next: WorldState = { ...state, lit: state.lit, blockId: s.id };
      if (s.op === 'forward') {
        const d = DELTA[state.dir];
        const p = { x: state.robot.x + d.x, y: state.robot.y + d.y };
        if (tileAt(level.map, p) === '#') {
          crashed = true;
          frames.push({ ...next, robot: p });
          return false;
        }
        next.robot = p;
      } else if (s.op === 'left') {
        next.dir = ((state.dir + 3) % 4) as Dir;
      } else if (s.op === 'right') {
        next.dir = ((state.dir + 1) % 4) as Dir;
      } else if (s.op === 'light') {
        const k = key(state.robot);
        if (tileAt(level.map, state.robot) === 'D' && !state.lit.includes(k)) next.lit = [...state.lit, k];
      }
      state = next;
      frames.push(state);
    }
    return true;
  };

  exec(program);

  const outcome: RunOutcome = crashed
    ? 'crash'
    : frames.length > MAX_STEPS
      ? 'too-long'
      : isWin(level, state)
        ? 'win'
        : 'incomplete';
  return { frames, outcome };
};
