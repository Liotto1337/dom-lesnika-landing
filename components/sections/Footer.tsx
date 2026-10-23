'use client';

import { useLenis } from 'lenis/react';
import { scrollToId } from '@/components/SmoothScroll';
import { site } from '@/content/site';
import styles from './Footer.module.css';

export function Footer() {
  const lenis = useLenis();
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(lenis, id);
  };

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.logo} onClick={go('top')}>
          {site.name}
        </a>
        <nav aria-label="Меню в подвале">
          <ul className={styles.nav}>
            {site.nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={go(item.id)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.copy}>© 2026 {site.name} · демо-сайт</p>
      </div>
    </footer>
  );
}
