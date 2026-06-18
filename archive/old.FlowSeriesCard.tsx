import { Link } from "react-router-dom";
import { ArrowRight, Waves, Calendar, Clock, CheckCircle2 } from "lucide-react";

type FlowSeries = {
  season: string;
  year: string;
  theme: string;
  dates: string;
  sessions: string;
  price: string;
};

type Props = {
  cohort: FlowSeries;
  whatsIncluded: string[];
};

export default function FlowSeriesCard({ cohort, whatsIncluded }: Props) {
  return (
    <Link
      to="/offerings/flow-series"
      className="block bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md hover:border-sage-200 transition-all cursor-pointer group"
    >
      <div className="p-5 sm:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-sage-100 flex items-center justify-center">
              <Waves className="w-5 h-5 text-sage-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Flow Series
              </h2>

              <p className="text-slate-500 text-md">
                8-week program delivered live via Zoom in a community-driven virtual environment.
                <br />
                Join from anywhere, this program frequently attracts participants from all around the world.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-3 mt-4 sm:mt-0">
            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-4xl font-bold text-slate-900">
                {cohort.price}
              </div>
            </div>

            <Link
              to="/checkout/spring-cohort/register"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sage-600 text-white rounded-lg font-semibold text-sm hover:bg-sage-700 transition-colors"
            >
              Enroll Today
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Cohort title */}
        <div className="mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {cohort.season} {cohort.year}
          </h3>

          <h3 className="text-sage-600 font-medium text-base sm:text-lg">
            {cohort.theme}
          </h3>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          <div className="lg:col-span-2">

            <p className="text-slate-600 leading-relaxed mb-6">
              Weaving together bodily movement, controlled breathing, and a vibrant community to create an experience powerful enough to transform how you approach your life and goals.
            </p>

            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Everything Included
            </h4>

            <ul className="space-y-3">
              {whatsIncluded.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-slate-600"
                >
                  <CheckCircle2 className="w-5 h-5 text-sage-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="bg-stone-50 rounded-xl p-6 space-y-5">

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Dates
                </p>

                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-sage-600 shrink-0 mt-0.5" />
                  <p className="font-semibold text-slate-900">
                    {cohort.dates}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Duration
                </p>

                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-sage-600 shrink-0 mt-0.5" />
                  <p className="font-semibold text-slate-900">
                    {cohort.sessions}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </Link>
  );
}
