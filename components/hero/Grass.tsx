'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { debugExpose } from './debug';
import { grassFragment, grassVertex } from './grassShader';
import { CABIN_POSITION } from './Cabin';
import { CAMERA_Z, createHillGeometry, hexToVec3, hillHeight } from './sceneMath';
import { usePreset } from './usePreset';

const NEAR_Z = CAMERA_Z - 1.2;
const FAR_Z = -3;
const BLADE_WIDTH = 0.075;
const POINTER_IDLE = new THREE.Vector3(0, -999, 0);
/** Wind strength when the visitor asked the OS to reduce motion. */
const REDUCED_WIND = 0.3;
/** Seconds the push lingers after the cursor stops. */
const POINTER_HOLD = 2.5;

function buildBlades(count: number, aspect: number) {
  const blade = new THREE.PlaneGeometry(BLADE_WIDTH, 1, 1, 3);
  blade.translate(0, 0.5, 0);

  const geo = new THREE.InstancedBufferGeometry();
  geo.index = blade.index;
  geo.setAttribute('position', blade.attributes.position);
  geo.setAttribute('uv', blade.attributes.uv);

  const offsets = new Float32Array(count * 3);
  const yaws = new Float32Array(count);
  const heights = new Float32Array(count);
  const rands = new Float32Array(count);

  // Spread blades over the trapezoid the camera sees, a bit wider than the screen.
  const spread = Math.tan(THREE.MathUtils.degToRad(22.5)) * Math.max(aspect, 0.6) * 1.15;
  const halfWidth = (z: number) => (CAMERA_Z - z + 1.5) * spread;
  const maxHalf = halfWidth(FAR_Z);

  for (let i = 0; i < count; ) {
    const z = FAR_Z + Math.random() * (NEAR_Z - FAR_Z);
    const x = (Math.random() * 2 - 1) * maxHalf;
    if (Math.abs(x) > halfWidth(z)) continue;
    if (Math.hypot(x - CABIN_POSITION.x, z - CABIN_POSITION.z) < 1.5) continue;
    offsets.set([x, hillHeight(x, z) - 0.02, z], i * 3);
    yaws[i] = Math.random() * Math.PI;
    // Taller tufts in the foreground read better close to the camera.
    const near = (z - FAR_Z) / (NEAR_Z - FAR_Z);
    heights[i] = (0.22 + Math.random() * 0.3) * (0.55 + near * 0.95);
    rands[i] = Math.random();
    i++;
  }

  geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
  geo.setAttribute('aYaw', new THREE.InstancedBufferAttribute(yaws, 1));
  geo.setAttribute('aHeight', new THREE.InstancedBufferAttribute(heights, 1));
  geo.setAttribute('aRand', new THREE.InstancedBufferAttribute(rands, 1));
  geo.instanceCount = count;
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 3, (NEAR_Z + FAR_Z) / 2), 40);
  return geo;
}

export function Grass({ count }: { count: number }) {
  const preset = usePreset();
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointer = useMemo(() => POINTER_IDLE.clone(), []);
  const lastMove = useRef(-Infinity);
  const strength = useRef(0);

  const geometry = useMemo(() => buildBlades(count, window.innerWidth / window.innerHeight), [count]);
  const proxy = useMemo(() => createHillGeometry(48), []);
  const windScale = useMemo(() => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? REDUCED_WIND : 1), []);
  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: pointer },
      uPointerStrength: { value: 0 },
      uWindScale: { value: windScale },
      uTint: { value: new THREE.Vector3() },
      uSunColor: { value: new THREE.Vector3() },
      uFogColor: { value: new THREE.Vector3() },
      uLight: { value: 1 },
      uNightGlow: { value: 0 },
    }),
    [pointer, windScale],
  );

  const debug = useMemo(() => ({ count, pointer: [0, -999, 0], windScale }), [count, windScale]);
  useEffect(() => debugExpose('grass', debug), [debug]);

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    pointer.copy(e.point);
    lastMove.current = performance.now() / 1000;
    debug.pointer = [e.point.x, e.point.y, e.point.z];
  };

  useFrame(({ clock }, dt) => {
    const u = material.current?.uniforms;
    if (!u) return;
    const p = preset.current;
    const active = performance.now() / 1000 - lastMove.current < POINTER_HOLD ? 1 : 0;
    strength.current += (active - strength.current) * (1 - Math.exp(-dt * (active ? 6 : 1.5)));

    u.uTime.value = clock.elapsedTime;
    u.uPointer.value.copy(pointer);
    u.uPointerStrength.value = strength.current;
    hexToVec3(p.grassTint, u.uTint.value);
    hexToVec3(p.sunColor, u.uSunColor.value);
    hexToVec3(p.fogColor, u.uFogColor.value);
    u.uLight.value = p.sunIntensity * 0.25 + p.ambient * 0.55;
    u.uNightGlow.value = p.fireflies;
  });

  return (
    <>
      <mesh geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          vertexShader={grassVertex}
          fragmentShader={grassFragment}
          uniforms={initialUniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Low-poly copy of the hill that only exists to catch the cursor. */}
      <mesh geometry={proxy} onPointerMove={onMove} onPointerLeave={() => (lastMove.current = -Infinity)}>
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>
    </>
  );
}
