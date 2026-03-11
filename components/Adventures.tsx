'use client';

export default function Adventures() {
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
    <section id="adventures" className="section section--adventures">
      <div className="section__container section__split">
        <div className="section__image">
          <img
                src="/assets/images/Adventures.webp"
                alt="Stroll in a garden"
              />
        </div>
        <div className="section__content">
          <h2 className="section__title">Adventures</h2>
          <p className="section__text">
            Discover the beauty of creation while building friendships that last a lifetime. Our outdoor adventures invite Muslim women to explore nature together in a comfortable, supportive environment.
          </p>
          <p className="section__text">
            Whether it&apos;s hiking scenic trails, kayaking peaceful waters, or camping under the stars, each adventure combines physical activity with spiritual reflection and meaningful connection with your sisters.
          </p>
          <a href="#email-signup" className="btn btn--secondary" onClick={scrollToEmail}>Get Adventure Updates</a>
        </div>
      </div>
    </section>
  );
}
