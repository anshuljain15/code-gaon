import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { EngineProps, FruitSpec, MlLevelDef } from '../../core/types';
import { t, tr } from '../../core/i18n';
import { speak } from '../../core/voice';
import { drawFruit, featureOf, FRUIT_SIZE } from './fruit';
import { accuracy, classify, type Example } from './model';

function Fruit({ spec, size = 56 }: { spec: FruitSpec; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (ctx) drawFruit(ctx, spec);
  }, [spec]);
  return <canvas ref={ref} width={FRUIT_SIZE} height={FRUIT_SIZE} style={{ width: size, height: size }} aria-hidden="true" />;
}

const HUE_STOPS = [0, 60, 120, 180, 240, 300, 360];

function HueLine({ examples, emoji }: { examples: Example[]; emoji: Record<string, string> }) {
  const W = 360;
  return (
    <svg class="hue-line" viewBox={`0 -26 ${W} 52`} role="img" aria-label="colour line">
      <defs>
        <linearGradient id="hues">
          {HUE_STOPS.map((h) => (
            <stop offset={`${(h / 360) * 100}%`} stop-color={`hsl(${h} 75% 50%)`} />
          ))}
        </linearGradient>
      </defs>
      <rect x="0" y="6" width={W} height="12" rx="6" fill="url(#hues)" />
      {examples.map((e, i) => (
        <text x={e.x} y={i % 2 ? -10 : 2} font-size="14" text-anchor="middle">
          {emoji[e.label]}
        </text>
      ))}
    </svg>
  );
}

export function MlLevel({ level, lang, onComplete }: EngineProps<MlLevelDef>) {
  const [taught, setTaught] = useState<Record<number, string>>({});
  const [results, setResults] = useState<{ spec: FruitSpec; guess: string; confidence: number }[] | null>(null);
  const [failedOnce, setFailedOnce] = useState(false);
  const [message, setMessage] = useState<{ text: string; kind: 'info' | 'error' | 'ok' } | null>(null);

  const emoji = useMemo(() => Object.fromEntries(level.classes.map((c) => [c.id, c.emoji])), [level]);

  const examples: Example[] = useMemo(
    () => [
      ...level.given.map((g) => ({ x: featureOf(g), label: g.label })),
      ...Object.entries(taught).map(([i, label]) => ({ x: featureOf(level.pool[Number(i)]), label })),
    ],
    [level, taught],
  );

  const say = (text: string, kind: 'info' | 'error' | 'ok') => {
    setMessage({ text, kind });
    speak(text, lang);
  };

  const teach = (i: number, label: string) => {
    setTaught((prev) => {
      const next = { ...prev };
      if (next[i] === label) delete next[i];
      else next[i] = label;
      return next;
    });
    setResults(null);
  };

  const poolLocked = level.mustFailFirst && !failedOnce;

  const runTest = () => {
    const counts = level.classes.map((c) => Object.values(taught).filter((l) => l === c.id).length);
    if (!poolLocked && counts.some((n) => n < level.minPerClass)) {
      return say(tr('needMoreExamples', lang, { n: level.minPerClass }), 'info');
    }
    const res = level.test.map((spec) => {
      const p = classify(examples, featureOf(spec), level.k);
      return { spec, guess: p?.label ?? '', confidence: p?.confidence ?? 0 };
    });
    setResults(res);
    const acc = accuracy(
      examples,
      level.test.map((s) => ({ x: featureOf(s), label: s.label })),
      level.k,
    );
    if (acc >= level.passAccuracy && (!level.mustFailFirst || failedOnce)) {
      setMessage(null);
      window.setTimeout(onComplete, 900);
    } else if (level.mustFailFirst && !failedOnce) {
      setFailedOnce(true);
      say(tr('biasFound', lang), 'error');
    } else {
      say(tr('tryAgainMl', lang), 'info');
    }
  };

  const score = results ? results.filter((r) => r.guess === r.spec.label).length : 0;

  return (
    <div class="ml-engine">
      {level.given.length > 0 && (
        <section>
          <h3>{tr('chintuKnows', lang)}</h3>
          <div class="fruit-row">
            {level.given.map((g) => (
              <figure class="fruit-card small">
                <Fruit spec={g} size={40} />
                <figcaption>{emoji[g.label]}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {!poolLocked && (
        <section>
          <h3>{tr('teachChintu', lang)}</h3>
          <div class="fruit-grid">
            {level.pool.map((spec, i) => (
              <div class={`fruit-card ${taught[i] ? 'taught' : ''}`}>
                <Fruit spec={spec} />
                <div class="label-buttons">
                  {level.classes.map((c) => (
                    <button
                      class={`chip ${taught[i] === c.id ? 'active' : ''}`}
                      aria-pressed={taught[i] === c.id}
                      onClick={() => teach(i, c.id)}
                    >
                      {c.emoji} {t(c.name, lang)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <p class="muted small">{tr('howChintuSees', lang)}</p>
        <HueLine examples={examples} emoji={emoji} />
      </section>

      <div class="controls">
        <button class="btn primary" onClick={runTest}>
          📝 {tr('testChintu', lang)}
        </button>
      </div>

      {message && (
        <p class={`engine-msg ${message.kind}`} role="status">
          {message.text}
        </p>
      )}

      {results && (
        <section>
          <h3>
            {tr('examResult', lang)}: {score} / {results.length} {tr('accuracy', lang)}
          </h3>
          <div class="meter" aria-hidden="true">
            <div style={{ width: `${(score / results.length) * 100}%` }} />
          </div>
          <div class="fruit-row">
            {results.map((r) => (
              <figure class={`fruit-card small ${r.guess === r.spec.label ? 'right' : 'wrong'}`}>
                <Fruit spec={r.spec} size={40} />
                <figcaption>
                  {r.guess === r.spec.label ? '✅' : '❌'} {emoji[r.guess] ?? '?'}
                  <br />
                  <span class="muted small">
                    {Math.round(r.confidence * 100)}% {tr('sure', lang)}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
