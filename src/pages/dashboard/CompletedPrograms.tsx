import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../components/context/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface CompletedEnrollment {
  id: string;
  program_id: string;
  enrolled_at: string;
  program: {
    title: string;
    slug: string;
    cover_image_url: string | null;
    category: string;
  };
}

interface ActiveEnrollment {
  id: string;
  program: {
    title: string;
    slug: string;
  };
}

export default function CompletedPrograms() {
  const { profile } = useAuth();
  const [completed, setCompleted] = useState<CompletedEnrollment[]>([]);
  const [active, setActive] = useState<ActiveEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    loadData();
  }, [profile]);

  const loadData = async () => {
    const [completedRes, activeRes] = await Promise.all([
      supabase
        .from('enrollments')
        .select('id, program_id, enrolled_at, programs(title, slug, cover_image_url, category)')
        .eq('user_id', profile!.id)
        .eq('status', 'completed')
        .order('enrolled_at', { ascending: false }),
      supabase
        .from('enrollments')
        .select('id, programs(title, slug)')
        .eq('user_id', profile!.id)
        .eq('status', 'active'),
    ]);

    setCompleted(
      (completedRes.data || []).map((e) => ({
        id: e.id,
        program_id: e.program_id,
        enrolled_at: e.enrolled_at,
        program: e.programs as unknown as CompletedEnrollment['program'],
      }))
    );

    setActive(
      (activeRes.data || []).map((e) => ({
        id: e.id,
        program: e.programs as unknown as ActiveEnrollment['program'],
      }))
    );

    setLoading(false);
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Completed Programs</h1>
        <p className="text-slate-600 mt-1">Programs you've seen through to the finish line.</p>
      </div>

      {completed.length === 0 ? (
        <div className="relative min-h-[420px] flex items-center justify-center overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          >
            <p className="text-[clamp(1.1rem,4vw,2.2rem)] font-black text-stone-100 text-center leading-snug px-8 uppercase tracking-tight">
              Your completed programs<br />will be displayed here.<br />What are you waiting for?<br />Go engage your hustle muscle<br />and get your{' '}
              {active.length === 1
                ? 'current program'
                : active.length > 1
                ? 'current programs'
                : 'program'}{' '}
              completed.
            </p>
          </div>

          <div className="relative z-10 text-center px-6">
            <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-sage-500" />
            </div>
            <p className="text-slate-500 text-base mb-6 max-w-sm mx-auto">
              No completed programs yet. Keep pushing — you're closer than you think.
            </p>
            {active.length > 0 ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {active.map((e) => (
                  <Link
                    key={e.id}
                    to={`/dashboard/programs/${e.program.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage-600 text-white rounded-lg font-semibold hover:bg-sage-700 transition-colors text-sm"
                  >
                    Continue: {e.program.title} <ArrowRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                to="/dashboard/programs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage-600 text-white rounded-lg font-semibold hover:bg-sage-700 transition-colors text-sm"
              >
                Explore Programs <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {completed.map((e) => (
            <Link
              key={e.id}
              to={`/dashboard/programs/${e.program.slug}`}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="h-40 bg-stone-100 overflow-hidden relative">
                {e.program.cover_image_url ? (
                  <img
                    src={e.program.cover_image_url}
                    alt={e.program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-stone-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-sage-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Completed
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-sage-600 uppercase tracking-wide">{e.program.category}</span>
                <h3 className="font-semibold text-slate-900 mt-1 line-clamp-1">{e.program.title}</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Completed {new Date(e.enrolled_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
