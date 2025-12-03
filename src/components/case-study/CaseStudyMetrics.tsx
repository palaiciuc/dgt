import React from 'react';
import { CaseStudy } from '@/data/caseStudiesData';
import { TrendingUp, Quote } from 'lucide-react';

interface Props {
  caseStudy: CaseStudy;
}

export default function CaseStudyMetrics({ caseStudy }: Props) {
  return (
    <section className="py-12 bg-[#003B8E]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Metrics */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Key Results & Metrics</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {caseStudy.metrics.map((metric, i) => (
            <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-5 text-center border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-[#00C2D1] mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-white/80">{metric.label}</div>
            </div>
          ))}
        </div>
        
        {/* Testimonial */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
          <Quote className="w-10 h-10 text-[#00C2D1] mb-4" />
          <blockquote className="text-lg md:text-xl text-white mb-6 leading-relaxed">
            "{caseStudy.testimonial.quote}"
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00C2D1] to-[#003B8E] flex items-center justify-center text-white font-bold">
              {caseStudy.testimonial.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-semibold text-white">{caseStudy.testimonial.author}</div>
              <div className="text-sm text-white/70">{caseStudy.testimonial.role}</div>
              <div className="text-sm text-[#00C2D1]">{caseStudy.testimonial.org}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
