import { useState, useEffect } from 'react';
import { useAuth } from '../../components/context/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Calendar, Clock, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface Booking {
  id: string;
  user_id: string;
  user_name: string;
  booking_date: string;
  booking_time: string;
  duration_minutes: number;
  status: string;
  rate: number | null;
}

interface BlockedSlot {
  id: string;
  blocked_start: string;
  blocked_end: string;
  reason: string;
}

interface CalendarItem {
  type: 'booking' | 'blocked';
  date: string;
  time: string;
  title: string;
  description?: string;
}

interface BookingRow {
  id: string;
  user_id: string;
  booking_date: string;
  booking_time: string;
  duration_minutes: number;
  status: string;
  rate: number | null;
  profiles: { full_name: string } | null;
}

export default function InstructorCalendar() {
  const { profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    if (!profile?.roles.includes('instructor')) return;
    loadCalendarData();
  }, [profile]);

  const loadCalendarData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const oneYearOut = new Date(today);
      oneYearOut.setFullYear(oneYearOut.getFullYear() + 1);

      const [bookingRes, blockedRes] = await Promise.all([
        supabase
          .from('instructor_bookings')
          .select('id, user_id, booking_date, booking_time, duration_minutes, status, rate, profiles!user_id(full_name)')
          .eq('instructor_id', profile!.id)
          .gte('booking_date', today.toISOString().split('T')[0])
          .lte('booking_date', oneYearOut.toISOString().split('T')[0])
          .order('booking_date', { ascending: true }),

        supabase
          .from('instructor_unavailable_slots')
          .select('*')
          .eq('instructor_id', profile!.id)
          .gte('blocked_start', today.toISOString())
          .lte('blocked_end', oneYearOut.toISOString())
          .order('blocked_start', { ascending: true }),
      ]);

      if (bookingRes.data) {
        setBookings(
          bookingRes.data.map((b: BookingRow) => ({
            id: b.id,
            user_id: b.user_id,
            user_name: b.profiles?.full_name || 'Unknown',
            booking_date: b.booking_date,
            booking_time: b.booking_time,
            duration_minutes: b.duration_minutes,
            status: b.status,
            rate: b.rate,
          }))
        );
      }

      if (blockedRes.data) {
        setBlockedSlots(blockedRes.data as BlockedSlot[]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCalendarEvents = (): CalendarItem[] => {
    const events: CalendarItem[] = [];

    bookings.forEach((b) => {
      events.push({
        type: 'booking',
        date: b.booking_date,
        time: b.booking_time,
        title: b.user_name,
        description: `${b.duration_minutes} min - $${b.rate?.toFixed(2) || 'N/A'}`,
      });
    });

    blockedSlots.forEach((s) => {
      const startDate = s.blocked_start.split('T')[0];
      const startTime = s.blocked_start.split('T')[1]?.slice(0, 5);
      const reasonLabel = s.reason === 'synced_event' ? 'Synced Event' : s.reason === 'personal' ? 'Personal Block' : 'Blocked';

      events.push({
        type: 'blocked',
        date: startDate,
        time: startTime || '00:00',
        title: reasonLabel,
      });
    });

    return events.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const eventsByDate = new Map<string, CalendarItem[]>();
  getCalendarEvents().forEach((event) => {
    const dateKey = event.date;
    if (!eventsByDate.has(dateKey)) {
      eventsByDate.set(dateKey, []);
    }
    eventsByDate.get(dateKey)!.push(event);
  });

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!profile?.roles.includes('instructor')) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Only instructors can view this page.</p>
      </div>
    );
  }

  const upcomingBookings = bookings
    .filter((b) => new Date(b.booking_date) >= new Date())
    .sort((a, b) => a.booking_date.localeCompare(b.booking_date))
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Calendar & Bookings</h1>
        <p className="text-slate-600 mt-1">View your availability and scheduled sessions</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">{monthName}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-slate-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="aspect-square" />;
                }

                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEvents = eventsByDate.get(dateStr) || [];
                return (
                  <div
                    key={dateStr}
                    className="aspect-square bg-stone-50 rounded-lg border border-stone-200 p-1.5 flex flex-col"
                  >
                    <div className="text-xs font-semibold text-slate-600">{day}</div>
                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                      {dayEvents.slice(0, 2).map((event, i) => (
                        <div
                          key={`${dateStr}-${i}`}
                          className={`text-[9px] px-1 py-0.5 rounded truncate font-medium text-white ${
                            event.type === 'booking' ? 'bg-sage-600' : 'bg-amber-600'
                          }`}
                        >
                          {event.title.split(' ')[0]}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-slate-500 px-1">+{dayEvents.length - 2}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-stone-200 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-sage-600 rounded"></div>
                <span className="text-slate-600">Bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-600 rounded"></div>
                <span className="text-slate-600">Blocked/Synced</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming Sessions</h2>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              {showDetails ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="space-y-3">
            {upcomingBookings.length === 0 ? (
              <div className="bg-white rounded-lg border border-stone-200 p-6 text-center">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-600">No upcoming sessions</p>
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg border border-stone-200 p-4 space-y-2"
                >
                  {showDetails && (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 truncate">{booking.user_name}</h3>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                            booking.status === 'confirmed'
                              ? 'bg-sage-100 text-sage-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(booking.booking_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {booking.booking_time} ({booking.duration_minutes} min)
                        </div>
                        {booking.rate && (
                          <div className="text-sm font-semibold text-sage-600">
                            ${booking.rate.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
