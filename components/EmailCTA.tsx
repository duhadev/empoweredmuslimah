'use client';

import { useState, FormEvent } from 'react';

export default function EmailCTA() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
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
          Join our community and be the first to know about upcoming retreats, meetups, and gatherings.
        </p>

        <form className="email-cta__form" onSubmit={handleSubmit}>
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
                placeholder="Your phone number (optional)"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
