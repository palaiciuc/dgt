import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, FileText, MessageSquare, BarChart3, LogOut, Home, Shield,
  Lightbulb, Layers, Brain, Info, Settings, Image
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/case-studies', icon: FileText, label: 'Case Studies' },
    { to: '/admin/solutions', icon: Lightbulb, label: 'Solutions' },
    { to: '/admin/platforms', icon: Layers, label: 'Platforms' },
    { to: '/admin/ai-features', icon: Brain, label: 'AI Features' },
    { to: '/admin/about', icon: Info, label: 'About Values' },
    { to: '/admin/media', icon: Image, label: 'Media Library' },
    { to: '/admin/submissions', icon: MessageSquare, label: 'Submissions' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/admin/settings', icon: Settings, label: 'Site Settings' },
  ];


  return (
    <aside className="w-64 bg-gradient-to-b from-[#003B8E] to-[#002d6e] min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#00C2D1]" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">DotGov Admin</h1>
            <p className="text-white/60 text-xs">Management Portal</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-white/60 text-xs">Logged in as</p>
          <p className="text-white font-medium text-sm truncate">{user.email}</p>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-[#00C2D1] text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition">
          <Home className="w-5 h-5" />View Website
        </a>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-300 transition">
          <LogOut className="w-5 h-5" />Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
