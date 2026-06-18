import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil as Edit2, Trash2, Eye, EyeOff, BookOpen, Users, Calendar, ChevronRight, Download, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { downloadTemplate, parseCSV, CSV_TEMPLATE_INSTRUCTIONS } from '../../lib/csvProgram';
import { getExampleCSVBlob } from '../../lib/csvProgramExample';

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
}

export default function AdminPrograms() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => { loadPrograms(); }, []);

  const loadPrograms = async () => {
    const { data } = await supabase
      .from('programs')
      .select('id, title, slug, description, category, difficulty_level, is_published, cover_image_url, required_role, created_at')
      .order('created_at', { ascending: false });

    if (!data) { setLoading(false); return; }

    const enriched: Program[] = await Promise.all(
      data.map(async (p) => {
        const [enrollRes, milestoneRes] = await Promise.all([
          supabase.from('enrollments').select('id', { count: 'exact', head: true }).eq('program_id', p.id),
          supabase.from('program_milestones').select('class_number').eq('program_id', p.id),
        ]);
        const classCount = new Set((milestoneRes.data || []).map((m: { class_number: number }) => m.class_number)).size;
        return { ...p, enrollment_count: enrollRes.count || 0, milestone_count: classCount };
      })
    );

    setPrograms(enriched);
    setLoading(false);
  };

  const togglePublished = async (id: string, current: boolean) => {
    await supabase.from('programs').update({ is_published: !current }).eq('id', id);
    setPrograms((prev) => prev.map((p) => p.id === id ? { ...p, is_published: !current } : p));
  };

  const deleteProgram = async (id: string) => {
    if (!confirm('Delete this program? This action cannot be undone.')) return;
    setDeletingId(id);
    await supabase.from('programs').delete().eq('id', id);
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const csvContent = await file.text();
      const programData = parseCSV(csvContent);

      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) throw new Error('Authentication required');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/import-program-csv`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ programData }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to import program');
      }

      setUploadSuccess(`Program "${result.summary.programTitle}" imported successfully with ${result.summary.milestonesCount} classes, ${result.summary.activitiesCount} activities, and ${result.summary.promptsCount} prompts.`);
      await loadPrograms();

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  const filtered = programs.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Programs</h1>
          <p className="text-slate-400 text-sm mt-1">{programs.length} program{programs.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadTemplate()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Template
            </button>
            <button
              onClick={() => {
                const blob = getExampleCSVBlob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'example_program.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
              title="Download a complete example program"
            >
              <Download className="w-4 h-4" /> Example
            </button>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-sage-600 hover:bg-sage-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" /> {uploading ? 'Importing...' : 'Import CSV'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => navigate('/admin/programs/new')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> New Program
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm"><span className="font-semibold">Error:</span> {uploadError}</p>
        </div>
      )}

      {uploadSuccess && (
        <div className="mb-4 p-4 bg-sage-900/30 border border-sage-700 rounded-lg">
          <p className="text-sage-400 text-sm"><span className="font-semibold">Success:</span> {uploadSuccess}</p>
        </div>
      )}

      {!showInstructions && (
        <button
          onClick={() => setShowInstructions(true)}
          className="mb-4 text-slate-400 hover:text-slate-300 text-sm underline transition-colors"
        >
          View CSV Upload Instructions
        </button>
      )}

      {showInstructions && (
        <div className="mb-6 p-4 bg-slate-900 border border-slate-700 rounded-lg max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">CSV Upload Instructions</h3>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-slate-400 hover:text-slate-300"
            >
              ✕
            </button>
          </div>
          <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto">
            {CSV_TEMPLATE_INSTRUCTIONS}
          </pre>
        </div>
      )}

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search programs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-16 text-center">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">{search ? 'No programs match your search.' : 'No programs yet. Create one to get started.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-slate-600" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="text-sm font-semibold text-white truncate">{p.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${p.is_published ? 'bg-sage-500/20 text-sage-400' : 'bg-slate-700 text-slate-400'}`}>
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="capitalize">{p.category}</span>
                  <span>&middot;</span>
                  <span className="capitalize">{p.difficulty_level}</span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {p.enrollment_count}</span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.milestone_count} classes</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublished(p.id, p.is_published)}
                  title={p.is_published ? 'Unpublish' : 'Publish'}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  {p.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <Link
                  to={`/admin/programs/${p.id}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => deleteProgram(p.id)}
                  disabled={deletingId === p.id}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link
                  to={`/admin/programs/${p.id}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
