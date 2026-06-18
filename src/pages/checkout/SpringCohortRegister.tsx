import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Heart, Eye, EyeOff, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../components/context/AuthContext';

export default function SpringCohortRegister() {
  const navigate = useNavigate();
  const { signUp, signIn, user, loading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/checkout/spring-cohort/pay" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) { setError('Please enter your full name'); return; }
    if (!email.trim()) { setError('Email is required'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setSubmitting(true);

    const { error: signUpErr } = await signUp(email, password, fullName);
    if (signUpErr) {
      if (signUpErr.toLowerCase().includes('already registered') || signUpErr.toLowerCase().includes('already exists')) {
        const { error: signInErr } = await signIn(email, password);
        if (signInErr) {
          setError('An account with this email already exists. Please sign in first.');
          setSubmitting(false);
          return;
        }
      } else {
        setError(signUpErr);
        setSubmitting(false);
        return;
      }
    } else {
      const { error: signInErr } = await signIn(email, password);
      if (signInErr) {
        setError('Account created! Please sign in to continue.');
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    navigate('/checkout/spring-cohort/pay');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-sage-600" />
            <span className="text-lg font-bold text-slate-900">OSIRIS YOGA THERAPY</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/offerings/flow-series"
              className="flex items-center gap-1.5 text-slate-500 hover:text-sage-600 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              <Lock className="w-4 h-4" /> Secure Enrollment
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-sage-600 text-white text-xs font-bold flex items-center justify-center">1</div>
              <span className="text-sm font-semibold text-sage-700">Create Account</span>
            </div>
            <div className="w-8 h-px bg-stone-300" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-slate-500 text-xs font-bold flex items-center justify-center">2</div>
              <span className="text-sm font-medium text-slate-400">Payment</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Set up your member account first, then complete payment to finalize your enrollment.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-100 outline-none transition-all text-sm"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-100 outline-none transition-all text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Create password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-100 outline-none transition-all text-sm pr-10"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-100 outline-none transition-all text-sm"
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group w-full flex items-center justify-center gap-2 py-3.5 bg-sage-600 text-white rounded-xl font-bold text-sm hover:bg-sage-700 transition-colors disabled:opacity-60 mt-2"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Setting up your account...
                </span>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-sage-600 font-semibold hover:text-sage-700">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
