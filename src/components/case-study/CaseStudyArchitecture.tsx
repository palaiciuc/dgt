import React from 'react';
import { CaseStudy } from '@/data/caseStudiesData';
import { Layers } from 'lucide-react';

interface Props {
  caseStudy: CaseStudy;
}

export default function CaseStudyArchitecture({ caseStudy }: Props) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#003B8E]/10 flex items-center justify-center">
            <Layers className="w-5 h-5 text-[#003B8E]" />
          </div>
          <h2 className="text-xl font-bold text-[#003B8E]">Solution Architecture</h2>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img 
            src={caseStudy.architectureImage} 
            alt={`${caseStudy.title} architecture diagram`}
            className="w-full h-auto object-cover"
          />
          <div className="p-6 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              The architecture diagram above illustrates the key components and data flows 
              implemented in this solution. The design follows government interoperability 
              standards and security best practices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
