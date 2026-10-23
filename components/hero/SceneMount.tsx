'use client';

import { Component, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SceneFallback } from './SceneFallback';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

/** three.js (r163+) renders only through WebGL2, so a WebGL1-only browser gets the fallback. */
function hasWebGL2(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

/** Any failure inside the scene (context creation, shader, chunk load) degrades to the static fallback. */
class SceneBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children;
  }
}

export function SceneMount() {
  const [support, setSupport] = useState<'unknown' | 'yes' | 'no'>('unknown');
  useEffect(() => setSupport(hasWebGL2() ? 'yes' : 'no'), []);
  if (support === 'unknown') return null;
  if (support === 'no') return <SceneFallback />;
  return (
    <SceneBoundary>
      <HeroScene />
    </SceneBoundary>
  );
}
