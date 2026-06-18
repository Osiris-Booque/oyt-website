import { Link } from 'react-router-dom';
import { ArrowRight, Users, User } from 'lucide-react';

export default function OfferingsSection() {
  return (
    <section id="offerings" className="bg-body pt-20 pb-16 lg:py-24">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-12">
          <p className="text-sage-600 font-medium tracking-widest uppercase text-lg mb-4">
            Explore Our Offerings
          </p>
          <p className="text-lg text-secondary leading-relaxed">
            We offer transformative wellness programs for teams and individuals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Link
            to="/offerings/team"
            className="group relative overflow-hidden rounded-3xl shadow-sm border border-stone-200 hover:shadow-xl transition-all duration-500 bg-white"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop"
                alt="Team Growth and Wellness"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-5 left-6">
                <div className="w-10 h-10 rounded-full bg-slate-500 flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-sage-dark transition-colors">
                Team Growth &amp; Wellness
              </h3>
              <p className="text-secondary leading-relaxed mb-6">
                Wellness journeys built for teams seeking to achieve greater connectivity, performance, and success.
              </p>
              <ul className="space-y-2 mb-7 text-sm text-secondary">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />Government Agency Programs</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />Corporate Wellness Programs</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />Community Wellness Programs</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />Virtual &amp; In-Person delivery</li>
              </ul>
              <div className="flex items-center gap-2 text-sage-dark font-semibold text-sm">
                Learn More About Team/Group Programs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            to="/offerings/personal"
            className="group relative overflow-hidden rounded-3xl shadow-sm border border-stone-200 hover:shadow-xl transition-all duration-500 bg-white"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop"
                alt="Personal Growth and Wellness"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                style={{ objectPosition: '67% center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-5 left-6">
                <div className="w-10 h-10 rounded-full bg-slate-500 flex items-center justify-center mb-2">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-sage-600 transition-colors">
                Personal Growth &amp; Wellness
              </h3>
              <p className="text-secondary leading-relaxed mb-6">
                Designed to help you achieve your highest levels of holistic wellness, we guide you through every step along your personal transformation journey.
              </p>
              <div className="space-y-2 mb-7 text-sm text-secondary">
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />Seasonal Programs</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />1:1 Private Sessions</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />Live Events &amp; Retreats</div>
              </div>
              <div className="flex items-center gap-2 text-sage-600 font-semibold text-sm">
                Find The Right Fit For You
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
