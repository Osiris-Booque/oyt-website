import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  processing: boolean;
  onSubmit: (paymentMethodId: string) => Promise<void>;
  error: string | null;
}

export default function StripePaymentForm({
  amount,
  processing,
  onSubmit,
  error,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const stripeLoading = stripe === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setSubmitting(true);
    setCardError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setSubmitting(false);
      return;
    }

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

    if (stripeError) {
      setCardError(stripeError.message ?? 'Card validation failed. Please check your details.');
      setSubmitting(false);
      return;
    }

    if (!paymentMethod) {
      setCardError('Could not process card. Please try again.');
      setSubmitting(false);
      return;
    }

    try {
      await onSubmit(paymentMethod.id);
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = cardError || error;

  if (stripeLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-widest mb-5 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Payment Details
          </h2>
          <div className="p-3 border border-stone-200 rounded-lg bg-stone-50 h-11 animate-pulse" />
        </div>
        <div className="h-14 rounded-xl bg-stone-200 animate-pulse" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-widest mb-5 flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> Payment Details
        </h2>
        <div className="p-3 border border-stone-200 rounded-lg bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#1e293b',
                  '::placeholder': {
                    color: '#cbd5e1',
                  },
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            }}
          />
        </div>
      </div>

      {displayError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{displayError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || processing}
        className="group w-full flex items-center justify-center gap-2 py-4 bg-sage-600 text-white rounded-xl font-bold text-base hover:bg-sage-700 transition-colors disabled:opacity-70"
      >
        {submitting || processing ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processing payment...
          </span>
        ) : (
          <>
            Pay ${amount} · Enroll Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3" /> Secured by Stripe
      </p>
    </form>
  );
}