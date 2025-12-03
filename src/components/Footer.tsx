import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const logoUrl = 'https://d64gsuwffb70l.cloudfront.net/690509315465c5cfba0ec767_1764409223589_aa32ba5b.png';

const companyLinks = [
  { label: 'About', href: 'about' },
  { label: 'Solutions', href: 'solutions' },
  { label: 'Platforms', href: 'platforms' },
  { label: 'Case Studies', href: 'cases' },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
          <Link to="/" className="inline-block mb-4">
            <img src={logoUrl} alt="DotGov Technologies - Engineering Digital Government" className="h-10 w-auto" />
          </Link>
          <p className="text-sm text-gray-600">
            Engineering Digital Government through secure, interoperable and AI-powered platforms for public institutions.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-[#003B8E] mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <button onClick={() => handleNavClick(link.href)} className="hover:text-[#00C2D1] transition">
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-[#003B8E] mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Email: contact@dotgov-technologies.example</li>
            <li>LinkedIn: DotGov Technologies</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} DotGov Technologies. All rights reserved.
      </div>
    </footer>
  );
}
