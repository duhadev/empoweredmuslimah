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
    <section id="adventures" className="py-24 px-8 bg-bg">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="max-lg:order-first">
          <img
            src="/assets/images/Adventures.webp"
            alt="Stroll in a garden"
            className="w-full h-auto"
          />
        </div>
        <div>
          <h2 className="mb-4">Adventures</h2>
          <p className="text-text-light mb-4">
            Discover the beauty of creation while building friendships that last a lifetime. Our outdoor adventures invite Muslim women to explore nature together in a comfortable, supportive environment.
          </p>
          <p className="text-text-light mb-4">
            Whether it&apos;s hiking scenic trails, kayaking peaceful waters, or camping under the stars, each adventure combines physical activity with spiritual reflection and meaningful connection with your sisters.
          </p>
          <a
            href="#email-signup"
            className="inline-block px-8 py-3.5 font-subheading font-semibold rounded-lg border-2 border-dark text-dark bg-transparent hover:bg-dark hover:text-white transition-all"
            onClick={scrollToEmail}
          >
            Get Adventure Updates
          </a>
        </div>
      </div>
    </section>
  );
}
