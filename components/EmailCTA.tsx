'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

// Format phone number as (XXX) XXX-XXXX
function formatPhoneNumber(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Limit to 10 digits
  const limited = digits.substring(0, 10);

  // Format based on length
  if (limited.length === 0) return '';
  if (limited.length <= 3) return `(${limited}`;
  if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
}

export default function EmailCTA() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot trap
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    // Validate phone has 10 digits
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setMessage('Please enter a valid 10-digit phone number.');
      setMessageType('error');
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
        setMessage('JazakAllahu Khairan! You have been subscribed.');
        setMessageType('success');
        setName('');
        setEmail('');
        setPhone('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
        setMessageType('error');
      }
    } catch {
      setMessage('Unable to connect. Please try again later.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  return (
    <section id="email-signup" className="email-cta">
      <div className="email-cta__container">
        <h2 className="email-cta__title">Stay Updated on Our Events</h2>
        <p className="email-cta__subtitle">
          Join our community and be the first to know about upcoming retreats, events, and adventures.
        </p>

        <form className="email-cta__form" onSubmit={handleSubmit}>
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
          <div className="email-cta__fields">
            <div className="form-group">
              <input
                type="text"
                placeholder="Your name"
                required
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                placeholder="(555) 555-5555"
                required
                className="form-input"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={14}
              />
            </div>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          {message && (
            <p className={`email-cta__message ${messageType}`}>{message}</p>
          )}
        </form>
      </div>
    </section>
  );
}
