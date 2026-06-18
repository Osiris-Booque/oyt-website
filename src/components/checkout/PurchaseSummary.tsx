import { Calendar, Users, CheckCircle2 } from 'lucide-react';

interface PurchaseSummaryProps {
  programTitle: string;
  programDescription: string;
  dates: string;
  price: number;
  spotsRemaining?: number;
  features: string[];
}

export default function PurchaseSummary({
  programTitle,
  programDescription,
  dates,
  price,
  spotsRemaining,
  features,
}: PurchaseSummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sticky top-24">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Order Summary
      </h3>

      <div className="pb-5 border-b border-stone-100 mb-5">
        <p className="font-bold text-slate-900 text-base">{programTitle}</p>
        <p className="text-slate-500 text-sm mt-0.5">{programDescription}</p>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
          <Calendar className="w-3.5 h-3.5" /> {dates}
        </div>
        {spotsRemaining !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mt-1.5">
            <Users className="w-3.5 h-3.5" /> {spotsRemaining} spot{spotsRemaining !== 1 ? 's' : ''} remaining
          </div>
        )}
      </div>

      <div className="space-y-2.5 mb-5">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage-500 mt-0.5 shrink-0" />
            {feature}
          </div>
        ))}
      </div>

      <div className="border-t border-stone-100 pt-4 flex items-center justify-between">
        <span className="text-slate-600 font-medium text-sm">Total</span>
        <span className="text-2xl font-bold text-slate-900">${price}</span>
      </div>
    </div>
  );
}
