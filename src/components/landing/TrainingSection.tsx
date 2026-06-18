import { BookOpen, Users, Calendar, Award, CheckCircle2, ArrowRight } from 'lucide-react';

const programs = [
  {
    title: 'Yoga Teacher Training',
    duration: '200 Hours',
    level: 'Beginner to Intermediate',
    description: 'Comprehensive RYT-200 certification covering asana, anatomy, philosophy, and the art of teaching.',
    highlights: ['RYT-200 Certification', 'Anatomy & Physiology', 'Teaching Methodology', 'Business & Ethics'],
    image: 'https://images.pexels.com/photos/8436587/pexels-photo-8436587.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  },
  {
    title: 'Breathwork Facilitator',
    duration: '100 Hours',
    level: 'All Levels',
    description: 'Master multiple breathing techniques and learn to guide transformative sessions with confidence and safety.',
    highlights: ['Multiple Techniques', 'Trauma-Informed Approach', 'Group Facilitation', 'Safety Protocols'],
    image: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  },
  {
    title: 'Integrative Wellness Coach',
    duration: '150 Hours',
    level: 'Intermediate',
    description: 'Become a certified wellness coach who blends mindfulness, movement, and evidence-based counseling.',
    highlights: ['Coaching Certification', 'Client Assessment', 'Program Design', 'Mindfulness Integration'],
    image: 'https://images.pexels.com/photos/5340280/pexels-photo-5340280.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  },
];

const benefits = [
  { icon: BookOpen, title: 'Comprehensive Curriculum', description: 'In-depth training combining theory, practice, and real-world application' },
  { icon: Users, title: 'Expert Mentorship', description: 'Small cohorts guided by seasoned practitioners with decades of experience' },
  { icon: Calendar, title: 'Flexible Scheduling', description: 'Weekend intensives and evening options designed for working professionals' },
  { icon: Award, title: 'Recognized Certification', description: 'Nationally recognized credentials to launch your professional practice' },
];

export default function Training() {
  return (
    <section className="section bg-slate-900">
      <div className="container-wide">
        <div className="max-w-3xl mb-10 sm:mb-16 lg:mb-20">
          <p className="text-sage-400 font-medium tracking-widest uppercase text-sm mb-4">Practitioner Training</p>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Turn your passion into a practice
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Our certification programs prepare you to guide others on their wellness journey -- with rigorous curriculum, hands-on mentorship, and professional credentialing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
          {programs.map((program) => (
            <div
              key={program.title}
              className="bg-slate-800 rounded-2xl overflow-hidden group hover:bg-slate-800/80 transition-colors duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <span className="px-3 py-1 bg-sage-600 text-white rounded-full text-sm font-medium">
                    {program.duration}
                  </span>
                  <span className="text-slate-300 text-sm">{program.level}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display text-2xl font-bold text-white mb-3">{program.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-6">{program.description}</p>

                <ul className="space-y-3 mb-6">
                  {program.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-sage-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="group/link inline-flex items-center text-sage-400 font-semibold hover:text-sage-300 transition-colors"
                >
                  Apply now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="bg-slate-800/60 rounded-xl p-5 sm:p-6 border border-slate-700/50">
                <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-sage-400 mb-3 sm:mb-4" />
                <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">{benefit.title}</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-16 text-center">
          <div className="bg-gradient-to-r from-sage-600/20 to-teal-600/20 border border-sage-500/30 rounded-2xl p-6 sm:p-10 max-w-xl mx-auto">
            <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
              Next cohort begins March 2026
            </h3>
            <p className="text-slate-400 mb-6 text-sm sm:text-base">Limited spots available. Early enrollment is now open.</p>
            <a
              href="#contact"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-sage-600 text-white rounded-full font-semibold hover:bg-sage-500 transition-colors shadow-lg shadow-sage-900/30 text-sm sm:text-base"
            >
              Request Information
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
