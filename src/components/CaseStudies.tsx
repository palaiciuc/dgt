import React from 'react';
import { Link } from 'react-router-dom';
import { caseStudies } from '@/data/caseStudiesData';
import { ArrowRight } from 'lucide-react';

export default function CaseStudies() {
  return (
    <section id="cases" className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="uppercase tracking-widest text-xs text-gray-500 mb-2">Impact</div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#003B8E] mb-2">Case studies & reference implementations.</h2>
        <p className="text-gray-600 max-w-2xl mb-8">Our team has experience in designing and delivering national-scale platforms in partnership with ministries of finance, ICT authorities and development partners.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {caseStudies.map((c) => (
            <article key={c.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition border-l-4 border-[#00C2D1] flex flex-col">
              <span className="text-xs uppercase tracking-wider text-[#00C2D1] font-medium">{c.tag}</span>
              <h3 className="font-semibold text-[#003B8E] mt-2 mb-2">{c.title}</h3>
              <p className="text-sm text-gray-600 flex-1">{c.shortDesc}</p>
              <Link 
                to={`/case-study/${c.id}`}
                className="mt-4 inline-flex items-center gap-2 text-sm text-[#003B8E] font-medium hover:text-[#00C2D1] transition group"
              >
                Read more 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
