'use client';

import { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';
import { scrollToId } from './SmoothScroll';
import { site } from '@/content/site';
import styles from './Header.module.css';

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const lenis = useLenis(({ scroll, direction }) => {
    setScrolled(scroll > 40);
    if (scroll < 120) setHidden(false);
    else if (direction === 1) setHidden(true);
    else if (direction === -1) setHidden(false);
  });

  // The full-screen mobile menu owns the scroll while it is open.
  useEffect(() => {
    if (!lenis || !open) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis, open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(lenis, id);
  };

  const className = [
    styles.header,
    hidden && !open ? styles.hidden : '',
    scrolled ? styles.scrolled : '',
    open ? styles.open : '',
  ].join(' ');

  return (
    <header className={className} data-ui>
      <div className={styles.inner}>
        <a href="#top" className={styles.logo} onClick={go('top')}>
          {site.name}
        </a>

        <nav aria-label="Основное меню" className={styles.nav} id="main-nav">
          <ul>
            {site.nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={go(item.id)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={site.phoneHref} className={styles.phoneMobile}>
            {site.phone}
          </a>
        </nav>

        <a href={site.phoneHref} className={styles.phone}>
          {site.phone}
        </a>

        <button
          type="button"
          className={styles.burger}
          aria-label="Меню"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
