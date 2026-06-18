import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Clock, BarChart3, LayoutDashboard } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/context/AuthContext';
import { PROGRAM_CATEGORIES } from '../../lib/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  category: string;
  difficulty_level: string;
  duration_hours: number;
  required_role: string;
  provider: { full_name: string };
}

export default function CourseCatalog() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    loadCourses();
  }, [profile]);

  const loadCourses = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('programs')
      .select('id, title, slug, description, cover_image_url, category, difficulty_level, duration_hours, provider:admin_id(full_name)')
      .eq('is_published', true)
      .order('title');

    const allCourses = (data || [])
      .map((c) => ({
        ...c,
        required_role: 'member',
        provider: c.provider as unknown as Course['provider'],
      }));

    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('program_id, status')
      .eq('user_id', profile.id)
      .eq('status', 'completed');

    void enrollments;
    setCourses(allCourses);
    setLoading(false);
  };

  const filtered = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || c.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-sage-600 text-sm font-medium mb-5 transition-colors">
        <LayoutDashboard className="w-4 h-4" /> Back to My Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Programs</h1>

      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search programs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 focus:border-sage-600 focus:ring-2 focus:ring-sage-100 outline-none transition-all text-sm"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-stone-300 focus:border-sage-600 outline-none text-sm bg-white"
          >
            <option value="all">All Categories</option>
            {PROGRAM_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No programs found</h2>
          <p className="text-slate-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => {
            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden transition-shadow group hover:shadow-md"
              >
                <Link to={`/dashboard/programs/${course.slug}`} className="block">
                  <CourseCardContent course={course} locked={false} roleBlocked={false} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CourseCardContent({ course, locked }: { course: Course; locked: boolean; roleBlocked: boolean }) {
  return (
    <>
      <div className="h-44 bg-stone-100 overflow-hidden">
        {course.cover_image_url ? (
          <img
            src={course.cover_image_url}
            alt={course.title}
            className={`w-full h-full object-cover ${!locked ? 'group-hover:scale-105' : ''} transition-transform duration-500`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-stone-300" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-sage-600 uppercase">{course.category}</span>
          <span className="text-xs text-slate-400">by {course.provider.full_name}</span>
        </div>
        <h3 className={`font-semibold text-slate-900 mb-2 ${!locked ? 'group-hover:text-sage-600' : ''} transition-colors`}>
          {course.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">{course.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.duration_hours}h
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="capitalize">{course.difficulty_level}</span>
          </div>
        </div>
      </div>
    </>
  );
}
