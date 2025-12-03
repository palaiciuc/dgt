import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Pillars from './Pillars';
import Solutions from './Solutions';
import Platforms from './Platforms';
import AISection from './AISection';
import CaseStudies from './CaseStudies';
import Partners from './Partners';
import CTASection from './CTASection';
import About from './About';
import Contact from './Contact';
import Footer from './Footer';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Header />
      <Hero />
      <Pillars />
      <Solutions />
      <Platforms />
      <AISection />
      <CaseStudies />
      <Partners />
      <CTASection />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}