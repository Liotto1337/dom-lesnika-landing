'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { GoldLine } from '@/components/ui/GoldLine';
import { Reveal } from '@/components/ui/Reveal';
import { site } from '@/content/site';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Starts under the hero, loops around each photo in turn and runs off toward the cabins heading.
const LINE_HEIGHT = 2400;
const LINE = [
  'M 640 0',
  'C 700 140, 430 190, 360 300',
  'C 290 410, 40 380, 20 560',
  'C 0 760, 300 830, 520 770',
  'C 760 700, 1000 650, 980 920',
  'C 960 1160, 700 1190, 520 1230',
  'C 300 1270, 20 1320, 50 1580',
  'C 80 1820, 380 1860, 600 1810',
  'C 820 1760, 1000 1830, 960 2060',
  'C 930 2260, 600 2310, 420 2400',
].join(' ');

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8 },
          { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className={`section ${styles.about}`}>
      <GoldLine path={LINE} height={LINE_HEIGHT} className={styles.line} />
      <div className={`container ${styles.inner}`}>
        {site.about.map((row, i) => (
          <div key={row.image} className={styles.row} data-flip={i % 2 === 1 || undefined}>
            <Reveal className={`photo ${styles.photo}`}>
              <img src={row.image} alt={row.alt} loading="lazy" decoding="async" data-parallax />
            </Reveal>
            <Reveal className={styles.text} delay={0.15}>
              {i === 0 && <h2 className="section-title">О нас</h2>}
              <p>{row.text}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
