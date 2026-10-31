import type { Lang } from '../core/types';
import { t, tr } from '../core/i18n';
import type { ProgressMap } from '../core/progress';
import { BANDS, levelKey, PACKS } from '../content';
import { go } from './router';

export function MapScreen({ lang, progress }: { lang: Lang; progress: ProgressMap }) {
  return (
    <main class="page">
      <h1>{tr('chooseTrack', lang)}</h1>
      {BANDS.map((band) => (
        <section class="band">
          <h2>
            <span aria-hidden="true">{band.emoji}</span> {t(band.title, lang)}
          </h2>
          <div class="pack-list">
            {PACKS.filter((p) => p.band === band.id).map((pack) => {
              const done = pack.levels.filter((l) => progress[levelKey(pack.id, l.id)]).length;
              return (
                <button class={`pack-card band-${band.id}`} onClick={() => go('pack', pack.id)}>
                  <span class="pack-icon" aria-hidden="true">
                    {pack.icon}
                  </span>
                  <span class="pack-text">
                    <strong>{t(pack.title, lang)}</strong>
                    <span class="muted small">{t(pack.audience, lang)}</span>
                    <span class="small">{t(pack.description, lang)}</span>
                  </span>
                  <span class="pill">
                    {done}/{pack.levels.length} {tr('levels', lang)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
