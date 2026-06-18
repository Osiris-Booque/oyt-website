import { Heart, Wind, Brain, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const approach = [
  {
    id: 'yoga-therapy',
    icon: Heart,
    title: 'Yoga Therapy',
    subtitle: 'Body & Spirit',
    image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    benefits: ['Improved flexibility & strength', 'Stress reduction', 'Enhanced mindfulness', 'Pain management'],
  },
  {
    id: 'breathwork',
    icon: Wind,
    title: 'Breathwork',
    subtitle: 'Energy & Balance',
    image: 'https://images.pexels.com/photos/3820380/pexels-photo-3820380.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    benefits: ['Reduced anxiety', 'Increased energy', 'Better sleep quality', 'Emotional regulation'],
  },
  {
    id: 'meditation',
    icon: Brain,
    title: 'Meditation',
    subtitle: 'Mind & Healing',
    image: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    benefits: ['Mental clarity', 'Emotional healing', 'Personal growth', 'Coping strategies'],
  },
  {
    id: 'conditioning',
    icon: Activity,
    title: 'Conditioning',
    subtitle: 'Growth & Mastery',
    image: 'https://images.pexels.com/photos/4325466/pexels-photo-4325466.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    benefits: ['Professional certification', 'Hands-on mentorship', 'Business skills', 'Community network'],
  },
];

export default function Approach() {
  return (
    <section id="approach" className="scroll-mt-16 py-16 md:py-20 bg-white">
      <div className="container-wide">
        <div className="max-w-3xl mb-10 lg:mb-12">
          <p className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-3">Our Approach</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-4">
            Four pillars of health & wellness
          </h2>
          <p className="text-base text-secondary leading-relaxed">
            Each discipline works in harmony together to carefully address each aspect of your biological system
            — body, breath, mind, and resilience.
          </p>
        </div>

        <div className="lg:hidden space-y-4 mb-12">
          {approach.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={`/approach#${item.id}`}
                className="flex items-start gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200 hover:border-sage-300 transition-colors"
              >
                <div className="w-12 h-12 bg-sage-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-sage-600/20">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-primary text-sm">{item.title}</h3>
                  <p className="text-sage-600 font-medium text-xs">{item.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:grid grid-cols-4 gap-5">
          {approach.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                to={`/approach#${item.id}`}
                className="group bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden hover:border-sage-300 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="relative overflow-hidden h-40">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-sage-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-sage-600/20">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-bold text-primary leading-tight">{item.title}</h3>
                      <p className="text-sage-600 font-medium text-xs">{item.subtitle}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 flex-1">
                    {item.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-primary">
                        <div className="w-1.5 h-1.5 bg-sage-600 rounded-full flex-shrink-0 mt-1.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 lg:mt-12 text-center">
          <Link
            to="/approach"
            className="inline-flex items-center gap-2 text-sage-600 font-medium hover:text-sage-700 transition-colors text-base sm:text-lg"
          >
            Learn more about our approach
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
