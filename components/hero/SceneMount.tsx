'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SceneFallback } from './SceneFallback';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function SceneMount() {
  const [support, setSupport] = useState<'unknown' | 'yes' | 'no'>('unknown');
  useEffect(() => setSupport(hasWebGL() ? 'yes' : 'no'), []);
  if (support === 'unknown') return null;
  return support === 'yes' ? <HeroScene /> : <SceneFallback />;
}
