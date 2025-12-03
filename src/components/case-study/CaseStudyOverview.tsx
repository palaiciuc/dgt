import React from 'react';
import { CaseStudy } from '@/data/caseStudiesData';
import { FileText, AlertTriangle } from 'lucide-react';

interface Props {
  caseStudy: CaseStudy;
}

export default function CaseStudyOverview({ caseStudy }: Props) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Overview */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#003B8E]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#003B8E]" />
              </div>
              <h2 className="text-xl font-bold text-[#003B8E]">Project Overview</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {caseStudy.overview}
            </p>
          </div>
          
          {/* Challenges */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-[#003B8E]">Challenges Addressed</h2>
            </div>
            <ul className="space-y-3">
              {caseStudy.challenges.map((challenge, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#00C2D1]/20 text-[#00C2D1] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-600 text-sm">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
