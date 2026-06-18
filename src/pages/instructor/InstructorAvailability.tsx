import { useState, useEffect } from 'react';
import { useAuth } from '../../components/context/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Plus, X, Calendar, Clock, Link as LinkIcon, Trash2, Pencil as Edit2 } from 'lucide-react';

interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface CalendarSync {
  id: string;
  calendar_type: 'google' | 'ical';
  calendar_id: string;
  is_synced: boolean;
  last_sync_at: string | null;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function InstructorAvailability() {
  const { profile } = useAuth();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [syncs, setSyncs] = useState<CalendarSync[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: 0,
    start_time: '09:00',
    end_time: '10:00',
    is_available: true,
  });

  useEffect(() => {
    if (!profile?.roles.includes('instructor')) return;
    loadData();
  }, [profile]);

  const loadData = async () => {
    try {
      const [availRes, syncRes] = await Promise.all([
        supabase
          .from('instructor_availability')
          .select('*')
          .eq('instructor_id', profile!.id)
          .order('day_of_week')
          .order('start_time'),

        supabase
          .from('instructor_calendar_sync')
          .select('*')
          .eq('instructor_id', profile!.id),
      ]);

      if (availRes.data) setAvailability(availRes.data as AvailabilitySlot[]);
      if (syncRes.data) setSyncs(syncRes.data as CalendarSync[]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async () => {
    if (!profile) return;

    const { error } = await supabase.from('instructor_availability').insert([
      {
        instructor_id: profile.id,
        ...formData,
      },
    ]);

    if (!error) {
      setFormData({ day_of_week: 0, start_time: '09:00', end_time: '10:00', is_available: true });
      setShowAddForm(false);
      loadData();
    }
  };

  const handleUpdateSlot = async () => {
    if (!editingSlot) return;

    const { error } = await supabase
      .from('instructor_availability')
      .update({
        day_of_week: editingSlot.day_of_week,
        start_time: editingSlot.start_time,
        end_time: editingSlot.end_time,
        is_available: editingSlot.is_available,
      })
      .eq('id', editingSlot.id);

    if (!error) {
      setEditingSlot(null);
      loadData();
    }
  };

  const handleDeleteSlot = async (id: string) => {
    const { error } = await supabase.from('instructor_availability').delete().eq('id', id);

    if (!error) {
      loadData();
    }
  };

  const handleDeleteSync = async (id: string) => {
    const { error } = await supabase.from('instructor_calendar_sync').delete().eq('id', id);

    if (!error) {
      loadData();
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!profile?.roles.includes('instructor')) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Only instructors can manage availability.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Availability & Calendar</h1>
        <p className="text-slate-600 mt-1">Manage your working hours and sync external calendars</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Weekly Availability</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add Slot
            </button>
          </div>

          <div className="space-y-2 bg-white rounded-xl border border-stone-200 p-4">
            {availability.length === 0 ? (
              <p className="text-slate-600 text-sm py-4 text-center">No availability slots set</p>
            ) : (
              availability.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200"
                >
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{DAYS[slot.day_of_week]}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      {slot.start_time} - {slot.end_time}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingSlot(slot)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {showAddForm && (
            <div className="mt-4 p-4 bg-sage-50 border border-sage-200 rounded-lg space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Day of Week</label>
                <select
                  value={formData.day_of_week}
                  onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                >
                  {DAYS.map((day, idx) => (
                    <option key={idx} value={idx}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddSlot}
                  className="flex-1 px-3 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors text-sm font-medium"
                >
                  Add Slot
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-3 py-2 bg-stone-200 text-slate-700 rounded-lg hover:bg-stone-300 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {editingSlot && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <h3 className="font-medium text-slate-900">Edit Availability</h3>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Day of Week</label>
                <select
                  value={editingSlot.day_of_week}
                  onChange={(e) => setEditingSlot({ ...editingSlot, day_of_week: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                >
                  {DAYS.map((day, idx) => (
                    <option key={idx} value={idx}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={editingSlot.start_time}
                    onChange={(e) => setEditingSlot({ ...editingSlot, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">End Time</label>
                  <input
                    type="time"
                    value={editingSlot.end_time}
                    onChange={(e) => setEditingSlot({ ...editingSlot, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateSlot}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingSlot(null)}
                  className="flex-1 px-3 py-2 bg-stone-200 text-slate-700 rounded-lg hover:bg-stone-300 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Calendar Sync</h2>
          </div>

          <div className="space-y-3 bg-white rounded-xl border border-stone-200 p-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-amber-900">Calendar Integration Coming Soon</p>
                  <p className="text-sm text-amber-800 mt-1">
                    Connect your Google Calendar or iCal feed to automatically sync your availability and prevent double-bookings.
                  </p>
                </div>
              </div>
            </div>

            {syncs.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium text-slate-600">Connected Calendars</p>
                {syncs.map((sync) => (
                  <div key={sync.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 capitalize">{sync.calendar_type} Calendar</div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                        <LinkIcon className="w-3.5 h-3.5" />
                        {sync.is_synced ? 'Synced' : 'Not synced'}
                        {sync.last_sync_at && (
                          <span className="text-xs text-slate-500">
                            - {new Date(sync.last_sync_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSync(sync.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
