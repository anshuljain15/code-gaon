import { useEffect, useState } from 'preact/hooks';
import type { Lang, LevelDef, ModulePack } from '../core/types';
import { t, tr } from '../core/i18n';
import { speak, stop } from '../core/voice';
import { starsFor } from '../core/progress';
import { GridLevel } from '../engines/grid/GridLevel';
import { MlLevel } from '../engines/ml/MlLevel';
import { TerminalLevel } from '../engines/terminal/TerminalLevel';
import { PythonLevel } from '../engines/python/PythonLevel';
import { go } from './router';

interface Props {
  pack: ModulePack;
  level: LevelDef;
  index: number;
  lang: Lang;
  onComplete: (stars: number) => void;
}

function Engine({ level, lang, onComplete }: { level: LevelDef; lang: Lang; onComplete: () => void }) {
  switch (level.engine) {
    case 'grid':
      return <GridLevel level={level} lang={lang} onComplete={onComplete} />;
    case 'ml':
      return <MlLevel level={level} lang={lang} onComplete={onComplete} />;
    case 'terminal':
      return <TerminalLevel level={level} lang={lang} onComplete={onComplete} />;
    case 'python':
      return <PythonLevel level={level} lang={lang} onComplete={onComplete} />;
  }
}

export function LevelScreen({ pack, level, index, lang, onComplete }: Props) {
  const [hintsShown, setHintsShown] = useState(0);
  const [won, setWon] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);
  const next = pack.levels[index + 1];

  useEffect(() => {
    setHintsShown(0);
    setWon(null);
    speak(t(level.story, lang), lang);
    return stop;
  }, [level.id]);

  const complete = () => {
    const stars = starsFor(hintsShown);
    setWon(stars);
    onComplete(stars);
    speak(tr('wellDone', lang), lang);
  };

  const showHint = () => {
    if (hintsShown >= level.hints.length) return;
    speak(t(level.hints[hintsShown], lang), lang);
    setHintsShown(hintsShown + 1);
  };

  return (
    <main class="page level-page">
      <button class="link" onClick={() => go('pack', pack.id)}>
        ← {t(pack.title, lang)}
      </button>
      <h1>
        {index + 1}. {t(level.title, lang)}
      </h1>

      <section class="story card">
        <p>{t(level.story, lang)}</p>
        <button class="btn small" onClick={() => speak(t(level.story, lang), lang)}>
          🔊 {tr('listen', lang)}
        </button>
      </section>

      <p class="goal">
        <strong>🎯 {tr('goal', lang)}:</strong> {t(level.goal, lang)}
      </p>

      <Engine key={`${level.id}:${attempt}`} level={level} lang={lang} onComplete={complete} />

      <section class="hints">
        {level.hints.slice(0, hintsShown).map((h, i) => (
          <p class="hint">
            💡 {i + 1}. {t(h, lang)}
          </p>
        ))}
        <button class="btn small" onClick={showHint} disabled={hintsShown >= level.hints.length}>
          💡 {hintsShown >= level.hints.length ? tr('noMoreHints', lang) : `${tr('hint', lang)} (${hintsShown}/${level.hints.length})`}
        </button>
      </section>

      {level.unplugged && (
        <details class="card">
          <summary>✂️ {tr('unplugged', lang)}</summary>
          <p>{t(level.unplugged, lang)}</p>
        </details>
      )}
      {level.teacherNote && (
        <details class="card">
          <summary>👩‍🏫 {tr('teacherNote', lang)}</summary>
          <p>{t(level.teacherNote, lang)}</p>
        </details>
      )}

      {won !== null && (
        <div class="overlay" role="dialog" aria-modal="true" aria-labelledby="win-title">
          <div class="win card">
            <div class="mascot" aria-hidden="true">
              🎉🤖
            </div>
            <h2 id="win-title">{tr('wellDone', lang)}</h2>
            <p class="stars big" aria-label={`${won} stars`}>
              {[1, 2, 3].map((s) => (s <= won ? '⭐' : '☆')).join(' ')}
            </p>
            <div class="controls column">
              {next && (
                <button class="btn primary big" onClick={() => go('level', pack.id, next.id)}>
                  {tr('next', lang)} →
                </button>
              )}
              <button
                class="btn"
                onClick={() => {
                  setWon(null);
                  setHintsShown(0);
                  setAttempt((a) => a + 1);
                }}
              >
                ↺ {tr('replay', lang)}
              </button>
              <button class="btn" onClick={() => go('')}>
                🗺️ {tr('toMap', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
