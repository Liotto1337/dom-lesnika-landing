'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A thin golden curve stretched over its section that draws itself as the section scrolls by.
 * `path` is in a 1000 × `height` viewBox and is stretched to the section's size.
 */
export function GoldLine({ path, height, className }: { path: string; height: number; className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const line = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const el = line.current;
    const section = svg.current?.parentElement;
    if (!el || !section) return;
    const length = el.getTotalLength();
    gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { strokeDashoffset: 0 });
      return;
    }
    gsap.to(el, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top 75%', end: 'bottom 70%', scrub: 0.6 },
    });
  });

  return (
    <svg
      ref={svg}
      className={className}
      viewBox={`0 0 1000 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
    >
      <path
        ref={line}
        d={path}
        fill="none"
        stroke="var(--line)"
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
