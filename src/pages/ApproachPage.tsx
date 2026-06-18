import { Heart, Wind, Brain, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { scrollToHash } from '../components/ScrollManager';

const pillars = [
  {
    id: 'yoga-therapy',
    icon: Heart,
    title: 'Yoga Therapy',
    subtitle: 'Body & Spirit',
    description: 'Yoga therapy works through the body to influence the psycho social emotional system. Intentional movement, breath coordination, and somatic awareness guide the body and mind toward nervous system coherence. The result is greater mobility, resilience, and a steadier capacity for calm, presence, and self regulation.',
    image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    benefits: ['Improved flexibility & strength', 'Stress reduction', 'Enhanced mindfulness', 'Pain management'],
  },
  {
    id: 'breathwork',
    icon: Wind,
    title: 'Breathwork',
    subtitle: 'Energy & Balance',
    description: 'Breathwork directly engages the nervous system and shapes how the body processes stress and emotion. Through structured pranayama and modern respiratory science, breathing patterns are retrained to restore psycho physiological coherence, stabilizing energy and supporting clarity, rest, and emotional balance.',
    image: 'https://images.pexels.com/photos/3820380/pexels-photo-3820380.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    benefits: ['Reduced anxiety', 'Increased energy', 'Better sleep quality', 'Emotional regulation'],
  },
  {
    id: 'meditation',
    icon: Brain,
    title: 'Meditation',
    subtitle: 'Mind & Healing',
    description: 'Meditation strengthens the ability to observe thoughts and emotions without immediate reaction. With consistent practice, attention and awareness organize the mind into greater mental and emotional coherence, supporting insight, healing, and a more deliberate relationship with experience.',
    image: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    benefits: ['Mental clarity', 'Emotional healing', 'Personal growth', 'Coping strategies'],
  },
  {
    id: 'conditioning',
    icon: Activity,
    title: 'Conditioning',
    subtitle: 'Growth & Mastery',
    description: 'Conditioning integrates movement, breath regulation, and reflective awareness into a single psycho social emotional training process. Together these practices cultivate nervous system coherence, emotional regulation, and the capacity to respond thoughtfully rather than react under pressure.',
    image: 'https://images.pexels.com/photos/4325466/pexels-photo-4325466.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    benefits: ['Professional certification', 'Hands-on mentorship', 'Business skills', 'Community network'],
  },
];

export default function ApproachPage() {
  return (
    <div>
      <section className="pt-12 sm:pt-20 pb-8 sm:pb-12 bg-stone-50">
        <div className="container-wide">
          <p className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-3">Our Approach</p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl font-bold text-primary mb-4 max-w-3xl">
            Four pillars of health & wellness
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-secondary leading-relaxed max-w-2xl mb-8 sm:mb-10">
            Each discipline works in harmony together to carefully address each aspect of your biological system
            -- body, breath, mind, and resilience.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <button
                  key={pillar.id}
                  onClick={() => scrollToHash(`#${pillar.id}`)}
                  className="group flex items-center gap-3 p-3 sm:p-4 bg-white rounded-xl border border-stone-200 hover:border-sage-400 hover:shadow-md transition-all duration-200 text-left cursor-pointer"
                >
                  <div className="w-9 sm:w-10 h-9 sm:h-10 bg-sage-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-sage-500 transition-colors">
                    <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-primary text-sm leading-tight">{pillar.title}</p>
                    <p className="text-sage-600 text-xs font-medium">{pillar.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24">
        <div className="container-wide space-y-16 sm:space-y-20 md:space-y-28">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={pillar.id}
                id={pillar.id}
                className="scroll-mt-24"
              >
                <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 sm:gap-10 lg:gap-16 items-center`}>
                  <div className="w-full lg:w-1/2">
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[4/3]">
                      <img
                        src={pillar.image}
                        alt={pillar.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 bg-sage-600 rounded-xl flex items-center justify-center shadow-md shadow-sage-600/20">
                        <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-primary">{pillar.title}</h2>
                        <p className="text-sage-600 font-medium text-xs sm:text-sm">{pillar.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-secondary leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">
                      {pillar.description}
                    </p>

                    <ul className="space-y-2 sm:space-y-3">
                      {pillar.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3 text-primary text-sm sm:text-base">
                          <div className="w-1.5 h-1.5 bg-sage-600 rounded-full flex-shrink-0 mt-2" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-stone-50">
        <div className="container-wide text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-4">
            Ready to begin your journey?
          </h2>
          <p className="text-secondary mb-8 max-w-lg mx-auto">
            Explore our programs and find the path that resonates with where you are today.
          </p>
          <Link
            to="/offerings"
            className="inline-flex items-center gap-2 bg-sage-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors w-full sm:w-auto justify-center"
          >
            View Offerings
          </Link>
        </div>
      </section>
    </div>
  );
}
