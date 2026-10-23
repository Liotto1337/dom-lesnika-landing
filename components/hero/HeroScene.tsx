'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Cloud, Clouds } from '@react-three/drei';
import * as THREE from 'three';
import { Cabin } from './Cabin';
import { Hill } from './Hill';
import { Sky } from './Sky';
import { Trees } from './Trees';
import { CAMERA_LIFT, CAMERA_TARGET, CAMERA_Z, hillHeight, sunDirection } from './sceneMath';
import { cloudTextureUrl } from './textures';
import { PresetProvider, usePreset } from './usePreset';

const CAMERA_Y = hillHeight(0, CAMERA_Z) + CAMERA_LIFT;

function Lights() {
  const preset = usePreset();
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const scene = useThree((s) => s.scene);
  const dir = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    scene.fog = new THREE.Fog('#d9e8f2', 40, 170);
  }, [scene]);

  useFrame(() => {
    const p = preset.current;
    if (sun.current) {
      // Keep the key light from going under the horizon at sunset so the hill stays lit.
      sunDirection(p.sunAzimuth, Math.max(p.sunElevation, 14), dir);
      sun.current.position.copy(dir).multiplyScalar(60);
      sun.current.color.set(p.sunColor);
      sun.current.intensity = p.sunIntensity;
    }
    if (hemi.current) {
      hemi.current.color.set(p.skyBottom);
      hemi.current.groundColor.set(p.grassTint);
      hemi.current.intensity = p.ambient;
    }
    if (scene.fog instanceof THREE.Fog) scene.fog.color.set(p.fogColor);
  });

  return (
    <>
      <directionalLight ref={sun} />
      <hemisphereLight ref={hemi} />
    </>
  );
}

const CLOUDS: { pos: [number, number, number]; seed: number; bounds: [number, number, number]; volume: number }[] = [
  { pos: [-60, 34, -110], seed: 1, bounds: [14, 3, 2], volume: 14 },
  { pos: [-18, 46, -130], seed: 2, bounds: [18, 3, 2], volume: 16 },
  { pos: [-38, 27, -100], seed: 3, bounds: [12, 2, 2], volume: 11 },
  { pos: [70, 42, -125], seed: 4, bounds: [16, 3, 2], volume: 15 },
  { pos: [-95, 22, -90], seed: 5, bounds: [10, 2, 2], volume: 9 },
  { pos: [105, 26, -95], seed: 6, bounds: [12, 2, 2], volume: 10 },
  { pos: [8, 58, -150], seed: 7, bounds: [20, 3, 2], volume: 18 },
];

const CLOUD_WRAP = 130;

function CloudLayer() {
  const texture = useMemo(() => cloudTextureUrl(), []);
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    group.current?.children.forEach((child) => {
      child.position.x += dt * 1.1;
      if (child.position.x > CLOUD_WRAP) child.position.x -= CLOUD_WRAP * 2;
    });
  });

  return (
    <Clouds texture={texture} material={THREE.MeshLambertMaterial} limit={160} frustumCulled={false}>
      <group ref={group}>
        {CLOUDS.map((c) => (
          <Cloud key={c.seed} seed={c.seed} position={c.pos} bounds={c.bounds} volume={c.volume} segments={18} speed={0.08} growth={3} opacity={0.92} fade={60} color="#ffffff" />
        ))}
      </group>
    </Clouds>
  );
}

function CameraRig() {
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  useFrame(({ camera, pointer }, dt) => {
    const k = 1 - Math.exp(-dt * 2.5);
    const tx = reduced ? 0 : pointer.x * 0.9;
    const ty = CAMERA_Y + (reduced ? 0 : pointer.y * 0.35);
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    camera.lookAt(CAMERA_TARGET);
  });
  return null;
}

export default function HeroScene() {
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = host.current?.closest('section');
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        flat
        dpr={[1, 1.75]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ fov: 45, near: 0.1, far: 600, position: [0, CAMERA_Y, CAMERA_Z] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ camera }) => camera.lookAt(CAMERA_TARGET)}
      >
        <PresetProvider>
          <Lights />
          <Sky />
          <CloudLayer />
          <Hill />
          <Cabin />
          <Trees />
          <CameraRig />
        </PresetProvider>
      </Canvas>
    </div>
  );
}
