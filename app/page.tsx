'use client';

import WhatWeDo from '@/components/WhatWeDo';
import Retreats from '@/components/Retreats';
import Seminars from '@/components/Seminars';
import Adventures from '@/components/Adventures';
import EmailCTA from '@/components/EmailCTA';
import { useDonation } from '@/contexts/DonationContext';

export default function Home() {
  const { openDonationPopup } = useDonation();

  const handleDonateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openDonationPopup();
  };

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero__background">
              <img
                src="/assets/images/Banner.webp"
                alt="Flowers"
              />
        </div>
        <div className="hero__content">
          <h1 className="hero__title">Empowering Muslim Women</h1>
          <p className="hero__subtitle">
            Building community, nurturing faith, and creating spaces where Muslim women can thrive together.
          </p>
          <a href="#" className="btn btn--primary btn--large" onClick={handleDonateClick}>
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
