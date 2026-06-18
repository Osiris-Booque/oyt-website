import { Sparkles, Shield, Users, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import osirisImage from '../../assets/Osiris.png';

const values = [
  { icon: Sparkles, title: 'Integrative Practice' },
  { icon: Shield, title: 'Accessible to Everyone' },
  { icon: Users, title: 'Community & Connection' },
  { icon: Heart, title: 'Guided by a Yoga Therapist' },
];

export default function About() {
  return (
    <section id="about" className="section bg-body">
      <div className="container-wide">
        <Link
          to="/about"
          className="group block rounded-2xl border border-stone-200 bg-white hover:border-sage-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <div className="grid grid-cols-1">
            <div className="relative h-72 sm:h-96">
              <img
                src={osirisImage}
                alt="Osiris Yoga Therapy"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <p className="text-sage-600 font-medium tracking-widest uppercase text-xs mb-3">About Us</p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-primary mb-3">
                Where movement drives healing
              </h2>
              <p className="text-secondary text-sm sm:text-base leading-relaxed mb-5">
                Osiris Yoga Therapy is a multi-modal health and wellness practice built on the conviction that the body, breath, and mind are inseparable. We combine yoga therapy, breathwork, meditation, and conditioning into integrated programs for individuals and organizations.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <div key={value.title} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-sage-600 shrink-0" />
                      <span className="text-xs sm:text-sm text-primary font-medium">{value.title}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-sage-600 font-medium text-sm group-hover:gap-3 transition-all duration-300">
                Learn more about us
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
