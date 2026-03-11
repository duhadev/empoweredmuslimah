'use client';

import { useEffect, useState } from 'react';

interface DonationPopupProps {
  onClose: () => void;
}

export default function DonationPopup({ onClose }: DonationPopupProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeHeight, setIframeHeight] = useState(600);

  // Close on Escape key, prevent background scroll, and handle iframe resize messages
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.origin === 'https://donorbox.org' && e.data?.height) {
        setIframeHeight(e.data.height);
      }
    };

    document.addEventListener('keydown', handleEscape);
    window.addEventListener('message', handleMessage);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('message', handleMessage);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="donation-popup-overlay" onClick={handleOverlayClick}>
      <div className="donation-popup">
        <button className="donation-popup__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="donation-popup__title">Support the Mission</h2>
        {isLoading && (
          <div className="donation-popup__loading py-4">Loading...</div>
        )}
        <iframe
          src="https://donorbox.org/embed/empowering-muslim-women-2?default_interval=o&enable_auto_scroll=true"
          name="donorbox"
          style={{
            width: '100%',
            maxWidth: '500px',
            minWidth: '250px',
            height: `${iframeHeight}px`,
            maxHeight: 'calc(90vh - 100px)',
            display: isLoading ? 'none' : 'block',
            border: 'none',
          }}
          allow="payment"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}
