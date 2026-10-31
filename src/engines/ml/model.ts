// A deliberately transparent model: one feature (colour) and k-nearest-neighbours.
// Children can see every example on a line and *why* Chintu guessed what it guessed.

export interface Example {
  x: number;
  label: string;
}

export interface Prediction {
  label: string;
  /** Share of the k neighbours that agreed, 0..1. */
  confidence: number;
}

/** Hue lives on a circle: 350° and 10° are neighbours. */
export const hueDistance = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

export const classify = (examples: Example[], x: number, k: number): Prediction | null => {
  if (examples.length === 0) return null;
  const nearest = [...examples].sort((a, b) => hueDistance(a.x, x) - hueDistance(b.x, x)).slice(0, k);
  const votes = new Map<string, { n: number; best: number }>();
  for (const e of nearest) {
    const v = votes.get(e.label) ?? { n: 0, best: Infinity };
    v.n++;
    v.best = Math.min(v.best, hueDistance(e.x, x));
    votes.set(e.label, v);
  }
  // Most votes wins; ties go to the label with the closest example.
  const [label, v] = [...votes.entries()].sort((a, b) => b[1].n - a[1].n || a[1].best - b[1].best)[0];
  return { label, confidence: v.n / nearest.length };
};

export const accuracy = (examples: Example[], test: Example[], k: number) => {
  if (test.length === 0) return 0;
  const correct = test.filter((t) => classify(examples, t.x, k)?.label === t.label).length;
  return correct / test.length;
};

export const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
};

/**
 * Feature extraction: the average colour (hue) of the fruit's pixels.
 * Background, outlines and dark stems are skipped. Hue is averaged as an angle so reds near 0°/360° don't cancel out.
 */
export const meanHue = (pixels: ArrayLike<number>): number | null => {
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 200) continue;
    const [h, s, l] = rgbToHsl(pixels[i], pixels[i + 1], pixels[i + 2]);
    if (s < 0.3 || l < 0.2 || l > 0.85) continue;
    const rad = (h * Math.PI) / 180;
    sx += Math.cos(rad) * s;
    sy += Math.sin(rad) * s;
    n++;
  }
  if (n === 0) return null;
  const deg = (Math.atan2(sy, sx) * 180) / Math.PI;
  return (deg + 360) % 360;
};
