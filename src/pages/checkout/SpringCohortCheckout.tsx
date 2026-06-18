import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft, Lock, Calendar, Users, CheckCircle2, Pencil, X, Check, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../components/context/AuthContext';
import { supabase } from '../../lib/supabase';
import StripePaymentLinkButton from '../../components/checkout/StripePaymentLinkIframe';

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_8x2fZia39f8O5AEbdLeIw00';

const ORDER_SUMMARY = {
  name: 'Flow Series — Spring 2026',
  description: '"Career & Expansion" · 8-Week Cohort',
  dates: 'March 22 – May 03, 2026',
  price: 1200,
};

const WHATS_INCLUDED = [
  '4 bi-weekly live zoom based sessions with your entire cohort',
  'Community forum for you and your cohort members to connect 1:1 and as a group',
  'Weekly reflection guides and video practices with journaling prompts and at home exercises',
  'Certificate of completion and automatic acceptance into join future cohorts (space permitting)',
  'Lifetime access to downloadable session recordings',
  'Discounted pricing for all 1:1 private sessions for 1 year',
];

interface EditableField {
  label: string;
  key: 'full_name' | 'phone';
  type: string;
  placeholder: string;
}

const EDITABLE_FIELDS: EditableField[] = [
  { label: 'Full name', key: 'full_name', type: 'text', placeholder: 'Your full name' },
  { label: 'Phone number', key: 'phone', type: 'tel', placeholder: 'e.g. +1 (555) 000-0000' },
];

export default function SpringCohortCheckout() {
  const { user, profile, loading, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [checkingExisting, setCheckingExisting] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [formValues, setFormValues] = useState({ full_name: '', phone: '' });

  useEffect(() => {
    if (profile) {
      setFormValues({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (loading || !user) return;
    (async () => {
      const { data: prog } = await supabase
        .from('programs')
        .select('id')
        .eq('slug', 'flow-into-spring')
        .maybeSingle();
      if (prog) {
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
  }, [loading, user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError('');
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: formValues.full_name, phone: formValues.phone })
      .eq('id', user.id);
    setSaving(false);
    if (error) {
      setSaveError('Failed to save. Please try again.');
    } else {
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setFormValues({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
    });
    setSaveError('');
    setEditing(false);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError('');
    const { error } = await deleteAccount();
    if (error) {
      setDeleteError(error);
      setDeleting(false);
    } else {
      navigate('/', { replace: true });
    }
  };

  if (loading || checkingExisting) return null;
  if (!user) return <Navigate to="/checkout/spring-cohort/register" replace />;

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
        <Link to="/offerings/flow-series" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-sage-600 text-sm font-medium transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to Flow Series
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
            <div className="w-7 h-7 rounded-full bg-sage-600 text-white text-xs font-bold flex items-center justify-center">2</div>
            <span className="text-sm font-semibold text-sage-700">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete your enrollment</h1>
            <p className="text-slate-500 mb-8">Review your details below, then proceed to payment.</p>

            <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-widest">Your Information</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage-600 hover:text-sage-700 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
              </div>

              {editing ? (
                <div className="space-y-4">
                  {EDITABLE_FIELDS.map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        value={formValues[field.key]}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-100 outline-none transition-all text-sm text-slate-800"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Email address</label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full px-3 py-2.5 rounded-lg border border-stone-100 bg-stone-50 text-slate-400 text-sm cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-400 mt-1">Email cannot be changed here.</p>
                  </div>

                  {saveError && (
                    <p className="text-xs text-red-600">{saveError}</p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-sage-600 text-white rounded-lg text-sm font-semibold hover:bg-sage-700 transition-colors disabled:opacity-60"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {saving ? 'Saving...' : 'Save changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-200 text-slate-600 rounded-lg text-sm font-semibold hover:border-stone-300 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-0.5">Full name</p>
                      <p className="text-sm font-semibold text-slate-800">{formValues.full_name || <span className="text-slate-400 italic">Not set</span>}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-0.5">Email address</p>
                      <p className="text-sm font-semibold text-slate-800">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-0.5">Phone number</p>
                      <p className="text-sm font-semibold text-slate-800">{formValues.phone || <span className="text-slate-400 italic">Not set</span>}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <StripePaymentLinkButton
              stripePaymentLinkUrl={STRIPE_PAYMENT_LINK}
              userEmail={user?.email}
              clientReferenceId={user?.id}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sticky top-24">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Order Summary</h3>
              <div className="pb-5 border-b border-stone-100 mb-5">
                <p className="font-bold text-slate-900 text-base">{ORDER_SUMMARY.name}</p>
                <p className="text-slate-500 text-sm mt-0.5">{ORDER_SUMMARY.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <Calendar className="w-3.5 h-3.5" /> {ORDER_SUMMARY.dates}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mt-1.5">
                  <Users className="w-3.5 h-3.5" /> 8 spots remaining
                </div>
              </div>

              <div className="space-y-2.5 mb-5">
                {WHATS_INCLUDED.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-500 mt-0.5 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100 pt-4 flex items-center justify-between">
                <span className="text-slate-600 font-medium text-sm">Total</span>
                <span className="text-2xl font-bold text-slate-900">${ORDER_SUMMARY.price}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-8 text-center">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors underline underline-offset-2"
          >
            Changed your mind? Cancel and delete my account
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl border border-stone-200 shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete your account?</h3>
            <p className="text-sm text-slate-500 text-center leading-relaxed mb-6">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>

            {deleteError && (
              <p className="text-xs text-red-600 text-center mb-4">{deleteError}</p>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Deleting account...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Yes, delete my account
                  </>
                )}
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteError(''); }}
                disabled={deleting}
                className="w-full py-3 border border-stone-200 text-slate-600 rounded-xl font-semibold text-sm hover:border-stone-300 transition-colors disabled:opacity-60"
              >
                Keep my account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
