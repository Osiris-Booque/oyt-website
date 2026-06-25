import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const BOOKING_URL =
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1HZ43X9NOvJz834TvyIRoJS6rrPvTHxRDCiOwqWtngAL-YC3ZkXiU716kFjkglgZmCtYJ1PKF_";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-10 sm:py-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">

        <div className="sm:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-sage-500" />
            <span className="text-lg font-bold">
              OSIRIS YOGA THERAPY
            </span>
          </div>

          <p className="text-white/70 max-w-md text-sm sm:text-base">
            A multi-modal health and wellness practice specializing in yoga
            therapy, breathwork, meditation, and conditioning.
          </p>
        </div>

        <div>
          <h3 className="uppercase text-sm text-white/60 mb-3 sm:mb-4">
            Navigation
          </h3>

          <div className="space-y-2">
            <Link to="/#offerings" className="block text-white/70 hover:text-sage-300 text-sm sm:text-base">
              Offerings
            </Link>

            <Link to="/about" className="block text-white/70 hover:text-sage-300 text-sm sm:text-base">
              About
            </Link>

            <Link to="/blog" className="block text-white/70 hover:text-sage-300 text-sm sm:text-base">
              Blog
            </Link>

            <Link to="/faq" className="block text-white/70 hover:text-sage-300 text-sm sm:text-base">
              FAQ
            </Link>

            <Link to="/login" className="block text-white/70 hover:text-sage-300 text-sm sm:text-base">
              Sign In
            </Link>
          </div>
        </div>

        <div>
          <h3 className="uppercase text-sm text-white/60 mb-3 sm:mb-4">
            Contact
          </h3>

          <p className="text-white/70 text-sm sm:text-base">
            info@osiris.yoga
          </p>

          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-sage-400 hover:text-sage-300 text-sm font-medium transition-colors"
          >
            Book a consultation
          </a>
          <Link
            to="/contact"
            className="block mt-1 text-sage-400 hover:text-sage-300 text-sm font-medium transition-colors"
          >
            Send us a message
          </Link>
        </div>

      </div>

      <div className="border-t border-white/20 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-white/50 text-xs sm:text-sm px-4">

        <p>© 2026 OSIRIS YOGA THERAPY</p>

        <p>
          Designed & Built with Love by{" "}
          <a
            href="https://www.cactai.io/work/osiris-yoga"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Cactai Inc.
          </a>
        </p>

      </div>

    </footer>
  );
}
