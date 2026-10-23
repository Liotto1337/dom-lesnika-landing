'use client';

import { useLenis } from 'lenis/react';
import { scrollToId } from '@/components/SmoothScroll';
import { Reveal } from '@/components/ui/Reveal';
import { site } from '@/content/site';
import styles from './Cabins.module.css';

export function Cabins() {
  const lenis = useLenis();
  return (
    <section id="cabins" className={`section ${styles.cabins}`}>
      <div className="container">
        <Reveal>
          <h2 className={`section-title ${styles.title}`}>
            <span>Выбери свой</span> <span className={`accent ${styles.shift}`}>уютный домик</span>
          </h2>
        </Reveal>
        <div className={styles.grid}>
          {site.cabins.map((cabin, i) => (
            <Reveal as="article" key={cabin.name} className={styles.card} delay={(i % 2) * 0.12}>
              <div className={`photo ${styles.photo}`}>
                <img src={cabin.image} alt={cabin.alt} loading="lazy" decoding="async" />
                <span className={styles.guests}>{cabin.guests}</span>
              </div>
              <div className={styles.body}>
                <h3>{cabin.name}</h3>
                <p>{cabin.text}</p>
                <ul>
                  {cabin.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className={styles.footer}>
                  <span className={styles.price}>{cabin.price}</span>
                  <button
                    type="button"
                    className="btn"
                    aria-label={`Забронировать: ${cabin.name}`}
                    onClick={() => scrollToId(lenis, 'contacts')}
                  >
                    Забронировать
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
