import type { FsDir, FsNode } from '../../core/types';

// A tiny, safe, in-memory "computer". Real commands, real-looking output, nothing can break.

interface Commit {
  hash: string;
  message: string;
  snapshot: Record<string, string>;
}

interface Repo {
  root: string[];
  staged: Record<string, string>;
  commits: Commit[];
}

const HOME = ['home', 'student'];

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

/** Splits a command line into words, keeping "quoted text" together. */
export const tokenize = (line: string): string[] => {
  const out: string[] = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
};

const shortHash = (s: string) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
};

const HELP = `Commands you can use:
  pwd                 show which folder you are in
  ls [folder]         list what is inside a folder
  cd <folder>         go into a folder (cd .. goes back up, cd ~ goes home)
  mkdir <name>        make a new folder
  touch <name>        make a new empty file
  cat <file>          show what is inside a file
  echo <text>         print text (echo hello > file.txt writes it to a file, >> adds to the end)
  rm <file>           delete a file
  clear               clear the screen
  git init            start tracking this folder with Git
  git status          see what changed
  git add <file|.>    put changes in the "ready to save" box
  git commit -m "msg" save a checkpoint with a message
  git log             see all saved checkpoints`;

export class Shell {
  root: FsDir;
  cwd: string[];
  repo: Repo | null = null;
  history: string[] = [];

  constructor(home: Record<string, FsNode> = {}, startIn = '') {
    this.root = { type: 'dir', children: { home: { type: 'dir', children: { student: { type: 'dir', children: clone(home) } } } } };
    this.cwd = [...HOME, ...startIn.split('/').filter(Boolean)];
  }

  get prompt() {
    const path = this.pathString(this.cwd);
    const home = '/' + HOME.join('/');
    return `student@code-gaon:${path.startsWith(home) ? '~' + path.slice(home.length) : path}$`;
  }

  pathString(parts: string[]) {
    return '/' + parts.join('/');
  }

  resolve(path: string): string[] {
    const parts = path.startsWith('/') ? [] : path.startsWith('~') ? [...HOME] : [...this.cwd];
    for (const seg of path.replace(/^~/, '').split('/')) {
      if (!seg || seg === '.') continue;
      if (seg === '..') parts.pop();
      else parts.push(seg);
    }
    return parts;
  }

  node(parts: string[]): FsNode | undefined {
    let n: FsNode = this.root;
    for (const p of parts) {
      if (n.type !== 'dir' || !(p in n.children)) return undefined;
      n = n.children[p];
    }
    return n;
  }

  /** Convenience for task checks: path relative to home, e.g. "mela/stalls.txt". */
  at(pathFromHome: string) {
    return this.node([...HOME, ...pathFromHome.split('/').filter(Boolean)]);
  }

  get cwdFromHome() {
    return this.cwd.slice(HOME.length).join('/');
  }

  ran(pattern: RegExp) {
    return this.history.some((h) => pattern.test(h.trim()));
  }

  private parentAndName(path: string): [FsDir | undefined, string] {
    const parts = this.resolve(path);
    const name = parts.pop() ?? '';
    const parent = this.node(parts);
    return [parent?.type === 'dir' ? parent : undefined, name];
  }

  private writeFile(path: string, text: string, append: boolean): string {
    const [dir, name] = this.parentAndName(path);
    if (!dir || !name) return `bash: ${path}: No such file or directory`;
    const existing = dir.children[name];
    if (existing?.type === 'dir') return `bash: ${path}: Is a directory`;
    const prev = existing?.type === 'file' ? existing.content : '';
    dir.children[name] = { type: 'file', content: append ? prev + text + '\n' : text + '\n' };
    return '';
  }

  /** Runs one command line. Returns the text the terminal should print ("\f" means clear the screen). */
  exec(line: string): string {
    const trimmed = line.trim();
    if (!trimmed) return '';
    this.history.push(trimmed);

    const redirect = trimmed.match(/^echo\s+(.*?)\s*(>>?)\s*(\S+)$/);
    if (redirect) {
      const text = tokenize(redirect[1]).join(' ');
      return this.writeFile(redirect[3], text, redirect[2] === '>>');
    }

    const [cmd, ...args] = tokenize(trimmed);
    switch (cmd) {
      case 'help':
        return HELP;
      case 'clear':
        return '\f';
      case 'pwd':
        return this.pathString(this.cwd);
      case 'whoami':
        return 'student';
      case 'ls': {
        const target = this.node(this.resolve(args[0] ?? '.'));
        if (!target) return `ls: cannot access '${args[0]}': No such file or directory`;
        if (target.type === 'file') return args[0];
        return Object.entries(target.children)
          .filter(([name]) => !name.startsWith('.'))
          .map(([name, n]) => (n.type === 'dir' ? name + '/' : name))
          .sort()
          .join('  ');
      }
      case 'cd': {
        const parts = this.resolve(args[0] ?? '~');
        const target = this.node(parts);
        if (!target) return `cd: ${args[0]}: No such file or directory`;
        if (target.type !== 'dir') return `cd: ${args[0]}: Not a directory`;
        this.cwd = parts;
        return '';
      }
      case 'mkdir': {
        if (!args[0]) return 'mkdir: missing operand';
        const [dir, name] = this.parentAndName(args[0]);
        if (!dir) return `mkdir: cannot create directory '${args[0]}': No such file or directory`;
        if (dir.children[name]) return `mkdir: cannot create directory '${args[0]}': File exists`;
        dir.children[name] = { type: 'dir', children: {} };
        return '';
      }
      case 'touch': {
        if (!args[0]) return 'touch: missing file operand';
        const [dir, name] = this.parentAndName(args[0]);
        if (!dir) return `touch: cannot touch '${args[0]}': No such file or directory`;
        dir.children[name] ??= { type: 'file', content: '' };
        return '';
      }
      case 'cat': {
        if (!args[0]) return 'cat: missing file operand';
        const n = this.node(this.resolve(args[0]));
        if (!n) return `cat: ${args[0]}: No such file or directory`;
        if (n.type === 'dir') return `cat: ${args[0]}: Is a directory`;
        return n.content.replace(/\n$/, '');
      }
      case 'echo':
        return args.join(' ');
      case 'rm': {
        if (!args[0]) return 'rm: missing operand';
        const [dir, name] = this.parentAndName(args[0]);
        const n = dir?.children[name];
        if (!dir || !n) return `rm: cannot remove '${args[0]}': No such file or directory`;
        if (n.type === 'dir') return `rm: cannot remove '${args[0]}': Is a directory`;
        delete dir.children[name];
        return '';
      }
      case 'git':
        return this.git(args);
      case 'sudo':
        return 'Nice try! No sudo needed here. 😄';
      default:
        return `${cmd}: command not found. Type "help" to see the commands you can use.`;
    }
  }

  private inRepo(): boolean {
    return !!this.repo && this.repo.root.every((p, i) => this.cwd[i] === p);
  }

  /** All files under the repo, as path-relative-to-repo -> content. */
  private workingTree(): Record<string, string> {
    const out: Record<string, string> = {};
    const walk = (dir: FsDir, prefix: string) => {
      for (const [name, n] of Object.entries(dir.children)) {
        if (name === '.git') continue;
        const p = prefix ? `${prefix}/${name}` : name;
        if (n.type === 'dir') walk(n, p);
        else out[p] = n.content;
      }
    };
    const root = this.repo && this.node(this.repo.root);
    if (root?.type === 'dir') walk(root, '');
    return out;
  }

  private lastSnapshot(): Record<string, string> {
    const commits = this.repo?.commits ?? [];
    return commits[commits.length - 1]?.snapshot ?? {};
  }

  private git(args: string[]): string {
    const [sub, ...rest] = args;
    if (!sub) return 'usage: git <command>. Try: git init, git status, git add, git commit, git log';

    if (sub === 'init') {
      const here = this.node(this.cwd) as FsDir;
      if (this.repo && this.inRepo()) return `Reinitialized existing Git repository in ${this.pathString(this.repo.root)}/.git/`;
      this.repo = { root: [...this.cwd], staged: {}, commits: [] };
      here.children['.git'] = { type: 'dir', children: {} };
      return `Initialized empty Git repository in ${this.pathString(this.cwd)}/.git/`;
    }

    if (!this.repo || !this.inRepo()) return 'fatal: not a git repository (or any of the parent directories): .git';
    const repo = this.repo;
    const tree = this.workingTree();
    const last = this.lastSnapshot();

    switch (sub) {
      case 'status': {
        const staged = Object.keys(repo.staged);
        const changed = Object.keys(tree).filter((f) => f in last && last[f] !== tree[f] && repo.staged[f] !== tree[f]);
        const untracked = Object.keys(tree).filter((f) => !(f in last) && !(f in repo.staged));
        const lines = ['On branch main'];
        if (repo.commits.length === 0) lines.push('', 'No commits yet');
        if (staged.length) lines.push('', 'Changes to be committed:', ...staged.map((f) => `\t${f in last ? 'modified' : 'new file'}:   ${f}`));
        if (changed.length) lines.push('', 'Changes not staged for commit:', ...changed.map((f) => `\tmodified:   ${f}`));
        if (untracked.length) lines.push('', 'Untracked files:', '  (use "git add <file>..." to include in what will be committed)', ...untracked.map((f) => `\t${f}`));
        if (!staged.length && !changed.length && !untracked.length) lines.push('nothing to commit, working tree clean');
        return lines.join('\n');
      }
      case 'add': {
        if (!rest.length) return 'Nothing specified, nothing added.\nhint: Maybe you wanted to say "git add ."?';
        const prefix = this.cwd.slice(repo.root.length).join('/');
        for (const target of rest) {
          const rel = target === '.' ? prefix : [prefix, target].filter(Boolean).join('/');
          const matches = Object.keys(tree).filter((f) => !rel || f === rel || f.startsWith(rel + '/'));
          if (!matches.length) return `fatal: pathspec '${target}' did not match any files`;
          for (const f of matches) if (last[f] !== tree[f]) repo.staged[f] = tree[f];
        }
        return '';
      }
      case 'commit': {
        const mi = rest.indexOf('-m');
        const message = mi >= 0 ? rest[mi + 1] : undefined;
        if (!message) return 'error: please add a message, like: git commit -m "my first save"';
        const files = Object.keys(repo.staged);
        if (!files.length) return 'nothing to commit (use "git add" to choose what to save)';
        const hash = shortHash(`${repo.commits.length}:${message}:${files.join(',')}`);
        repo.commits.push({ hash, message, snapshot: { ...last, ...repo.staged } });
        repo.staged = {};
        const root = repo.commits.length === 1 ? ' (root-commit)' : '';
        return `[main${root} ${hash}] ${message}\n ${files.length} file${files.length > 1 ? 's' : ''} changed`;
      }
      case 'log':
        if (!repo.commits.length) return "fatal: your current branch 'main' does not have any commits yet";
        return [...repo.commits]
          .reverse()
          .map((c, i) => `commit ${c.hash}${i === 0 ? ' (HEAD -> main)' : ''}\nAuthor: student <student@code-gaon>\n\n    ${c.message}`)
          .join('\n\n');
      default:
        return `git: '${sub}' is not a git command here. Try: git init, git status, git add, git commit, git log`;
    }
  }
}
