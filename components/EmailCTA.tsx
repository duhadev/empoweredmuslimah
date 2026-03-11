'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

// Format phone number as (XXX) XXX-XXXX
function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  const limited = digits.substring(0, 10);

  if (limited.length === 0) return '';
  if (limited.length <= 3) return `(${limited}`;
  if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
}

const inputClass = 'w-full px-4 py-3.5 font-body text-base text-text bg-white border border-highlight rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20 placeholder:text-text-light';

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
    <section id="email-signup" className="py-24 px-8 text-center bg-contrast">
      <div className="max-w-[600px] mx-auto">
        <h2 className="text-white mb-2">Stay Updated on Our Events</h2>
        <p className="text-white/90 mb-8">
          Join our community and be the first to know about upcoming retreats, events, and adventures.
        </p>

        <form onSubmit={handleSubmit}>
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
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Your name"
                required
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <input
                type="email"
                placeholder="Your email address"
                required
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <input
                type="tel"
                placeholder="(555) 555-5555"
                required
                className={inputClass}
                value={phone}
                onChange={handlePhoneChange}
                maxLength={14}
              />
            </div>
            <button
              type="submit"
              className="inline-block px-10 py-[1.125rem] font-subheading text-lg font-semibold rounded-lg transition-colors bg-primary text-white hover:bg-dark disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          {message && (
            <p className={`mt-4 text-sm ${messageType === 'success' ? 'text-[#90EE90]' : messageType === 'error' ? 'text-[#FFB6C1]' : 'text-white'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
