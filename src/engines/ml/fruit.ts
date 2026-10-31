import type { FruitSpec } from '../../core/types';
import { meanHue } from './model';

export const FRUIT_SIZE = 72;

const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

/** Draws a simple, slightly random fruit so no image files need downloading. */
export const drawFruit = (ctx: CanvasRenderingContext2D, f: FruitSpec) => {
  const s = FRUIT_SIZE;
  const rand = rng(f.seed);
  ctx.clearRect(0, 0, s, s);
  ctx.save();
  ctx.translate(s / 2, s / 2);
  ctx.rotate((rand() - 0.5) * 0.6);
  const body = `hsl(${f.hue} 75% ${48 + rand() * 8}%)`;
  ctx.fillStyle = body;
  ctx.strokeStyle = `hsl(${f.hue} 60% 22%)`;
  ctx.lineWidth = 2;

  ctx.beginPath();
  if (f.kind === 'mango') {
    ctx.ellipse(0, 2, s * 0.3, s * 0.38, 0.5, 0, Math.PI * 2);
  } else if (f.kind === 'apple') {
    ctx.moveTo(0, -s * 0.24);
    ctx.bezierCurveTo(s * 0.42, -s * 0.44, s * 0.48, s * 0.22, 0, s * 0.38);
    ctx.bezierCurveTo(-s * 0.48, s * 0.22, -s * 0.42, -s * 0.44, 0, -s * 0.24);
  } else {
    ctx.moveTo(-s * 0.4, -s * 0.18);
    ctx.quadraticCurveTo(0, s * 0.5, s * 0.4, -s * 0.18);
    ctx.quadraticCurveTo(0, s * 0.22, -s * 0.4, -s * 0.18);
  }
  ctx.fill();
  ctx.stroke();

  // Speckles keep fruits looking different without changing their colour family.
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = `hsl(${f.hue} 70% ${38 + rand() * 10}%)`;
    ctx.beginPath();
    ctx.arc((rand() - 0.5) * s * 0.3, (rand() - 0.5) * s * 0.3, 1.5 + rand() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stem: very dark so the feature extractor ignores it.
  ctx.fillStyle = 'hsl(25 30% 12%)';
  ctx.fillRect(-2, f.kind === 'banana' ? -s * 0.22 : -s * 0.36, 4, 9);
  ctx.restore();
};

const cache = new Map<string, number>();

/** What Chintu actually "sees": the hue measured from the drawn pixels, not the number we chose. */
export const featureOf = (f: FruitSpec): number => {
  const id = `${f.kind}:${f.hue}:${f.seed}`;
  const hit = cache.get(id);
  if (hit !== undefined) return hit;
  let value = f.hue;
  if (typeof document !== 'undefined') {
    const c = document.createElement('canvas');
    c.width = c.height = FRUIT_SIZE;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      drawFruit(ctx, f);
      value = meanHue(ctx.getImageData(0, 0, FRUIT_SIZE, FRUIT_SIZE).data) ?? f.hue;
    }
  }
  cache.set(id, value);
  return value;
};
