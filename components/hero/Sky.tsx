'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { hexToVec3, sunDirection } from './sceneMath';
import { usePreset } from './usePreset';

const vertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uBottom;
  uniform vec3 uSun;
  uniform vec3 uSunColor;
  uniform float uGlow;
  uniform float uMoon;
  varying vec3 vDir;

  void main() {
    vec3 dir = normalize(vDir);
    float h = clamp(dir.y, 0.0, 1.0);
    vec3 col = mix(uBottom, uTop, pow(h, 0.55));

    float d = max(dot(dir, uSun), 0.0);
    col += uSunColor * pow(d, 10.0) * uGlow * 0.6;
    col += uSunColor * pow(d, 80.0) * uGlow * 0.5;

    // Moon: crisp disc with a soft halo.
    float disc = smoothstep(0.99955, 0.99975, d);
    float halo = pow(d, 300.0) * 0.5;
    col = mix(col, vec3(1.0, 0.98, 0.92), disc * uMoon);
    col += vec3(0.75, 0.82, 1.0) * halo * uMoon;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function SkyDome() {
  const preset = usePreset();
  const material = useRef<THREE.ShaderMaterial>(null);
  const initialUniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Vector3() },
      uBottom: { value: new THREE.Vector3() },
      uSun: { value: new THREE.Vector3() },
      uSunColor: { value: new THREE.Vector3() },
      uGlow: { value: 0 },
      uMoon: { value: 0 },
    }),
    [],
  );

  useFrame(() => {
    // Write through the material: R3F hands the material its own copy of the uniforms object.
    const uniforms = material.current?.uniforms;
    if (!uniforms) return;
    const p = preset.current;
    hexToVec3(p.skyTop, uniforms.uTop.value);
    hexToVec3(p.skyBottom, uniforms.uBottom.value);
    hexToVec3(p.sunColor, uniforms.uSunColor.value);
    sunDirection(p.sunAzimuth, p.sunElevation, uniforms.uSun.value);
    uniforms.uGlow.value = p.sunGlow;
    uniforms.uMoon.value = p.moon;
  });

  return (
    <mesh renderOrder={-10}>
      <sphereGeometry args={[300, 48, 24]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={initialUniforms}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function StarField({ count = 1400 }: { count?: number }) {
  const preset = usePreset();
  const material = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Upper hemisphere, denser toward the zenith.
      const u = Math.random() * Math.PI * 2;
      const y = 0.05 + Math.pow(Math.random(), 0.7) * 0.95;
      const r = Math.sqrt(1 - y * y);
      arr.set([Math.cos(u) * r * 280, y * 280, Math.sin(u) * r * 280], i * 3);
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!material.current) return;
    const twinkle = 0.85 + Math.sin(clock.elapsedTime * 1.7) * 0.15;
    material.current.opacity = preset.current.stars * twinkle;
    material.current.visible = preset.current.stars > 0.01;
  });

  return (
    <points renderOrder={-9}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        size={1.6}
        sizeAttenuation={false}
        color="#ffffff"
        transparent
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </points>
  );
}

export function Sky() {
  return (
    <>
      <SkyDome />
      <StarField />
    </>
  );
}
