import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Heart, ChevronLeft, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../components/context/AuthContext';
import { supabase } from '../../lib/supabase';
import StripePaymentLinkButton from '../../components/checkout/StripePaymentLinkIframe';
import PurchaseSummary from '../../components/checkout/PurchaseSummary';

interface Program {
  id: string;
  title: string;
  description: string;
  slug: string;
  price?: number;
  duration_hours?: number;
  cover_image_url?: string;
  stripe_payment_link_url?: string;
}

interface ProgramDetails {
  program: Program;
  programDates: string;
  spotsRemaining?: number;
  features: string[];
  backLinkUrl: string;
}

const PROGRAM_CONFIGS: Record<string, ProgramDetails> = {
  'flow-into-spring': {
    program: {
      id: '',
      title: 'Flow Series — Spring 2026',
      description: '"Career & Expansion" · 8-Week Cohort',
      slug: 'flow-into-spring',
      price: 1200,
    },
    programDates: 'March 22 – May 03, 2026',
    spotsRemaining: 8,
    features: [
      '4 bi-weekly live zoom based sessions with your entire cohort',
      'Community forum for you and your cohort members to connect 1:1 and as a group',
      'Weekly reflection guides and video practices with journaling prompts and at home exercises',
      'Certificate of completion and automatic acceptance into join future cohorts (space permitting)',
      'Lifetime access to downloadable session recordings',
      'Discounted pricing for all 1:1 private sessions for 1 year',
    ],
    backLinkUrl: '/offerings/flow-series',
  },
};

export default function CheckoutPage() {
  const { programSlug } = useParams<{ programSlug: string }>();
  const { user, profile, loading } = useAuth();
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [programData, setProgramData] = useState<Program | null>(null);

  const config = programSlug ? PROGRAM_CONFIGS[programSlug] : undefined;

  useEffect(() => {
    if (loading || !user || !programSlug || !config) return;
    (async () => {
      const { data: prog } = await supabase
        .from('programs')
        .select('id, title, description, slug, stripe_payment_link_url')
        .eq('slug', programSlug)
        .maybeSingle();

      if (prog) {
        setProgramData(prog);
        const { data: existing } = await supabase
          .from('payments')
          .select('id')
          .eq('user_id', user.id)
          .eq('program_id', prog.id)
          .eq('status', 'paid')
          .maybeSingle();
        if (existing) {
          window.location.href = '/dashboard';
          return;
        }
      }
      setCheckingExisting(false);
    })();
  }, [loading, user, programSlug, config]);

  if (!programSlug || !config) {
    return <Navigate to="/offerings" replace />;
  }

  if (loading || checkingExisting) return null;
  if (!user) return <Navigate to="/login" replace />;

  const stripeLink = programData?.stripe_payment_link_url;

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-sage-600" />
            <span className="text-lg font-bold text-slate-900">OSIRIS YOGA THERAPY</span>
          </Link>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Lock className="w-4 h-4" /> Secure Checkout
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={config.backLinkUrl}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-sage-600 text-sm font-medium transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sage-600 text-white text-xs font-bold flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-sage-700">Account Created</span>
          </div>
          <div className="w-8 h-px bg-sage-300" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sage-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </div>
            <span className="text-sm font-semibold text-sage-700">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete your enrollment</h1>
            <p className="text-slate-500 mb-2">
              Enrolling as <span className="font-semibold text-slate-700">{profile?.full_name}</span>
            </p>
            <p className="text-slate-400 text-sm mb-8">Complete your payment to finalize your spot.</p>

            {stripeLink ? (
              <StripePaymentLinkButton
                stripePaymentLinkUrl={stripeLink}
                userEmail={user?.email}
                clientReferenceId={user?.id}
              />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
                Payment link is not yet configured for this program. Please contact support.
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <PurchaseSummary
              programTitle={config.program.title}
              programDescription={config.program.description}
              dates={config.programDates}
              price={config.program.price || 0}
              spotsRemaining={config.spotsRemaining}
              features={config.features}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
