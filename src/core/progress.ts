import { get, set } from 'idb-keyval';
import type { Lang } from './types';

export interface Profile {
  id: string;
  nickname: string;
  avatar: string;
  lang: Lang;
  voice: boolean;
}

export interface LevelProgress {
  stars: number;
  completedAt: number;
}

export type ProgressMap = Record<string, LevelProgress>;

// Some browsers (private mode, blocked storage) refuse IndexedDB; fall back to memory so the game still plays.
const memory = new Map<string, unknown>();

const load = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const v = await get<T>(key);
    return v ?? fallback;
  } catch {
    return (memory.get(key) as T) ?? fallback;
  }
};

const save = async (key: string, value: unknown) => {
  memory.set(key, value);
  try {
    await set(key, value);
  } catch {
    /* memory copy is enough for this session */
  }
};

export const loadProfiles = () => load<Profile[]>('profiles', []);
export const saveProfiles = (p: Profile[]) => save('profiles', p);

export const loadProgress = (profileId: string) => load<ProgressMap>(`progress:${profileId}`, {});

export const recordCompletion = async (profileId: string, levelKey: string, stars: number) => {
  const progress = await loadProgress(profileId);
  const prev = progress[levelKey];
  progress[levelKey] = { stars: Math.max(stars, prev?.stars ?? 0), completedAt: Date.now() };
  await save(`progress:${profileId}`, progress);
  return progress;
};

/** Mastery stars reward understanding, not time spent: fewer hints, more stars. */
export const starsFor = (hintsUsed: number) => (hintsUsed === 0 ? 3 : hintsUsed <= 2 ? 2 : 1);

export const newId = () => Math.random().toString(36).slice(2, 10);
