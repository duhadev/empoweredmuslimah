'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
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
      <nav className="nav">
        <div className="nav__container">
          <a href="/" className="nav__logo">
            <img
              src="/assets/images/Text-logo.png"
              alt="EMMA Foundation"
              className="nav__logo-img"
            />
          </a>

          <button
            className={`nav__toggle ${mobileMenuOpen ? 'active' : ''}`}
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav__links ${mobileMenuOpen ? 'active' : ''}`}>
            <li><a href="#retreats" onClick={closeMobileMenu}>Retreats</a></li>
            <li><a href="#seminars" onClick={closeMobileMenu}>Seminars</a></li>
            <li><a href="#adventures" onClick={closeMobileMenu}>Adventures</a></li>
            <li>
              <a
                href="#"
                className="btn btn--primary nav__donate"
                onClick={(e) => { closeMobileMenu(); handleDonateClick(e); }}
              >
                Donate
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

    // Validate phone has 10 digits
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

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__main">
          <div className="footer__brand">
            <div className="footer__logo-container">
              <img
                src="/assets/images/Text-logo.png"
                alt="EMMA Foundation"
                className="footer__logo-img"
              />
            </div>
            <p className="footer__tagline">Empowering Muslim women through community and faith.</p>
          </div>

          <nav className="footer__nav">
            <h3 className="footer__nav-title">Quick Links</h3>
            <ul className="footer__links">
              <li><a href="#retreats">Retreats</a></li>
              <li><a href="#seminars">Seminars</a></li>
              <li><a href="#adventures">Adventures</a></li>
              <li><a href="#" onClick={onDonateClick}>Donate</a></li>
            </ul>
          </nav>

          <div className="footer__connect">
            <h3 className="footer__nav-title">Connect With Us</h3>
            <div className="footer__social">
              <a
                href={CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            <form className="footer__subscribe" onSubmit={handleSubmit}>
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
                className="form-input form-input--small"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Your email"
                required
                className="form-input form-input--small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="(555) 555-5555"
                required
                className="form-input form-input--small"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={14}
              />
              <button type="submit" className="btn btn--small btn--primary" disabled={isSubmitting}>
                {isSubmitting ? '...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} EMMA Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
