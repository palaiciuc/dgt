import React from 'react';
import { Server, Network, Brain, Shield } from 'lucide-react';

const pillars = [
  { icon: Server, title: 'Digital Government Platforms', desc: 'End-to-end platforms for portals, back-office and integration with legacy systems.' },
  { icon: Network, title: 'Interoperability & GSB', desc: 'Secure data exchange between ministries, agencies and national registers.' },
  { icon: Brain, title: 'AI & Data', desc: 'AI-assisted decision making, analytics and automation for public sector processes.' },
  { icon: Shield, title: 'Security & Compliance', desc: 'Architectures aligned with international security and data protection standards.' },
];

export default function Pillars() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="uppercase tracking-widest text-xs text-gray-500 mb-2">Our Foundation</div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#003B8E] mb-2">Core pillars of DotGov Technologies.</h2>
      <p className="text-gray-600 max-w-2xl mb-8">
        We design and operate digital government platforms that are secure, interoperable and driven by data, helping institutions modernise their services at national scale.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((p, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <p.icon className="w-8 h-8 text-[#00C2D1] mb-3" />
            <h3 className="font-semibold text-[#003B8E] mb-2">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}