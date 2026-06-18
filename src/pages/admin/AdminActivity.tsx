import { useEffect, useState } from 'react';
import { BookOpen, Pen, CheckSquare, Users, ChevronDown, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ProgramActivity {
  id: string;
  title: string;
  slug: string;
  category: string;
  is_published: boolean;
  enrollment_count: number;
  active_count: number;
  completed_count: number;
  journal_count: number;
  task_count: number;
  total_prompts: number;
  total_tasks: number;
  students: StudentProgress[];
}

interface StudentProgress {
  id: string;
  full_name: string;
  enrolled_at: string;
  status: string;
  journal_count: number;
  task_count: number;
  progress_pct: number;
}

export default function AdminActivity() {
  const [programs, setPrograms] = useState<ProgramActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { loadActivity(); }, []);

  const loadActivity = async () => {
    const { data: progs } = await supabase
      .from('programs')
      .select('id, title, slug, category, is_published')
      .order('created_at', { ascending: false });

    if (!progs) { setLoading(false); return; }

    const enriched: ProgramActivity[] = await Promise.all(
      progs.map(async (p) => {
        const [enrollRes, milestonesRes] = await Promise.all([
          supabase
            .from('enrollments')
            .select('id, user_id, enrolled_at, status, profiles:user_id(id, full_name)')
            .eq('program_id', p.id),
          supabase.from('program_milestones').select('id').eq('program_id', p.id),
        ]);

        const enrollments = enrollRes.data || [];
        const milestoneIds = (milestonesRes.data || []).map((m: { id: string }) => m.id);

        const [promptsRes, tasksRes] = await Promise.all([
          milestoneIds.length > 0
            ? supabase.from('milestone_journal_prompts').select('id').in('milestone_id', milestoneIds)
            : Promise.resolve({ data: [] }),
          supabase.from('daily_homework_tasks').select('id').eq('program_id', p.id),
        ]);

        const totalPrompts = (promptsRes.data || []).length;
        const totalTasks = (tasksRes.data || []).length;
        const total = totalPrompts + totalTasks;

        const students: StudentProgress[] = await Promise.all(
          enrollments.map(async (e) => {
            const userId = e.user_id;
            const promptIds = (promptsRes.data || []).map((x: { id: string }) => x.id);
            const taskIds = (tasksRes.data || []).map((x: { id: string }) => x.id);

            const [jRes, tRes] = await Promise.all([
              promptIds.length > 0
                ? supabase.from('user_journal_responses').select('id', { count: 'exact', head: true }).eq('user_id', userId).in('prompt_id', promptIds)
                : Promise.resolve({ count: 0 }),
              taskIds.length > 0
                ? supabase.from('user_task_completions').select('id', { count: 'exact', head: true }).eq('user_id', userId).in('task_id', taskIds)
                : Promise.resolve({ count: 0 }),
            ]);

            const done = (jRes.count || 0) + (tRes.count || 0);
            return {
              id: userId,
              full_name: (e.profiles as unknown as { full_name: string })?.full_name || 'Unknown',
              enrolled_at: e.enrolled_at,
              status: e.status,
              journal_count: jRes.count || 0,
              task_count: tRes.count || 0,
              progress_pct: total > 0 ? Math.round((done / total) * 100) : 0,
            };
          })
        );

        const journalTotal = students.reduce((s, x) => s + x.journal_count, 0);
        const taskTotal = students.reduce((s, x) => s + x.task_count, 0);

        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          category: p.category,
          is_published: p.is_published,
          enrollment_count: enrollments.length,
          active_count: enrollments.filter((e) => e.status === 'active').length,
          completed_count: enrollments.filter((e) => e.status === 'completed').length,
          journal_count: journalTotal,
          task_count: taskTotal,
          total_prompts: totalPrompts,
          total_tasks: totalTasks,
          students: students.sort((a, b) => b.progress_pct - a.progress_pct),
        };
      })
    );

    setPrograms(enriched);
    setLoading(false);
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Activity Monitor</h1>
        <p className="text-slate-400 text-sm mt-1">Track progress and engagement across all programs.</p>
      </div>

      {programs.length === 0 ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-16 text-center">
          <TrendingUp className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No programs to monitor yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {programs.map((p) => {
            const isExpanded = expandedId === p.id;
            const avgProgress = p.students.length > 0
              ? Math.round(p.students.reduce((s, x) => s + x.progress_pct, 0) / p.students.length)
              : 0;

            return (
              <div key={p.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-semibold text-white truncate">{p.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${p.is_published ? 'bg-sage-500/20 text-sage-400' : 'bg-slate-700 text-slate-400'}`}>
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-xs text-slate-500 capitalize shrink-0">{p.category}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {p.enrollment_count} enrolled</span>
                      <span className="flex items-center gap-1"><Pen className="w-3 h-3" /> {p.journal_count} responses</span>
                      <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" /> {p.task_count} tasks</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-white">{avgProgress}%</p>
                      <p className="text-xs text-slate-500">avg progress</p>
                    </div>
                    <div className="w-24 hidden sm:block">
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div
                          className="bg-sage-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${avgProgress}%` }}
                        />
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-800">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-800">
                      {[
                        { label: 'Active', value: p.active_count, icon: Users },
                        { label: 'Completed', value: p.completed_count, icon: BookOpen },
                        { label: 'Journal Responses', value: `${p.journal_count}/${p.total_prompts * p.students.length}`, icon: Pen },
                        { label: 'Tasks Done', value: `${p.task_count}/${p.total_tasks * p.students.length}`, icon: CheckSquare },
                      ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="bg-slate-900 px-4 py-3 text-center">
                          <Icon className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                          <p className="text-base font-bold text-white">{value}</p>
                          <p className="text-xs text-slate-500">{label}</p>
                        </div>
                      ))}
                    </div>

                    {p.students.length === 0 ? (
                      <div className="px-5 py-6 text-center text-slate-500 text-sm">No students enrolled.</div>
                    ) : (
                      <div className="divide-y divide-slate-800">
                        <div className="grid grid-cols-12 gap-2 px-5 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <div className="col-span-4">Student</div>
                          <div className="col-span-2 text-center">Journal</div>
                          <div className="col-span-2 text-center">Tasks</div>
                          <div className="col-span-2 text-center">Status</div>
                          <div className="col-span-2 text-center">Progress</div>
                        </div>
                        {p.students.map((s) => (
                          <div key={s.id} className="grid grid-cols-12 gap-2 items-center px-5 py-3">
                            <div className="col-span-4 flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-xs font-semibold text-slate-300">{s.full_name?.[0]?.toUpperCase() || '?'}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate">{s.full_name}</p>
                                <p className="text-xs text-slate-500">
                                  {new Date(s.enrolled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="text-sm font-semibold text-white">{s.journal_count}</span>
                              <span className="text-xs text-slate-500">/{p.total_prompts}</span>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="text-sm font-semibold text-white">{s.task_count}</span>
                              <span className="text-xs text-slate-500">/{p.total_tasks}</span>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                                s.status === 'completed' ? 'bg-sage-500/20 text-sage-400' :
                                s.status === 'dropped' ? 'bg-red-500/20 text-red-400' :
                                'bg-sky-500/20 text-sky-400'
                              }`}>
                                {s.status}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                                  <div
                                    className="bg-sage-500 h-1.5 rounded-full transition-all"
                                    style={{ width: `${s.progress_pct}%` }}
                                  />
                                </div>
                                <span className="text-xs text-slate-400 shrink-0 w-8 text-right">{s.progress_pct}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
