'use client';

import { useEffect, useRef, useState } from 'react';
import { createBreakTimer, formatMMSS } from './breakTimer';
import styles from './Hero.module.css';

const BREAK_MS = 60_000;

/** Countdown shown while the interface is hidden; calls onDone when time is up. */
export function BreakMode({ onDone }: { onDone: () => void }) {
  const [label, setLabel] = useState(formatMMSS(BREAK_MS));
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const timer = createBreakTimer(BREAK_MS);
    timer.start();
    let raf = 0;
    const tick = () => {
      setLabel(formatMMSS(timer.remainingMs()));
      if (timer.isDone()) {
        done.current();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // rAF pauses in a hidden tab; re-check as soon as the tab is visible again.
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return (
    <div className={styles.break}>
      <span className={styles.breakLabel}>Тишина леса</span>
      <span role="timer" aria-live="off" className={styles.breakTime}>
        {label}
      </span>
      <button type="button" className={styles.breakBack} onClick={onDone}>
        Вернуться
      </button>
    </div>
  );
}
