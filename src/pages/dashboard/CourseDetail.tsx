import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Calendar, Users, ChevronDown, ChevronUp, CheckSquare, Pen, MessageSquare, User as User2, Clock, Layers, LayoutDashboard, Save, CheckCircle2, GraduationCap, FileText, Book } from 'lucide-react';
import { useAuth } from '../../components/context/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Milestone {
  id: string;
  class_number: number;
  theme_number: number;
  title: string;
  description: string;
  class_date: string;
  sort_order: number;
  prompts: { id: string; prompt_text: string; sort_order: number }[];
}

interface HomeworkTask {
  id: string;
  week_number: number;
  day_of_week: number;
  task_title: string;
  task_description: string;
  sort_order: number;
}

interface ProgramData {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  category: string;
  duration_hours: number;
  admin: { full_name: string } | null;
}

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  author: { full_name: string };
}

type Tab = 'overview' | 'curriculum' | 'coursework' | 'community';

interface JournalResponse {
  promptId: string;
  text: string;
  saved: boolean;
  saving: boolean;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-stone-100 text-slate-600',
  question: 'bg-sky-100 text-sky-700',
  discussion: 'bg-sage-100 text-sage-700',
  announcement: 'bg-amber-100 text-amber-700',
  resource: 'bg-sage-light text-sage-dark',
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const [program, setProgram] = useState<ProgramData | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [homework, setHomework] = useState<HomeworkTask[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'community' || tab === 'coursework') return tab;
    return 'overview';
  });
  const [journalResponses, setJournalResponses] = useState<Record<string, JournalResponse>>({});
  const [expandedWorkbookThemes, setExpandedWorkbookThemes] = useState<Set<string>>(new Set());
  const [expandedThemeJournals, setExpandedThemeJournals] = useState<Set<string>>(new Set());
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!slug || !profile) return;
    loadData();
  }, [slug, profile]);

  const loadData = async () => {
    const { data: prog } = await supabase
      .from('programs')
      .select('id, title, slug, description, cover_image_url, category, duration_hours, admin:admin_id(full_name)')
      .eq('slug', slug!)
      .maybeSingle();

    if (!prog) { setLoading(false); return; }

    const programData: ProgramData = {
      ...prog,
      admin: prog.admin as unknown as { full_name: string } | null,
    };
    setProgram(programData);

    const [countRes, milestonesRes, homeworkRes, postsRes] = await Promise.all([
      supabase
        .from('enrollments')
        .select('id', { count: 'exact', head: true })
        .eq('program_id', prog.id)
        .eq('status', 'active'),
      supabase
        .from('program_milestones')
        .select('id, class_number, theme_number, title, description, class_date, sort_order, milestone_journal_prompts(id, prompt_text, sort_order)')
        .eq('program_id', prog.id)
        .order('sort_order', { ascending: true }),
      supabase
        .from('daily_homework_tasks')
        .select('id, week_number, day_of_week, task_title, task_description, sort_order')
        .eq('program_id', prog.id)
        .order('week_number', { ascending: true })
        .order('day_of_week', { ascending: true })
        .order('sort_order', { ascending: true }),
      supabase
        .from('community_posts')
        .select('id, title, content, category, created_at, profiles:author_id(full_name)')
        .eq('program_id', prog.id)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    setEnrollmentCount(countRes.count || 0);

    setMilestones(
      (milestonesRes.data || []).map((m) => ({
        ...m,
        prompts: ((m.milestone_journal_prompts as { id: string; prompt_text: string; sort_order: number }[]) || [])
          .sort((a, b) => a.sort_order - b.sort_order),
      }))
    );

    setHomework(homeworkRes.data || []);

    setCommunityPosts(
      (postsRes.data || []).map((p) => ({
        ...p,
        author: p.profiles as unknown as { full_name: string },
      }))
    );

    setLoading(false);
  };

  const loadJournalResponses = useCallback(async () => {
    if (!profile) return;
    const allPromptIds = milestones.flatMap((m) => m.prompts.map((p) => p.id));
    if (allPromptIds.length === 0) return;
    const { data } = await supabase
      .from('user_journal_responses')
      .select('prompt_id, response_text')
      .eq('user_id', profile.id)
      .in('prompt_id', allPromptIds);

    const map: Record<string, JournalResponse> = {};
    (data || []).forEach((r) => {
      map[r.prompt_id] = { promptId: r.prompt_id, text: r.response_text, saved: true, saving: false };
    });
    setJournalResponses(map);
  }, [profile, milestones]);

  useEffect(() => {
    if (activeTab === 'coursework' && program) {
      loadJournalResponses();
    }
  }, [activeTab, program]);

  const handleResponseChange = (promptId: string, text: string) => {
    setJournalResponses((prev) => ({
      ...prev,
      [promptId]: { promptId, text, saved: false, saving: false },
    }));
  };

  const saveResponse = async (promptId: string) => {
    if (!profile) return;
    const current = journalResponses[promptId];
    if (!current) return;

    setJournalResponses((prev) => ({
      ...prev,
      [promptId]: { ...prev[promptId], saving: true },
    }));

    const { data: existing } = await supabase
      .from('user_journal_responses')
      .select('id')
      .eq('user_id', profile.id)
      .eq('prompt_id', promptId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_journal_responses')
        .update({ response_text: current.text, updated_at: new Date().toISOString() })
        .eq('user_id', profile.id)
        .eq('prompt_id', promptId);
    } else {
      await supabase
        .from('user_journal_responses')
        .insert({ user_id: profile.id, prompt_id: promptId, response_text: current.text });
    }

    setJournalResponses((prev) => ({
      ...prev,
      [promptId]: { ...prev[promptId], saving: false, saved: true },
    }));
  };

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!program) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Program not found</h2>
      <Link to="/dashboard" className="text-sage-600 font-semibold">Back to My Dashboard</Link>
    </div>
  );

  const classDates = [...new Map(
    milestones.map((m) => [m.class_number, { classNumber: m.class_number, date: m.class_date }])
  ).values()].sort((a, b) => a.classNumber - b.classNumber);

  const getTasksForWeek = (weekNum: number) =>
    homework.filter((t) => t.week_number === weekNum);

  const groupByDay = (tasks: HomeworkTask[]) => {
    const map: Record<number, HomeworkTask[]> = {};
    tasks.forEach((t) => {
      if (!map[t.day_of_week]) map[t.day_of_week] = [];
      map[t.day_of_week].push(t);
    });
    return map;
  };

  const toggleWorkbookTheme = (themeId: string) => {
    setExpandedWorkbookThemes((prev) => {
      const next = new Set(prev);
      if (next.has(themeId)) next.delete(themeId);
      else next.add(themeId);
      return next;
    });
  };

  const toggleThemeJournal = (themeId: string) => {
    setExpandedThemeJournals((prev) => {
      const next = new Set(prev);
      if (next.has(themeId)) next.delete(themeId);
      else next.add(themeId);
      return next;
    });
  };

  const toggleWeek = (weekKey: string) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekKey)) next.delete(weekKey);
      else next.add(weekKey);
      return next;
    });
  };

  const toggleDay = (dayKey: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayKey)) next.delete(dayKey);
      else next.add(dayKey);
      return next;
    });
  };

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Syllabus', icon: <FileText className="w-4 h-4" /> },
    { key: 'coursework', label: 'Workbook', icon: <Book className="w-4 h-4" /> },
    { key: 'community', label: 'Community', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-sage-600 text-sm font-medium transition-colors">
          <LayoutDashboard className="w-4 h-4" /> Back to My Dashboard
        </Link>
      </div>

      {program.cover_image_url && (
        <div className="rounded-2xl overflow-hidden mb-6 h-56 lg:h-72">
          <img src={program.cover_image_url} alt={program.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-sage-100 text-sage-700 text-xs font-semibold rounded-full capitalize">
              {program.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">{program.title}</h1>

          <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 flex-wrap">
            {program.admin && (
              <div className="flex items-center gap-1.5">
                <User2 className="w-4 h-4" />
                Facilitated by <span className="font-medium text-slate-700 ml-1">{program.admin.full_name}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {program.duration_hours} hours
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {enrollmentCount} enrolled
            </div>
          </div>

          <div className="border-b border-stone-200 mb-6">
            <nav className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    activeTab === tab.key
                      ? 'border-sage-600 text-sage-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-stone-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <p className="text-slate-600 text-sm">
                Four Sunday classes, each with a dedicated theme. Between classes, you'll have daily activities that reinforce and expand on the fundamentals you've learned.
              </p>

              {classDates.map(({ classNumber, date }) => {
                const classThemes = milestones.filter((m) => m.class_number === classNumber);
                return (
                  <div key={classNumber} className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-sage-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{classNumber}</span>
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900">Class {classNumber}</h2>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(date)}
                        </div>
                      </div>
                    </div>

                    {classThemes.map((theme) => {
                      const isExpanded = expandedWorkbookThemes.has(theme.id);
                      return (
                        <div key={theme.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleWorkbookTheme(theme.id)}
                            className="w-full bg-stone-50 border-b border-stone-200 px-5 py-3 flex items-center gap-3 hover:bg-stone-100 transition-colors text-left"
                          >
                            {/*<div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sage-700 font-bold text-xs">{theme.theme_number}</span>
                            </div>*/}
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 text-sm">{theme.title}</p>
                              <p className="text-xs text-slate-500 leading-relaxed">{theme.description}</p>
                            </div>
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                          </button>

                          {isExpanded && (
                            <div className="space-y-3 p-5 border-t border-stone-200">
                              {theme.prompts.length > 0 && (
                                <div className="bg-stone-50 rounded-lg border border-stone-200 overflow-hidden">
                                  <button
                                    onClick={() => toggleThemeJournal(theme.id)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-stone-100 transition-colors text-left"
                                  >
                                    <Pen className="w-4 h-4 text-sage-600 flex-shrink-0" />
                                    <span className="text-sm font-semibold text-slate-900">Journal Prompts</span>
                                    {expandedThemeJournals.has(theme.id) ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />}
                                  </button>

                                  {expandedThemeJournals.has(theme.id) && (
                                    <div className="px-4 py-4 space-y-5 border-t border-stone-200 bg-white">
                                      {theme.prompts.map((prompt, idx) => (
                                        <div key={prompt.id} className="flex items-start gap-2.5">
                                          <div className="w-5 h-5 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-sage-700 font-semibold text-xs">{idx + 1}</span>
                                          </div>
                                          <p className="text-sm text-slate-800 font-medium leading-relaxed">{prompt.prompt_text}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {(() => {
                                const themeWeeks = [classNumber * 2 - 1, classNumber * 2];
                                const weekTasks: Record<number, HomeworkTask[]> = {};

                                themeWeeks.forEach((weekNum) => {
                                  const tasks = getTasksForWeek(weekNum);
                                  if (tasks.length > 0) {
                                    weekTasks[weekNum] = tasks;
                                  }
                                });

                                if (Object.keys(weekTasks).length === 0) return null;

                                return (
                                  <div className="space-y-3">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                      <CheckSquare className="w-3.5 h-3.5 text-sage-600" /> Daily Practice
                                    </p>
                                    <div className="space-y-3">
                                      {themeWeeks.map((weekNum) => {
                                        const weekKey = `week-${theme.id}-${weekNum}`;
                                        const isWeekExpanded = expandedWeeks.has(weekKey);
                                        const tasksInWeek = weekTasks[weekNum];

                                        if (!tasksInWeek || tasksInWeek.length === 0) return null;

                                        const tasksByDay: Record<number, HomeworkTask[]> = {};
                                        tasksInWeek.forEach((task) => {
                                          if (!tasksByDay[task.day_of_week]) tasksByDay[task.day_of_week] = [];
                                          tasksByDay[task.day_of_week].push(task);
                                        });
                                        const daysWithTasks = Object.keys(tasksByDay).map(Number).sort();

                                        return (
                                          <div key={weekNum} className="bg-stone-50 rounded-lg border border-stone-200 overflow-hidden">
                                            <button
                                              onClick={() => toggleWeek(weekKey)}
                                              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-stone-100 transition-colors text-left"
                                            >
                                              <Layers className="w-4 h-4 text-sage-600 flex-shrink-0" />
                                              <span className="text-sm font-semibold text-slate-900">Week {weekNum}</span>
                                              
                                              {isWeekExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />}
                                            </button>

                                            {isWeekExpanded && (
                                              <div className="px-4 py-4 space-y-3 border-t border-stone-200 bg-white">
                                                {daysWithTasks.map((day) => {
                                                  const dayKey = `day-${theme.id}-${weekNum}-${day}`;
                                                  const isDayExpanded = expandedDays.has(dayKey);
                                                  return (
                                                    <div key={day} className="bg-white border border-stone-200 rounded-lg overflow-hidden">
                                                      <button
                                                        onClick={() => toggleDay(dayKey)}
                                                        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-stone-50 transition-colors text-left"
                                                      >
                                                        <span className="text-sm font-semibold text-slate-900">{DAY_NAMES[day - 1]}</span>
                                                        <span className="text-xs text-slate-500 ml-auto">{tasksByDay[day].length} items</span>
                                                        {isDayExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                                      </button>
                                                      {isDayExpanded && (
                                                        <div className="px-4 py-3 space-y-2 border-t border-stone-200 bg-stone-50">
                                                          {tasksByDay[day].map((task) => (
                                                            <div key={task.id} className="bg-white rounded-lg p-3 border border-stone-200">
                                                              <p className="font-semibold text-slate-900 text-sm">{task.task_title}</p>
                                                              {task.task_description && (
                                                                <p className="text-xs text-slate-600 leading-tight mt-1">{task.task_description}</p>
                                                              )}
                                                            </div>
                                                          ))}
                                                        </div>
                                                      )}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}


          {activeTab === 'coursework' && (
            <div className="space-y-8">
              <p className="text-slate-600 text-sm">
                Work through journal prompts for each theme and track your daily practice. Your responses are saved automatically when you click Save.
              </p>

              {milestones.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-xl p-10 text-center">
                  <GraduationCap className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-slate-500">No coursework available yet for this program.</p>
                </div>
              ) : (
                classDates.map(({ classNumber, date }) => {
                  const classThemes = milestones.filter((m) => m.class_number === classNumber);
                  const weeksForClass = [classNumber * 2 - 1, classNumber * 2];

                  return (
                    <div key={classNumber} className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-sage-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{classNumber}</span>
                        </div>
                        <div>
                          <h2 className="font-bold text-slate-900">Class {classNumber}</h2>
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(date)}
                          </div>
                        </div>
                      </div>

                      {classThemes.map((theme) => {
                        const isExpanded = expandedWorkbookThemes.has(theme.id);
                        return (
                          <div key={theme.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => toggleWorkbookTheme(theme.id)}
                              className="w-full bg-stone-50 border-b border-stone-200 px-5 py-3 flex items-center gap-3 hover:bg-stone-100 transition-colors text-left"
                            >
                              <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sage-700 font-bold text-xs">{theme.theme_number}</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900 text-sm">{theme.title}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{theme.description}</p>
                              </div>
                              {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                            </button>

                            {isExpanded && (
                              <div className="space-y-3 p-5 border-t border-stone-200">
                                {theme.prompts.length > 0 && (
                                  <div className="bg-stone-50 rounded-lg border border-stone-200 overflow-hidden">
                                    <button
                                      onClick={() => toggleThemeJournal(theme.id)}
                                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-stone-100 transition-colors text-left"
                                    >
                                      <Pen className="w-4 h-4 text-sage-600 flex-shrink-0" />
                                      <span className="text-sm font-semibold text-slate-900">Journal Prompts</span>
                                      {expandedThemeJournals.has(theme.id) ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />}
                                    </button>

                                    {expandedThemeJournals.has(theme.id) && (
                                      <div className="px-4 py-4 space-y-5 border-t border-stone-200 bg-white">
                                        {theme.prompts.map((prompt, idx) => {
                                          const response = journalResponses[prompt.id];
                                          return (
                                            <div key={prompt.id} className="space-y-2">
                                              <div className="flex items-start gap-2.5">
                                                <div className="w-5 h-5 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                  <span className="text-sage-700 font-semibold text-xs">{idx + 1}</span>
                                                </div>
                                                <p className="text-sm text-slate-800 font-medium leading-relaxed">{prompt.prompt_text}</p>
                                              </div>
                                              <div className="ml-7">
                                                <textarea
                                                  value={response?.text ?? ''}
                                                  onChange={(e) => handleResponseChange(prompt.id, e.target.value)}
                                                  placeholder="Write your reflection here..."
                                                  rows={4}
                                                  className="w-full text-sm text-slate-700 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent placeholder:text-stone-400 leading-relaxed transition-shadow"
                                                />
                                                <div className="flex items-center justify-between mt-1.5">
                                                  <span className="text-xs text-slate-400">
                                                    {response?.saved && !response?.saving
                                                      ? <span className="flex items-center gap-1 text-sage-600"><CheckCircle2 className="w-3.5 h-3.5" /> Saved</span>
                                                      : response?.text && !response?.saved
                                                      ? 'Unsaved changes'
                                                      : ''}
                                                  </span>
                                                  <button
                                                    onClick={() => saveResponse(prompt.id)}
                                                    disabled={response?.saving || (!response?.text)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                  >
                                                    <Save className="w-3 h-3" />
                                                    {response?.saving ? 'Saving...' : 'Save'}
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {weeksForClass.map((weekNum) => {
                        const weekTasks = getTasksForWeek(weekNum);
                        if (weekTasks.length === 0) return null;
                        const byDay = groupByDay(weekTasks);
                        const days = Object.keys(byDay).map(Number).sort();
                        const weekKey = `week-coursework-${weekNum}-class${classNumber}`;
                        const isWeekExpanded = expandedWeeks.has(weekKey);

                        return (
                          <div key={weekNum} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => toggleWeek(weekKey)}
                              className="w-full px-5 py-3 flex items-center gap-3 hover:bg-stone-50 transition-colors text-left bg-stone-50 border-b border-stone-200"
                            >
                              <Layers className="w-4 h-4 text-sage-600 flex-shrink-0" />
                              <span className="text-sm font-semibold text-slate-900">Week {weekNum}</span>
                              <span className="text-xs text-slate-500 ml-auto"></span>
                              {isWeekExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                            </button>

                            {isWeekExpanded && (
                              <div className="px-5 py-4 space-y-3 border-t border-stone-200 bg-white">
                                {days.map((day) => {
                                  const dayKey = `${DAY_NAMES[day - 1]}-week${weekNum}-class${classNumber}`;
                                  const isDayExpanded = expandedDays.has(dayKey);
                                  return (
                                    <div key={day} className="bg-stone-50 border border-stone-200 rounded-lg overflow-hidden">
                                      <button
                                        onClick={() => toggleDay(dayKey)}
                                        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-stone-100 transition-colors text-left"
                                      >
                                        <span className="text-sm font-semibold text-slate-900">{DAY_NAMES[day - 1]}</span>
                                        <span className="text-xs text-slate-500 ml-auto">{byDay[day].length} items</span>
                                        {isDayExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                      </button>

                                      {isDayExpanded && (
                                        <div className="px-4 py-3 space-y-2 border-t border-stone-200 bg-white">
                                          {byDay[day].map((task) => (
                                            <label key={task.id} className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-sage-50 transition-colors group">
                                              <input
                                                type="checkbox"
                                                checked={completedTasks.has(task.id)}
                                                onChange={() => toggleTask(task.id)}
                                                className="w-5 h-5 rounded border-stone-300 text-sage-600 focus:ring-sage-500 mt-0.5 flex-shrink-0 cursor-pointer"
                                              />
                                              <span className="flex-1 min-w-0">
                                                <span className={`text-sm font-medium block leading-tight transition-all ${completedTasks.has(task.id) ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                  {task.task_title}
                                                </span>
                                                {task.task_description && (
                                                  <span className={`text-xs block leading-tight transition-all ${completedTasks.has(task.id) ? 'text-slate-300' : 'text-slate-500'}`}>
                                                    {task.task_description}
                                                  </span>
                                                )}
                                              </span>
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-4">
              {communityPosts.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-xl p-10 text-center">
                  <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-slate-500">No community posts yet for this program.</p>
                  <Link to="/dashboard/community" className="text-sage-600 font-semibold text-sm mt-3 inline-block hover:text-sage-700">
                    Go to Community Board
                  </Link>
                </div>
              ) : (
                <>
                  {communityPosts.map((post) => (
                    <div key={post.id} className="bg-white border border-stone-200 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.general}`}>
                          {post.category}
                        </span>
                        <span className="text-xs text-slate-400">{timeAgo(post.created_at)}</span>
                        <span className="text-xs text-slate-500">by {post.author.full_name}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{post.title}</h3>
                      <p className="text-slate-600 text-sm line-clamp-2">{post.content}</p>
                    </div>
                  ))}
                  <Link
                    to="/dashboard/community"
                    className="flex items-center justify-center gap-2 py-3 text-sage-600 font-semibold text-sm hover:text-sage-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    View all in Community Board
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-stone-200 p-6 sticky top-24">
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium text-slate-900">{program.duration_hours} hours</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Classes</span>
                <span className="font-medium text-slate-900">{classDates.length} sessions</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Format</span>
                <span className="font-medium text-slate-900">Every other Sunday</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Starts</span>
                <span className="font-medium text-slate-900">March 22, 2026</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Enrolled</span>
                <span className="font-medium text-slate-900">{enrollmentCount} members</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
