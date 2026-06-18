import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart, LogOut, LayoutDashboard,
  Menu, X, Shield, ChevronRight, GraduationCap, Mail, Users, Home, Calendar, Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function InstructorLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!profile) return;
    loadUnreadCount();

    const channel = supabase
      .channel('instructor-messages-unread')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        loadUnreadCount();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, () => {
        loadUnreadCount();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile]);

  const loadUnreadCount = async () => {
    if (!profile) return;
    const { data: threads } = await supabase
      .from('message_threads')
      .select('id')
      .contains('participant_ids', [profile.id]);

    if (!threads?.length) { setUnreadCount(0); return; }

    let total = 0;
    for (const t of threads) {
      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('thread_id', t.id)
        .not('read_by', 'cs', `{"${profile.id}"}`);
      total += count || 0;
    }
    setUnreadCount(total);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const NAV = [
    { to: '/instructor', label: 'My Programs', icon: LayoutDashboard, exact: true },
    { to: '/instructor/calendar', label: 'Calendar & Bookings', icon: Calendar, exact: true },
    { to: '/instructor/availability', label: 'Availability', icon: Clock, exact: true },
    { to: '/instructor/community', label: 'Community', icon: Users, exact: false },
  ];

  return (
    <div className="min-h-screen bg-amber-950/10 flex" style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fffbeb 100%)' }}>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-amber-200 flex flex-col transform transition-transform duration-200 lg:translate-x-0 shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-amber-100 shrink-0">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary leading-tight">Instructor Portal</p>
            <p className="text-xs text-secondary leading-tight">OSIRIS YOGA THERAPY</p>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-slate-700"
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
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-amber-700' : 'text-slate-400 group-hover:text-slate-700'}`} />
                {label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-amber-600" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-amber-100 p-4 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-amber-700 text-xs font-bold">
                {profile?.full_name?.[0]?.toUpperCase() || 'I'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-primary truncate">{profile?.full_name || 'Instructor'}</p>
              <p className="text-xs text-secondary">Instructor</p>
            </div>
          </div>
          {profile?.roles?.includes('admin') && (
            <Link
              to="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors mb-1"
            >
              <Shield className="w-3.5 h-3.5" /> Admin Portal
            </Link>
          )}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-amber-50 hover:text-slate-700 transition-colors mb-1"
          >
            <Home className="w-3.5 h-3.5" /> Member Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors w-full"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-amber-200 flex items-center px-4 lg:px-8 gap-4 sticky top-0 z-30 shadow-sm">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-800"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-sage-600" />
            <span className="text-sm font-semibold text-primary hidden sm:block">OSIRIS YOGA THERAPY</span>
          </div>
          <div className="flex-1" />
          <Link
            to="/instructor/messages"
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-amber-50 transition-colors text-slate-500 hover:text-slate-700"
          >
            <Mail className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-200">
            Instructor Mode
          </span>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
