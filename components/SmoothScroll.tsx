'use client';

import { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import type Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Offset that keeps section headings clear of the fixed header. */
const HEADER_OFFSET = -80;

export function scrollToId(lenis: Lenis | undefined, id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: HEADER_OFFSET, duration: 1.4 });
  else target.scrollIntoView({ behavior: 'smooth' });
}

/** Drives Lenis from the GSAP ticker so ScrollTrigger and smooth scroll share one clock. */
function GsapBridge() {
  const lenis = useLenis(ScrollTrigger.update);

  useEffect(() => {
    if (!lenis) return;
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1, anchors: false }}>
      <GsapBridge />
      {children}
    </ReactLenis>
  );
}
