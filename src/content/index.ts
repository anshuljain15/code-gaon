import type { Band, LevelDef, ModulePack, Text } from '../core/types';
import type { ProgressMap } from '../core/progress';
import { junior } from './junior';
import { senior } from './senior';
import { realworld } from './realworld';

/** To add a new module, create a pack file and list it here. See docs/module-packs.md. */
export const PACKS: ModulePack[] = [junior, senior, realworld];

export const BANDS: { id: Band; title: Text; emoji: string }[] = [
  { id: 'junior', title: { en: 'Junior · Classes 3-5', hi: 'जूनियर · कक्षा 3-5' }, emoji: '🌱' },
  { id: 'senior', title: { en: 'Senior · Classes 6-9', hi: 'सीनियर · कक्षा 6-9' }, emoji: '🌿' },
  { id: 'realworld', title: { en: 'Real World · Class 9-12 & college', hi: 'असली दुनिया · कक्षा 9-12 और कॉलेज' }, emoji: '🌳' },
];

export const levelKey = (packId: string, levelId: string) => `${packId}/${levelId}`;

export const findPack = (id: string) => PACKS.find((p) => p.id === id);

export const findLevel = (packId: string, levelId: string): { pack: ModulePack; level: LevelDef; index: number } | undefined => {
  const pack = findPack(packId);
  const index = pack?.levels.findIndex((l) => l.id === levelId) ?? -1;
  return pack && index >= 0 ? { pack, level: pack.levels[index], index } : undefined;
};

/** Levels open one after another inside a pack; every pack's first level is open. */
export const isUnlocked = (pack: ModulePack, index: number, progress: ProgressMap) =>
  index === 0 || !!progress[levelKey(pack.id, pack.levels[index - 1].id)];
