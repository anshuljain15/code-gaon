import { useState } from 'preact/hooks';
import type { Lang } from '../core/types';
import { tr } from '../core/i18n';
import { newId, type Profile } from '../core/progress';

const AVATARS = ['🦁', '🐯', '🐘', '🦚', '🐒', '🐄', '🦜', '🐢'];

interface Props {
  profiles: Profile[];
  lang: Lang;
  onPick: (p: Profile) => void;
  onCreate: (p: Profile) => void;
}

/** Several children often share one family phone, so each gets a nickname profile. No personal data. */
export function Players({ profiles, lang, onPick, onCreate }: Props) {
  const [creating, setCreating] = useState(profiles.length === 0);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const create = (e: Event) => {
    e.preventDefault();
    const name = nickname.trim().slice(0, 20);
    if (!name) return;
    onCreate({ id: newId(), nickname: name, avatar, lang, voice: true });
  };

  return (
    <main class="page narrow">
      <div class="hero">
        <div class="mascot" aria-hidden="true">
          🤖
        </div>
        <h1>{tr('appName', lang)}</h1>
        <p class="muted">{tr('tagline', lang)}</p>
      </div>

      {profiles.length > 0 && (
        <section>
          <h2>{tr('whoIsPlaying', lang)}</h2>
          <div class="player-list">
            {profiles.map((p) => (
              <button class="player" onClick={() => onPick(p)}>
                <span class="avatar" aria-hidden="true">
                  {p.avatar}
                </span>
                {p.nickname}
              </button>
            ))}
            {!creating && (
              <button class="player add" onClick={() => setCreating(true)}>
                <span class="avatar" aria-hidden="true">
                  ＋
                </span>
                {tr('newPlayer', lang)}
              </button>
            )}
          </div>
        </section>
      )}

      {creating && (
        <form class="card" onSubmit={create}>
          <label class="field">
            <span>{tr('nickname', lang)}</span>
            <input value={nickname} maxLength={20} onInput={(e) => setNickname((e.target as HTMLInputElement).value)} required />
          </label>
          <fieldset class="field">
            <legend>{tr('pickAvatar', lang)}</legend>
            <div class="avatar-picker">
              {AVATARS.map((a) => (
                <button type="button" class={`avatar-btn ${a === avatar ? 'active' : ''}`} aria-pressed={a === avatar} onClick={() => setAvatar(a)}>
                  {a}
                </button>
              ))}
            </div>
          </fieldset>
          <button class="btn primary big" type="submit">
            {tr('start', lang)} →
          </button>
          <p class="muted small">🔒 {tr('privacy', lang)}</p>
        </form>
      )}
    </main>
  );
}
