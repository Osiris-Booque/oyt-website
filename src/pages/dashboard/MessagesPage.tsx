import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Mail, Send, ArrowLeft, Search, LayoutDashboard, Plus, X, Users } from 'lucide-react';
import { useAuth } from '../../components/context/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ROLE_COLORS, ROLE_LABELS } from '../../lib/constants';

interface Participant {
  id: string;
  full_name: string;
  role: string;
  roles?: string[];
}

interface Thread {
  id: string;
  participant_ids: string[];
  updated_at: string;
  other_participant: Participant;
  last_message: string;
  unread: boolean;
}

interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_by: string[];
}

interface EnrollmentContactRow {
  profiles: Participant | null;
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-11 h-11 text-base' : 'w-9 h-9 text-sm';
  return (
    <div className={`${s} rounded-full bg-sage-100 flex items-center justify-center font-semibold text-sage-700 flex-shrink-0`}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

function participantRoles(p: Participant): string[] {
  if (p.roles?.length) return p.roles;
  if (p.role) return [p.role];
  return ['member'];
}

function RoleBadges({ roles }: { roles: string[] }) {
  if (!roles?.length) return null;
  return (
    <span className="flex items-center gap-1 flex-wrap">
      {roles.map((r) => (
        <span key={r} className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${ROLE_COLORS[r] || 'bg-stone-100 text-slate-600'}`}>
          {ROLE_LABELS[r] || r}
        </span>
      ))}
    </span>
  );
}

function timeLabel(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function MessagesPage() {
  const { profile } = useAuth();
  const location = useLocation();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [showNewConvo, setShowNewConvo] = useState(false);
  const [contacts, setContacts] = useState<Participant[]>([]);
  const [contactSearch, setContactSearch] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (profile) loadThreads();
  }, [profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (showNewConvo && profile) loadContacts();
  }, [showNewConvo]);

  const loadContacts = async () => {
    setLoadingContacts(true);
    let data: Participant[] = [];

    if (profile!.roles.includes('admin')) {
      const { data: all } = await supabase
        .from('profiles')
        .select('id, full_name, role, roles')
        .neq('id', profile!.id)
        .order('full_name');
      data = all || [];
    } else if (profile!.roles.includes('instructor')) {
      const [adminRes, enrollRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, role, roles').contains('roles', ['admin']),
        supabase
          .from('enrollments')
          .select('profiles!enrollments_user_id_fkey(id, full_name, role, roles)')
          .in(
            'program_id',
            (await supabase.from('programs').select('id').eq('instructor_id', profile!.id)).data?.map((p: { id: string }) => p.id) || []
          ),
      ]);
      const admins: Participant[] = adminRes.data || [];
      const enrolled: Participant[] = ((enrollRes.data || []) as EnrollmentContactRow[])
        .map((e) => e.profiles ?? null)
        .filter((p): p is Participant => Boolean(p))
        .filter((p) => p.id !== profile!.id);
      const seen = new Set<string>();
      for (const p of [...admins, ...enrolled]) {
        if (!seen.has(p.id)) { seen.add(p.id); data.push(p); }
      }
      data.sort((a, b) => a.full_name.localeCompare(b.full_name));
    }

    setContacts(data);
    setLoadingContacts(false);
  };

  const loadThreads = async () => {
    const { data: threadData } = await supabase
      .from('message_threads')
      .select('id, participant_ids, updated_at')
      .contains('participant_ids', [profile!.id])
      .order('updated_at', { ascending: false });

    if (!threadData) { setLoading(false); return; }

    const otherIds = threadData.flatMap((t) =>
      t.participant_ids.filter((id: string) => id !== profile!.id)
    );
    const uniqueIds = [...new Set(otherIds)];

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, full_name, role, roles')
      .in('id', uniqueIds.length ? uniqueIds : ['00000000-0000-0000-0000-000000000000']);

    const profileMap = Object.fromEntries((profileData || []).map((p) => [p.id, p]));

    const threadsWithDetails = await Promise.all(
      threadData.map(async (t) => {
        const otherId = t.participant_ids.find((id: string) => id !== profile!.id);
        const other = profileMap[otherId] || { id: otherId, full_name: 'Unknown', role: 'member' };

        const { data: lastMsg } = await supabase
          .from('messages')
          .select('content, read_by, sender_id')
          .eq('thread_id', t.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const unread = lastMsg
          ? lastMsg.sender_id !== profile!.id && !lastMsg.read_by.includes(profile!.id)
          : false;

        return {
          id: t.id,
          participant_ids: t.participant_ids,
          updated_at: t.updated_at,
          other_participant: other,
          last_message: lastMsg?.content || '',
          unread,
        };
      })
    );

    setThreads(threadsWithDetails);
    setLoading(false);
  };

  const startConversation = async (contact: Participant) => {
    const existing = threads.find((t) =>
      t.participant_ids.includes(contact.id) && t.participant_ids.includes(profile!.id) && t.participant_ids.length === 2
    );
    if (existing) {
      setShowNewConvo(false);
      openThread(existing);
      return;
    }

    const { data } = await supabase
      .from('message_threads')
      .insert({ participant_ids: [profile!.id, contact.id] })
      .select('id, participant_ids, updated_at')
      .single();

    if (data) {
      const newThread: Thread = {
        id: data.id,
        participant_ids: data.participant_ids,
        updated_at: data.updated_at,
        other_participant: contact,
        last_message: '',
        unread: false,
      };
      setThreads((prev) => [newThread, ...prev]);
      setShowNewConvo(false);
      openThread(newThread);
    }
  };

  const openThread = async (thread: Thread) => {
    setActiveThread(thread);
    setMobileView('chat');
    setThreads((prev) =>
      prev.map((t) => (t.id === thread.id ? { ...t, unread: false } : t))
    );

    const { data } = await supabase
      .from('messages')
      .select('id, thread_id, sender_id, content, created_at, read_by')
      .eq('thread_id', thread.id)
      .order('created_at', { ascending: true });

    setMessages(data || []);

    const unreadMessages = (data || []).filter(
      (m) => m.sender_id !== profile!.id && !m.read_by.includes(profile!.id)
    );

    for (const msg of unreadMessages) {
      await supabase
        .from('messages')
        .update({ read_by: [...msg.read_by, profile!.id] })
        .eq('id', msg.id);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !activeThread || sending) return;
    setSending(true);
    const content = messageText.trim();
    setMessageText('');

    const { data } = await supabase
      .from('messages')
      .insert({
        thread_id: activeThread.id,
        sender_id: profile!.id,
        content,
        read_by: [profile!.id],
      })
      .select('id, thread_id, sender_id, content, created_at, read_by')
      .single();

    if (data) {
      setMessages((prev) => [...prev, data]);
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id
            ? { ...t, last_message: content, updated_at: data.created_at }
            : t
        ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      );
    }
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredThreads = threads.filter((t) =>
    !search || t.other_participant.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredContacts = contacts.filter((c) =>
    !contactSearch || c.full_name.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isInstructorRoute = location.pathname.startsWith('/instructor');
  const backLink = isAdminRoute ? '/admin' : isInstructorRoute ? '/instructor' : '/dashboard';
  const backLabel = isAdminRoute ? 'Admin Portal' : isInstructorRoute ? 'Instructor Portal' : 'My Dashboard';

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4 flex-shrink-0">
        <Link to={backLink} className="inline-flex items-center gap-1.5 text-slate-500 hover:text-sage-600 text-sm font-medium mb-3 transition-colors">
          <LayoutDashboard className="w-4 h-4" /> Back to {backLabel}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
            <p className="text-slate-500 mt-1 text-sm">
              {profile?.roles.includes('admin') ? 'All conversations across the platform' :
               profile?.roles.includes('instructor') ? 'Conversations with your students and admins' :
               'Your conversations with the cohort'}
            </p>
          </div>
          {(profile?.roles.includes('admin') || profile?.roles.includes('instructor')) && (
            <button
              onClick={() => { setShowNewConvo(true); setContactSearch(''); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> New Message
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-white rounded-xl border border-stone-200 shadow-sm min-h-0">
        <div className={`w-full lg:w-80 flex-shrink-0 border-r border-stone-200 flex flex-col ${mobileView === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-3 border-b border-stone-100 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 border border-stone-200"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="p-6 text-center">
                <Mail className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No conversations yet</p>
                {(profile?.roles.includes('admin') || profile?.roles.includes('instructor')) && (
                  <button
                    onClick={() => { setShowNewConvo(true); setContactSearch(''); }}
                    className="mt-3 text-sm text-sage-600 hover:text-sage-700 font-medium"
                  >
                    Start a conversation
                  </button>
                )}
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => openThread(thread)}
                  className={`w-full flex items-start gap-3 p-4 text-left hover:bg-stone-50 transition-colors border-b border-stone-100 ${
                    activeThread?.id === thread.id ? 'bg-sage-50' : ''
                  }`}
                >
                  <Avatar name={thread.other_participant.full_name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-sm font-semibold truncate ${thread.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                        {thread.other_participant.full_name}
                      </span>
                      <span className="text-xs text-slate-400 flex-shrink-0">{timeLabel(thread.updated_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RoleBadges roles={participantRoles(thread.other_participant)} />
                      <p className={`text-xs truncate flex-1 ${thread.unread ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                        {thread.last_message || 'No messages yet'}
                      </p>
                      {thread.unread && (
                        <span className="w-2 h-2 rounded-full bg-sage-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'}`}>
          {!activeThread ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <Mail className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Select a conversation</p>
                <p className="text-slate-400 text-sm mt-1">Choose from the list on the left</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-200 flex-shrink-0">
                <button
                  onClick={() => { setMobileView('list'); setActiveThread(null); }}
                  className="lg:hidden text-slate-400 hover:text-slate-600 mr-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <Avatar name={activeThread.other_participant.full_name} size="lg" />
                <div>
                  <p className="font-semibold text-slate-900">{activeThread.other_participant.full_name}</p>
                  <RoleBadges roles={participantRoles(activeThread.other_participant)} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => {
                  const isMe = msg.sender_id === profile!.id;
                  const showAvatar = idx === 0 || messages[idx - 1].sender_id !== msg.sender_id;
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isMe && showAvatar && <Avatar name={activeThread.other_participant.full_name} size="sm" />}
                      {!isMe && !showAvatar && <div className="w-8" />}
                      <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        {showAvatar && !isMe && (
                          <span className="text-xs text-slate-400 ml-1">{activeThread.other_participant.full_name}</span>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-sage-600 text-white rounded-br-md' : 'bg-stone-100 text-slate-800 rounded-bl-md'}`}>
                          {msg.content}
                        </div>
                        <span className="text-xs text-slate-400 mx-1">{timeLabel(msg.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-stone-200 flex-shrink-0">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Type a message... (Enter to send)"
                    className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none max-h-28 leading-relaxed"
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                      const t = e.currentTarget;
                      t.style.height = 'auto';
                      t.style.height = Math.min(t.scrollHeight, 112) + 'px';
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!messageText.trim() || sending}
                    className="p-2.5 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showNewConvo && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-sage-600" />
                <h2 className="text-base font-bold text-slate-900">New Message</h2>
              </div>
              <button onClick={() => setShowNewConvo(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border-b border-stone-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search people..."
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 border border-stone-200"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-72">
              {loadingContacts ? (
                <div className="p-6 text-center text-slate-400 text-sm">Loading contacts…</div>
              ) : filteredContacts.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-slate-500 text-sm">No contacts found</p>
                  {profile?.roles.includes('instructor') && (
                    <p className="text-slate-400 text-xs mt-1">You can message admins and members enrolled in your programs.</p>
                  )}
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => startConversation(contact)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-0"
                  >
                    <Avatar name={contact.full_name} />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-slate-900 truncate">{contact.full_name}</p>
                      <RoleBadges roles={participantRoles(contact)} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
