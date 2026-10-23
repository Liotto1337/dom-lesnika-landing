'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_Z, hillHeight } from './sceneMath';
import { usePreset } from './usePreset';

const vertex = /* glsl */ `
  attribute float aPhase;
  uniform float uTime;
  uniform float uSize;
  varying float vBlink;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.35 + aPhase * 6.0) * 0.6;
    p.y += sin(uTime * 0.5 + aPhase * 9.0) * 0.35;
    p.z += cos(uTime * 0.3 + aPhase * 4.0) * 0.6;
    vBlink = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * 1.6 + aPhase * 30.0), 3.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (12.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform float uAmount;
  varying float vBlink;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vec3(0.85, 1.0, 0.45) * a, a * vBlink * uAmount);
  }
`;

export function Fireflies({ count = 140 }: { count?: number }) {
  const preset = usePreset();
  const material = useRef<THREE.ShaderMaterial>(null);
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const z = -4 + Math.random() * (CAMERA_Z - 6);
      const x = (Math.random() * 2 - 1) * (CAMERA_Z - z) * 0.7;
      pos.set([x, hillHeight(x, z) + 0.3 + Math.random() * 1.8, z], i * 3);
      phase[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    return geo;
  }, [count]);

  const initialUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAmount: { value: 0 }, uSize: { value: 14 * Math.min(window.devicePixelRatio, 1.75) } }),
    [],
  );

  useFrame(({ clock }) => {
    const u = material.current?.uniforms;
    if (!u || !points.current) return;
    u.uTime.value = clock.elapsedTime;
    u.uAmount.value = preset.current.fireflies;
    points.current.visible = preset.current.fireflies > 0.01;
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={initialUniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
