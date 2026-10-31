import { describe, expect, it } from 'vitest';
import { Shell, tokenize } from '../src/engines/terminal/shell';

const file = (content: string) => ({ type: 'file' as const, content });

describe('tokenize', () => {
  it('keeps quoted text together', () => {
    expect(tokenize('git commit -m "first save"')).toEqual(['git', 'commit', '-m', 'first save']);
    expect(tokenize("echo 'hi there'  now")).toEqual(['echo', 'hi there', 'now']);
  });
});

describe('shell: files and folders', () => {
  it('starts in the home folder with a friendly prompt', () => {
    const sh = new Shell();
    expect(sh.exec('pwd')).toBe('/home/student');
    expect(sh.prompt).toBe('student@code-gaon:~$');
  });

  it('lists, makes and enters folders', () => {
    const sh = new Shell({ 'notes.txt': file('hi\n') });
    expect(sh.exec('mkdir mela')).toBe('');
    expect(sh.exec('ls')).toBe('mela/  notes.txt');
    sh.exec('cd mela');
    expect(sh.cwdFromHome).toBe('mela');
    expect(sh.prompt).toBe('student@code-gaon:~/mela$');
    sh.exec('cd ..');
    expect(sh.cwdFromHome).toBe('');
    sh.exec('cd mela');
    sh.exec('cd ~');
    expect(sh.cwdFromHome).toBe('');
  });

  it('gives real error messages', () => {
    const sh = new Shell({ 'a.txt': file('') });
    expect(sh.exec('cd nowhere')).toMatch(/No such file or directory/);
    expect(sh.exec('cd a.txt')).toMatch(/Not a directory/);
    expect(sh.exec('mkdir a.txt')).toMatch(/File exists/);
    expect(sh.exec('cat missing')).toMatch(/No such file/);
    expect(sh.exec('dance')).toMatch(/command not found/);
  });

  it('creates, writes, appends, reads and removes files', () => {
    const sh = new Shell();
    sh.exec('touch stalls.txt');
    expect(sh.at('stalls.txt')).toEqual(file(''));
    sh.exec('echo chaat > stalls.txt');
    sh.exec('echo "pani puri" >> stalls.txt');
    expect(sh.exec('cat stalls.txt')).toBe('chaat\npani puri');
    sh.exec('echo jalebi > stalls.txt');
    expect(sh.exec('cat stalls.txt')).toBe('jalebi');
    sh.exec('rm stalls.txt');
    expect(sh.at('stalls.txt')).toBeUndefined();
  });

  it('handles > characters inside quotes', () => {
    const sh = new Shell();
    sh.exec('echo "<p>Chaat</p>" >> index.html');
    expect(sh.exec('cat index.html')).toBe('<p>Chaat</p>');
  });

  it('keeps a command history and clears the screen', () => {
    const sh = new Shell();
    sh.exec('ls');
    sh.exec('  ');
    expect(sh.history).toEqual(['ls']);
    expect(sh.ran(/^ls/)).toBe(true);
    expect(sh.exec('clear')).toBe('\f');
  });

  it('does not let the starting files be shared between shells', () => {
    const home = { 'a.txt': file('x') };
    new Shell(home).exec('rm a.txt');
    expect(new Shell(home).at('a.txt')).toEqual(file('x'));
  });
});

describe('shell: git', () => {
  const project = () => new Shell({ project: { type: 'dir', children: { 'index.html': file('<h1>Mela</h1>\n') } } }, 'project');

  it('refuses git commands outside a repository', () => {
    expect(project().exec('git status')).toMatch(/not a git repository/);
  });

  it('runs the full init, add, commit, log loop', () => {
    const sh = project();
    expect(sh.exec('git init')).toMatch(/Initialized empty Git repository in \/home\/student\/project\/.git/);
    expect(sh.exec('git status')).toMatch(/Untracked files:[\s\S]*index.html/);
    expect(sh.exec('git commit -m "nothing"')).toMatch(/nothing to commit/);
    sh.exec('git add .');
    expect(sh.exec('git status')).toMatch(/Changes to be committed:[\s\S]*new file:\s+index.html/);
    expect(sh.exec('git commit -m "first save"')).toMatch(/^\[main \(root-commit\) [0-9a-f]{7}\] first save/);
    expect(sh.exec('git status')).toMatch(/working tree clean/);

    sh.exec('echo "Chaat stall" >> index.html');
    expect(sh.exec('git status')).toMatch(/Changes not staged for commit:[\s\S]*modified:\s+index.html/);
    sh.exec('git add index.html');
    sh.exec('git commit -m "add chaat stall"');
    const log = sh.exec('git log');
    expect(log.indexOf('add chaat stall')).toBeLessThan(log.indexOf('first save'));
    expect(log).toMatch(/HEAD -> main/);
    expect(sh.repo?.commits).toHaveLength(2);
  });

  it('asks for a commit message', () => {
    const sh = project();
    sh.exec('git init');
    sh.exec('git add .');
    expect(sh.exec('git commit')).toMatch(/please add a message/);
  });

  it('rejects unknown paths in git add', () => {
    const sh = project();
    sh.exec('git init');
    expect(sh.exec('git add nope.txt')).toMatch(/did not match any files/);
  });

  it('works from a subfolder of the repository', () => {
    const sh = project();
    sh.exec('git init');
    sh.exec('mkdir css');
    sh.exec('cd css');
    sh.exec('touch style.css');
    sh.exec('git add .');
    expect(Object.keys(sh.repo!.staged)).toEqual(['css/style.css']);
  });
});
