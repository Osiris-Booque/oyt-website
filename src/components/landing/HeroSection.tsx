import { ArrowRight } from 'lucide-react';
import { scrollToHash } from '../ScrollManager';
import heroImage from '../../assets/Osiris_Yoga_Therapy_Hero.png';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col pt-16 sm:pt-20">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Welcome to Osiris Yoga Therapy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-slate-900/30"></div>
      </div>

      <div className="relative container-wide w-full pt-[0%] flex flex-col justify-start">
        <div className="max-w-2xl pl-4 sm:pl-8 lg:pl-12">
          <p className="text-sage-400 font-medium tracking-widest uppercase text-xs sm:text-sm mb-4 sm:mb-6 animate-fade-in-up">
            Multi-Modal Health & Wellness Practice
          </p>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6 sm:mb-8 animate-fade-in-up delay-100">
            Where Movement
            <span className="block text-sage-400">Drives Healing</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed mb-8 sm:mb-10 max-w-xl animate-fade-in-up delay-200">
            An integrative practice combining yoga, breathwork, and therapy - guided by a yoga therapist dedicated to creating lasting transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up delay-300">
            <a
              href="#offerings"
              onClick={(e) => {
                // Scroll imperatively: a react-router <Link> to the same hash
                // produces no location change, so the CTA would go dead after
                // the first click. Matches the Header's anchor-link handling.
                e.preventDefault();
                scrollToHash("#offerings");
                window.history.pushState(null, "", "#offerings");
              }}
              className="group inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-sage-600 text-white rounded-full font-semibold text-base sm:text-lg hover:bg-sage-500 transition-all duration-300 shadow-lg shadow-sage-900/30"
            >
              <span>Explore Offerings</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>


          {/* <div className="flex items-center gap-8 mt-16 animate-fade-in-up delay-400">
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-slate-400 text-sm">Lives Transformed</div>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div>
              <div className="text-3xl font-bold text-white">15+</div>
              <div className="text-slate-400 text-sm">Years of Practice</div>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div>
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-slate-400 text-sm">Verified Graduates</div>
            </div>
          </div> */}
        </div>
      </div>

    </section>
  );
}
