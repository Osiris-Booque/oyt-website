import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut, LayoutDashboard, Users, BookOpen,
  BarChart2, Menu, X, Shield, ChevronRight, GraduationCap, Home, Mail, MessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/admin/programs', label: 'Programs', icon: BookOpen },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/activity', label: 'Activity', icon: BarChart2 },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/community', label: 'Community', icon: MessageSquare },
];

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 shrink-0">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Admin Portal</p>
            <p className="text-xs text-slate-400 leading-tight">OSIRIS YOGA THERAPY</p>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                  active
                    ? 'bg-rose-600/20 text-rose-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-rose-400' : 'text-slate-500 group-hover:text-white'}`} />
                {label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-rose-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-rose-600/20 rounded-full flex items-center justify-center shrink-0">
              <span className="text-rose-400 text-xs font-bold">
                {profile?.full_name?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'Admin'}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          {profile?.roles?.includes('instructor') && (
            <Link
              to="/instructor"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-amber-400 hover:bg-amber-900/30 hover:text-amber-300 transition-colors mb-1"
            >
              <GraduationCap className="w-3.5 h-3.5" /> Instructor Portal
            </Link>
          )}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors mb-1"
          >
            <Home className="w-3.5 h-3.5" /> Member Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-4 lg:px-8 gap-4 sticky top-0 z-30">
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <span className="text-xs font-semibold px-2.5 py-1 bg-rose-600/20 text-rose-400 rounded-full border border-rose-600/30">
            Admin Mode
          </span>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
