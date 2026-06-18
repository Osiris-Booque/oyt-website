import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, ChevronRight, Clock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty_level: string;
  is_published: boolean;
  cover_image_url: string | null;
  required_role: string;
  created_at: string;
  enrollment_count: number;
  milestone_count: number;
  next_class: string | null;
  next_class_time: string | null;
}

export default function InstructorHome() {
  const { profile } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) loadPrograms();
  }, [profile]);

  const loadPrograms = async () => {
    const { data } = await supabase
      .from('programs')
      .select('id, title, slug, description, category, difficulty_level, is_published, cover_image_url, required_role, created_at')
      .eq('instructor_id', profile!.id)
      .order('created_at', { ascending: false });

    if (!data) { setLoading(false); return; }

    const enriched: Program[] = await Promise.all(
      data.map(async (p) => {
        const [enrollRes, milestoneRes, nextClassRes] = await Promise.all([
          supabase.from('enrollments').select('id', { count: 'exact', head: true }).eq('program_id', p.id),
          supabase.from('program_milestones').select('class_number').eq('program_id', p.id),
          supabase
            .from('program_milestones')
            .select('class_date, class_time, class_number')
            .eq('program_id', p.id)
            .gte('class_date', new Date().toISOString().split('T')[0])
            .order('class_date', { ascending: true })
            .order('class_time', { ascending: true })
            .limit(1),
        ]);
        const classCount = new Set((milestoneRes.data || []).map((m: { class_number: number }) => m.class_number)).size;
        const next = nextClassRes.data?.[0];
        return {
          ...p,
          enrollment_count: enrollRes.count || 0,
          milestone_count: classCount,
          next_class: next?.class_date || null,
          next_class_time: next?.class_time || null,
        };
      })
    );

    setPrograms(enriched);
    setLoading(false);
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="mb-8">
        <p className="text-amber-700 text-sm font-medium mb-1">{today}</p>
        <h1 className="text-2xl font-bold text-slate-900">
          Good {getTimeOfDay()}, {profile?.full_name?.split(' ')[0] || 'Instructor'}
        </h1>
        <p className="text-slate-600 mt-1">Here are the programs you're currently instructing.</p>
      </div>

      {programs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-amber-200 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-slate-900 font-semibold mb-2">No programs assigned yet</h3>
          <p className="text-slate-500 text-sm">Programs you're assigned to instruct will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {programs.map((p) => (
            <Link
              key={p.id}
              to={`/instructor/programs/${p.id}`}
              className="group bg-white rounded-2xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="h-40 bg-amber-50 overflow-hidden relative">
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-amber-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
                    p.is_published ? 'bg-sage-100 text-sage-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {p.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
                  {p.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{p.description}</p>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {p.enrollment_count} enrolled
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {p.milestone_count} classes
                  </span>
                </div>

                {p.next_class ? (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-amber-800">Next class</p>
                      <p className="text-xs text-amber-700">
                        {new Date(p.next_class + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {p.next_class_time && ` at ${formatTime(p.next_class_time)}`}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <p className="text-xs text-slate-500">No upcoming classes scheduled</p>
                  </div>
                )}
              </div>

              <div className="px-5 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 capitalize">{p.category} &middot; {p.difficulty_level}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function formatTime(time: string) {
  const [h, m] = time.split(':');
  const d = new Date();
  d.setHours(parseInt(h), parseInt(m));
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
