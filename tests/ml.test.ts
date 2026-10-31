import { describe, expect, it } from 'vitest';
import { accuracy, classify, hueDistance, meanHue, rgbToHsl } from '../src/engines/ml/model';

const pixels = (...rgba: number[][]) => Uint8ClampedArray.from(rgba.flat());

describe('hue distance', () => {
  it('wraps around the colour circle', () => {
    expect(hueDistance(350, 10)).toBe(20);
    expect(hueDistance(10, 350)).toBe(20);
    expect(hueDistance(0, 180)).toBe(180);
    expect(hueDistance(40, 100)).toBe(60);
  });
});

describe('rgbToHsl', () => {
  it('converts primary colours', () => {
    expect(rgbToHsl(255, 0, 0)[0]).toBeCloseTo(0);
    expect(rgbToHsl(0, 255, 0)[0]).toBeCloseTo(120);
    expect(rgbToHsl(0, 0, 255)[0]).toBeCloseTo(240);
    expect(rgbToHsl(128, 128, 128)[1]).toBe(0);
  });
});

describe('meanHue (feature extraction)', () => {
  it('averages hue of coloured pixels', () => {
    expect(meanHue(pixels([255, 255, 0, 255], [255, 255, 0, 255]))).toBeCloseTo(60);
  });

  it('averages reds across 0 degrees instead of landing on cyan', () => {
    // hue ~350 and ~10 should average to ~0, not 180
    const h = meanHue(pixels([255, 0, 43, 255], [255, 43, 0, 255]))!;
    expect(hueDistance(h, 0)).toBeLessThan(2);
  });

  it('ignores transparent, grey and very dark pixels', () => {
    const h = meanHue(pixels([0, 255, 0, 255], [255, 0, 0, 0], [120, 120, 120, 255], [20, 5, 0, 255]));
    expect(h).toBeCloseTo(120);
  });

  it('returns null when there is nothing to see', () => {
    expect(meanHue(pixels([0, 0, 0, 0]))).toBeNull();
  });
});

describe('k-nearest-neighbours classifier', () => {
  const examples = [
    { x: 40, label: 'ripe' },
    { x: 45, label: 'ripe' },
    { x: 50, label: 'ripe' },
    { x: 95, label: 'raw' },
    { x: 100, label: 'raw' },
    { x: 105, label: 'raw' },
  ];

  it('knows nothing without examples', () => {
    expect(classify([], 50, 3)).toBeNull();
  });

  it('predicts the majority of the nearest neighbours', () => {
    expect(classify(examples, 42, 3)).toEqual({ label: 'ripe', confidence: 1 });
    expect(classify(examples, 110, 3)).toEqual({ label: 'raw', confidence: 1 });
  });

  it('reports lower confidence near the boundary', () => {
    const p = classify(examples, 72, 3)!;
    expect(p.confidence).toBeCloseTo(2 / 3);
  });

  it('breaks ties with the closest example', () => {
    expect(classify([{ x: 10, label: 'a' }, { x: 30, label: 'b' }], 12, 2)?.label).toBe('a');
  });

  it('learns wrong things from wrong labels', () => {
    const flipped = examples.map((e) => ({ ...e, label: e.label === 'ripe' ? 'raw' : 'ripe' }));
    expect(accuracy(flipped, examples, 3)).toBe(0);
  });

  it('measures accuracy on held-out data', () => {
    expect(accuracy(examples, [{ x: 43, label: 'ripe' }, { x: 99, label: 'ripe' }], 3)).toBe(0.5);
    expect(accuracy(examples, [], 3)).toBe(0);
  });
});
