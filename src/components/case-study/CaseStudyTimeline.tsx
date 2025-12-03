import React from 'react';
import { CaseStudy } from '@/data/caseStudiesData';
import { Clock } from 'lucide-react';

interface Props {
  caseStudy: CaseStudy;
}

export default function CaseStudyTimeline({ caseStudy }: Props) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#003B8E]/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#003B8E]" />
          </div>
          <h2 className="text-xl font-bold text-[#003B8E]">Implementation Timeline</h2>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00C2D1] to-[#003B8E]" />
          
          <div className="space-y-8">
            {caseStudy.timeline.map((item, i) => (
              <div key={i} className={`relative flex items-start gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-[#00C2D1] border-4 border-white shadow -translate-x-1/2 mt-1.5 z-10" />
                
                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                    <span className="inline-block bg-[#00C2D1]/20 text-[#00C2D1] text-xs font-semibold px-2 py-1 rounded mb-2">
                      {item.duration}
                    </span>
                    <h3 className="font-semibold text-[#003B8E] mb-1">{item.phase}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
