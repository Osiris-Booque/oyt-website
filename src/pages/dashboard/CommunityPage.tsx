import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MessageSquare, Pin, Plus, X, ChevronDown, ChevronUp,
  ThumbsUp, Sparkles, Star, Lightbulb, Send, Search, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../components/context/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { POST_CATEGORIES, REACTION_TYPES, ROLE_COLORS, ROLE_LABELS } from '../../lib/constants';

interface Author {
  id: string;
  full_name: string;
  roles: string[];
}

interface Reaction {
  id: string;
  user_id: string;
  reaction_type: string;
}

interface Comment {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  author: Author;
}

interface Post {
  id: string;
  author_id: string;
  program_id: string | null;
  title: string;
  content: string;
  category: string;
  created_at: string;
  is_pinned: boolean;
  author: Author;
  reactions: Reaction[];
  comment_count: number;
}

const REACTION_ICONS: Record<string, React.ReactNode> = {
  like: <ThumbsUp className="w-3.5 h-3.5" />,
  helpful: <Sparkles className="w-3.5 h-3.5" />,
  inspiring: <Star className="w-3.5 h-3.5" />,
  insightful: <Lightbulb className="w-3.5 h-3.5" />,
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

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-sm';
  return (
    <div className={`${s} rounded-full bg-sage-light flex items-center justify-center font-semibold text-sage-dark flex-shrink-0`}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
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

function parseAuthor(raw: unknown): Author {
  const author = raw as { id?: string; full_name?: string; roles?: string[]; role?: string } | null;
  const roles: string[] = author?.roles?.length ? author.roles : (author?.role ? [author.role] : ['member']);
  return { id: author?.id || '', full_name: author?.full_name || 'Unknown', roles };
}

interface PostCardProps {
  post: Post;
  currentUserId: string;
  currentUserName: string;
  onReaction: (postId: string, type: string) => void;
  onCommentSubmit: (postId: string, content: string) => void;
}

function PostCard({ post, currentUserId, currentUserName, onReaction, onCommentSubmit }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    if (commentsLoaded) return;
    const { data } = await supabase
      .from('post_comments')
      .select('id, author_id, content, created_at, profiles:author_id(id, full_name, roles, role)')
      .eq('post_id', post.id)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: true });
    setComments(
      (data || []).map((c) => ({ ...c, author: parseAuthor(c.profiles) }))
    );
    setCommentsLoaded(true);
  };

  const handleToggle = () => {
    if (!expanded) loadComments();
    setExpanded(!expanded);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    const { data } = await supabase
      .from('post_comments')
      .insert({ post_id: post.id, author_id: currentUserId, content: commentText.trim() })
      .select('id, author_id, content, created_at, profiles:author_id(id, full_name, roles, role)')
      .single();
    if (data) {
      setComments((prev) => [...prev, { ...data, author: parseAuthor(data.profiles) }]);
      onCommentSubmit(post.id, commentText.trim());
    }
    setCommentText('');
    setSubmitting(false);
  };

  const myReactions = post.reactions.filter((r) => r.user_id === currentUserId).map((r) => r.reaction_type);

  const reactionCounts = REACTION_TYPES.reduce<Record<string, number>>((acc, rt) => {
    acc[rt.value] = post.reactions.filter((r) => r.reaction_type === rt.value).length;
    return acc;
  }, {});

  return (
    <div className="bg-card rounded-md border border-input-border overflow-hidden hover:shadow-card transition-shadow">
      {post.is_pinned && (
        <div className="flex items-center gap-1.5 px-5 pt-3 pb-0">
          <Pin className="w-3.5 h-3.5 text-warm-coral rotate-45" />
          <span className="text-xs font-semibold text-warm-coral uppercase tracking-wide">Pinned</span>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <Avatar name={post.author.full_name} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900 text-sm">{post.author.full_name}</span>
              <RoleBadges roles={post.author.roles} />
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.general}`}>
                {POST_CATEGORIES.find((c) => c.value === post.category)?.label || post.category}
              </span>
              <span className="text-xs text-slate-400">{timeAgo(post.created_at)}</span>
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-primary mb-2">{post.title}</h3>
        <p className={`text-secondary text-sm leading-relaxed whitespace-pre-line ${!expanded ? 'line-clamp-3' : ''}`}>
          {post.content}
        </p>

        {post.content.length > 200 && (
          <button
            onClick={handleToggle}
            className="text-teal text-sm font-medium mt-1 hover:text-teal-hover"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-input-border">
          <div className="flex items-center gap-1.5 flex-wrap">
            {REACTION_TYPES.map((rt) => (
              <button
                key={rt.value}
                onClick={() => onReaction(post.id, rt.value)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  myReactions.includes(rt.value)
                    ? 'bg-sage-light text-sage-dark'
                    : 'bg-input text-secondary hover:bg-input-border'
                }`}
              >
                {REACTION_ICONS[rt.value]}
                {reactionCounts[rt.value] > 0 && <span>{reactionCounts[rt.value]}</span>}
                <span className="hidden sm:inline">{rt.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleToggle}
            className="flex items-center gap-1.5 text-secondary hover:text-teal text-xs font-medium ml-auto transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-input-border space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <Avatar name={c.author.full_name} size="sm" />
                <div className="flex-1 bg-input rounded-sm p-3">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-primary text-xs">{c.author.full_name}</span>
                    <RoleBadges roles={c.author.roles} />
                    <span className="text-xs text-slate-400">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-secondary text-sm leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-2.5 mt-3">
              <Avatar name={currentUserName} size="sm" />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 text-sm bg-input border border-input-border rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim() || submitting}
                  className="px-3 py-2 bg-teal text-white rounded-sm hover:bg-teal-hover transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface NewPostModalProps {
  onClose: () => void;
  onSubmit: (title: string, content: string, category: string) => Promise<void>;
}

function NewPostModal({ onClose, onSubmit }: NewPostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit(title.trim(), content.trim(), category);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-md shadow-card w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-input-border">
          <h2 className="text-lg font-bold text-primary">New Post</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-input-border rounded-sm focus:outline-none focus:ring-2 focus:ring-teal text-sm"
            >
              {POST_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-3 py-2 border border-input-border rounded-sm focus:outline-none focus:ring-2 focus:ring-teal text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Share your thoughts, questions, or reflections..."
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 text-sm resize-none"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-input-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || submitting}
            className="px-5 py-2 bg-teal text-white rounded-sm font-semibold text-sm hover:bg-teal-hover transition-colors disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { profile } = useAuth();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const isAdmin = location.pathname.startsWith('/admin');
  const isInstructor = location.pathname.startsWith('/instructor');
  const backLink = isAdmin ? '/admin' : isInstructor ? '/instructor' : '/dashboard';
  const backLabel = isAdmin ? 'Admin Portal' : isInstructor ? 'Instructor Portal' : 'My Dashboard';

  useEffect(() => {
    if (profile) loadPosts();
  }, [profile]);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('community_posts')
      .select(`
        id, author_id, program_id, title, content, category, created_at, is_pinned,
        profiles:author_id(id, full_name, roles, role),
        post_reactions(id, user_id, reaction_type),
        post_comments(id)
      `)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    setPosts(
      (data || []).map((p) => ({
        ...p,
        author: parseAuthor(p.profiles),
        reactions: (p.post_reactions || []) as Reaction[],
        comment_count: (p.post_comments || []).length,
      }))
    );
    setLoading(false);
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    if (!profile) return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const existing = post.reactions.find(
      (r) => r.user_id === profile.id && r.reaction_type === reactionType
    );

    if (existing) {
      await supabase.from('post_reactions').delete().eq('id', existing.id);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, reactions: p.reactions.filter((r) => r.id !== existing.id) }
            : p
        )
      );
    } else {
      const { data } = await supabase
        .from('post_reactions')
        .insert({ user_id: profile.id, post_id: postId, reaction_type: reactionType })
        .select('id, user_id, reaction_type')
        .single();
      if (data) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, reactions: [...p.reactions, data] } : p
          )
        );
      }
    }
  };

  const handleCommentSubmit = (postId: string, content: string) => {
    void content;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p
      )
    );
  };

  const handleNewPost = async (title: string, content: string, category: string) => {
    if (!profile) return;
    const { data } = await supabase
      .from('community_posts')
      .insert({ author_id: profile.id, title, content, category })
      .select(`
        id, author_id, program_id, title, content, category, created_at, is_pinned,
        profiles:author_id(id, full_name, roles, role)
      `)
      .single();
    if (data) {
      setPosts((prev) => [
        {
          ...data,
          author: parseAuthor(data.profiles),
          reactions: [],
          comment_count: 0,
        },
        ...prev,
      ]);
    }
  };

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <Link to={backLink} className="inline-flex items-center gap-1.5 text-secondary hover:text-teal text-sm font-medium mb-3 transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Back to {backLabel}
          </Link>
          <h1 className="text-2xl font-bold text-primary">Community</h1>
          <p className="text-secondary mt-1 text-sm">Share, ask, and connect with your cohort</p>
        </div>
        <button
          onClick={() => setShowNewPost(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white rounded-md font-semibold text-sm hover:bg-teal-hover transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-9 pr-3 py-2 bg-card border border-input-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-teal text-white'
                : 'bg-input text-secondary hover:bg-input-border'
            }`}
          >
            All
          </button>
          {POST_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.value
                  ? 'bg-teal text-white'
                  : 'bg-input text-secondary hover:bg-input-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-md border border-input-border p-12 text-center shadow-card">
          <MessageSquare className="w-10 h-10 text-input mx-auto mb-3" />
          <p className="text-secondary">No posts found.</p>
          <button
            onClick={() => setShowNewPost(true)}
            className="mt-4 text-teal font-semibold text-sm hover:text-teal-hover"
          >
            Be the first to post
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={profile!.id}
              currentUserName={profile!.full_name}
              onReaction={handleReaction}
              onCommentSubmit={handleCommentSubmit}
            />
          ))}
        </div>
      )}

      {showNewPost && (
        <NewPostModal onClose={() => setShowNewPost(false)} onSubmit={handleNewPost} />
      )}
    </div>
  );
}
