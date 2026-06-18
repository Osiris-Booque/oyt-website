import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Users, Calendar, Clock, ExternalLink, BookOpen,
  CheckCircle, AlertCircle, Eye, EyeOff, ChevronDown, ChevronUp,
  UserPlus, UserX, Search, X,
} from 'lucide-react';
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
}

interface Milestone {
  id: string;
  class_number: number;
  theme_number: number;
  title: string;
  description: string | null;
  class_date: string | null;
  class_time: string | null;
  class_link: string | null;
  sort_order: number;
}

interface Enrollee {
  id: string;
  enrollment_id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
}

interface MemberProfile {
  id: string;
  full_name: string;
}

interface EnrollmentRow {
  id: string;
  profiles: Omit<Enrollee, 'enrollment_id'> | null;
}

export default function InstructorProgram() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const [program, setProgram] = useState<Program | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [enrollees, setEnrollees] = useState<Enrollee[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const [showEnrollees, setShowEnrollees] = useState(false);

  const [showAddMember, setShowAddMember] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberResults, setMemberResults] = useState<MemberProfile[]>([]);
  const [searchingMembers, setSearchingMembers] = useState(false);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (programId: string) => {
    const [progRes, milRes, enrollRes] = await Promise.all([
      supabase.from('programs').select('*').eq('id', programId).eq('instructor_id', profile!.id).maybeSingle(),
      supabase.from('program_milestones').select('*').eq('program_id', programId).order('sort_order'),
      supabase
        .from('enrollments')
        .select('id, profiles(id, full_name, avatar_url, role)')
        .eq('program_id', programId),
    ]);

    if (progRes.data) setProgram(progRes.data);
    if (milRes.data) setMilestones(milRes.data);
    if (enrollRes.data) {
      setEnrollees(
        (enrollRes.data as EnrollmentRow[])
          .map((e) => (e.profiles ? { enrollment_id: e.id, ...e.profiles } : null))
          .filter((e): e is Enrollee => Boolean(e?.id))
      );
    }
    setLoading(false);
  };

  const searchMembers = async (query: string) => {
    setMemberSearch(query);
    if (query.trim().length < 2) { setMemberResults([]); return; }
    setSearchingMembers(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name')
      .ilike('full_name', `%${query}%`)
      .limit(8);
    setMemberResults((data || []).filter((m) => !enrollees.find((e) => e.id === m.id)));
    setSearchingMembers(false);
  };

  const handleEnroll = async (memberId: string, memberName: string) => {
    if (!program) return;
    setEnrollingId(memberId);
    const { data } = await supabase.from('enrollments').upsert(
      { user_id: memberId, program_id: program.id, status: 'active' },
      { onConflict: 'user_id,program_id' }
    ).select('id').maybeSingle();
    setEnrollees((prev) => [...prev, { id: memberId, enrollment_id: data?.id || '', full_name: memberName, avatar_url: null, role: 'member' }]);
    setMemberResults((prev) => prev.filter((m) => m.id !== memberId));
    setEnrollingId(null);
  };

  const handleUnenroll = async (enrolleeId: string, enrollmentId: string) => {
    await supabase.from('enrollments').delete().eq('id', enrollmentId);
    setEnrollees((prev) => prev.filter((e) => e.id !== enrolleeId));
  };

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!program) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600">Program not found or you don't have access.</p>
        <Link to="/instructor" className="text-amber-700 text-sm font-medium mt-3 inline-block hover:underline">
          Back to my programs
        </Link>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  const classNumbers = Array.from(new Set(milestones.map(m => m.class_number)));
  const classGroups = classNumbers.map(cn => {
    const themes = milestones.filter(m => m.class_number === cn);
    return { class_number: cn, themes, class_date: themes[0]?.class_date || null };
  }).sort((a, b) => a.class_number - b.class_number);

  const upcomingClasses = classGroups.filter(c => c.class_date && c.class_date >= today);
  const pastClasses = classGroups.filter(c => !c.class_date || c.class_date < today);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/instructor"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-amber-100 hover:text-amber-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-900 truncate">{program.title}</h1>
          <p className="text-sm text-slate-500 capitalize">{program.category} &middot; {program.difficulty_level}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${
          program.is_published ? 'bg-sage-100 text-sage-700 border border-sage-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}>
          {program.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {program.is_published ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-amber-200 p-5 shadow-sm">
          {program.cover_image_url && (
            <img src={program.cover_image_url} alt={program.title} className="w-full h-48 object-cover rounded-xl mb-4" />
          )}
          <h2 className="font-semibold text-slate-900 mb-2">{program.title}</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{program.description || 'No description provided.'}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowEnrollees(!showEnrollees)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{enrollees.length}</p>
                  <p className="text-xs text-slate-500">Enrolled students</p>
                </div>
              </div>
              {showEnrollees ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {showEnrollees && (
              <div className="mt-3 pt-3 border-t border-amber-100">
                <div className="space-y-1.5 mb-3">
                  {enrollees.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No students enrolled yet.</p>
                  )}
                  {enrollees.map((e) => (
                    <div key={e.id} className="flex items-center justify-between gap-2 bg-amber-50 rounded-lg px-2.5 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-amber-800 text-xs font-bold">{e.full_name?.[0]?.toUpperCase() || '?'}</span>
                        </div>
                        <p className="text-sm text-slate-700 truncate">{e.full_name}</p>
                      </div>
                      <button
                        onClick={(ev) => { ev.stopPropagation(); handleUnenroll(e.id, e.enrollment_id); }}
                        className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                        title="Remove from program"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {!showAddMember ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowAddMember(true); setMemberSearch(''); setMemberResults([]); }}
                    className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-semibold transition-colors w-full justify-center border border-amber-200 rounded-lg py-2 hover:bg-amber-50"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Add Member
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={memberSearch}
                        onChange={(e) => { e.stopPropagation(); searchMembers(e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Search by name…"
                        className="w-full bg-stone-50 border border-amber-200 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    {searchingMembers && <p className="text-xs text-slate-400">Searching...</p>}
                    {memberResults.length > 0 && (
                      <div className="space-y-1">
                        {memberResults.map((m) => (
                          <div key={m.id} className="flex items-center justify-between bg-white border border-amber-100 rounded-lg px-2.5 py-2">
                            <p className="text-xs text-slate-700">{m.full_name}</p>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEnroll(m.id, m.full_name); }}
                              disabled={enrollingId === m.id}
                              className="text-xs font-semibold text-sage-700 hover:text-sage-900 transition-colors disabled:opacity-50"
                            >
                              {enrollingId === m.id ? 'Adding…' : 'Enroll'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {memberSearch.length >= 2 && !searchingMembers && memberResults.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No matching members found.</p>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowAddMember(false); setMemberSearch(''); setMemberResults([]); }}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-sage-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{classGroups.length}</p>
                <p className="text-xs text-slate-500">Total classes</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>{upcomingClasses.length} upcoming</span>
              <span>{pastClasses.length} past</span>
            </div>
          </div>
        </div>
      </div>

      {upcomingClasses.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" /> Upcoming Classes
          </h2>
          <div className="space-y-2">
            {upcomingClasses.map((cls) => (
              <ClassCard
                key={cls.class_number}
                classGroup={cls}
                expanded={expandedMilestone === String(cls.class_number)}
                onToggle={() => setExpandedMilestone(expandedMilestone === String(cls.class_number) ? null : String(cls.class_number))}
                upcoming
              />
            ))}
          </div>
        </section>
      )}

      {pastClasses.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-slate-400" /> Past Classes
          </h2>
          <div className="space-y-2">
            {pastClasses.map((cls) => (
              <ClassCard
                key={cls.class_number}
                classGroup={cls}
                expanded={expandedMilestone === String(cls.class_number)}
                onToggle={() => setExpandedMilestone(expandedMilestone === String(cls.class_number) ? null : String(cls.class_number))}
                upcoming={false}
              />
            ))}
          </div>
        </section>
      )}

      {classGroups.length === 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 p-12 text-center shadow-sm">
          <BookOpen className="w-10 h-10 text-amber-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No classes have been scheduled for this program yet.</p>
        </div>
      )}
    </div>
  );
}

function ClassCard({
  classGroup, expanded, onToggle, upcoming,
}: {
  classGroup: { class_number: number; themes: Milestone[]; class_date: string | null };
  expanded: boolean;
  onToggle: () => void;
  upcoming: boolean;
}) {
  const ref = classGroup.themes[0];

  const isLinkActive = () => {
    if (!ref?.class_date || !ref?.class_time || !ref?.class_link) return false;
    const classStart = new Date(`${ref.class_date}T${ref.class_time}`);
    const now = new Date();
    const activateAt = new Date(classStart.getTime() - 15 * 60 * 1000);
    const deactivateAt = new Date(classStart.getTime() + 30 * 60 * 1000);
    return now >= activateAt && now <= deactivateAt;
  };

  const active = isLinkActive();

  return (
    <div className={`bg-white rounded-xl border transition-colors ${upcoming ? 'border-amber-200 hover:border-amber-300' : 'border-slate-200 hover:border-slate-300'} shadow-sm overflow-hidden`}>
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={onToggle}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${upcoming ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>
          {classGroup.class_number}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900">
            Class {classGroup.class_number}
            <span className="ml-2 text-xs font-normal text-slate-500">
              {classGroup.themes.length} {classGroup.themes.length === 1 ? 'theme' : 'themes'}
            </span>
          </p>
          {ref?.class_date && (
            <p className="text-xs text-slate-500">
              {new Date(ref.class_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              {ref.class_time && ` at ${formatTime(ref.class_time)}`}
            </p>
          )}
        </div>
        {ref?.class_link && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${active ? 'bg-sage-100 text-sage-700' : 'bg-slate-100 text-slate-500'}`}>
            {active ? 'Live now' : 'Zoom'}
          </span>
        )}
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </div>

      {expanded && (
        <div className="border-t border-slate-100">
          {ref?.class_link && (
            <div className="px-4 pt-3 pb-3 border-b border-slate-100">
              <a
                href={ref.class_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-sage-600 hover:bg-sage-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                {active ? 'Join Class Now' : 'Zoom Link'}
              </a>
            </div>
          )}

          <div className="px-4 py-3 space-y-3">
            {classGroup.themes
              .sort((a, b) => a.theme_number - b.theme_number)
              .map((theme) => (
                <div key={theme.id || `${theme.class_number}-${theme.theme_number}`} className="flex gap-3">
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded h-fit shrink-0 mt-0.5">
                    T{theme.theme_number}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{theme.title || 'Untitled theme'}</p>
                    {theme.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{theme.description}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(time: string) {
  const [h, m] = time.split(':');
  const d = new Date();
  d.setHours(parseInt(h), parseInt(m));
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
