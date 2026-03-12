'use client';

import { useDonation } from '@/contexts/DonationContext';

export default function DonateButton() {
  const { openDonationPopup } = useDonation();

  return (
    <a
      href="#"
      className="inline-block px-10 py-[1.125rem] font-subheading text-lg font-semibold rounded-lg transition-colors bg-primary text-white hover:bg-dark"
      onClick={(e) => { e.preventDefault(); openDonationPopup(); }}
    >
      Donate To Our Cause
    </a>
  );
}
