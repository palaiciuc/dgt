import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { caseStudies } from '@/data/caseStudiesData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CaseStudyHero from '@/components/case-study/CaseStudyHero';
import CaseStudyOverview from '@/components/case-study/CaseStudyOverview';
import CaseStudyArchitecture from '@/components/case-study/CaseStudyArchitecture';
import CaseStudyTimeline from '@/components/case-study/CaseStudyTimeline';
import CaseStudyMetrics from '@/components/case-study/CaseStudyMetrics';
import { ArrowRight } from 'lucide-react';

export default function CaseStudyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseStudy = caseStudies.find(c => c.id === id);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  if (!caseStudy) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#003B8E] mb-4">Case Study Not Found</h1>
            <Link to="/#cases" className="text-[#00C2D1] hover:underline">
              Back to Case Studies
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const currentIndex = caseStudies.findIndex(c => c.id === id);
  const nextCase = caseStudies[(currentIndex + 1) % caseStudies.length];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CaseStudyHero caseStudy={caseStudy} />
        <CaseStudyOverview caseStudy={caseStudy} />
        <CaseStudyArchitecture caseStudy={caseStudy} />
        <CaseStudyTimeline caseStudy={caseStudy} />
        <CaseStudyMetrics caseStudy={caseStudy} />
        
        {/* Next Case Study CTA */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Next Case Study</p>
            <h3 className="text-2xl font-bold text-[#003B8E] mb-4">{nextCase.title}</h3>
            <Link
              to={`/case-study/${nextCase.id}`}
              className="inline-flex items-center gap-2 bg-[#003B8E] text-white px-6 py-3 rounded-full font-medium hover:bg-[#002d6e] transition"
            >
              Read Case Study <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
