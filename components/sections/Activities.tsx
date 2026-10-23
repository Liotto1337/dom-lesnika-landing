import { Reveal } from '@/components/ui/Reveal';
import { site } from '@/content/site';
import styles from './Activities.module.css';

export function Activities() {
  return (
    <section id="activities" className={`section ${styles.activities}`}>
      <div className="container">
        <Reveal className={styles.head}>
          <h2 className="section-title">Активный отдых</h2>
          <p>Чем заняться, когда надоест лежать в гамаке.</p>
        </Reveal>
        <div className={styles.grid}>
          {site.activities.map((a, i) => (
            <Reveal as="article" key={a.title} className={styles.tile} delay={(i % 3) * 0.1}>
              <img src={a.image} alt={a.alt} loading="lazy" decoding="async" />
              <div className={styles.caption}>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
