'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { hillHeight } from './sceneMath';

/** [x, z, scale] for each spruce around the cabin. */
const SPRUCES: [number, number, number][] = [
  [-3.3, -1.2, 1.15],
  [-4.8, 0.9, 0.9],
  [2.4, -1.6, 1.3],
  [3.9, 0.5, 0.85],
  [1.5, -3.4, 1.05],
  [-2.1, -3.6, 1.25],
  [5.6, -2.6, 1.0],
];

const TIERS: { r: number; h: number; y: number }[] = [
  { r: 1.0, h: 1.5, y: 1.1 },
  { r: 0.78, h: 1.3, y: 1.85 },
  { r: 0.52, h: 1.1, y: 2.55 },
];

function Spruce({ x, z, scale, material, trunk }: { x: number; z: number; scale: number; material: THREE.Material; trunk: THREE.Material }) {
  const rotation = useMemo(() => Math.random() * Math.PI, []);
  return (
    <group position={[x, hillHeight(x, z) - 0.1, z]} scale={scale} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.35, 0]} material={trunk}>
        <cylinderGeometry args={[0.09, 0.13, 0.8, 6]} />
      </mesh>
      {TIERS.map((t, i) => (
        <mesh key={i} position={[0, t.y, 0]} material={material}>
          <coneGeometry args={[t.r, t.h, 7]} />
        </mesh>
      ))}
    </group>
  );
}

export function Trees() {
  const needles = useMemo(() => new THREE.MeshLambertMaterial({ color: '#2b4a2d', flatShading: true }), []);
  const bark = useMemo(() => new THREE.MeshLambertMaterial({ color: '#4a3324' }), []);
  return (
    <>
      {SPRUCES.map(([x, z, s], i) => (
        <Spruce key={i} x={x} z={z} scale={s} material={needles} trunk={bark} />
      ))}
    </>
  );
}
