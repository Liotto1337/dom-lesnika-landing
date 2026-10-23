import { Header } from '@/components/Header';
import { site } from '@/content/site';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section id="top" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <h1>{site.name}</h1>
        </section>
      </main>
    </>
  );
}
