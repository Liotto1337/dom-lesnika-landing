import { describe, expect, it } from 'vitest';
import { PRESETS, mixPresets, timeStore } from './timeOfDay';

describe('mixPresets', () => {
  it('returns the start preset at t = 0', () => {
    expect(mixPresets(PRESETS.day, PRESETS.night, 0)).toEqual(PRESETS.day);
  });

  it('returns the end preset at t = 1', () => {
    expect(mixPresets(PRESETS.day, PRESETS.night, 1)).toEqual(PRESETS.night);
  });

  it('averages numbers at t = 0.5', () => {
    const mid = mixPresets(PRESETS.day, PRESETS.night, 0.5);
    expect(mid.sunIntensity).toBeCloseTo((PRESETS.day.sunIntensity + PRESETS.night.sunIntensity) / 2);
  });

  it('clamps t outside [0, 1]', () => {
    expect(mixPresets(PRESETS.day, PRESETS.night, -1)).toEqual(PRESETS.day);
    expect(mixPresets(PRESETS.day, PRESETS.night, 2)).toEqual(PRESETS.night);
  });
});

describe('timeStore', () => {
  it('defaults to day', () => {
    expect(timeStore.get()).toBe('day');
  });

  it('keeps the last value on rapid switches and notifies each time', () => {
    const seen: string[] = [];
    const unsubscribe = timeStore.subscribe((v) => seen.push(v));
    timeStore.set('night');
    timeStore.set('sunset');
    expect(timeStore.get()).toBe('sunset');
    expect(seen).toEqual(['night', 'sunset']);
    unsubscribe();
    timeStore.set('day');
    expect(seen).toEqual(['night', 'sunset']);
  });
});
