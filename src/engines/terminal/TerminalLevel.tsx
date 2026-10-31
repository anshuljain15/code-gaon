import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { EngineProps, TerminalLevelDef } from '../../core/types';
import { t, tr } from '../../core/i18n';
import { Shell } from './shell';

interface Line {
  kind: 'cmd' | 'out';
  text: string;
}

const QUICK = ['ls', 'pwd', 'cd ', 'cd ..', 'mkdir ', 'touch ', 'cat ', 'echo ', 'git ', '"', '>', '.'];

export function TerminalLevel({ level, lang, onComplete }: EngineProps<TerminalLevelDef>) {
  const shell = useMemo(() => new Shell(level.home, level.startIn), [level]);
  const [lines, setLines] = useState<Line[]>([{ kind: 'out', text: tr('terminalHelp', lang) }]);
  const [input, setInput] = useState('');
  const [done, setDone] = useState<boolean[]>(() => level.tasks.map(() => false));
  const [cursor, setCursor] = useState<number | null>(null);
  const completed = useRef(false);
  const inputEl = useRef<HTMLInputElement>(null);
  const screenEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    screenEl.current?.scrollTo({ top: screenEl.current.scrollHeight });
  }, [lines]);

  const submit = (e: Event) => {
    e.preventDefault();
    const cmdLine: Line = { kind: 'cmd', text: `${shell.prompt} ${input}` };
    const out = shell.exec(input);
    setLines((prev) => (out === '\f' ? [] : [...prev, cmdLine, ...(out ? [{ kind: 'out' as const, text: out }] : [])]));
    setInput('');
    setCursor(null);
    const status = level.tasks.map((task, i) => done[i] || task.check(shell));
    setDone(status);
    if (status.every(Boolean) && !completed.current) {
      completed.current = true;
      window.setTimeout(onComplete, 700);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const h = shell.history;
    if (e.key === 'ArrowUp' && h.length) {
      e.preventDefault();
      const i = cursor === null ? h.length - 1 : Math.max(0, cursor - 1);
      setCursor(i);
      setInput(h[i]);
    } else if (e.key === 'ArrowDown' && cursor !== null) {
      e.preventDefault();
      const i = cursor + 1;
      setCursor(i >= h.length ? null : i);
      setInput(i >= h.length ? '' : h[i]);
    }
  };

  const insert = (s: string) => {
    setInput((v) => (v && !v.endsWith(' ') && /^[a-z]/.test(s) ? `${v} ${s}` : v + s));
    inputEl.current?.focus();
  };

  return (
    <div class="terminal-engine">
      <section class="tasks">
        <h3>{tr('tasks', lang)}</h3>
        <ol>
          {level.tasks.map((task, i) => (
            <li class={done[i] ? 'done' : ''}>
              <span aria-hidden="true">{done[i] ? '✅' : '⬜'}</span> {t(task.text, lang)}
            </li>
          ))}
        </ol>
      </section>

      <div class="terminal" ref={screenEl} onClick={() => inputEl.current?.focus()}>
        {lines.map((l) => (
          <pre class={l.kind}>{l.text}</pre>
        ))}
        <form onSubmit={submit} class="prompt-row">
          <label for="term-input" class="prompt">
            {shell.prompt}
          </label>
          <input
            id="term-input"
            ref={inputEl}
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            onKeyDown={onKeyDown}
            autocomplete="off"
            autocapitalize="off"
            spellcheck={false}
            enterKeyHint="send"
          />
        </form>
      </div>

      <div class="quick-keys" aria-label="quick insert">
        {QUICK.map((q) => (
          <button type="button" class="chip mono" onClick={() => insert(q)}>
            {q.trim() || q}
          </button>
        ))}
      </div>
    </div>
  );
}
