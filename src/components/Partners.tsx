import React from 'react';
import { CheckCircle } from 'lucide-react';

const partners = ['Ministries of Finance & ICT', 'Regulatory Authorities', 'Central Banks', 'Development Partners', 'Local System Integrators'];
const securityFeatures = [
  'OWASP-aligned secure development practices',
  'Role-based access control and audit trails',
  'Encryption in transit and at rest',
  'Segregated environments and backup policies',
  'Continuous monitoring and incident response procedures',
];

export default function Partners() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="uppercase tracking-widest text-xs text-gray-500 mb-2">Trust</div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#003B8E] mb-2">Partners & security posture.</h2>
      <p className="text-gray-600 max-w-2xl mb-6">DotGov Technologies works alongside government institutions, regulators and international partners to ensure that each platform is secure, compliant and sustainable over time.</p>
      <div className="flex flex-wrap gap-3 mb-8">
        {partners.map((p, i) => (
          <span key={i} className="bg-[#e3f6f8] text-[#003B8E] px-4 py-2 rounded-full text-sm">{p}</span>
        ))}
      </div>
      <div className="bg-[#003B8E] text-white rounded-2xl p-8 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-3">Security by design.</h3>
          <p className="text-sm opacity-90">Each platform is engineered with security and data protection as core requirements, not afterthoughts. We align with international standards and follow a defence-in-depth approach across infrastructure, applications and operations.</p>
        </div>
        <ul className="space-y-2">
          {securityFeatures.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle className="w-5 h-5 text-[#00C2D1] flex-shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}