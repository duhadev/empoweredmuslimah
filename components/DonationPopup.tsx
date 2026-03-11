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
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] p-8 max-sm:p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-lg max-w-[500px] w-full max-h-[90vh] max-sm:max-h-[85vh] overflow-y-auto shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-8">
        <button
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border-0 bg-primary text-white rounded-full text-2xl leading-none cursor-pointer hover:bg-dark transition-colors z-10"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="font-heading text-center mb-8 text-dark">Support the Mission</h2>
        {isLoading && (
          <div className="flex items-center justify-center min-h-[300px] p-16 text-center text-text-light font-subheading">
            Loading...
          </div>
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
