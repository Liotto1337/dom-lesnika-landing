'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { hillHeight } from './sceneMath';
import { logTexture, softDotTexture } from './textures';
import { usePreset } from './usePreset';

const W = 2.2; // width (x)
const D = 1.8; // depth (z)
const H = 1.3; // wall height
const RH = 0.9; // roof rise
const ROOF_T = 0.09;
const SLOPE = Math.atan2(RH, W / 2);
const PANEL = Math.hypot(W / 2, RH) + 0.32;

export const CABIN_POSITION = new THREE.Vector3(-0.6, hillHeight(-0.6, 0.2) - 0.05, 0.2);

function Smoke({ origin }: { origin: [number, number, number] }) {
  const preset = usePreset();
  const texture = useMemo(() => softDotTexture(), []);
  const puffs = useRef<(THREE.Sprite | null)[]>([]);
  const COUNT = 7;
  const tint = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = preset.current;
    tint.set('#cfcac2').multiplyScalar(0.35 + 0.65 * Math.min(1, p.ambient));
    puffs.current.forEach((s, i) => {
      if (!s) return;
      const life = (t * 0.22 + i / COUNT) % 1;
      s.position.set(origin[0] + life * 0.9 + Math.sin(t + i) * 0.08, origin[1] + life * 2.6, origin[2] - life * 0.3);
      const scale = 0.25 + life * 1.1;
      s.scale.set(scale, scale, scale);
      const m = s.material as THREE.SpriteMaterial;
      m.opacity = Math.sin(life * Math.PI) * 0.45;
      m.color.copy(tint);
    });
  });

  return (
    <>
      {Array.from({ length: COUNT }, (_, i) => (
        <sprite key={i} ref={(el) => void (puffs.current[i] = el)}>
          <spriteMaterial map={texture} transparent depthWrite={false} />
        </sprite>
      ))}
    </>
  );
}

export function Cabin() {
  const preset = usePreset();
  const windows = useRef<THREE.MeshStandardMaterial>(null);
  const lamp = useRef<THREE.PointLight>(null);

  const logs = useMemo(() => {
    const tex = logTexture();
    tex.repeat.set(1, 1.2);
    return tex;
  }, []);

  const gable = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-W / 2, 0);
    shape.lineTo(W / 2, 0);
    shape.lineTo(0, RH);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: D, bevelEnabled: false });
    geo.translate(0, 0, -D / 2);
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const glow = preset.current.windowGlow;
    const flicker = 1 + Math.sin(clock.elapsedTime * 7.3) * 0.04 + Math.sin(clock.elapsedTime * 13.1) * 0.03;
    if (windows.current) windows.current.emissiveIntensity = glow * flicker;
    if (lamp.current) lamp.current.intensity = glow * 2.2 * flicker;
  });

  const wood = '#5a3a22';

  return (
    <group position={CABIN_POSITION} rotation={[0, -0.32, 0]}>
      {/* foundation & porch */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[W + 0.2, 0.2, D + 0.2]} />
        <meshLambertMaterial color="#4a4038" />
      </mesh>
      <mesh position={[0, 0.12, D / 2 + 0.35]}>
        <boxGeometry args={[W * 0.9, 0.08, 0.6]} />
        <meshLambertMaterial color={wood} />
      </mesh>

      {/* walls */}
      <mesh position={[0, H / 2 + 0.15, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshLambertMaterial map={logs} />
      </mesh>
      <mesh geometry={gable} position={[0, H + 0.15, 0]}>
        <meshLambertMaterial map={logs} />
      </mesh>

      {/* roof */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[
            side * (W / 4) - side * Math.sin(SLOPE) * ROOF_T * 0.5,
            H + 0.15 + RH / 2 + Math.cos(SLOPE) * ROOF_T * 0.5,
            0,
          ]}
          rotation={[0, 0, -side * SLOPE]}
        >
          <boxGeometry args={[PANEL, ROOF_T, D + 0.5]} />
          <meshLambertMaterial color="#2d2620" />
        </mesh>
      ))}

      {/* chimney */}
      <mesh position={[0.55, H + 0.15 + RH * 0.75, -0.3]}>
        <boxGeometry args={[0.28, 0.8, 0.28]} />
        <meshLambertMaterial color="#6d625a" />
      </mesh>

      {/* door */}
      <mesh position={[0.5, 0.15 + 0.45, D / 2 + 0.011]}>
        <planeGeometry args={[0.46, 0.9]} />
        <meshLambertMaterial color="#3a2617" />
      </mesh>

      {/* warm windows */}
      <mesh position={[-0.5, 0.15 + 0.75, D / 2 + 0.012]}>
        <planeGeometry args={[0.5, 0.42]} />
        <meshStandardMaterial ref={windows} color="#2a1a0e" emissive="#ffb35c" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[W / 2 + 0.012, 0.15 + 0.75, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.5, 0.42]} />
        <meshStandardMaterial color="#2a1a0e" emissive="#ffb35c" emissiveIntensity={1} />
      </mesh>
      <pointLight ref={lamp} position={[-0.5, 0.9, D / 2 + 0.6]} color="#ffb35c" distance={7} decay={1.6} />

      <Smoke origin={[0.55, H + 0.15 + RH * 0.75 + 0.45, -0.3]} />
    </group>
  );
}
