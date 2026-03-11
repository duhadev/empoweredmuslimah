'use client';

import Image from 'next/image';

export default function Seminars() {
  const scrollToEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    const emailSection = document.getElementById('email-signup');
    if (emailSection) {
      emailSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      requestAnimationFrame(() => {
        emailSection.classList.add('email-cta--highlight');
        setTimeout(() => emailSection.classList.remove('email-cta--highlight'), 3000);
      });
    }
  };

  return (
    <section id="seminars" className="py-24 px-8 bg-highlight">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="mb-4">Career Seminars</h2>
          <p className="text-text-light mb-4">
            Elevate your professional journey through seminars designed to empower Muslim women in the workplace. Our career development programs address the unique challenges and opportunities you face while honoring your values and identity.
          </p>
          <p className="text-text-light mb-4">
            Connect with successful Muslim women professionals, gain practical skills, and build a network of sisters who understand your aspirations. From resume workshops to leadership training, we equip you for success.
          </p>
          <a
            href="#email-signup"
            className="inline-block px-8 py-3.5 font-subheading font-semibold rounded-lg border-2 border-dark text-dark bg-transparent hover:bg-dark hover:text-white transition-colors"
            onClick={scrollToEmail}
          >
            Get Seminar Updates
          </a>
        </div>
        <div className="max-lg:order-first">
          <Image
            src="/assets/images/Seminars.webp"
            alt="Career seminar"
            width={600}
            height={400}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
