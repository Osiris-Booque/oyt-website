import { Lock, ExternalLink, CreditCard, ShieldCheck } from 'lucide-react';

interface StripePaymentLinkButtonProps {
  stripePaymentLinkUrl: string;
  userEmail?: string;
  clientReferenceId?: string;
}

export default function StripePaymentLinkButton({
  stripePaymentLinkUrl,
  userEmail,
  clientReferenceId,
}: StripePaymentLinkButtonProps) {
  const buildUrl = () => {
    const url = new URL(stripePaymentLinkUrl);
    if (userEmail) url.searchParams.set('prefilled_email', userEmail);
    if (clientReferenceId) url.searchParams.set('client_reference_id', clientReferenceId);
    return url.toString();
  };

  const handleClick = () => {
    window.open(buildUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-8">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Payment Details
        </h2>

        <div className="bg-stone-50 rounded-xl p-6 mb-6 border border-stone-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-sage-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 mb-1">Secure payment via Stripe</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                You'll be taken to Stripe's secure checkout page to complete your payment.
                Your financial information is never stored on our servers.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleClick}
          className="group w-full flex items-center justify-center gap-2.5 py-4 bg-sage-600 text-white rounded-xl font-bold text-sm hover:bg-sage-700 active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
        >
          <Lock className="w-4 h-4" />
          Proceed to Secure Payment
          <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>

        <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL encrypted
          </span>
          <span className="w-px h-3 bg-stone-200" />
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> PCI DSS compliant
          </span>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3" /> Secured by Stripe
      </p>
    </div>
  );
}
