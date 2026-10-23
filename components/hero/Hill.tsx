'use client';

import { forwardRef, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createHillGeometry } from './sceneMath';
import { usePreset } from './usePreset';

export const Hill = forwardRef<THREE.Mesh>(function Hill(_, ref) {
  const preset = usePreset();
  const material = useRef<THREE.MeshLambertMaterial>(null);

  const geometry = useMemo(() => createHillGeometry(120), []);

  const tint = useMemo(() => new THREE.Color(), []);
  useFrame(() => {
    // Ground under the grass is a darker shade of the grass tint.
    tint.set(preset.current.grassTint).multiplyScalar(0.62);
    material.current?.color.copy(tint);
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshLambertMaterial ref={material} />
    </mesh>
  );
});
