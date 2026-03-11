'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface DonationPopupProps {
  onClose: () => void;
}

export default function DonationPopup({ onClose }: DonationPopupProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <>
      <Script
        src="https://donorbox.org/widgets.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="donation-popup-overlay" onClick={onClose}>
        <div className="donation-popup" onClick={(e) => e.stopPropagation()}>
          <button className="donation-popup__close" onClick={onClose} aria-label="Close">
            ×
          </button>
          {scriptLoaded ? (
            <dbox-widget
              campaign="empowering-muslim-women-2"
              type="donation_form"
              enable-auto-scroll="true"
            />
          ) : (
            <div className="donation-popup__loading">Loading...</div>
          )}
        </div>
      </div>
    </>
  );
}
