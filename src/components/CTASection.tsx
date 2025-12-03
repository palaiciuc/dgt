import React from 'react';

export default function CTASection() {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-r from-[#003B8E] to-[#00C2D1] py-16">
      <div className="max-w-4xl mx-auto px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to modernise your government services?</h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Get in touch with the DotGov Technologies team to discuss how we can support your digital transformation roadmap and ongoing operations.
        </p>
        <button
          onClick={scrollToContact}
          className="bg-white text-[#003B8E] font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
        >
          Book a consultation
        </button>
      </div>
    </section>
  );
}