import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const PROGRAM_CATEGORIES = [
  {
    id: 'government',
    title: 'Government Agency Programs',
    description: 'Resilience & performance for public servants',
    calendarParam: 'Government',
  },
  {
    id: 'corporate',
    title: 'Corporate Wellness Programs',
    description: 'Culture, performance, and retention',
    calendarParam: 'Corporate',
  },
  {
    id: 'community',
    title: 'Community Wellness Programs',
    description: 'Wellness for schools & nonprofits',
    calendarParam: 'Community',
  },
];

export default function InterestForm() {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) return;

    const selectedCategories = PROGRAM_CATEGORIES.filter((cat) =>
      selected.includes(cat.id)
    )
      .map((cat) => cat.calendarParam)
      .join(', ');

    const calendarUrl = `https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1HZ43X9NOvJz834TvyIRoJS6rrPvTHxRDCiOwqWtngAL-YC3ZkXiU716kFjkglgZmCtYJ1PKF_?gid=${encodeURIComponent(selectedCategories)}`;

    window.location.href = calendarUrl;
  };

  const isValid = selected.length > 0;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="space-y-4 mb-8">
        {PROGRAM_CATEGORIES.map((category) => (
          <label
            key={category.id}
            className="block cursor-pointer"
          >
            <div className={`relative flex items-start p-5 rounded-xl border-2 transition-all ${
              selected.includes(category.id)
                ? 'border-sage-600 bg-sage-50'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}>
              <input
                type="checkbox"
                checked={selected.includes(category.id)}
                onChange={() => toggleSelection(category.id)}
                className="w-5 h-5 rounded border-stone-300 text-sage-600 cursor-pointer mt-0.5"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-slate-900">
                  {category.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {category.description}
                </p>
              </div>
              {selected.includes(category.id) && (
                <CheckCircle2 className="w-6 h-6 text-sage-600 ml-3 flex-shrink-0" />
              )}
            </div>
          </label>
        ))}
      </div>

      {submitted && selected.length === 0 && (
        <p className="text-sm text-red-600 mb-4 text-center">
          Please select at least one program category
        </p>
      )}

      <button
        type="submit"
        disabled={!isValid}
        className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-colors ${
          isValid
            ? 'bg-sage-600 text-white hover:bg-sage-500'
            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
        }`}
        onClick={() => setSubmitted(true)}
      >
        Schedule a Consultation
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
}
