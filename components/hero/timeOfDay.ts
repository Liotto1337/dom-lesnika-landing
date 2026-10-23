import { useSyncExternalStore } from 'react';

export type TimeOfDay = 'day' | 'sunset' | 'night';

export const TIMES: { id: TimeOfDay; label: string }[] = [
  { id: 'day', label: 'День' },
  { id: 'sunset', label: 'Закат' },
  { id: 'night', label: 'Ночь' },
];

/** Everything the 3D scene needs to look like a given time of day. Colors are hex strings. */
export interface ScenePreset {
  skyTop: string;
  skyBottom: string;
  sunColor: string;
  sunIntensity: number;
  ambient: number;
  fogColor: string;
  grassTint: string;
  windowGlow: number;
  cloudColor: string;
  stars: number;
  fireflies: number;
  moon: number;
  /** Sun (or moon at night) direction: azimuth and elevation in degrees, 0° azimuth = straight ahead. */
  sunAzimuth: number;
  sunElevation: number;
  /** Strength of the soft glow around the sun in the sky dome. */
  sunGlow: number;
}

export const PRESETS: Record<TimeOfDay, ScenePreset> = {
  day: {
    skyTop: '#3d7fd0',
    skyBottom: '#d6e9f6',
    sunColor: '#fff4d6',
    sunIntensity: 2.6,
    ambient: 1.1,
    fogColor: '#d9e8f2',
    grassTint: '#6f9a3a',
    windowGlow: 0.4,
    cloudColor: '#ffffff',
    stars: 0,
    fireflies: 0,
    moon: 0,
    sunAzimuth: -55,
    sunElevation: 28,
    sunGlow: 0.55,
  },
  sunset: {
    skyTop: '#4a2466',
    skyBottom: '#f08a5d',
    sunColor: '#ffb36b',
    sunIntensity: 1.8,
    ambient: 0.7,
    fogColor: '#e98a6a',
    grassTint: '#7a7a34',
    windowGlow: 1.6,
    cloudColor: '#ff9e7a',
    stars: 0.15,
    fireflies: 0.2,
    moon: 0,
    sunAzimuth: 35,
    sunElevation: 4,
    sunGlow: 0.9,
  },
  night: {
    skyTop: '#0a1433',
    skyBottom: '#1e3a78',
    sunColor: '#9fb8ff',
    sunIntensity: 0.55,
    ambient: 0.35,
    fogColor: '#13254f',
    grassTint: '#2f5a3a',
    windowGlow: 3,
    cloudColor: '#3b4f86',
    stars: 1,
    fireflies: 1,
    moon: 1,
    sunAzimuth: 21,
    sunElevation: 8,
    sunGlow: 0.25,
  },
};

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

function lerpHex(a: string, b: string, t: number): string {
  if (t === 0) return a;
  if (t === 1) return b;
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  let out = 0;
  for (const shift of [16, 8, 0]) {
    const ca = (pa >> shift) & 0xff;
    const cb = (pb >> shift) & 0xff;
    out |= Math.round(ca + (cb - ca) * t) << shift;
  }
  return `#${out.toString(16).padStart(6, '0')}`;
}

export function mixPresets(a: ScenePreset, b: ScenePreset, t: number): ScenePreset {
  const k = clamp01(t);
  const out = {} as Record<keyof ScenePreset, string | number>;
  for (const key of Object.keys(a) as (keyof ScenePreset)[]) {
    const va = a[key];
    const vb = b[key];
    out[key] =
      typeof va === 'number' ? va * (1 - k) + (vb as number) * k : lerpHex(va, vb as string, k);
  }
  return out as unknown as ScenePreset;
}

type Listener = (v: TimeOfDay) => void;

function createTimeStore(initial: TimeOfDay) {
  let value = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => value,
    set(v: TimeOfDay) {
      value = v;
      listeners.forEach((fn) => fn(v));
    },
    subscribe(fn: Listener) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
  };
}

export const timeStore = createTimeStore('day');

export function useTimeOfDay(): [TimeOfDay, (v: TimeOfDay) => void] {
  const value = useSyncExternalStore(timeStore.subscribe, timeStore.get, () => 'day' as TimeOfDay);
  return [value, timeStore.set];
}
