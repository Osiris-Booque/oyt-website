import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredPost = {
  title: 'Why Breathwork Is the Missing Piece in Your Wellness Routine',
  excerpt: 'Most people think of wellness as movement and nutrition. But the single most accessible tool for regulating your nervous system is the one you already do 20,000 times a day — your breath. Here is why intentional breathwork deserves a place in your daily practice.',
  image: 'https://images.pexels.com/photos/3820380/pexels-photo-3820380.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
  category: 'Breathwork',
  readTime: '6 min read',
  date: 'March 5, 2026',
};

const posts = [
  {
    title: 'What Actually Happens to Your Body During Yoga Therapy',
    excerpt: 'Yoga therapy is not just stretching. It is a clinical approach to retraining your nervous system through intentional movement and breath coordination.',
    image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    category: 'Yoga Therapy',
    readTime: '5 min read',
    date: 'February 22, 2026',
  },
  {
    title: 'The Science of Seasonal Wellness: Why Spring Is the Time to Expand',
    excerpt: 'Ancient traditions and modern research agree — our bodies and minds follow seasonal rhythms. Learn how aligning your practice with the seasons can accelerate growth.',
    image: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    category: 'Wellness',
    readTime: '4 min read',
    date: 'February 14, 2026',
  },
  {
    title: 'From Burnout to Balance: A Government Team\'s Wellness Journey',
    excerpt: 'When a federal agency approached us about staff burnout, we designed a 12-week program that transformed their team culture. Here is what we learned.',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    category: 'Case Study',
    readTime: '7 min read',
    date: 'February 3, 2026',
  },
  {
    title: '5 Meditation Techniques You Can Practice at Your Desk',
    excerpt: 'You do not need a cushion, a candle, or 30 minutes of silence. These five techniques take less than 3 minutes and can be done between meetings.',
    image: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    category: 'Meditation',
    readTime: '4 min read',
    date: 'January 20, 2026',
  },
  {
    title: 'How the Flow Series Changed How I Approach My Career',
    excerpt: 'A Fall 2025 cohort member shares how 8 weeks of movement, breathwork, and community reshaped their relationship with ambition and professional growth.',
    image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    category: 'Community',
    readTime: '5 min read',
    date: 'January 8, 2026',
  },
  {
    title: 'Understanding Your Nervous System: A Beginner\'s Guide',
    excerpt: 'Fight, flight, freeze, or fawn — your nervous system drives more of your daily experience than you realize. Here is a practical introduction to how it works and how to work with it.',
    image: 'https://images.pexels.com/photos/4325466/pexels-photo-4325466.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    category: 'Education',
    readTime: '8 min read',
    date: 'December 15, 2025',
  },
];

const categories = ['All', 'Breathwork', 'Yoga Therapy', 'Meditation', 'Wellness', 'Community', 'Education', 'Case Study'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-body">
      <section className="pt-6 sm:pt-10 pb-4 sm:pb-6 bg-stone-50">
        <div className="container-wide">
          <p className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-3">
            Insights & Stories
          </p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl font-bold text-primary mb-4">
            The Osiris Blog
          </h1>
          <p className="text-secondary text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
            Research-backed insights, practitioner perspectives, and community stories
            on yoga therapy, breathwork, meditation, and holistic wellness.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container-wide">
          <div className="flex flex-wrap gap-2 mb-10 sm:mb-14">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === 0
                    ? 'bg-sage-600 text-white'
                    : 'bg-white text-secondary border border-stone-200 hover:border-sage-300 hover:text-sage-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mb-12 sm:mb-16">
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-stone-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-sage-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sage-600 text-xs font-semibold uppercase tracking-wider">
                      {featuredPost.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-stone-300" />
                    <span className="text-slate-400 text-xs">{featuredPost.date}</span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-4 group-hover:text-sage-700 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-secondary leading-relaxed mb-6 text-sm sm:text-base">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sage-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <article
                key={post.title}
                className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-sage-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-stone-300" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-primary mb-2 group-hover:text-sage-700 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed mb-4 flex-grow">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sage-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-stone-50">
        <div className="container-wide text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-4">
            Stay in the loop
          </h2>
          <p className="text-secondary mb-8 max-w-lg mx-auto">
            New articles, program announcements, and community updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-sage-600 focus:ring-2 focus:ring-sage-100 outline-none transition-all bg-white text-sm"
            />
            <button className="w-full sm:w-auto px-6 py-3 bg-sage-600 text-white rounded-lg font-medium hover:bg-sage-700 transition-colors whitespace-nowrap text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
