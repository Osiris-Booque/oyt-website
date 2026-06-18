import { useState, useEffect } from 'react';
import { useAuth } from '../../components/context/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Calendar, Clock, User, MapPin, X, Zap, BookOpen, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface EnrolledClass {
  id: string;
  classNumber: number;
  title: string;
  date: string;
  time: string | null;
  link: string | null;
  programTitle: string;
  programSlug: string;
  type: 'enrolled';
}

interface AvailableProgram {
  id: string;
  title: string;
  date: string;
  time: null;
  slug: string;
  nextClassDate: string | null;
  category: string;
  type: 'available';
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string | null;
  eventType: string;
  description: string | null;
  locationUrl: string | null;
  type: 'event';
}

interface InstructorBooking {
  id: string;
  title: string;
  instructorId: string;
  instructorName: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: string;
  rate: number | null;
  type: 'booking';
}

interface DailyActivity {
  id: string;
  title: string;
  time: null;
  description: string;
  date: string;
  weekNumber: number;
  dayOfWeek: number;
  programTitle: string;
  type: 'activity';
}

type CalendarItem = EnrolledClass | AvailableProgram | CalendarEvent | InstructorBooking | DailyActivity;

interface ProgramMilestoneRow {
  id: string;
  class_number: number;
  class_date: string;
  class_time: string | null;
  class_link: string | null;
  title: string;
  programs: { title: string; slug: string } | null;
}

interface ProgramRow {
  id: string;
  title: string;
  slug: string;
  category: string;
}

interface CalendarEventRow {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  event_type: string;
  description: string | null;
  location_url: string | null;
}

interface BookingRow {
  id: string;
  instructor_id: string;
  booking_date: string;
  booking_time: string;
  duration_minutes: number;
  status: string;
  rate: number | null;
  profiles: { full_name: string } | null;
}

interface ActivityRow {
  id: string;
  task_title: string;
  task_description: string;
  week_number: number;
  day_of_week: number;
  program_id: string;
}

interface EnrollmentProgramRow {
  program_id: string;
  programs: { title: string; created_at: string | null } | null;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return '';
  return new Date('1970-01-01T' + timeStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function getEventColor(type: string): string {
  switch (type) {
    case 'enrolled':
      return 'bg-sage-50 border-sage-200 text-sage-900';
    case 'available':
      return 'bg-blue-50 border-blue-200 text-blue-900';
    case 'event':
      return 'bg-amber-50 border-amber-200 text-amber-900';
    case 'booking':
      return 'bg-purple-50 border-purple-200 text-purple-900';
    case 'activity':
      return 'bg-sage-light border-sage text-sage-dark';
    default:
      return 'bg-stone-50 border-stone-200 text-slate-900';
  }
}

function getDayColor(type: string): string {
  switch (type) {
    case 'enrolled':
      return 'bg-sage-600';
    case 'available':
      return 'bg-blue-600';
    case 'event':
      return 'bg-amber-600';
    case 'booking':
      return 'bg-purple-600';
    case 'activity':
      return 'bg-sage';
    default:
      return 'bg-slate-400';
  }
}

function EventModal({ event, onClose }: { event: CalendarItem | null; onClose: () => void }) {
  if (!event) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">{event.title}</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(event.date)}</span>
              </div>
              {event.type !== 'available' && event.time && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{formatTime(event.time)}</span>
                </div>
              )}

              {event.type === 'enrolled' && (
                <>
                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">{(event as EnrolledClass).programTitle}</span>
                  </div>
                  {(event as EnrolledClass).link && (
                    <a
                      href={(event as EnrolledClass).link!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-sage-100 text-sage-700 text-sm font-semibold rounded-lg hover:bg-sage-200 transition-colors"
                    >
                      <Zap className="w-4 h-4" /> Join Zoom
                    </a>
                  )}
                </>
              )}

              {event.type === 'available' && (
                <div className="flex items-center gap-2 text-slate-600">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">{(event as AvailableProgram).category}</span>
                </div>
              )}

              {event.type === 'event' && (
                <>
                  {(event as CalendarEvent).description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{(event as CalendarEvent).description}</p>
                  )}
                  {(event as CalendarEvent).locationUrl && (
                    <a
                      href={(event as CalendarEvent).locationUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-amber-700 text-sm font-semibold hover:text-amber-800"
                    >
                      <MapPin className="w-4 h-4" /> Location
                    </a>
                  )}
                </>
              )}

              {event.type === 'booking' && (
                <>
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{(event as InstructorBooking).instructorName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{(event as InstructorBooking).durationMinutes} minutes</span>
                  </div>
                  {(event as InstructorBooking).rate !== null && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="text-sm font-semibold">${(event as InstructorBooking).rate?.toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}

              {event.type === 'activity' && (
                <>
                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">{(event as DailyActivity).programTitle}</span>
                  </div>
                  {(event as DailyActivity).description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{(event as DailyActivity).description}</p>
                  )}
                </>
              )}
            </div>

            {event.type === 'available' && (
              <Link
                to={`/dashboard/programs/${(event as AvailableProgram).slug}`}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center text-sm"
              >
                View Program
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function MonthCalendar({ events, onSelectEvent, currentDate, onDateChange }: {
  events: CalendarItem[];
  onSelectEvent: (event: CalendarItem) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const eventsByDate = new Map<string, CalendarItem[]>();
  events.forEach(event => {
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
    const newDate = new Date(year, month - 1);
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(year, month + 1);
    onDateChange(newDate);
  };

  return (
    <div className="bg-card rounded-xl border border-input-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-primary">{monthName}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 hover:bg-input rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-input rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-secondary py-2">
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
              className="aspect-square bg-input rounded-lg border border-input-border p-1.5 flex flex-col"
            >
              <div className="text-xs font-semibold text-secondary mb-1">{day}</div>
              <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                {dayEvents.slice(0, 2).map((event, i) => (
                  <button
                    key={`${dateStr}-${i}`}
                    onClick={() => onSelectEvent(event)}
                    className={`text-[9px] px-1 py-0.5 rounded truncate font-medium ${getDayColor(event.type)} text-white hover:opacity-90 transition-opacity`}
                  >
                    {event.type === 'available' ? (event as AvailableProgram).title.split(' ')[0] : event.title.split(' ')[0]}
                  </button>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[9px] text-secondary px-1">+{dayEvents.length - 2}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [view, setView] = useState<'month' | 'list'>('month');

  useEffect(() => {
    if (!profile) return;
    loadCalendarData();
  }, [profile]);

  const loadCalendarData = async () => {
    const items: CalendarItem[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneYearOut = new Date(today);
    oneYearOut.setFullYear(oneYearOut.getFullYear() + 1);

    const [enrolledRes, availRes, eventsRes, bookingsRes, activitiesRes] = await Promise.all([
      supabase
        .from('program_milestones')
        .select('id, class_number, class_date, class_time, class_link, title, programs(title, slug)')
        .in(
          'program_id',
          (await supabase
            .from('enrollments')
            .select('program_id')
            .eq('user_id', profile!.id)
            .eq('status', 'active')
            .then((r) => r.data?.map((e: { program_id: string }) => e.program_id) || []))
        ),

      supabase
        .from('programs')
        .select('id, title, slug, category')
        .eq('is_published', true),

      supabase
        .from('calendar_events')
        .select('*')
        .gte('event_date', today.toISOString().split('T')[0])
        .lte('event_date', oneYearOut.toISOString().split('T')[0])
        .order('event_date', { ascending: true }),

      supabase
        .from('instructor_bookings')
        .select('id, instructor_id, booking_date, booking_time, duration_minutes, status, rate, profiles:instructor_id(full_name)')
        .eq('user_id', profile!.id)
        .gte('booking_date', today.toISOString().split('T')[0])
        .lte('booking_date', oneYearOut.toISOString().split('T')[0])
        .order('booking_date', { ascending: true }),

      supabase
        .from('daily_homework_tasks')
        .select('id, task_title, task_description, week_number, day_of_week, program_id, programs(title)')
        .in(
          'program_id',
          (await supabase
            .from('enrollments')
            .select('program_id')
            .eq('user_id', profile!.id)
            .eq('status', 'active')
            .then((r) => r.data?.map((e: { program_id: string }) => e.program_id) || []))
        ),
    ]);

    if (enrolledRes.data) {
      enrolledRes.data.forEach((m: ProgramMilestoneRow) => {
        items.push({
          id: m.id,
          classNumber: m.class_number,
          title: m.title,
          date: m.class_date,
          time: m.class_time,
          link: m.class_link,
          programTitle: m.programs?.title || '',
          programSlug: m.programs?.slug || '',
          type: 'enrolled',
        });
      });
    }

    if (availRes.data) {
      const enrolledIds = new Set(
        (await supabase
          .from('enrollments')
          .select('program_id')
          .eq('user_id', profile!.id)
          .then((r) => r.data?.map((e: { program_id: string }) => e.program_id) || []))
      );

      availRes.data.forEach((p: ProgramRow) => {
        if (!enrolledIds.has(p.id)) {
          items.push({
            id: p.id,
            title: p.title,
            slug: p.slug,
            nextClassDate: null,
            time: null,
            category: p.category,
            type: 'available',
            date: today.toISOString().split('T')[0],
          });
        }
      });
    }

    if (eventsRes.data) {
      eventsRes.data.forEach((e: CalendarEventRow) => {
        items.push({
          id: e.id,
          title: e.title,
          date: e.event_date,
          time: e.event_time,
          eventType: e.event_type,
          description: e.description,
          locationUrl: e.location_url,
          type: 'event',
        });
      });
    }

    if (bookingsRes.data) {
      bookingsRes.data.forEach((b: BookingRow) => {
        items.push({
          id: b.id,
          title: `Session with ${b.profiles?.full_name || 'Instructor'}`,
          instructorId: b.instructor_id,
          instructorName: b.profiles?.full_name || 'Instructor',
          date: b.booking_date,
          time: b.booking_time,
          durationMinutes: b.duration_minutes,
          status: b.status,
          rate: b.rate,
          type: 'booking',
        });
      });
    }

    if (activitiesRes.data) {
      const enrolledPrograms = new Map<string, { title: string; startDate: string | null }>();

      const enrollmentsRes = await supabase
        .from('enrollments')
        .select('program_id, programs(id, title, created_at)')
        .eq('user_id', profile!.id)
        .eq('status', 'active');

      if (enrollmentsRes.data) {
        enrollmentsRes.data.forEach((e: EnrollmentProgramRow) => {
          enrolledPrograms.set(e.program_id, {
            title: e.programs?.title || '',
            startDate: e.programs?.created_at?.split('T')[0] || null,
          });
        });
      }

      activitiesRes.data.forEach((a: ActivityRow) => {
        const programInfo = enrolledPrograms.get(a.program_id);
        const programStartDate = programInfo?.startDate;

        if (programStartDate) {
          const start = new Date(programStartDate + 'T00:00:00');
          const weekDiff = a.week_number - 1;
          const dayDiff = a.day_of_week - 1;
          const daysToAdd = weekDiff * 7 + dayDiff;
          const activityDate = new Date(start);
          activityDate.setDate(activityDate.getDate() + daysToAdd);
          const actDate = activityDate.toISOString().split('T')[0];

          if (new Date(actDate) <= oneYearOut && new Date(actDate) >= today) {
            items.push({
              id: a.id,
              title: a.task_title,
              time: null,
              description: a.task_description,
              date: actDate,
              weekNumber: a.week_number,
              dayOfWeek: a.day_of_week,
              programTitle: programInfo?.title || '',
              type: 'activity',
            });
          }
        }
      });
    }

    items.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) return dateA.getTime() - dateB.getTime();
      return (a.time || '').localeCompare(b.time || '');
    });

    setEvents(items);
    setLoading(false);
  };

  const listEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).slice(0, 50);

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-input rounded-lg transition-colors text-secondary hover:text-primary"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Calendar</h1>
              <p className="text-secondary mt-1">View all your classes, available programs, and events</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/booking"
              className="px-4 py-2 bg-sage-600 text-white rounded-lg font-medium hover:bg-sage-700 transition-colors text-sm text-center"
            >
              Schedule 1:1 Session
            </Link>
            <div className="flex items-center gap-2 bg-input rounded-lg p-1">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                  view === 'month'
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                  view === 'list'
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {view === 'month' ? (
        <MonthCalendar
          events={events}
          onSelectEvent={setSelectedEvent}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
      ) : (
        <div className="space-y-3">
          {listEvents.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No upcoming events.</p>
            </div>
          ) : (
            listEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-md ${getEventColor(event.type)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-2">{event.title}</h3>
                    <div className="flex items-center gap-4 text-xs opacity-75 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(event.date)}
                      </span>
                      {event.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(event.time)}
                        </span>
                      )}
                      {event.type === 'enrolled' && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {(event as EnrolledClass).programTitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-2.5 py-1 bg-white/50 rounded-full text-xs font-medium capitalize whitespace-nowrap">
                    {event.type === 'available' ? 'Program' : event.type}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
