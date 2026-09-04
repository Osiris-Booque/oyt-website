import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NotifyModal({ isOpen, onClose }: NotifyModalProps) {
  const [form, setForm] = useState<FormState>({ firstName: '', lastName: '', email: '', phone: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const { firstName, lastName, email, phone } = form;
    const emailNorm = email.trim().toLowerCase();

    try {
      const { data: existing, error: fetchError } = await supabase
        .from('notification_signup_list')
        .select('*')
        .eq('email', emailNorm)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) {
        const merged = {
          first_names: addIfMissing(existing.first_names, firstName.trim()),
          last_names: addIfMissing(existing.last_names, lastName.trim()),
          phones: addIfMissing(existing.phones, phone.trim()),
          updated_at: new Date().toISOString(),
        };
        const { error: updateError } = await supabase
          .from('notification_signup_list')
          .update(merged)
          .eq('email', emailNorm);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('notification_signup_list')
          .insert({
            email: emailNorm,
            first_names: firstName.trim() ? [firstName.trim()] : [],
            last_names: lastName.trim() ? [lastName.trim()] : [],
            phones: phone.trim() ? [phone.trim()] : [],
          });
        if (insertError) throw insertError;
      }

      setStatus('success');
      setForm({ firstName: '', lastName: '', email: '', phone: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.message ?? 'Something went wrong. Please try again.');
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <p className="text-lg font-bold text-slate-900 mb-2">You're on the list.</p>
            <p className="text-sm text-slate-500">We'll reach out when early access opens for this cohort.</p>
            <button
              onClick={onClose}
              className="mt-6 px-5 py-2.5 border border-slate-900 text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-900 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Flow Series Announcements</p>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Send Me Emails About Flow Series</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              We'll send you emails with announcements about the Flow Series to make sure you know every time a new cohort opens for signup.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Jane"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="jane@example.com"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-600">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center justify-center gap-2 mt-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Submitting…' : 'Notify Me'}
                {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function addIfMissing(arr: string[], value: string): string[] {
  if (!value) return arr;
  if (arr.includes(value)) return arr;
  return [...arr, value];
}
