import * as THREE from 'three';

/** Hill crest height and spread. The cabin sits on the crest at the origin. */
const HILL_HEIGHT = 5;
const HILL_SPREAD = 16;

export function hillHeight(x: number, z: number): number {
  const dome = HILL_HEIGHT * Math.exp(-(x * x + z * z) / (2 * HILL_SPREAD * HILL_SPREAD));
  const ripple = 0.18 * Math.sin(x * 0.35) * Math.cos(z * 0.28);
  return dome + ripple;
}

export const CAMERA_Z = 22;
export const CAMERA_LIFT = 1.5;
export const CAMERA_TARGET = new THREE.Vector3(0, 10.5, 0);

/** Unit vector toward the sun for an azimuth/elevation in degrees (camera looks down −Z). */
export function sunDirection(azimuthDeg: number, elevationDeg: number, target = new THREE.Vector3()) {
  const az = THREE.MathUtils.degToRad(azimuthDeg);
  const el = THREE.MathUtils.degToRad(elevationDeg);
  return target.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
}

/** Hex → raw sRGB components, for shaders that write display colors directly. */
export function hexToVec3(hex: string, target: THREE.Vector3) {
  const n = parseInt(hex.slice(1), 16);
  return target.set(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

export const HILL_SIZE = 140;

export function createHillGeometry(segments: number) {
  const geo = new THREE.PlaneGeometry(HILL_SIZE, HILL_SIZE, segments, segments);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, hillHeight(pos.getX(i), pos.getZ(i)));
  }
  geo.computeVertexNormals();
  return geo;
}
