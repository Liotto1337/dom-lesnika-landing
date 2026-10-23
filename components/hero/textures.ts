import * as THREE from 'three';

function canvas(size: number) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return [c, c.getContext('2d')!] as const;
}

/** Soft, lumpy puff used by the clouds; built at runtime so the scene has no external assets. */
export function cloudTextureUrl(): string {
  const [c, ctx] = canvas(256);
  const blobs = [
    [128, 138, 92],
    [88, 150, 62],
    [170, 150, 66],
    [118, 104, 64],
    [156, 112, 52],
  ];
  for (const [x, y, r] of blobs) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.45)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  }
  return c.toDataURL('image/png');
}

/** Round soft dot for smoke and fireflies. */
export function softDotTexture(): THREE.Texture {
  const [c, ctx] = canvas(64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Horizontal log courses for the cabin walls. */
export function logTexture(): THREE.Texture {
  const [c, ctx] = canvas(256);
  const rows = 8;
  const h = 256 / rows;
  for (let i = 0; i < rows; i++) {
    const g = ctx.createLinearGradient(0, i * h, 0, (i + 1) * h);
    g.addColorStop(0, '#6b4024');
    g.addColorStop(0.45, '#9a6238');
    g.addColorStop(0.85, '#7a4a2a');
    g.addColorStop(1, '#3d2414');
    ctx.fillStyle = g;
    ctx.fillRect(0, i * h, 256, h);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
