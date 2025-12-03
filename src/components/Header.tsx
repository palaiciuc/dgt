import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const logoUrl = 'https://d64gsuwffb70l.cloudfront.net/690509315465c5cfba0ec767_1764409223589_aa32ba5b.png';

const navLinks = [
  { href: 'solutions', label: 'Solutions' },
  { href: 'platforms', label: 'Platforms' },
  { href: 'ai', label: 'AI for Government' },
  { href: 'cases', label: 'Case Studies' },
  { href: 'about', label: 'About' },
  { href: 'contact', label: 'Contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logoUrl} alt="DotGov Technologies - Engineering Digital Government" className="h-24 md:h-28 w-auto" />
        </Link>

        <nav className="hidden md:flex gap-5 text-sm">
          {navLinks.map((link) => (
            <button key={link.href} onClick={() => handleNavClick(link.href)} className="text-gray-700 hover:text-[#00C2D1] transition-colors">
              {link.label}
            </button>
          ))}
        </nav>
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <button key={link.href} onClick={() => handleNavClick(link.href)} className="block w-full text-left text-gray-700 hover:text-[#00C2D1]">
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
