export type Lang = 'en' | 'hi';

/** Every learner-facing string ships in all supported languages. */
export type Text = Record<Lang, string>;

export type Band = 'junior' | 'senior' | 'realworld';

/** Computational-thinking / AI concept tags (AI4K12 "Five Big Ideas" + CT pillars). */
export type Concept =
  | 'sequencing'
  | 'debugging'
  | 'loops'
  | 'conditionals'
  | 'variables'
  | 'functions'
  | 'decomposition'
  | 'ai-training-data'
  | 'ai-bias'
  | 'ai-prediction'
  | 'tools-terminal'
  | 'tools-git';

interface LevelBase {
  id: string;
  title: Text;
  /** Spoken aloud when the level opens. Keep it short: 2-3 sentences. */
  story: Text;
  goal: Text;
  concepts: Concept[];
  hints: Text[];
  /** "Play without a phone" twin activity for classrooms with one device for 40 children. */
  unplugged?: Text;
  /** Zero-prep script for a teacher who has never coded. */
  teacherNote?: Text;
}

// ---------- Grid (block coding) ----------

export type Dir = 0 | 1 | 2 | 3; // N, E, S, W

export type GridAction = 'forward' | 'left' | 'right' | 'light';

export type Stmt =
  | { op: GridAction; id?: string }
  | { op: 'repeat'; times: number; body: Stmt[]; id?: string };

export type GridBlock = GridAction | 'repeat';

export interface GridLevelDef extends LevelBase {
  engine: 'grid';
  /** Rows of tiles: '#' tree/wall, '.' path, 'S' start, 'G' goal, 'D' diya to light. */
  map: string[];
  startDir: Dir;
  win: 'reach-goal' | 'light-all';
  blocks: GridBlock[];
  /** Optional block budget, e.g. to make children discover loops. */
  maxBlocks?: number;
  /** Program preloaded into the workspace (used by debugging levels). */
  starter?: Stmt[];
  /** Reference solution, verified by the test suite so every level is solvable. */
  solution: Stmt[];
}

// ---------- ML (train your own AI) ----------

export type FruitKind = 'mango' | 'apple' | 'banana';

export interface FruitSpec {
  kind: FruitKind;
  hue: number;
  seed: number;
  /** The true answer. Never shown before the child predicts or labels. */
  label: string;
}

export interface MlClass {
  id: string;
  name: Text;
  emoji: string;
}

export interface MlLevelDef extends LevelBase {
  engine: 'ml';
  classes: MlClass[];
  /** Examples Chintu already learned from before the child arrives. */
  given: FruitSpec[];
  /** Unlabelled fruit the child can teach Chintu with. */
  pool: FruitSpec[];
  /** Held-out exam: never used for training. */
  test: FruitSpec[];
  passAccuracy: number;
  /** Minimum examples per class the child must add before testing. */
  minPerClass: number;
  /** Bias levels: the child must first see Chintu fail, then fix it with better data. */
  mustFailFirst?: boolean;
  k: number;
}

// ---------- Terminal + Git simulator ----------

export interface FsFile {
  type: 'file';
  content: string;
}
export interface FsDir {
  type: 'dir';
  children: Record<string, FsNode>;
}
export type FsNode = FsFile | FsDir;

export interface TerminalTask<S = unknown> {
  text: Text;
  check: (shell: S) => boolean;
}

export interface TerminalLevelDef extends LevelBase {
  engine: 'terminal';
  /** Contents of /home/student at start. */
  home: Record<string, FsNode>;
  /** Starting directory relative to home, e.g. "" or "project". */
  startIn?: string;
  tasks: TerminalTask<import('../engines/terminal/shell').Shell>[];
  /** Commands that complete every task; verified by the test suite. */
  solution: string[];
}

// ---------- Python in the browser ----------

export interface PyTest {
  name: Text;
  code: string;
}

export interface PythonLevelDef extends LevelBase {
  engine: 'python';
  starter: string;
  tests: PyTest[];
  /** Reference answer, shown after 3 hints or on request by a teacher. */
  solution: string;
}

export type LevelDef = GridLevelDef | MlLevelDef | TerminalLevelDef | PythonLevelDef;

export interface ModulePack {
  id: string;
  band: Band;
  title: Text;
  description: Text;
  icon: string;
  /** Who it is for, e.g. "Classes 3-5". */
  audience: Text;
  levels: LevelDef[];
}

export interface EngineProps<L extends LevelDef> {
  level: L;
  lang: Lang;
  onComplete: () => void;
}
