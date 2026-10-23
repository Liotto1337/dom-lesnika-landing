import { Header } from '@/components/Header';
import { Hero } from '@/components/hero/Hero';
import { About } from '@/components/sections/About';
import { Activities } from '@/components/sections/Activities';
import { Cabins } from '@/components/sections/Cabins';
import { Contacts } from '@/components/sections/Contacts';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Cabins />
        <Activities />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
