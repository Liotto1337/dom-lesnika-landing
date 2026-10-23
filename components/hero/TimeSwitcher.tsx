'use client';

import { TIMES, useTimeOfDay } from './timeOfDay';
import styles from './Hero.module.css';

export function TimeSwitcher() {
  const [time, setTime] = useTimeOfDay();
  return (
    <div role="group" aria-label="Время суток" className={styles.switcher} data-fade>
      {TIMES.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-pressed={time === t.id}
          className={styles.switch}
          onClick={() => setTime(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
