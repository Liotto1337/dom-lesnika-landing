'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { PRESETS, mixPresets, timeStore, type ScenePreset } from './timeOfDay';

type PresetRef = React.MutableRefObject<ScenePreset>;

const PresetContext = createContext<PresetRef | null>(null);

const TRANSITION_S = 1.5;

/**
 * Owns the interpolated scene preset. On every time-of-day change it tweens from whatever
 * is on screen right now to the new target, so rapid switches never jump or stall.
 */
export function PresetProvider({ children }: { children: React.ReactNode }) {
  const current = useRef<ScenePreset>(PRESETS[timeStore.get()]);
  const from = useRef<ScenePreset>(current.current);
  const to = useRef<ScenePreset>(current.current);
  const progress = useRef({ value: 1 });

  useEffect(
    () =>
      timeStore.subscribe((time) => {
        from.current = current.current;
        to.current = PRESETS[time];
        progress.current.value = 0;
        gsap.to(progress.current, { value: 1, duration: TRANSITION_S, ease: 'power2.inOut', overwrite: true });
      }),
    [],
  );

  // Negative priority runs before the scene objects read the preset in their own useFrame.
  useFrame(() => {
    current.current = mixPresets(from.current, to.current, progress.current.value);
  }, -1);

  return <PresetContext.Provider value={current}>{children}</PresetContext.Provider>;
}

export function usePreset(): PresetRef {
  const ref = useContext(PresetContext);
  if (!ref) throw new Error('usePreset must be used inside <PresetProvider>');
  return ref;
}
