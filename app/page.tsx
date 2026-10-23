import { Header } from '@/components/Header';
import { Hero } from '@/components/hero/Hero';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <div style={{ height: '150vh' }} />
        <section id="contacts" style={{ minHeight: '60vh' }}>
          <h2>Контакты</h2>
        </section>
      </main>
    </>
  );
}
