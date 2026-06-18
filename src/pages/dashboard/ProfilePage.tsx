import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../components/context/AuthContext';
import { supabase } from '../../lib/supabase';
import { ROLE_LABELS, ROLE_COLORS } from '../../lib/constants';
import type { UserRole } from '../../lib/constants';

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSaved(false);

    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName, full_name: fullName, bio, phone, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || profile?.full_name;

  return (
    <div className="max-w-2xl">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-sage-600 text-sm font-medium mb-5 transition-colors">
        <LayoutDashboard className="w-4 h-4" /> Back to My Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Profile Settings</h1>

      <div className="bg-white rounded-xl border border-stone-200 p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-stone-200">
          <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-sage-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{displayName}</h2>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${profile ? ROLE_COLORS[profile.role as UserRole] : ''}`}>
                {profile ? ROLE_LABELS[profile.role as UserRole] : ''}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1.5">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-sage-600 focus:ring-2 focus:ring-sage-100 outline-none transition-all"
                placeholder="First"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1.5">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-sage-600 focus:ring-2 focus:ring-sage-100 outline-none transition-all"
                placeholder="Last"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1.5">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-sage-600 focus:ring-2 focus:ring-sage-100 outline-none transition-all resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-sage-600 focus:ring-2 focus:ring-sage-100 outline-none transition-all"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-sage-600 text-white rounded-lg font-semibold hover:bg-sage-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && <span className="text-sage-600 text-sm font-medium">Saved successfully</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
