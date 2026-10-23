'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { scrollToId } from '@/components/SmoothScroll';
import { site } from '@/content/site';
import { BreakMode } from './BreakMode';
import { TimeSwitcher } from './TimeSwitcher';
import { useTimeOfDay } from './timeOfDay';
import styles from './Hero.module.css';

gsap.registerPlugin(useGSAP);

export function Hero({ scene }: { scene?: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [time] = useTimeOfDay();
  const [breaking, setBreaking] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap
        .timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 })
        .from('[data-letter]', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.045 })
        .from('[data-intro]', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.6');
    },
    { scope: root },
  );

  const stopBreak = useCallback(() => setBreaking(false), []);

  const wasBreaking = useRef(false);
  useEffect(() => {
    if (breaking) lenis?.stop();
    else lenis?.start();
    // Skip the initial render so the intro timeline keeps its tweens.
    if (breaking === wasBreaking.current) return;
    wasBreaking.current = breaking;
    const fadeEls = root.current?.querySelectorAll('[data-fade]');
    if (fadeEls) {
      gsap.to(fadeEls, { autoAlpha: breaking ? 0 : 1, duration: 0.8, ease: 'power2.inOut', overwrite: 'auto' });
    }
    if (breaking) document.body.setAttribute('data-break', 'on');
    else document.body.removeAttribute('data-break');
  }, [breaking, lenis]);

  useEffect(() => {
    if (!breaking) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBreaking(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [breaking]);

  return (
    <section id="top" ref={root} className={styles.hero} data-time={time}>
      <div className={styles.scene} data-scene-slot>
        {scene}
      </div>

      <div className={styles.overlay}>
        <h1 className={styles.title} aria-label={site.name} data-fade>
          {site.name.split(' ').map((word, wi) => (
            <span key={wi} className={styles.word} aria-hidden="true">
              {[...word].map((ch, ci) => (
                <span key={ci} className={styles.letter} data-letter>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className={styles.tagline} data-fade data-intro>
          {site.tagline}
        </p>
        <div className={styles.actions} data-fade data-intro>
          <button type="button" className={`btn ${styles.primary}`} onClick={() => scrollToId(lenis, 'contacts')}>
            Забронировать
          </button>
          <button type="button" className={`btn btn--ghost ${styles.ghost}`} onClick={() => setBreaking(true)}>
            Подышать лесом
          </button>
        </div>
      </div>

      <div className={styles.bottom} data-intro>
        <TimeSwitcher />
      </div>

      {breaking && <BreakMode onDone={stopBreak} />}

      <div className={styles.fadeOut} aria-hidden="true" />
    </section>
  );
}
