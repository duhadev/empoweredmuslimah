'use client';

export default function Seminars() {
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
    <section id="seminars" className="section section--seminars">
      <div className="section__container section__split">
        <div className="section__content">
          <h2 className="section__title">Career Seminars</h2>
          <p className="section__text">
            Elevate your professional journey through seminars designed to empower Muslim women in the workplace. Our career development programs address the unique challenges and opportunities you face while honoring your values and identity.
          </p>
          <p className="section__text">
            Connect with successful Muslim women professionals, gain practical skills, and build a network of sisters who understand your aspirations. From resume workshops to leadership training, we equip you for success.
          </p>
          <a href="#email-signup" className="btn btn--secondary" onClick={scrollToEmail}>Get Seminar Updates</a>
        </div>
        <div className="section__image">
          <div className="placeholder-image">
            <span>Career Seminars Image</span>
          </div>
        </div>
      </div>
    </section>
  );
}
