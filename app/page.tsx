import Image from 'next/image';
import WhatWeDo from '@/components/WhatWeDo';
import Retreats from '@/components/Retreats';
import Seminars from '@/components/Seminars';
import Adventures from '@/components/Adventures';
import EmailCTA from '@/components/EmailCTA';
import DonateButton from '@/components/DonateButton';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative flex items-center justify-center min-h-screen py-24 px-8 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 after:absolute after:inset-0 after:bg-highlight/70 after:pointer-events-none after:content-['']">
          <Image
            src="/assets/images/Banner.webp"
            alt="Flowers"
            fill
            priority
            sizes="100vw"
            className="object-cover scale-[1.25] md:scale-100"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl lg:text-[3.5rem] text-white mb-4">Empowering Muslim Women</h1>
          <p className="text-xl text-white mb-8 max-w-xl mx-auto">
            Building community, nurturing faith, and creating spaces where Muslim women can thrive together.
          </p>
          <DonateButton />
        </div>
      </section>

      <WhatWeDo />
      <Retreats />
      <Seminars />
      <Adventures />
      <EmailCTA />
    </>
  );
}
