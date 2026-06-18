import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, TrendingUp, Activity, ArrowRight, CheckSquare, Pen, Map } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Stats {
  totalUsers: number;
  totalPrograms: number;
  totalEnrollments: number;
  activeEnrollments: number;
  totalJournalResponses: number;
  totalTaskCompletions: number;
  recentSignups: { id: string; full_name: string; role: string; created_at: string }[];
  recentEnrollments: { id: string; user_name: string; program_title: string; enrolled_at: string }[];
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    const [usersRes, programsRes, enrollmentsRes, journalRes, tasksRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name, role, created_at').order('created_at', { ascending: false }),
      supabase.from('programs').select('id').eq('is_published', true),
      supabase.from('enrollments').select('id, user_id, program_id, enrolled_at, status, profiles:user_id(full_name), programs:program_id(title)'),
      supabase.from('user_journal_responses').select('id', { count: 'exact', head: true }),
      supabase.from('user_task_completions').select('id', { count: 'exact', head: true }),
    ]);

    const users = usersRes.data || [];
    const enrollments = enrollmentsRes.data || [];

    const recentSignups = users.slice(0, 5).map((u) => ({
      id: u.id,
      full_name: u.full_name,
      role: u.role,
      created_at: u.created_at,
    }));

    const recentEnrollments = enrollments
      .sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime())
      .slice(0, 5)
      .map((e) => ({
        id: e.id,
        user_name: (e.profiles as unknown as { full_name: string })?.full_name || 'Unknown',
        program_title: (e.programs as unknown as { title: string })?.title || 'Unknown',
        enrolled_at: e.enrolled_at,
      }));

    setStats({
      totalUsers: users.length,
      totalPrograms: programsRes.data?.length || 0,
      totalEnrollments: enrollments.length,
      activeEnrollments: enrollments.filter((e) => e.status === 'active').length,
      totalJournalResponses: journalRes.count || 0,
      totalTaskCompletions: tasksRes.count || 0,
      recentSignups,
      recentEnrollments,
    });
    setLoading(false);
  };

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!stats) return null;

  const STAT_CARDS = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-sky-500/10 text-sky-400', border: 'border-sky-500/20' },
    { label: 'Published Programs', value: stats.totalPrograms, icon: BookOpen, color: 'bg-sage-500/10 text-sage-400', border: 'border-sage-500/20' },
    { label: 'Active Enrollments', value: stats.activeEnrollments, icon: TrendingUp, color: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/20' },
    { label: 'Journal Responses', value: stats.totalJournalResponses, icon: Pen, color: 'bg-rose-500/10 text-rose-400', border: 'border-rose-500/20' },
    { label: 'Task Completions', value: stats.totalTaskCompletions, icon: CheckSquare, color: 'bg-sage-500/10 text-sage-400', border: 'border-sage-500/20' },
    { label: 'Total Enrollments', value: stats.totalEnrollments, icon: Activity, color: 'bg-violet-500/10 text-violet-400', border: 'border-violet-500/20' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-slate-400 mt-1 text-sm">Real-time snapshot of all platform activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`bg-slate-900 rounded-xl border ${border} p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{value.toLocaleString()}</div>
              <div className="text-slate-400 text-xs mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white">Recent Sign-ups</h2>
            <Link to="/admin/users" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-800">
            {stats.recentSignups.length === 0 ? (
              <p className="text-slate-500 text-sm px-5 py-6">No users yet.</p>
            ) : stats.recentSignups.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-slate-300 text-xs font-semibold">{u.full_name?.[0]?.toUpperCase() || '?'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{u.full_name}</p>
                  <p className="text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                  u.role === 'admin' ? 'bg-rose-500/20 text-rose-400' :
                  u.role === 'guru' ? 'bg-sage-500/20 text-sage-400' :
                  u.role === 'instructor' ? 'bg-amber-500/20 text-amber-400' :
                  u.role === 'student' ? 'bg-sky-500/20 text-sky-400' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white">Recent Enrollments</h2>
            <Link to="/admin/activity" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-800">
            {stats.recentEnrollments.length === 0 ? (
              <p className="text-slate-500 text-sm px-5 py-6">No enrollments yet.</p>
            ) : stats.recentEnrollments.map((e) => (
              <div key={e.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 bg-sage-500/10 rounded-full flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5 text-sage-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{e.user_name}</p>
                  <p className="text-xs text-slate-500 truncate">{e.program_title}</p>
                </div>
                <p className="text-xs text-slate-500 shrink-0">
                  {new Date(e.enrolled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        to="/sitemap"
        className="mt-6 flex items-center gap-3 bg-slate-900 rounded-xl border border-slate-800 px-5 py-4 hover:border-slate-600 transition-colors group"
      >
        <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
          <Map className="w-4 h-4 text-teal-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">Site Map</p>
          <p className="text-xs text-slate-500">Pages, navigation flows, and CTAs</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
      </Link>
    </div>
  );
}
