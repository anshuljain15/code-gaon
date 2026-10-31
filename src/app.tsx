import { useEffect, useState } from 'preact/hooks';
import type { Lang } from './core/types';
import { tr } from './core/i18n';
import { setVoiceEnabled } from './core/voice';
import { loadProfiles, loadProgress, recordCompletion, saveProfiles, type Profile, type ProgressMap } from './core/progress';
import { findLevel, findPack, levelKey } from './content';
import { go, useRoute } from './ui/router';
import { Players } from './ui/Players';
import { MapScreen } from './ui/MapScreen';
import { PackScreen } from './ui/PackScreen';
import { LevelScreen } from './ui/LevelScreen';

export function App({ offlineReady }: { offlineReady: boolean }) {
  const route = useRoute();
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [player, setPlayer] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [guestLang, setGuestLang] = useState<Lang>('hi');
  const lang = player?.lang ?? guestLang;

  useEffect(() => {
    loadProfiles().then(setProfiles);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const choose = async (p: Profile) => {
    setVoiceEnabled(p.voice);
    setPlayer(p);
    setProgress(await loadProgress(p.id));
  };

  const updatePlayer = (patch: Partial<Profile>) => {
    if (!player) return;
    const updated = { ...player, ...patch };
    setPlayer(updated);
    const all = (profiles ?? []).map((p) => (p.id === updated.id ? updated : p));
    setProfiles(all);
    saveProfiles(all);
  };

  const toggleLang = () => {
    const next: Lang = lang === 'hi' ? 'en' : 'hi';
    if (player) updatePlayer({ lang: next });
    else setGuestLang(next);
  };

  const toggleVoice = () => {
    if (!player) return;
    setVoiceEnabled(!player.voice);
    updatePlayer({ voice: !player.voice });
  };

  if (profiles === null) return null;

  let screen;
  if (!player || route[0] === 'players') {
    screen = (
      <Players
        profiles={profiles}
        lang={lang}
        onPick={(p) => {
          choose(p);
          go('');
        }}
        onCreate={(p) => {
          const all = [...profiles, p];
          setProfiles(all);
          saveProfiles(all);
          choose(p);
          go('');
        }}
      />
    );
  } else if (route[0] === 'pack' && findPack(route[1])) {
    screen = <PackScreen pack={findPack(route[1])!} lang={lang} progress={progress} />;
  } else if (route[0] === 'level' && findLevel(route[1], route[2])) {
    const { pack, level, index } = findLevel(route[1], route[2])!;
    screen = (
      <LevelScreen
        pack={pack}
        level={level}
        index={index}
        lang={lang}
        onComplete={(stars) => recordCompletion(player.id, levelKey(pack.id, level.id), stars).then(setProgress)}
      />
    );
  } else {
    screen = <MapScreen lang={lang} progress={progress} />;
  }

  return (
    <>
      <header class="topbar">
        <button class="brand" onClick={() => go('')}>
          <span aria-hidden="true">🤖</span> {tr('appName', lang)}
        </button>
        <div class="topbar-actions">
          <button class="btn small" onClick={toggleLang} aria-label="Change language / भाषा बदलें">
            {lang === 'hi' ? 'English' : 'हिंदी'}
          </button>
          {player && (
            <>
              <button class="btn small icon" onClick={toggleVoice} aria-label={tr(player.voice ? 'voiceOn' : 'voiceOff', lang)}>
                {player.voice ? '🔊' : '🔇'}
              </button>
              <button class="btn small icon" onClick={() => go('players')} aria-label={tr('switchPlayer', lang)}>
                {player.avatar}
              </button>
            </>
          )}
        </div>
      </header>
      {screen}
      {offlineReady && <p class="toast">✅ {tr('offlineReady', lang)}</p>}
    </>
  );
}
