'use client';

import { forwardRef, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { hillHeight } from './sceneMath';
import { usePreset } from './usePreset';

const SIZE = 140;
const SEGMENTS = 180;

export const Hill = forwardRef<THREE.Mesh>(function Hill(_, ref) {
  const preset = usePreset();
  const material = useRef<THREE.MeshLambertMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, hillHeight(pos.getX(i), pos.getZ(i)));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const tint = useMemo(() => new THREE.Color(), []);
  useFrame(() => {
    // Ground under the grass is a darker shade of the grass tint.
    tint.set(preset.current.grassTint).multiplyScalar(0.62);
    material.current?.color.copy(tint);
  });

  return (
    <mesh ref={ref} geometry={geometry} receiveShadow>
      <meshLambertMaterial ref={material} />
    </mesh>
  );
});
