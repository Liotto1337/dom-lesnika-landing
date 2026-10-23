export const grassVertex = /* glsl */ `
  attribute vec3 aOffset;
  attribute float aYaw;
  attribute float aHeight;
  attribute float aRand;

  uniform float uTime;
  uniform vec3 uPointer;
  uniform float uPointerStrength;

  varying float vH;
  varying float vRand;
  varying float vGlow;
  varying float vDepth;

  void main() {
    vec3 p = position;            // blade: x across, y from 0 (root) to 1 (tip)
    float h = p.y;
    p.x *= 1.0 - h * 0.85;        // taper to a point
    p.y *= aHeight;

    float c = cos(aYaw);
    float s = sin(aYaw);
    vec3 world = aOffset + vec3(p.x * c, p.y, p.x * s);

    float bend = h * h * aHeight;

    // Wind: a slow rolling wave plus a faster per-blade flutter.
    float wave = sin(uTime * 1.25 + aOffset.x * 0.22 + aOffset.z * 0.17);
    float flutter = sin(uTime * 2.9 + aOffset.x * 0.9 + aRand * 6.2831);
    float wind = wave * 0.55 + flutter * 0.2;
    world.x += wind * 0.28 * bend;
    world.z += wind * 0.1 * bend;

    // Blades lean away from the cursor.
    vec2 away = aOffset.xz - uPointer.xz;
    float dist = length(away);
    float push = (1.0 - smoothstep(0.0, 2.4, dist)) * uPointerStrength;
    world.xz += (away / max(dist, 0.001)) * push * bend * 0.9;
    world.y -= push * bend * 0.35;

    vGlow = (1.0 - smoothstep(0.0, 3.2, dist)) * uPointerStrength;
    vH = h;
    vRand = aRand;

    vec4 mv = viewMatrix * vec4(world, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

export const grassFragment = /* glsl */ `
  uniform vec3 uTint;
  uniform vec3 uSunColor;
  uniform vec3 uFogColor;
  uniform float uLight;
  uniform float uNightGlow;

  varying float vH;
  varying float vRand;
  varying float vGlow;
  varying float vDepth;

  void main() {
    vec3 root = uTint * 0.32;
    vec3 tip = uTint * 1.05 + vec3(0.03, 0.035, 0.0);
    vec3 col = mix(root, tip, smoothstep(0.0, 1.0, vH));
    col *= 0.72 + vRand * 0.46;
    col *= uLight * mix(vec3(1.0), uSunColor, 0.35);

    // Night: soft green bioluminescence around the cursor, strongest at the tips.
    col += vec3(0.45, 1.0, 0.55) * vGlow * uNightGlow * (0.25 + vH * 0.75) * 1.1;

    float fog = smoothstep(40.0, 170.0, vDepth);
    col = mix(col, uFogColor, fog);
    gl_FragColor = vec4(col, 1.0);
  }
`;
