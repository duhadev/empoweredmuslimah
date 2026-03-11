'use client';

import Image from 'next/image';

export default function Retreats() {
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
    <section id="retreats" className="py-24 px-8 bg-white">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="max-lg:order-first">
          <Image
            src="/assets/images/Retreats.webp"
            alt="A nice mindful garden"
            width={600}
            height={400}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="w-full h-auto"
          />
        </div>
        <div>
          <h2 className="mb-4">Retreats</h2>
          <p className="font-subheading text-[1.1rem] font-semibold text-primary mb-4 uppercase tracking-[0.05em]">Local and National</p>
          <p className="text-text-light mb-4">
            Step away from the noise of everyday life and immerse yourself in transformative retreat experiences designed exclusively for Muslim women. Our retreats blend spiritual nourishment with sisterhood, creating moments of peace and renewal.
          </p>
          <p className="text-text-light mb-4">
            From weekend getaways at local venues to week-long national gatherings, each retreat offers guided reflection, engaging workshops, and the opportunity to forge lasting bonds with like-minded sisters.
          </p>
          <a
            href="#email-signup"
            className="inline-block px-8 py-3.5 font-subheading font-semibold rounded-lg border-2 border-dark text-dark bg-transparent hover:bg-dark hover:text-white transition-colors"
            onClick={scrollToEmail}
          >
            Get Retreat Updates
          </a>
        </div>
      </div>
    </section>
  );
}
