import type { Lang, ModulePack } from '../core/types';
import { t, tr } from '../core/i18n';
import type { ProgressMap } from '../core/progress';
import { isUnlocked, levelKey } from '../content';
import { go } from './router';

export function PackScreen({ pack, lang, progress }: { pack: ModulePack; lang: Lang; progress: ProgressMap }) {
  return (
    <main class="page narrow">
      <button class="link" onClick={() => go('')}>
        ← {tr('toMap', lang)}
      </button>
      <h1>
        <span aria-hidden="true">{pack.icon}</span> {t(pack.title, lang)}
      </h1>
      <p class="muted">{t(pack.description, lang)}</p>
      <ol class="level-path">
        {pack.levels.map((level, i) => {
          const p = progress[levelKey(pack.id, level.id)];
          const open = isUnlocked(pack, i, progress);
          return (
            <li>
              <button
                class={`level-node ${p ? 'done' : ''}`}
                disabled={!open}
                title={open ? undefined : tr('locked', lang)}
                onClick={() => go('level', pack.id, level.id)}
              >
                <span class="level-num">{open ? i + 1 : '🔒'}</span>
                <span class="level-title">{t(level.title, lang)}</span>
                <span class="stars" aria-label={`${p?.stars ?? 0} stars`}>
                  {[1, 2, 3].map((s) => (p && s <= p.stars ? '⭐' : '☆')).join('')}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
