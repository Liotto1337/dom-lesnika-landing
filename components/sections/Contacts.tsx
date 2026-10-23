import { Reveal } from '@/components/ui/Reveal';
import { site } from '@/content/site';
import styles from './Contacts.module.css';

function MapPlaceholder() {
  return (
    <svg viewBox="0 0 600 440" className={styles.map} role="img" aria-label="Схема проезда (заглушка)">
      <rect width="600" height="440" fill="#373619" />
      <g fill="#2e4a26" opacity="0.9">
        <circle cx="90" cy="80" r="70" />
        <circle cx="180" cy="50" r="55" />
        <circle cx="470" cy="330" r="95" />
        <circle cx="540" cy="230" r="60" />
        <circle cx="110" cy="360" r="80" />
        <circle cx="330" cy="120" r="48" />
      </g>
      <path d="M-10 300 C 120 260, 200 330, 300 290 S 480 180, 610 210" fill="none" stroke="#4f6f8a" strokeWidth="18" strokeLinecap="round" opacity="0.8" />
      <path d="M 40 -10 C 120 120, 220 160, 300 230 S 380 380, 420 450" fill="none" stroke="#e2bc8e" strokeWidth="3" strokeDasharray="10 8" opacity="0.7" />
      <g transform="translate(300 230)">
        <circle r="28" fill="#e2bc8e" opacity="0.18" />
        <path d="M0 -34 C 14 -34 22 -24 22 -13 C 22 2 0 22 0 22 C 0 22 -22 2 -22 -13 C -22 -24 -14 -34 0 -34 Z" fill="#e2bc8e" />
        <circle cy="-13" r="7" fill="#373619" />
      </g>
      <text x="300" y="282" textAnchor="middle" fill="#efe3cc" fontSize="18" fontFamily="var(--font-display), serif" letterSpacing="3">
        ДОМ ЛЕСНИКА
      </text>
    </svg>
  );
}

export function Contacts() {
  const c = site.contacts;
  return (
    <section id="contacts" className={`section ${styles.contacts}`}>
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.info}>
          <h2 className="section-title">Контакты</h2>
          <p className={styles.lead}>Позвоните или напишите — подберём домик и даты, расскажем, как доехать.</p>
          <dl className={styles.list}>
            <div>
              <dt>Телефон</dt>
              <dd>
                <a href={site.phoneHref}>{site.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Адрес</dt>
              <dd>{c.address}</dd>
            </div>
            <div>
              <dt>Почта</dt>
              <dd>
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </dd>
            </div>
            <div>
              <dt>Время</dt>
              <dd>{c.hours}</dd>
            </div>
          </dl>
          <ul className={styles.socials}>
            {c.socials.map((s) => (
              <li key={s.id}>
                <a href="#" aria-label={`${s.label} (ссылка появится позже)`}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className={`photo ${styles.mapWrap}`} delay={0.15}>
          <MapPlaceholder />
        </Reveal>
      </div>
    </section>
  );
}
