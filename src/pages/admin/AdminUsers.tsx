import { useEffect, useState, useRef } from 'react';
import { Search, ChevronDown, Users, BookOpen, Pen, CheckSquare, Plus, Trash2, X, Check, UserPlus, Eye, EyeOff, AlertTriangle, UserCheck, UserX, GraduationCap, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ROLE_LABELS, ROLE_COLORS, ALL_ROLES, highestRole } from '../../lib/constants';
import { useAuth } from '../../components/context/AuthContext';

interface UserRow {
  id: string;
  full_name: string;
  role: string;
  roles: string[];
  created_at: string;
  bio: string | null;
  headline: string | null;
  enrollment_count: number;
  journal_count: number;
  task_count: number;
}

interface CreateForm {
  full_name: string;
  email: string;
  password: string;
  role: string;
}

interface Program {
  id: string;
  title: string;
  slug: string;
}

interface UserEnrollment {
  id: string;
  program_id: string;
  status: string;
  enrolled_at: string;
  program_title: string;
}

interface UserPayment {
  id: string;
  program_id: string;
  program_title: string;
  amount: number;
  status: string;
  payment_method_last4: string | null;
  payment_method_expiry: string | null;
  created_at: string;
  confirmed_at: string | null;
}

interface EnrollmentRow {
  id: string;
  program_id: string;
  status: string;
  enrolled_at: string;
  programs: { title: string } | null;
}

interface PaymentRow {
  id: string;
  program_id: string;
  amount: number;
  status: string;
  payment_method_last4: string | null;
  payment_method_expiry: string | null;
  created_at: string;
  confirmed_at: string | null;
  programs: { title: string } | null;
}

export default function AdminUsers() {
  const { profile: adminProfile } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [enrollmentsByUser, setEnrollmentsByUser] = useState<Record<string, UserEnrollment[]>>({});
  const [paymentsByUser, setPaymentsByUser] = useState<Record<string, UserPayment[]>>({});
  const [loadingEnrollments, setLoadingEnrollments] = useState<string | null>(null);
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [enrollingUserId, setEnrollingUserId] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  const [editingRolesId, setEditingRolesId] = useState<string | null>(null);
  const [editingRoles, setEditingRoles] = useState<string[]>([]);
  const [savingRoles, setSavingRoles] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>({ full_name: '', email: '', password: '', role: 'member' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadUsers(); loadAllPrograms(); }, []);

  const loadAllPrograms = async () => {
    const { data } = await supabase.from('programs').select('id, title, slug').eq('is_published', true).order('title');
    if (data) setAllPrograms(data);
  };

  const loadUserEnrollments = async (userId: string) => {
    if (enrollmentsByUser[userId]) return;
    setLoadingEnrollments(userId);
    const [enrollRes, payRes] = await Promise.all([
      supabase
        .from('enrollments')
        .select('id, program_id, status, enrolled_at, programs(title)')
        .eq('user_id', userId),
      supabase
        .from('payments')
        .select('id, program_id, amount, status, payment_method_last4, payment_method_expiry, created_at, confirmed_at, programs(title)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
    ]);
    if (enrollRes.data) {
      setEnrollmentsByUser((prev) => ({
        ...prev,
        [userId]: enrollRes.data.map((e: EnrollmentRow) => ({
          id: e.id,
          program_id: e.program_id,
          status: e.status,
          enrolled_at: e.enrolled_at,
          program_title: e.programs?.title || 'Unknown',
        })),
      }));
    }
    if (payRes.data) {
      setPaymentsByUser((prev) => ({
        ...prev,
        [userId]: payRes.data.map((p: PaymentRow) => ({
          id: p.id,
          program_id: p.program_id,
          program_title: p.programs?.title || 'Unknown',
          amount: p.amount,
          status: p.status,
          payment_method_last4: p.payment_method_last4,
          payment_method_expiry: p.payment_method_expiry,
          created_at: p.created_at,
          confirmed_at: p.confirmed_at,
        })),
      }));
    }
    setLoadingEnrollments(null);
  };

  const handleEnroll = async (userId: string) => {
    if (!selectedProgramId) return;
    setEnrolling(true);
    await supabase.from('enrollments').upsert(
      { user_id: userId, program_id: selectedProgramId, status: 'active' },
      { onConflict: 'user_id,program_id' }
    );
    setEnrollmentsByUser((prev) => {
      const prog = allPrograms.find((p) => p.id === selectedProgramId);
      const existing = prev[userId] || [];
      const already = existing.find((e) => e.program_id === selectedProgramId);
      if (already) {
        return { ...prev, [userId]: existing.map((e) => e.program_id === selectedProgramId ? { ...e, status: 'active' } : e) };
      }
      return {
        ...prev,
        [userId]: [...existing, { id: '', program_id: selectedProgramId, status: 'active', enrolled_at: new Date().toISOString(), program_title: prog?.title || '' }],
      };
    });
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, enrollment_count: u.enrollment_count + 1 } : u));
    setEnrollingUserId(null);
    setSelectedProgramId('');
    setEnrolling(false);
  };

  const handleUnenroll = async (userId: string, enrollmentId: string, programId: string) => {
    await supabase.from('enrollments').delete().eq('id', enrollmentId);
    setEnrollmentsByUser((prev) => ({
      ...prev,
      [userId]: (prev[userId] || []).filter((e) => e.program_id !== programId),
    }));
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, enrollment_count: Math.max(0, u.enrollment_count - 1) } : u));
  };

  const loadUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, role, roles, created_at, bio, headline')
      .order('created_at', { ascending: false });

    if (!profiles) { setLoading(false); return; }

    const enriched: UserRow[] = await Promise.all(
      profiles.map(async (p) => {
        const [enrollRes, journalRes, taskRes] = await Promise.all([
          supabase.from('enrollments').select('id', { count: 'exact', head: true }).eq('user_id', p.id),
          supabase.from('user_journal_responses').select('id', { count: 'exact', head: true }).eq('user_id', p.id),
          supabase.from('user_task_completions').select('id', { count: 'exact', head: true }).eq('user_id', p.id),
        ]);
        return {
          ...p,
          roles: p.roles?.length ? p.roles : [p.role],
          enrollment_count: enrollRes.count || 0,
          journal_count: journalRes.count || 0,
          task_count: taskRes.count || 0,
        };
      })
    );

    setUsers(enriched);
    setLoading(false);
  };

  const startEditRoles = (u: UserRow, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRolesId(u.id);
    setEditingRoles([...u.roles]);
  };

  const toggleRole = (role: string) => {
    setEditingRoles((prev) =>
      prev.includes(role) ? (prev.length > 1 ? prev.filter((r) => r !== role) : prev) : [...prev, role]
    );
  };

  const saveRoles = async (userId: string) => {
    setSavingRoles(true);
    const primary = highestRole(editingRoles);
    await supabase.from('profiles').update({ roles: editingRoles, role: primary }).eq('id', userId);
    setUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, roles: editingRoles, role: primary } : u)
    );
    setEditingRolesId(null);
    setSavingRoles(false);
  };

  const handleCreate = async () => {
    setCreateError('');
    if (!createForm.full_name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      setCreateError('All fields are required.');
      return;
    }
    if (createForm.password.length < 6) {
      setCreateError('Password must be at least 6 characters.');
      return;
    }
    setCreateLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-user-management/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          email: createForm.email.trim(),
          password: createForm.password,
          full_name: createForm.full_name.trim(),
          role: createForm.role,
        }),
      }
    );

    const json = await res.json();
    setCreateLoading(false);

    if (!res.ok || json.error) {
      setCreateError(json.error || 'Failed to create user.');
      return;
    }

    setShowCreate(false);
    setCreateForm({ full_name: '', email: '', password: '', role: 'member' });
    await loadUsers();
  };

  const handleDelete = async (userId: string) => {
    setDeleteLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-user-management/delete/${userId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session?.access_token}` },
      }
    );
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setDeleteConfirmId(null);
    setDeleteLoading(false);
    setExpandedId(null);
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.full_name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.roles.includes(roleFilter);
    return matchSearch && matchRole;
  });

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 text-sm mt-1">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateError(''); }}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Create User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-700 text-white rounded-lg pl-3.5 pr-9 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors"
          >
            <option value="all">All Roles</option>
            {ALL_ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-16 text-center">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No users match your filters.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((u) => {
            const isExpanded = expandedId === u.id;
            const isEditingRoles = editingRolesId === u.id;
            const isConfirmingDelete = deleteConfirmId === u.id;
            const isSelf = adminProfile?.id === u.id;

            return (
              <div key={u.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  onClick={() => { const next = isExpanded ? null : u.id; setExpandedId(next); if (next) loadUserEnrollments(next); }}
                >
                  <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-slate-300 text-sm font-semibold">{u.full_name?.[0]?.toUpperCase() || '?'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{u.full_name}</p>
                    <p className="text-xs text-slate-500">
                      Joined {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0 max-w-[200px]">
                    {u.roles.slice(0, 3).map((r) => (
                      <span key={r} className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${ROLE_COLORS[r] || 'bg-slate-700 text-slate-300'}`}>
                        {ROLE_LABELS[r] || r}
                      </span>
                    ))}
                    {u.roles.length > 3 && (
                      <span className="text-xs text-slate-500">+{u.roles.length - 3}</span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-800 px-4 py-4 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <BookOpen className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{u.enrollment_count}</p>
                        <p className="text-xs text-slate-500">Enrollments</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <Pen className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{u.journal_count}</p>
                        <p className="text-xs text-slate-500">Journal Entries</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <CheckSquare className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{u.task_count}</p>
                        <p className="text-xs text-slate-500">Tasks Done</p>
                      </div>
                    </div>

                    {u.headline && (
                      <p className="text-xs text-slate-400 italic">"{u.headline}"</p>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-400">Roles</span>
                        {!isEditingRoles && (
                          <button
                            onClick={(e) => startEditRoles(u, e)}
                            className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            Edit roles
                          </button>
                        )}
                      </div>

                      {isEditingRoles ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-1.5">
                            {ALL_ROLES.map((r) => {
                              const selected = editingRoles.includes(r);
                              return (
                                <button
                                  key={r}
                                  onClick={() => toggleRole(r)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                                    selected
                                      ? 'border-rose-500 bg-rose-500/10 text-white'
                                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected ? 'bg-rose-500 border-rose-500' : 'border-slate-600'}`}>
                                    {selected && <Check className="w-2.5 h-2.5 text-white" />}
                                  </div>
                                  {ROLE_LABELS[r] || r}
                                </button>
                              );
                            })}
                          </div>
                          <p className="text-xs text-slate-500">
                            Primary role: <span className="text-white font-semibold">{ROLE_LABELS[highestRole(editingRoles)]}</span>
                          </p>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => saveRoles(u.id)}
                              disabled={savingRoles}
                              className="flex items-center gap-1.5 bg-sage-600 hover:bg-sage-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingRolesId(null)}
                              className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {u.roles.map((r) => (
                            <span key={r} className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ROLE_COLORS[r] || 'bg-slate-700 text-slate-300'}`}>
                              {ROLE_LABELS[r] || r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5" /> Program Enrollments
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); loadUserEnrollments(u.id); setEnrollingUserId(enrollingUserId === u.id ? null : u.id); setSelectedProgramId(''); }}
                          className="text-xs text-sage-400 hover:text-sage-300 transition-colors flex items-center gap-1"
                        >
                          <UserCheck className="w-3 h-3" /> Manage
                        </button>
                      </div>

                      {loadingEnrollments === u.id && (
                        <p className="text-xs text-slate-500">Loading...</p>
                      )}

                      {enrollmentsByUser[u.id] && (
                        <div className="space-y-1 mb-2">
                          {enrollmentsByUser[u.id].length === 0 && (
                            <p className="text-xs text-slate-500 italic">Not enrolled in any programs.</p>
                          )}
                          {enrollmentsByUser[u.id].map((enr) => (
                            <div key={enr.program_id} className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2">
                              <div>
                                <p className="text-xs font-medium text-white">{enr.program_title}</p>
                                <p className="text-xs text-slate-500 capitalize">{enr.status}</p>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleUnenroll(u.id, enr.id, enr.program_id); }}
                                className="text-slate-500 hover:text-red-400 transition-colors"
                                title="Remove enrollment"
                              >
                                <UserX className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {enrollingUserId === u.id && (
                        <div className="flex gap-2 mt-2">
                          <select
                            value={selectedProgramId}
                            onChange={(e) => setSelectedProgramId(e.target.value)}
                            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-sage-500 transition-colors"
                          >
                            <option value="">Select a program…</option>
                            {allPrograms
                              .filter((p) => !enrollmentsByUser[u.id]?.find((e) => e.program_id === p.id))
                              .map((p) => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                              ))}
                          </select>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEnroll(u.id); }}
                            disabled={!selectedProgramId || enrolling}
                            className="flex items-center gap-1 bg-sage-600 hover:bg-sage-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            <Check className="w-3 h-3" /> Enroll
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEnrollingUserId(null); }}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {paymentsByUser[u.id] && paymentsByUser[u.id].length > 0 && (
                      <div className="pt-1 border-t border-slate-800">
                        <div className="flex items-center gap-1.5 mb-2">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400">Payment History</span>
                        </div>
                        <div className="space-y-1.5">
                          {paymentsByUser[u.id].map((pay) => (
                            <div key={pay.id} className="bg-slate-800/60 rounded-lg px-3 py-2">
                              <div className="flex items-center justify-between mb-0.5">
                                <p className="text-xs font-medium text-white truncate mr-2">{pay.program_title}</p>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                                  pay.status === 'paid'
                                    ? 'bg-sage-500/15 text-sage-400'
                                    : pay.status === 'pending'
                                    ? 'bg-amber-500/15 text-amber-400'
                                    : 'bg-red-500/15 text-red-400'
                                }`}>
                                  {pay.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span>${(pay.amount / 100).toFixed(2)}</span>
                                {pay.payment_method_last4 && (
                                  <span>···· {pay.payment_method_last4}{pay.payment_method_expiry ? ` · ${pay.payment_method_expiry}` : ''}</span>
                                )}
                                <span className="ml-auto">
                                  {pay.status === 'paid' && pay.confirmed_at
                                    ? new Date(pay.confirmed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : new Date(pay.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isSelf && !isConfirmingDelete && (
                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(u.id); }}
                          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove user
                        </button>
                      </div>
                    )}

                    {isConfirmingDelete && (
                      <div className="pt-2 border-t border-slate-800">
                        <div className="bg-red-950/40 border border-red-800/50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2 text-red-400">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <p className="text-xs font-semibold">This will permanently delete {u.full_name} and all their data.</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(u.id)}
                              disabled={deleteLoading}
                              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              {deleteLoading ? 'Deleting…' : 'Yes, delete'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div ref={modalRef} className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-rose-500/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-rose-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Create User</h2>
              </div>
              <button
                onClick={() => setShowCreate(false)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={createForm.full_name}
                  onChange={(e) => setCreateForm((f) => ({ ...f, full_name: e.target.value }))}
                  placeholder="Jane Doe"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jane@example.com"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={createForm.password}
                    onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Min. 6 characters"
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Role</label>
                <div className="relative">
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))}
                    className="appearance-none w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {createError && (
                <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">{createError}</p>
                </div>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={handleCreate}
                disabled={createLoading}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {createLoading ? 'Creating…' : 'Create User'}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
