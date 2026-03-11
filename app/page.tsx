'use client';

import WhatWeDo from '@/components/WhatWeDo';
import Retreats from '@/components/Retreats';
import Seminars from '@/components/Seminars';
import Adventures from '@/components/Adventures';
import EmailCTA from '@/components/EmailCTA';

const CONFIG = {
  donationUrl: 'https://example.com/donate',
};

export default function Home() {
  const goToDonate = (e: React.MouseEvent) => {
    e.preventDefault();
    if (CONFIG.donationUrl) {
      window.open(CONFIG.donationUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('Donation link coming soon. Please check back later.');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero__background">
          <div className="placeholder-image placeholder-image--hero">
            <span>Hero Background Image</span>
          </div>
        </div>
        <div className="hero__content">
          <h1 className="hero__title">Empowering Muslim Women</h1>
          <p className="hero__subtitle">
            Building community, nurturing faith, and creating spaces where Muslim women can thrive together.
          </p>
          <a href="#" className="btn btn--primary btn--large" onClick={goToDonate}>
            Support Our Mission
          </a>
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
