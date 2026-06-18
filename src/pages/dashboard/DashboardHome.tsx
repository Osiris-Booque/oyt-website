import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ArrowRight, Pin, ThumbsUp, Sparkles, Star, Lightbulb, MessageSquare, Plus, Video } from 'lucide-react';
import { useAuth } from '../../components/context/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { POST_CATEGORIES } from '../../lib/constants';

interface ClassInfo {
  classNumber: number;
  date: string;
  classTime: string | null;
  classLink: string | null;
  title: string;
  programSlug: string;
}

interface EnrolledProgram {
  id: string;
  program_id: string;
  enrolled_at: string;
  status: string;
  program: {
    title: string;
    slug: string;
    cover_image_url: string | null;
    category: string;
    description: string | null;
  };
  promptsAnswered: number;
  totalPrompts: number;
  tasksCompleted: number;
  totalTasks: number;
  progress: number;
  firstIncompletePromptSlug: string | null;
  firstIncompleteTaskSlug: string | null;
  classes: ClassInfo[];
}

interface RecentPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  is_pinned: boolean;
  author: { full_name: string };
  reaction_count: number;
  comment_count: number;
}

const REACTION_ICONS: Record<string, React.ReactNode> = {
  like: <ThumbsUp className="w-3 h-3" />,
  helpful: <Sparkles className="w-3 h-3" />,
  inspiring: <Star className="w-3 h-3" />,
  insightful: <Lightbulb className="w-3 h-3" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-input text-secondary',
  question: 'bg-sage-light text-sage-dark',
  discussion: 'bg-sage-light text-sage-dark',
  announcement: 'bg-warm-coral-bg text-warm-coral',
  resource: 'bg-sage-light text-sage-dark',
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm';
  return (
    <div className={`${s} rounded-full bg-sage-light flex items-center justify-center font-semibold text-sage-dark flex-shrink-0`}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

function useScheduledNow(classDate: string | null, classTime: string | null) {
  const [now, setNow] = useState(() => new Date());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!classDate || !classTime) return;

    const [h, m, s] = classTime.split(':').map(Number);
    const start = new Date(classDate + 'T00:00:00');
    start.setHours(h, m, s ?? 0, 0);
    const openAt = new Date(start.getTime() - 15 * 60 * 1000);
    const closeAt = new Date(start.getTime() + 30 * 60 * 1000);

    const scheduleNext = () => {
      const n = new Date();
      let msUntilChange: number | null = null;

      if (n < openAt) {
        msUntilChange = openAt.getTime() - n.getTime();
      } else if (n >= openAt && n <= closeAt) {
        msUntilChange = closeAt.getTime() - n.getTime() + 1000;
      }

      if (msUntilChange !== null && msUntilChange > 0) {
        timerRef.current = setTimeout(() => {
          setNow(new Date());
          scheduleNext();
        }, msUntilChange);
      }
    };

    setNow(new Date());
    scheduleNext();

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [classDate, classTime]);

  return now;
}

function isZoomLinkActive(classDate: string, classTime: string | null, now: Date): boolean {
  if (!classTime) return false;
  const [h, m, s] = classTime.split(':').map(Number);
  const start = new Date(classDate + 'T00:00:00');
  start.setHours(h, m, s ?? 0, 0);
  const openAt = new Date(start.getTime() - 15 * 60 * 1000);
  const closeAt = new Date(start.getTime() + 30 * 60 * 1000);
  return now >= openAt && now <= closeAt;
}

export default function DashboardHome() {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrolledProgram[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [upcomingClassState, setUpcomingClassState] = useState<ClassInfo | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const now = useScheduledNow(upcomingClassState?.date ?? null, upcomingClassState?.classTime ?? null);

  useEffect(() => {
    if (!profile) return;
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    const [enrollRes, postsRes] = await Promise.all([
      supabase
        .from('enrollments')
        .select('id, program_id, enrolled_at, status, programs(title, slug, cover_image_url, category, description)')
        .eq('user_id', profile!.id)
        .eq('status', 'active')
        .order('enrolled_at', { ascending: false })
        .limit(4),
      supabase
        .from('community_posts')
        .select(`
          id, author_id, title, content, category, created_at, is_pinned,
          profiles:author_id(full_name),
          post_reactions(id),
          post_comments(id)
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6),
    ]);

    const enriched: EnrolledProgram[] = [];

    if (enrollRes.data) {
      for (const e of enrollRes.data) {
        const prog = e.programs as unknown as EnrolledProgram['program'];

        const milestonesRes = await supabase
          .from('program_milestones')
          .select('id, class_number, class_date, class_time, class_link, title')
          .eq('program_id', e.program_id);
        const milestoneIds = milestonesRes.data?.map((m: { id: string }) => m.id) || [];

        const classMap = new Map<number, { date: string; classTime: string | null; classLink: string | null; title: string }>();
        (milestonesRes.data || []).forEach((m: { class_number: number; class_date: string; class_time: string | null; class_link: string | null; title: string }) => {
          if (!classMap.has(m.class_number)) {
            classMap.set(m.class_number, { date: m.class_date, classTime: m.class_time, classLink: m.class_link, title: m.title });
          }
        });
        const classes: ClassInfo[] = Array.from(classMap.entries())
          .map(([classNumber, info]) => ({ classNumber, ...info, programSlug: prog.slug }))
          .sort((a, b) => a.classNumber - b.classNumber);

        const allPromptsRes = await supabase
          .from('milestone_journal_prompts')
          .select('id, sort_order, milestone_id')
          .in('milestone_id', milestoneIds)
          .order('sort_order', { ascending: true });
        const allPromptIds = allPromptsRes.data?.map((p: { id: string }) => p.id) || [];

        const allTasksRes = await supabase
          .from('daily_homework_tasks')
          .select('id, sort_order, week_number, day_of_week')
          .eq('program_id', e.program_id)
          .order('week_number', { ascending: true })
          .order('day_of_week', { ascending: true })
          .order('sort_order', { ascending: true });
        const allTaskIds = allTasksRes.data?.map((t: { id: string }) => t.id) || [];

        const [answeredRes, completedTaskRes] = await Promise.all([
          supabase
            .from('user_journal_responses')
            .select('prompt_id')
            .eq('user_id', profile!.id)
            .in('prompt_id', allPromptIds),
          supabase
            .from('user_task_completions')
            .select('task_id')
            .eq('user_id', profile!.id)
            .in('task_id', allTaskIds),
        ]);

        const answeredPromptIds = new Set((answeredRes.data || []).map((r: { prompt_id: string }) => r.prompt_id));
        const completedTaskIds = new Set((completedTaskRes.data || []).map((r: { task_id: string }) => r.task_id));

        const totalPrompts = allPromptIds.length;
        const promptsAnswered = answeredPromptIds.size;
        const totalTasks = allTaskIds.length;
        const tasksCompleted = completedTaskIds.size;
        const total = totalPrompts + totalTasks;
        const done = promptsAnswered + tasksCompleted;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;

        const firstIncompletePrompt = (allPromptsRes.data || []).find(
          (p: { id: string }) => !answeredPromptIds.has(p.id)
        );
        const firstIncompleteTask = (allTasksRes.data || []).find(
          (t: { id: string }) => !completedTaskIds.has(t.id)
        );

        enriched.push({
          id: e.id,
          program_id: e.program_id,
          enrolled_at: e.enrolled_at,
          status: e.status,
          program: prog,
          promptsAnswered,
          totalPrompts,
          tasksCompleted,
          totalTasks,
          progress,
          firstIncompletePromptSlug: firstIncompletePrompt ? prog.slug : null,
          firstIncompleteTaskSlug: firstIncompleteTask ? prog.slug : null,
          classes,
        });
      }
    }

    setEnrollments(enriched);

    setRecentPosts(
      (postsRes.data || []).map((p) => ({
        id: p.id,
        author_id: p.author_id,
        title: p.title,
        content: p.content,
        category: p.category,
        created_at: p.created_at,
        is_pinned: p.is_pinned,
        author: p.profiles as unknown as RecentPost['author'],
        reaction_count: (p.post_reactions || []).length,
        comment_count: (p.post_comments || []).length,
      }))
    );

    const allCls = enriched.flatMap((e) => e.classes);
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const nextClass = allCls
      .filter((c) => new Date(c.date + 'T12:00:00') > todayMidnight)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null;
    setUpcomingClassState(nextClass);

    setLoading(false);
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  const upcomingClass = upcomingClassState;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-secondary mt-1">Every step forward is progress. Keep going.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-primary mb-4">{enrollments.length === 1 ? 'Current Program' : 'Current Programs'}</h2>

        {enrollments.length === 0 ? (
          <div className="bg-card rounded-md border border-input-border p-10 text-center shadow-card">
            <BookOpen className="w-10 h-10 text-input mx-auto mb-3" />
            <p className="text-secondary">You are not currently enrolled in any programs.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            enrollments.length === 1
              ? 'grid-cols-1'
              : enrollments.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-3'
          }`}>
            {enrollments.map((e) => (
              <Link
                key={e.id}
                to={`/dashboard/programs/${e.program.slug}`}
                className="bg-card rounded-md border border-input-border overflow-hidden hover:shadow-card transition-all hover:border-sage-border group flex flex-col h-full"
              >
                <div className="w-full h-40 bg-input overflow-hidden">
                  {e.program.cover_image_url ? (
                    <img src={e.program.cover_image_url} alt={e.program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-input-border" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-primary mb-3 line-clamp-2 text-sm">{e.program.title}</h3>
                  {e.program.description && (
                    <p className="text-xs text-secondary line-clamp-3 mb-4">{e.program.description}</p>
                  )}
                  <div className="mt-auto inline-flex items-center justify-center gap-2 px-3 py-2 bg-teal text-white rounded-sm font-semibold group-hover:bg-teal-hover transition-colors text-sm w-full">
                    <ArrowRight className="w-4 h-4" />
                    Go to Program Page
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-primary mb-4">Schedule</h2>

          {upcomingClass && (() => {
            const zoomActive = isZoomLinkActive(upcomingClass.date, upcomingClass.classTime, now);
            const hasLink = !!upcomingClass.classLink;
            return (
              <button
                onClick={() => setSelectedClass(upcomingClass)}
                className="mt-4 w-full bg-card-active border border-sage-border rounded-md p-4 hover:bg-card transition-all text-left shadow-card"
              >
                <p className="text-xs font-semibold text-sage-dark uppercase tracking-widest mb-3">Upcoming Class</p>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary text-sm line-clamp-1">{upcomingClass.title}</p>
                  <p className="text-secondary text-xs mt-0.5">
                    {new Date(upcomingClass.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    {upcomingClass.classTime && (
                      <span className="text-secondary"> &middot; {new Date('1970-01-01T' + upcomingClass.classTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    {zoomActive && hasLink ? (
                      <a
                        href={upcomingClass.classLink!}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white text-xs font-semibold rounded-sm hover:bg-teal-hover transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Zoom link
                      </a>
                    ) : (
                      <span
                        title="Zoom link available 15 minutes prior to start time"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-input text-secondary text-xs font-semibold rounded-lg cursor-not-allowed select-none"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Zoom link
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })()}
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-primary">Community</h2>
            <Link to="/dashboard/community" className="text-teal text-sm font-semibold hover:text-teal-hover flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="bg-card rounded-md border border-input-border p-12 text-center shadow-card">
              <Users className="w-10 h-10 text-input mx-auto mb-3" />
              <p className="text-secondary mb-4">No community posts yet.</p>
              <Link to="/dashboard/community" className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-sm font-semibold hover:bg-teal-hover transition-colors text-sm">
                <Plus className="w-4 h-4" /> Start the Conversation
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to="/dashboard/community"
                  className="block bg-card rounded-md border border-input-border p-4 hover:shadow-card hover:border-sage-border transition-all group"
                >
                  {post.is_pinned && (
                    <div className="flex items-center gap-1 mb-2">
                      <Pin className="w-3 h-3 text-warm-coral rotate-45" />
                      <span className="text-xs font-semibold text-warm-coral uppercase tracking-wide">Pinned</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Avatar name={post.author?.full_name || '?'} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-semibold text-primary">{post.author?.full_name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.general}`}>
                          {POST_CATEGORIES.find((c) => c.value === post.category)?.label || post.category}
                        </span>
                        <span className="text-xs text-slate-400 ml-auto">{timeAgo(post.created_at)}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-primary line-clamp-1 group-hover:text-teal transition-colors">{post.title}</h3>
                      <p className="text-xs text-secondary mt-0.5 line-clamp-1 leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          {REACTION_ICONS['like']}
                          {post.reaction_count}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <MessageSquare className="w-3 h-3" />
                          {post.comment_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                to="/dashboard/community"
                className="flex items-center justify-center gap-2 w-full py-3 bg-input border border-input-border rounded-md text-sm font-semibold text-secondary hover:bg-card-active hover:border-sage-border hover:text-teal transition-all"
              >
                <Plus className="w-4 h-4" /> Join the Conversation
              </Link>
            </div>
          )}
        </div>
      </div>

      {selectedClass && (() => {
        const zoomActive = isZoomLinkActive(selectedClass.date, selectedClass.classTime, now);
        const hasLink = !!selectedClass.classLink;
        const classDate = new Date(selectedClass.date + 'T12:00:00');
        const formattedDate = classDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        const formattedTime = selectedClass.classTime
          ? new Date('1970-01-01T' + selectedClass.classTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : null;

        return (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedClass(null)}
          >
            <div
              className="bg-card rounded-md shadow-card max-w-md w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-sage-light rounded-sm flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5 text-sage-dark" />
                  </div>
                  <button
                    onClick={() => setSelectedClass(null)}
                    className="ml-auto text-secondary hover:text-primary transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <h3 className="text-lg font-bold text-primary mb-1">{selectedClass.title}</h3>

                <div className="space-y-4 my-5">
                  <div className="bg-input rounded-sm p-3.5">
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">Date & Time</p>
                    <p className="text-sm font-medium text-primary">{formattedDate}</p>
                    {formattedTime && (
                      <p className="text-sm text-secondary mt-1">{formattedTime}</p>
                    )}
                  </div>

                  {hasLink && (
                    <div className="bg-input rounded-sm p-3.5">
                      <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">Zoom Link</p>
                      {zoomActive ? (
                        <a
                          href={selectedClass.classLink!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white text-xs font-semibold rounded-sm hover:bg-teal-hover transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Zoom link
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed select-none">
                          <Video className="w-3.5 h-3.5" />
                          Zoom link
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    {zoomActive && hasLink ? (
                      <a
                        href={selectedClass.classLink!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white text-xs font-semibold rounded-sm hover:bg-teal-hover transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Zoom link
                      </a>
                    ) : (
                      <span
                        title="Zoom link available 15 minutes prior to start time"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed select-none"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Zoom link
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/dashboard/programs/${selectedClass.programSlug}`}
                    onClick={() => setSelectedClass(null)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-card-active border border-sage-border text-teal rounded-sm font-semibold hover:bg-input hover:border-sage-border transition-all text-sm"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Go to Program Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
