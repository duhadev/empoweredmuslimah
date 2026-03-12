'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { DonationProvider, useDonation } from '@/contexts/DonationContext';

const CONFIG = {
  instagram: 'https://www.instagram.com/emma.foundation/',
};

// Format phone number as (XXX) XXX-XXXX
function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  const limited = digits.substring(0, 10);

  if (limited.length === 0) return '';
  if (limited.length <= 3) return `(${limited}`;
  if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DonationProvider>
      <LayoutContent>{children}</LayoutContent>
    </DonationProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openDonationPopup } = useDonation();

  const handleDonateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openDonationPopup();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto px-8 py-4">
          <a href="/" className="flex items-center">
            <div className="h-12 overflow-hidden flex items-center">
              <Image
                src="/assets/images/Text-logo.png"
                alt="EMMA Foundation"
                width={192}
                height={192}
                className="h-48 w-auto"
              />
            </div>
          </a>

          <button
            className="flex flex-col justify-between w-[30px] h-[21px] bg-transparent border-0 cursor-pointer md:hidden"
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="block w-full h-[3px] bg-dark rounded-sm transition-colors"></span>
            <span className="block w-full h-[3px] bg-dark rounded-sm transition-colors"></span>
            <span className="block w-full h-[3px] bg-dark rounded-sm transition-colors"></span>
          </button>

          <ul className={`flex list-none items-center max-md:flex-col max-md:fixed max-md:top-[70px] max-md:inset-x-0 max-md:bg-white max-md:px-8 max-md:py-8 max-md:gap-4 max-md:shadow-[0_4px_10px_rgba(0,0,0,0.1)] max-md:transition-all max-md:duration-300 md:gap-8 ${mobileMenuOpen ? 'max-md:translate-y-0 max-md:opacity-100 max-md:visible' : 'max-md:-translate-y-full max-md:opacity-0 max-md:invisible'}`}>
            <li><a href="#retreats" className="font-subheading text-text hover:text-primary transition-colors" onClick={closeMobileMenu}>Retreats</a></li>
            <li><a href="#seminars" className="font-subheading text-text hover:text-primary transition-colors" onClick={closeMobileMenu}>Seminars</a></li>
            <li><a href="#adventures" className="font-subheading text-text hover:text-primary transition-colors" onClick={closeMobileMenu}>Adventures</a></li>
            <li>
              <a
                href="#"
                className="ml-4 max-md:ml-0 max-md:w-full max-md:text-center inline-block px-8 py-3.5 bg-primary text-white rounded-lg font-subheading font-semibold hover:bg-dark transition-colors"
                onClick={(e) => { closeMobileMenu(); handleDonateClick(e); }}
              >
                Donate Now
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Page Content */}
      {children}

      {/* Footer */}
      <Footer onDonateClick={handleDonateClick} />
    </>
  );
}

function Footer({ onDonateClick }: { onDonateClick: (e: React.MouseEvent) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot trap
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, honeypot }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('JazakAllahu Khairan! You have been subscribed.');
        setName('');
        setEmail('');
        setPhone('');
      } else {
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Unable to connect. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerInputClass = 'w-full px-3 py-2 text-sm font-body text-text bg-white border border-highlight rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-text-light';

  return (
    <footer className="bg-dark text-white py-16 px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr] gap-16 mb-16">
          <div className="max-w-[300px] md:col-span-2 lg:max-w-none lg:col-span-1">
            <div className="h-16 overflow-hidden flex items-center justify-start">
              <Image
                src="/assets/images/Text-logo.png"
                alt="EMMA Foundation"
                width={224}
                height={224}
                className="h-56 w-auto brightness-0 invert -ml-12"
              />
            </div>
            <p className="mt-4 text-white/80 text-sm">Empowering Muslim women through community and faith.</p>
          </div>

          <nav>
            <h3 className="font-subheading text-base font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="list-none">
              <li className="mb-2"><a href="#retreats" className="text-white/80 text-sm hover:text-primary transition-colors">Retreats</a></li>
              <li className="mb-2"><a href="#seminars" className="text-white/80 text-sm hover:text-primary transition-colors">Seminars</a></li>
              <li className="mb-2"><a href="#adventures" className="text-white/80 text-sm hover:text-primary transition-colors">Adventures</a></li>
              <li className="mb-2"><a href="#" className="text-white/80 text-sm hover:text-primary transition-colors" onClick={onDonateClick}>Donate</a></li>
            </ul>
          </nav>

          <div>
            <h3 className="font-subheading text-base font-semibold mb-4 text-white">Connect With Us</h3>
            <div className="flex gap-4 mb-8">
              <a
                href={CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full text-white hover:bg-primary transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
              {/* Honeypot field - hidden from users, catches bots */}
              <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
              <input
                type="text"
                placeholder="Your name"
                required
                className={footerInputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Your email"
                required
                className={footerInputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="(555) 555-5555"
                required
                className={footerInputClass}
                value={phone}
                onChange={handlePhoneChange}
                maxLength={14}
              />
              <button
                type="submit"
                className="inline-block px-4 py-2 text-sm font-subheading font-semibold rounded-lg bg-primary text-white hover:bg-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? '...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/60 m-0">&copy; {new Date().getFullYear()} EMMA Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
