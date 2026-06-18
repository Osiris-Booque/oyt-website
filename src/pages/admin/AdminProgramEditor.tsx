import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, Save, Calendar, Link as LinkIcon,
  Clock, BookOpen, GripVertical, ChevronDown, ChevronUp, AlertCircle, GraduationCap,
  Pen, CheckSquare, Copy, Download, Upload, ThumbsUp,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { PROGRAM_CATEGORIES } from '../../lib/constants';

interface JournalPrompt {
  id?: string;
  prompt_text: string;
  sort_order: number;
  _isNew: boolean;
}

interface MilestoneForm {
  id?: string;
  class_number: number;
  theme_number: number;
  title: string;
  description: string;
  class_date: string;
  class_time: string;
  duration_minutes: number;
  class_link: string;
  sort_order: number;
  _isNew: boolean;
  prompts?: JournalPrompt[];
}

interface DailyActivityForm {
  id?: string;
  week_number: number;
  day_of_week: number;
  task_title: string;
  task_description: string;
  activity_date: string;
  sort_order: number;
  _isNew: boolean;
  _isCollapsed?: boolean;
  _isSaving?: boolean;
  _saveStatus?: 'idle' | 'saving' | 'saved';
}

interface ProgramForm {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty_level: string;
  required_role: string;
  cover_image_url: string;
  is_published: boolean;
  instructor_id: string;
}

interface InstructorOption {
  id: string;
  full_name: string;
  role: string;
}

interface ClassGroup {
  class_number: number;
  class_date: string;
  class_time: string;
  duration_minutes: number;
  class_link: string;
  themes: MilestoneForm[];
}

const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert', 'master', 'guru'];
const REQUIRED_ROLES = ['member', 'instructor', 'admin'];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function groupByClass(milestones: MilestoneForm[]): ClassGroup[] {
  const map = new Map<number, ClassGroup>();
  for (const m of milestones) {
    if (!map.has(m.class_number)) {
      map.set(m.class_number, {
        class_number: m.class_number,
        class_date: m.class_date,
        class_time: m.class_time,
        duration_minutes: m.duration_minutes,
        class_link: m.class_link,
        themes: [],
      });
    }
    map.get(m.class_number)!.themes.push(m);
  }
  return Array.from(map.values()).sort((a, b) => a.class_number - b.class_number);
}

function calculateActivityDate(startDate: string, weekNumber: number, dayOfWeek: number): string {
  if (!startDate) return '';
  const start = new Date(startDate + 'T00:00:00');
  const weekDiff = weekNumber - 1;
  const dayDiff = dayOfWeek - 1;
  const daysToAdd = weekDiff * 7 + dayDiff;
  const result = new Date(start);
  result.setDate(result.getDate() + daysToAdd);
  return result.toISOString().split('T')[0];
}

function getDayName(dayOfWeek: number): string {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days[dayOfWeek - 1] || 'Mon';
}

function downloadCSVTemplate() {
  const headers = ['Week Number', 'Day of Week', 'Activity Title', 'Activity Description'];
  const sampleRows = [
    ['1', 'Monday', 'Morning Practice', 'Begin with 10 minute breathing exercise'],
    ['1', 'Tuesday', 'Evening Reflection', 'Journal about your experience'],
  ];
  const csvContent = [
    headers.join(','),
    ...sampleRows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'activity_template.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function AdminProgramEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManual, setSlugManual] = useState(false);
  const [instructors, setInstructors] = useState<InstructorOption[]>([]);
  const [expandedClasses, setExpandedClasses] = useState<Set<number>>(new Set());

  const [form, setForm] = useState<ProgramForm>({
    title: '',
    slug: '',
    description: '',
    category: 'wellness',
    difficulty_level: 'beginner',
    required_role: 'member',
    cover_image_url: '',
    is_published: false,
    instructor_id: profile?.id || '',
  });

  const [milestones, setMilestones] = useState<MilestoneForm[]>([]);
  const [dailyActivities, setDailyActivities] = useState<DailyActivityForm[]>([]);
  const [expandedThemes, setExpandedThemes] = useState<Set<string>>(new Set());
  const [collapsedActivities, setCollapsedActivities] = useState<Set<number>>(new Set());
  const [programId, setProgramId] = useState<string | null>(null);

  useEffect(() => {
    loadInstructors();
    if (!isNew && id) loadProgram(id);
  }, [id]);

  const loadInstructors = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .in('role', ['instructor', 'admin'])
      .order('full_name');
    setInstructors(data || []);
  };

  const loadProgram = async (progId: string) => {
    const [progRes, milRes, actRes, promptsRes] = await Promise.all([
      supabase.from('programs').select('*').eq('id', progId).maybeSingle(),
      supabase.from('program_milestones').select('*').eq('program_id', progId).order('sort_order'),
      supabase.from('daily_homework_tasks').select('*').eq('program_id', progId).order('week_number').order('day_of_week').order('sort_order'),
      supabase.from('milestone_journal_prompts').select('*,milestone_id(id)').order('sort_order'),
    ]);

    if (progRes.data) {
      const p = progRes.data;
      setProgramId(progId);
      setForm({
        title: p.title,
        slug: p.slug,
        description: p.description || '',
        category: p.category,
        difficulty_level: p.difficulty_level,
        required_role: p.required_role,
        cover_image_url: p.cover_image_url || '',
        is_published: p.is_published,
        instructor_id: p.instructor_id || '',
      });
      setSlugManual(true);
    }

    const prompts = promptsRes.data || [];
    const promptsByMilestone = new Map<string, JournalPrompt[]>();
    prompts.forEach((p) => {
      const mId = typeof p.milestone_id === 'object' ? p.milestone_id.id : p.milestone_id;
      if (!promptsByMilestone.has(mId)) promptsByMilestone.set(mId, []);
      promptsByMilestone.get(mId)!.push({
        id: p.id,
        prompt_text: p.prompt_text,
        sort_order: p.sort_order,
        _isNew: false,
      });
    });

    if (milRes.data) {
      setMilestones(milRes.data.map((m) => ({
        id: m.id,
        class_number: m.class_number,
        theme_number: m.theme_number,
        title: m.title,
        description: m.description || '',
        class_date: m.class_date || '',
        class_time: m.class_time || '',
        duration_minutes: m.duration_minutes || 60,
        class_link: m.class_link || '',
        sort_order: m.sort_order,
        _isNew: false,
        prompts: promptsByMilestone.get(m.id) || [],
      })));
    }

    if (actRes.data) {
      setDailyActivities(actRes.data.map((a) => ({
        id: a.id,
        week_number: a.week_number,
        day_of_week: a.day_of_week,
        task_title: a.task_title,
        task_description: a.task_description || '',
        activity_date: a.activity_date || '',
        sort_order: a.sort_order,
        _isNew: false,
      })));
    }

    setLoading(false);
  };

  const handleFormChange = (field: keyof ProgramForm, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !slugManual) {
        updated.slug = slugify(value as string);
      }
      return updated;
    });
  };

  const toggleClass = (classNumber: number) => {
    setExpandedClasses((prev) => {
      const next = new Set(prev);
      if (next.has(classNumber)) next.delete(classNumber);
      else next.add(classNumber);
      return next;
    });
  };

  const addClass = () => {
    const maxClass = milestones.length > 0 ? Math.max(...milestones.map((m) => m.class_number)) : 0;
    const newClassNum = maxClass + 1;
    const newMilestone: MilestoneForm = {
      class_number: newClassNum,
      theme_number: 1,
      title: '',
      description: '',
      class_date: '',
      class_time: '',
      duration_minutes: 60,
      class_link: '',
      sort_order: milestones.length,
      _isNew: true,
    };
    setMilestones((prev) => [...prev, newMilestone]);
    setExpandedClasses((prev) => new Set([...prev, newClassNum]));
  };

  const addTheme = (classNumber: number) => {
    const classThemes = milestones.filter((m) => m.class_number === classNumber);
    const maxTheme = classThemes.length > 0 ? Math.max(...classThemes.map((m) => m.theme_number)) : 0;
    const ref = classThemes[0];
    const newTheme: MilestoneForm = {
      class_number: classNumber,
      theme_number: maxTheme + 1,
      title: '',
      description: '',
      class_date: ref?.class_date || '',
      class_time: ref?.class_time || '',
      duration_minutes: ref?.duration_minutes || 60,
      class_link: ref?.class_link || '',
      sort_order: milestones.length,
      _isNew: true,
    };
    setMilestones((prev) => [...prev, newTheme]);
  };

  const updateClassField = (classNumber: number, field: 'class_date' | 'class_time' | 'class_link' | 'duration_minutes', value: string | number) => {
    setMilestones((prev) =>
      prev.map((m) => m.class_number === classNumber ? { ...m, [field]: value } : m)
    );
  };

  const updateTheme = (classNumber: number, themeNumber: number, field: 'title' | 'description', value: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.class_number === classNumber && m.theme_number === themeNumber
          ? { ...m, [field]: value }
          : m
      )
    );
  };

  const removeTheme = (classNumber: number, themeNumber: number) => {
    setMilestones((prev) =>
      prev.filter((m) => !(m.class_number === classNumber && m.theme_number === themeNumber))
    );
  };

  const removeClass = (classNumber: number) => {
    setMilestones((prev) => prev.filter((m) => m.class_number !== classNumber));
    setExpandedClasses((prev) => { const next = new Set(prev); next.delete(classNumber); return next; });
  };

  const toggleThemeExpanded = (themeId: string) => {
    setExpandedThemes((prev) => {
      const next = new Set(prev);
      if (next.has(themeId)) next.delete(themeId);
      else next.add(themeId);
      return next;
    });
  };

  const addPrompt = (classNumber: number, themeNumber: number) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.class_number === classNumber && m.theme_number === themeNumber
          ? {
              ...m,
              prompts: [
                ...(m.prompts || []),
                { prompt_text: '', sort_order: (m.prompts?.length || 0), _isNew: true },
              ],
            }
          : m
      )
    );
  };

  const updatePrompt = (classNumber: number, themeNumber: number, index: number, text: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.class_number === classNumber && m.theme_number === themeNumber
          ? {
              ...m,
              prompts: (m.prompts || []).map((p, i) => (i === index ? { ...p, prompt_text: text } : p)),
            }
          : m
      )
    );
  };

  const removePrompt = (classNumber: number, themeNumber: number, index: number) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.class_number === classNumber && m.theme_number === themeNumber
          ? { ...m, prompts: (m.prompts || []).filter((_, i) => i !== index) }
          : m
      )
    );
  };

  const addDailyActivity = () => {
    const maxWeek = dailyActivities.length > 0 ? Math.max(...dailyActivities.map((a) => a.week_number)) : 0;
    const newActivity: DailyActivityForm = {
      week_number: maxWeek + 1,
      day_of_week: 1,
      task_title: '',
      task_description: '',
      activity_date: '',
      sort_order: dailyActivities.length,
      _isNew: true,
    };
    const firstMilestoneDate = milestones.find(m => m.class_date);
    if (firstMilestoneDate) {
      newActivity.activity_date = calculateActivityDate(firstMilestoneDate.class_date, newActivity.week_number, newActivity.day_of_week);
    }
    setDailyActivities((prev) => [...prev, newActivity]);
  };

  const updateDailyActivity = (
    index: number,
    field: 'week_number' | 'day_of_week' | 'task_title' | 'task_description' | 'activity_date',
    value: string | number
  ) => {
    setDailyActivities((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  };

  const removeDailyActivity = (index: number) => {
    setDailyActivities((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleActivityCollapsed = (index: number) => {
    setCollapsedActivities((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const duplicateActivity = (index: number) => {
    const activity = dailyActivities[index];
    const firstMilestoneDate = milestones.find(m => m.class_date);
    let activityDate = activity.activity_date;
    if (firstMilestoneDate && !activityDate) {
      activityDate = calculateActivityDate(firstMilestoneDate.class_date, activity.week_number, activity.day_of_week);
    }
    const newActivity: DailyActivityForm = {
      ...activity,
      id: undefined,
      activity_date: activityDate,
      _isNew: true,
      _isSaving: false,
      _saveStatus: 'idle',
    };
    setDailyActivities((prev) => [...prev, newActivity]);
  };

  const saveSingleActivity = async (index: number) => {
    if (!programId) return;
    const activity = dailyActivities[index];
    if (!activity.task_title.trim()) return;

    setDailyActivities((prev) =>
      prev.map((a, i) => (i === index ? { ...a, _isSaving: true, _saveStatus: 'saving' } : a))
    );

    const activityData = {
      program_id: programId,
      week_number: activity.week_number,
      day_of_week: activity.day_of_week,
      task_title: activity.task_title.trim(),
      task_description: activity.task_description.trim(),
      sort_order: index,
    };

    try {
      if (activity.id) {
        await supabase.from('daily_homework_tasks').update(activityData).eq('id', activity.id);
      } else {
        const { data } = await supabase
          .from('daily_homework_tasks')
          .insert(activityData)
          .select('id')
          .maybeSingle();
        if (data?.id) {
          setDailyActivities((prev) =>
            prev.map((a, i) => (i === index ? { ...a, id: data.id, _isNew: false } : a))
          );
        }
      }
      setDailyActivities((prev) =>
        prev.map((a, i) => (i === index ? { ...a, _isSaving: false, _saveStatus: 'saved' } : a))
      );
      setTimeout(() => {
        setDailyActivities((prev) =>
          prev.map((a, i) => (i === index ? { ...a, _saveStatus: 'idle' } : a))
        );
      }, 2000);
    } catch {
      setDailyActivities((prev) =>
        prev.map((a, i) => (i === index ? { ...a, _isSaving: false, _saveStatus: 'idle' } : a))
      );
    }
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.trim().split('\n');
    if (lines.length < 2) return;

    const newActivities: DailyActivityForm[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].match(/"([^"]*)"|([^,]+)/g);
      if (!values || values.length < 4) continue;

      const weekNum = parseInt(values[0].replace(/['"]/g, ''));
      const dayStr = values[1].replace(/['"]/g, '').trim();
      const dayMap: Record<string, number> = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 7 };
      const dayNum = dayMap[dayStr] || 1;
      const title = values[2]?.replace(/['"]/g, '').trim() || '';
      const desc = values[3]?.replace(/['"]/g, '').trim() || '';

      if (title && !isNaN(weekNum)) {
        newActivities.push({
          week_number: weekNum,
          day_of_week: dayNum,
          task_title: title,
          task_description: desc,
          activity_date: '',
          sort_order: dailyActivities.length + newActivities.length,
          _isNew: true,
        });
      }
    }

    const sorted = [...dailyActivities, ...newActivities].sort((a, b) => {
      if (a.week_number !== b.week_number) return a.week_number - b.week_number;
      return a.day_of_week - b.day_of_week;
    });
    setDailyActivities(sorted);
    event.target.value = '';
  };

  const handleSave = async () => {
    setError(null);
    if (!form.title.trim()) { setError('Program title is required.'); return; }
    if (!form.slug.trim()) { setError('Program slug is required.'); return; }

    setSaving(true);

    let programId = isNew ? null : id;

    const programData = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      category: form.category,
      difficulty_level: form.difficulty_level,
      required_role: form.required_role,
      cover_image_url: form.cover_image_url.trim() || null,
      is_published: form.is_published,
      admin_id: profile!.id,
      instructor_id: form.instructor_id || profile!.id,
    };

    if (isNew) {
      const { data, error: insertErr } = await supabase.from('programs').insert(programData).select('id').maybeSingle();
      if (insertErr) { setError(insertErr.message); setSaving(false); return; }
      programId = data?.id ?? null;
    } else {
      const { error: updateErr } = await supabase.from('programs').update(programData).eq('id', programId!);
      if (updateErr) { setError(updateErr.message); setSaving(false); return; }
    }

    if (!programId) { setError('Failed to save program.'); setSaving(false); return; }
    setProgramId(programId);

    let sortOrder = 0;
    const savedMilestoneIds = new Map<string, string>();

    for (const m of milestones) {
      const milestoneData = {
        program_id: programId,
        class_number: m.class_number,
        theme_number: m.theme_number,
        title: m.title.trim(),
        description: m.description.trim(),
        class_date: m.class_date || null,
        class_time: m.class_time || null,
        duration_minutes: m.duration_minutes || 60,
        class_link: m.class_link.trim() || null,
        sort_order: sortOrder++,
      };

      let milestoneId = m.id;
      if (m.id) {
        await supabase.from('program_milestones').update(milestoneData).eq('id', m.id);
      } else {
        const { data: inserted } = await supabase
          .from('program_milestones')
          .insert(milestoneData)
          .select('id')
          .maybeSingle();
        milestoneId = inserted?.id;
      }

      if (milestoneId) {
        savedMilestoneIds.set(`${m.class_number}-${m.theme_number}`, milestoneId);

        if (m.prompts && m.prompts.length > 0) {
          for (let i = 0; i < m.prompts.length; i++) {
            const prompt = m.prompts[i];
            const promptData = {
              milestone_id: milestoneId,
              prompt_text: prompt.prompt_text.trim(),
              sort_order: i,
            };

            if (prompt.id) {
              await supabase
                .from('milestone_journal_prompts')
                .update(promptData)
                .eq('id', prompt.id);
            } else if (prompt.prompt_text.trim()) {
              await supabase.from('milestone_journal_prompts').insert(promptData);
            }
          }
        }
      }
    }

    let activitySortOrder = 0;
    for (const activity of dailyActivities) {
      const activityData = {
        program_id: programId,
        week_number: activity.week_number,
        day_of_week: activity.day_of_week,
        task_title: activity.task_title.trim(),
        task_description: activity.task_description.trim(),
        activity_date: activity.activity_date || null,
        sort_order: activitySortOrder++,
      };

      if (activity.id) {
        await supabase.from('daily_homework_tasks').update(activityData).eq('id', activity.id);
      } else if (activity.task_title.trim()) {
        await supabase.from('daily_homework_tasks').insert(activityData);
      }
    }

    setSaving(false);
    navigate('/admin/programs');
  };

  const classGroups = groupByClass(milestones);
  const classCount = classGroups.length;
  const themeCount = milestones.length;

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/admin/programs')}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">{isNew ? 'New Program' : 'Edit Program'}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{isNew ? 'Fill in the details below to create a new program.' : 'Update program details and class schedule.'}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Program'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-3 mb-6 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-6">
        <section className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-400" /> Program Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Title <span className="text-rose-400">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="e.g. Flow Into Spring: 8-Week Yoga Cohort"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                URL Slug <span className="text-rose-400">*</span>
                <span className="ml-2 text-slate-500 font-normal">/dashboard/programs/<em>{form.slug || 'slug'}</em></span>
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => { setSlugManual(true); handleFormChange('slug', slugify(e.target.value)); }}
                placeholder="flow-into-spring"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={3}
                placeholder="Describe what students will experience in this program…"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Cover Image URL</label>
              <input
                type="url"
                value={form.cover_image_url}
                onChange={(e) => handleFormChange('cover_image_url', e.target.value)}
                placeholder="https://images.pexels.com/…"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Instructor
              </label>
              <select
                value={form.instructor_id}
                onChange={(e) => handleFormChange('instructor_id', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors"
              >
                <option value="">— Unassigned —</option>
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.full_name} ({i.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                >
                  {PROGRAM_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Difficulty</label>
                <select
                  value={form.difficulty_level}
                  onChange={(e) => handleFormChange('difficulty_level', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors capitalize"
                >
                  {DIFFICULTY_LEVELS.map((d) => (
                    <option key={d} value={d} className="capitalize">{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Required Role</label>
                <select
                  value={form.required_role}
                  onChange={(e) => handleFormChange('required_role', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                >
                  {REQUIRED_ROLES.map((r) => (
                    <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => handleFormChange('is_published', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-checked:bg-rose-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
              </label>
              <span className="text-sm text-slate-300">Published — visible to eligible students</span>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Class Schedule
            </h2>
            <button
              onClick={addClass}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5" /> Add Class
            </button>
          </div>

          {classCount > 0 && (
            <p className="text-xs text-slate-500 mb-4">
              {classCount} {classCount === 1 ? 'class' : 'classes'} &middot; {themeCount} {themeCount === 1 ? 'theme' : 'themes'} total
            </p>
          )}

          {classGroups.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-700 rounded-lg">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No classes added yet.</p>
              <p className="text-slate-600 text-xs mt-1">Add classes to define the program schedule and Zoom links.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {classGroups.map((cls) => {
                const expanded = expandedClasses.has(cls.class_number);
                const ref = cls.themes[0];
                return (
                  <div key={cls.class_number} className="border border-slate-700 rounded-xl overflow-hidden">
                    <div
                      className="flex items-center gap-3 px-4 py-3 bg-slate-800 cursor-pointer select-none"
                      onClick={() => toggleClass(cls.class_number)}
                    >
                      <GripVertical className="w-4 h-4 text-slate-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-300 bg-slate-700 px-2 py-0.5 rounded shrink-0">
                        Class {cls.class_number}
                      </span>
                      {ref?.class_date && (
                        <span className="text-xs text-slate-500 shrink-0">
                          {new Date(ref.class_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {ref.class_time && ` · ${new Date('1970-01-01T' + ref.class_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
                        </span>
                      )}
                      <span className="flex-1" />
                      <span className="text-xs text-slate-500 shrink-0">
                        {cls.themes.length} {cls.themes.length === 1 ? 'theme' : 'themes'}
                      </span>
                      {ref?.class_link && (
                        <span className="text-xs bg-sage-500/20 text-sage-400 px-2 py-0.5 rounded font-medium shrink-0">Zoom</span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeClass(cls.class_number); }}
                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors shrink-0"
                        title="Remove class"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {expanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </div>

                    {expanded && (
                      <div className="border-t border-slate-700 bg-slate-900/50">
                        <div className="p-4 space-y-4 border-b border-slate-700/50">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Schedule &amp; Link</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Class Date
                              </label>
                              <input
                                type="date"
                                value={ref?.class_date || ''}
                                onChange={(e) => updateClassField(cls.class_number, 'class_date', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors [color-scheme:dark]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> Start Time
                              </label>
                              <input
                                type="time"
                                value={ref?.class_time || ''}
                                onChange={(e) => updateClassField(cls.class_number, 'class_time', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors [color-scheme:dark]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> Duration (min)
                              </label>
                              <input
                                type="number"
                                min="5"
                                max="480"
                                value={ref?.duration_minutes || 60}
                                onChange={(e) => updateClassField(cls.class_number, 'duration_minutes', parseInt(e.target.value) || 60)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                              <LinkIcon className="w-3.5 h-3.5" /> Zoom Link
                              <span className="text-slate-600 font-normal">— activates 15 min before, disables 30 min after</span>
                            </label>
                            <input
                              type="url"
                              value={ref?.class_link || ''}
                              onChange={(e) => updateClassField(cls.class_number, 'class_link', e.target.value)}
                              placeholder="https://zoom.us/j/…"
                              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors font-mono"
                            />
                            {ref?.class_date && ref?.class_time && ref?.class_link && (
                              <p className="text-xs text-sage-400 mt-1.5">
                                Link activates {new Date(ref.class_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {(() => {
                                  const [h, min] = ref.class_time.split(':');
                                  const d = new Date();
                                  d.setHours(parseInt(h), parseInt(min) - 15);
                                  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                                })()}.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Themes</p>
                            <button
                              onClick={() => addTheme(cls.class_number)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-700"
                            >
                              <Plus className="w-3 h-3" /> Add Theme
                            </button>
                          </div>

                          <div className="space-y-2">
                            {cls.themes
                              .sort((a, b) => a.theme_number - b.theme_number)
                              .map((theme) => {
                                const themeId = theme.id || `${theme.class_number}-${theme.theme_number}`;
                                const isThemeExpanded = expandedThemes.has(themeId);
                                return (
                                  <div key={`${theme.class_number}-${theme.theme_number}`} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                                    <div className="p-3 cursor-pointer hover:bg-slate-700/50 transition-colors" onClick={() => toggleThemeExpanded(themeId)}>
                                      <div className="flex items-center gap-2 mb-2.5">
                                        <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded shrink-0">
                                          Theme {theme.theme_number}
                                        </span>
                                        <div className="flex-1" />
                                        {cls.themes.length > 1 && (
                                          <button
                                            onClick={(e) => { e.stopPropagation(); removeTheme(theme.class_number, theme.theme_number); }}
                                            className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
                                            title="Remove theme"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        )}
                                        <button className="w-5 h-5 flex items-center justify-center text-slate-500" title="Expand theme details">
                                          {isThemeExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                      </div>
                                      <div className="space-y-2">
                                        <input
                                          type="text"
                                          value={theme.title}
                                          onChange={(e) => { e.stopPropagation(); updateTheme(theme.class_number, theme.theme_number, 'title', e.target.value); }}
                                          onClick={(e) => e.stopPropagation()}
                                          placeholder="Theme title…"
                                          className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                                        />
                                        <textarea
                                          value={theme.description}
                                          onChange={(e) => { e.stopPropagation(); updateTheme(theme.class_number, theme.theme_number, 'description', e.target.value); }}
                                          onClick={(e) => e.stopPropagation()}
                                          rows={2}
                                          placeholder="Brief description of this theme…"
                                          className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors resize-none"
                                        />
                                      </div>
                                    </div>

                                    {isThemeExpanded && (
                                      <div className="border-t border-slate-700 bg-slate-900/50 p-3 space-y-3">
                                        <div className="flex items-center justify-between">
                                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                            <Pen className="w-3.5 h-3.5" /> Journal Prompts
                                          </p>
                                          <button
                                            onClick={() => addPrompt(theme.class_number, theme.theme_number)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600"
                                          >
                                            <Plus className="w-3 h-3" /> Add Prompt
                                          </button>
                                        </div>

                                        {(theme.prompts || []).length === 0 ? (
                                          <p className="text-xs text-slate-500 italic">No journal prompts yet. Add one to engage students in reflection.</p>
                                        ) : (
                                          <div className="space-y-2">
                                            {(theme.prompts || []).map((prompt, idx) => (
                                              <div key={idx} className="flex gap-2">
                                                <input
                                                  type="text"
                                                  value={prompt.prompt_text}
                                                  onChange={(e) => updatePrompt(theme.class_number, theme.theme_number, idx, e.target.value)}
                                                  placeholder={`Prompt ${idx + 1}…`}
                                                  className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                                                />
                                                <button
                                                  onClick={() => removePrompt(theme.class_number, theme.theme_number, idx)}
                                                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
                                                  title="Remove prompt"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
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
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-slate-400" /> Daily Practice Activities
            </h2>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> Upload CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={downloadCSVTemplate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" /> Template
              </button>
              <button
                onClick={addDailyActivity}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Activity
              </button>
            </div>
          </div>

          {dailyActivities.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-700 rounded-lg">
              <CheckSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No daily activities yet.</p>
              <p className="text-slate-600 text-xs mt-1">Add activities to give students daily practice tasks between classes.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dailyActivities.map((activity, idx) => {
                const isCollapsed = collapsedActivities.has(idx);
                const isSaving = activity._isSaving || false;
                const saveStatus = activity._saveStatus || 'idle';
                const firstMilestoneDate = milestones.find(m => m.class_date)?.class_date || '';
                const actDate = calculateActivityDate(firstMilestoneDate, activity.week_number, activity.day_of_week);

                return (
                  <div key={idx} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                    <div className="p-3">
                      <div className="flex items-center gap-3 mb-3">
                        <button
                          onClick={() => toggleActivityCollapsed(idx)}
                          className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
                          title={isCollapsed ? 'Expand' : 'Collapse'}
                        >
                          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </button>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
                          W{activity.week_number} {getDayName(activity.day_of_week)}
                        </span>
                        <h3 className="flex-1 text-sm font-semibold text-white truncate">{activity.task_title || 'Untitled Activity'}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => duplicateActivity(idx)}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
                            title="Duplicate activity"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {!activity._isNew && (
                            <button
                              onClick={() => saveSingleActivity(idx)}
                              disabled={isSaving || saveStatus === 'saved'}
                              className={`w-6 h-6 flex items-center justify-center transition-colors ${
                                saveStatus === 'saved'
                                  ? 'text-sage-400'
                                  : 'text-slate-500 hover:text-slate-300 disabled:opacity-50'
                              }`}
                              title="Save activity"
                            >
                              {saveStatus === 'saved' ? (
                                <ThumbsUp className="w-3.5 h-3.5" />
                              ) : (
                                <Save className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => removeDailyActivity(idx)}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
                            title="Remove activity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {!isCollapsed && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1.5">Week</label>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={activity.week_number}
                                onChange={(e) => updateDailyActivity(idx, 'week_number', parseInt(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1.5">Day</label>
                              <select
                                value={activity.day_of_week}
                                onChange={(e) => updateDailyActivity(idx, 'day_of_week', parseInt(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                              >
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, d) => (
                                  <option key={d} value={d + 1}>{day}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Practice Date
                              </label>
                              <input
                                type="date"
                                value={activity.activity_date || ''}
                                onChange={(e) => updateDailyActivity(idx, 'activity_date', e.target.value)}
                                placeholder={actDate || undefined}
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors [color-scheme:dark]"
                              />
                              {!activity.activity_date && actDate && (
                                <p className="text-xs text-slate-500 mt-1">Preset: {new Date(actDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                              )}
                            </div>
                          </div>
                          <input
                            type="text"
                            value={activity.task_title}
                            onChange={(e) => updateDailyActivity(idx, 'task_title', e.target.value)}
                            placeholder="Activity title…"
                            className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                          />
                          <textarea
                            value={activity.task_description}
                            onChange={(e) => updateDailyActivity(idx, 'task_description', e.target.value)}
                            rows={2}
                            placeholder="Activity description…"
                            className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors resize-none"
                          />
                          {activity._isNew && (
                            <p className="text-xs text-slate-500">This activity will be saved when you click Save Program</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <button
                onClick={addDailyActivity}
                className="w-full py-2.5 border-2 border-dashed border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-300 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Another Activity
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          onClick={() => navigate('/admin/programs')}
          className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Program'}
        </button>
      </div>
    </div>
  );
}
