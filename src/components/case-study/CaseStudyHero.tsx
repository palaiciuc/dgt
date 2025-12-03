import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CaseStudy } from '@/data/caseStudiesData';

interface Props {
  caseStudy: CaseStudy;
}

export default function CaseStudyHero({ caseStudy }: Props) {
  return (
    <section className="bg-gradient-to-br from-[#00C2D1] to-[#003B8E] text-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        <Link 
          to="/#cases" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case Studies
        </Link>
        
        <span className="inline-block bg-white/20 text-white text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-4">
          {caseStudy.tag}
        </span>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {caseStudy.title}
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 max-w-3xl">
          {caseStudy.shortDesc}
        </p>
      </div>
    </section>
  );
}
