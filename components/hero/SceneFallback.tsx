import styles from './Hero.module.css';

/** Static hill with a cabin and spruces, shown when WebGL is unavailable. */
export function SceneFallback() {
  return (
    <div className={styles.fallback} data-testid="scene-fallback" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
        <path d="M0 900 L0 720 Q720 560 1440 720 L1440 900 Z" fill="#3f5f2a" />
        <g fill="#24361f">
          <path d="M560 640 l26 -70 l26 70 z M566 600 l20 -56 l20 56 z" />
          <path d="M840 650 l30 -84 l30 84 z M847 604 l23 -66 l23 66 z" />
          <path d="M905 658 l22 -60 l22 60 z" />
        </g>
        <g>
          <rect x="660" y="606" width="110" height="52" fill="#6b4024" />
          <path d="M648 608 L715 566 L782 608 Z" fill="#2d2620" />
          <rect x="682" y="622" width="24" height="18" fill="#ffb35c" />
          <rect x="735" y="620" width="20" height="38" fill="#3a2617" />
        </g>
      </svg>
    </div>
  );
}
