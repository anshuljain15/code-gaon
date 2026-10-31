import { useEffect, useState } from 'preact/hooks';
import type { EngineProps, PythonLevelDef } from '../../core/types';
import { t, tr } from '../../core/i18n';
import { python, TimeoutError, type PyResult } from './runner';

type Status = 'loading' | 'ready' | 'running' | 'offline';

export function PythonLevel({ level, lang, onComplete }: EngineProps<PythonLevelDef>) {
  const [code, setCode] = useState(level.starter);
  const [status, setStatus] = useState<Status>('loading');
  const [result, setResult] = useState<PyResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [failedRuns, setFailedRuns] = useState(0);

  useEffect(() => {
    let alive = true;
    python
      .load()
      .then(() => alive && setStatus('ready'))
      .catch(() => alive && setStatus('offline'));
    return () => {
      alive = false;
    };
  }, []);

  const run = async () => {
    setStatus('running');
    setNotice(null);
    try {
      const r = await python.run(
        code,
        level.tests.map((x) => x.code),
      );
      setResult(r);
      const passed = !r.error && r.results.length === level.tests.length && r.results.every((x) => x.ok);
      if (passed) window.setTimeout(onComplete, 700);
      else setFailedRuns((n) => n + 1);
    } catch (e) {
      setResult(null);
      setNotice(e instanceof TimeoutError ? tr('timedOut', lang) : tr('pythonOffline', lang));
      setFailedRuns((n) => n + 1);
    }
    setStatus('ready');
  };

  // Tab inserts spaces instead of leaving the editor; Python cares about indentation.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.target as HTMLTextAreaElement;
    const { selectionStart: s, selectionEnd: end } = el;
    const next = code.slice(0, s) + '    ' + code.slice(end);
    setCode(next);
    requestAnimationFrame(() => el.setSelectionRange(s + 4, s + 4));
  };

  return (
    <div class="python-engine">
      <textarea
        class="code-editor"
        value={code}
        onInput={(e) => setCode((e.target as HTMLTextAreaElement).value)}
        onKeyDown={onKeyDown}
        spellcheck={false}
        autocapitalize="off"
        autocomplete="off"
        aria-label="Python code"
        rows={Math.max(10, code.split('\n').length + 1)}
      />

      <div class="controls">
        <button class="btn primary" onClick={run} disabled={status !== 'ready'}>
          ▶ {tr('runTests', lang)}
        </button>
        <button class="btn" onClick={() => setCode(level.starter)}>
          ↺ {tr('reset', lang)}
        </button>
        {failedRuns >= 3 && (
          <button class="btn" onClick={() => setCode(level.solution)}>
            💡 {tr('showSolution', lang)}
          </button>
        )}
      </div>

      {status === 'loading' && <p class="engine-msg info">⏳ {tr('loadingPython', lang)}</p>}
      {status === 'offline' && <p class="engine-msg error">{tr('pythonOffline', lang)}</p>}
      {notice && <p class="engine-msg error">{notice}</p>}

      {result && (
        <>
          <h3>{tr('output', lang)}</h3>
          <pre class="py-output">{result.error ? `❌ ${result.error}` : result.stdout || ' '}</pre>
          <h3>{tr('checks', lang)}</h3>
          <ul class="checks">
            {level.tests.map((test, i) => {
              const r = result.results[i];
              return (
                <li class={r?.ok ? 'done' : ''}>
                  {r ? (r.ok ? '✅' : '❌') : '⬜'} {t(test.name, lang)}
                  {r && !r.ok && r.error && <div class="muted small mono">{r.error}</div>}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
