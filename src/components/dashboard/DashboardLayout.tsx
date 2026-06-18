import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Heart, LogOut, ChevronDown, Settings, Mail, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { ROLE_COLORS, ROLE_LABELS } from '../../lib/constants';

export default function DashboardLayout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!profile) return;
    loadUnreadCount();

    const channel = supabase
      .channel('messages-unread')
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

  const role = profile?.role;
  const roleBadgeClass = role ? ROLE_COLORS[role] : '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-body">
      <header className="sticky top-0 z-40 bg-card border-b border-input-border">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 h-16 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0 mr-2">
            <Heart className="w-6 h-6 text-sage" />
            <span className="text-base font-bold text-primary hidden sm:block">OSIRIS YOGA THERAPY</span>
          </Link>

          <div className="flex-1" />

          <Link
            to="/dashboard/calendar"
            className="relative shrink-0 w-9 h-9 flex items-center justify-center rounded-sm hover:bg-input transition-colors text-secondary hover:text-primary"
          >
            <Calendar className="w-5 h-5" />
          </Link>

          <Link
            to="/dashboard/messages"
            className="relative shrink-0 w-9 h-9 flex items-center justify-center rounded-sm hover:bg-input transition-colors text-secondary hover:text-primary"
          >
            <Mail className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-warm-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <div className="relative shrink-0">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 hover:bg-input rounded-lg px-2.5 py-1.5 transition-colors"
            >
              <div className="w-8 h-8 bg-sage-light rounded-full flex items-center justify-center shrink-0">
                <span className="text-sage-dark text-sm font-semibold">
                  {profile?.full_name?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-primary leading-tight">
                  {profile?.full_name?.split(' ')[0] || 'User'}
                </span>
                {role && (
                  <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full capitalize leading-none mt-0.5 ${roleBadgeClass}`}>
                    {ROLE_LABELS[profile!.role]}
                  </span>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-secondary" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-card rounded-md shadow-soft border border-input-border py-1 z-50">
                  <div className="px-4 py-2.5 border-b border-input-border">
                    <p className="text-sm font-semibold text-primary">{profile?.full_name}</p>
                    <p className="text-xs text-secondary truncate">{user?.email || ''}</p>
                  </div>
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary hover:bg-input transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  {profile?.roles.includes('admin') && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-warm-coral hover:bg-warm-coral-bg transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Portal
                    </Link>
                  )}
                  {profile?.roles.includes('instructor') && (
                    <Link
                      to="/instructor"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-sage-dark hover:bg-sage-light transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Instructor Portal
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-warm-coral hover:bg-warm-coral-bg w-full transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
