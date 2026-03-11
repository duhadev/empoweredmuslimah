'use client';

export default function Retreats() {
  const scrollToEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    const emailSection = document.getElementById('email-signup');
    if (emailSection) {
      emailSection.classList.add('email-cta--highlight');

      const rect = emailSection.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top - (window.innerHeight / 2) + (rect.height / 2);

      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });

      setTimeout(() => {
        emailSection.classList.remove('email-cta--highlight');
      }, 3000);
    }
  };

  return (
    <section id="retreats" className="section section--retreats">
      <div className="section__container section__split">
        <div className="section__image_retreat">
              <img
                src="/assets/images/Retreats.webp"
                alt="A nice mindful garden"
              />
        </div>
        <div className="section__content">
          <h2 className="section__title">Retreats</h2>
          <p className="section__subtitle">Local and National</p>
          <p className="section__text">
            Step away from the noise of everyday life and immerse yourself in transformative retreat experiences designed exclusively for Muslim women. Our retreats blend spiritual nourishment with sisterhood, creating moments of peace and renewal.
          </p>
          <p className="section__text">
            From weekend getaways at local venues to week-long national gatherings, each retreat offers guided reflection, engaging workshops, and the opportunity to forge lasting bonds with like-minded sisters.
          </p>
          <a href="#email-signup" className="btn btn--secondary" onClick={scrollToEmail}>Get Retreat Updates</a>
        </div>
      </div>
    </section>
  );
}
