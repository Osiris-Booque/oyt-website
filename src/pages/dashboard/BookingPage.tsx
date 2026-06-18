import { useState, useEffect } from 'react';
import { useAuth } from '../../components/context/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ArrowLeft, Calendar, Clock, User, CreditCard, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Instructor {
  id: string;
  full_name: string;
  headline: string | null;
  avatar_url: string | null;
}

interface AvailableSlot {
  date: string;
  time: string;
  instructor_id: string;
}

interface BookingData {
  instructor_id: string | null;
  date: string | null;
  time: string | null;
  duration_minutes: number;
  rate: number;
}

export default function BookingPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'instructor' | 'time' | 'payment' | 'confirm'>(
    'instructor'
  );
  const [booking, setBooking] = useState<BookingData>({
    instructor_id: null,
    date: null,
    time: null,
    duration_minutes: 60,
    rate: 75,
  });
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');

  useEffect(() => {
    if (!profile) return;
    loadInstructors();
  }, [profile]);

  const loadInstructors = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, headline, avatar_url')
        .contains('roles', ['instructor'])
        .eq('is_public', true);

      if (data) setInstructors(data as Instructor[]);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async (instructorId: string) => {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    const slots: AvailableSlot[] = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      const { data: availability } = await supabase
        .from('instructor_availability')
        .select('start_time, end_time')
        .eq('instructor_id', instructorId)
        .eq('day_of_week', dayOfWeek);

      if (availability) {
        availability.forEach((slot) => {
          const start = new Date(`${dateStr}T${slot.start_time}`);
          const end = new Date(`${dateStr}T${slot.end_time}`);

          for (let time = start; time < end; time.setMinutes(time.getMinutes() + 60)) {
            const timeStr = time.toTimeString().slice(0, 5);
            slots.push({
              date: dateStr,
              time: timeStr,
              instructor_id: instructorId,
            });
          }
        });
      }
    }

    setAvailableSlots(slots);
  };

  const handleSelectInstructor = (instructorId: string) => {
    setBooking({ ...booking, instructor_id: instructorId });
    loadAvailableSlots(instructorId);
    setStep('time');
  };

  const handleSelectSlot = (slot: AvailableSlot) => {
    setBooking({
      ...booking,
      date: slot.date,
      time: slot.time,
    });
    setStep('payment');
  };

  const handleProcessPayment = async () => {
    if (!booking.instructor_id || !booking.date || !booking.time || !profile) return;

    setPaymentStatus('processing');

    try {
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: profile.id,
          program_id: null,
          amount: Math.round(booking.rate * 100),
          status: 'paid',
        })
        .select()
        .single();

      if (paymentError || !payment) {
        setPaymentStatus('error');
        return;
      }

      const { error: bookingError } = await supabase
        .from('instructor_bookings')
        .insert({
          instructor_id: booking.instructor_id,
          user_id: profile.id,
          booking_date: booking.date,
          booking_time: booking.time,
          duration_minutes: booking.duration_minutes,
          rate: booking.rate,
          payment_id: payment.id,
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        });

      if (bookingError) {
        setPaymentStatus('error');
        return;
      }

      setPaymentStatus('success');
      setStep('confirm');
    } catch {
      setPaymentStatus('error');
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard/calendar')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Calendar
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Schedule 1:1 Session</h1>
        <p className="text-slate-600 mt-1">Book a private session with an instructor</p>
      </div>

      <div className="max-w-2xl">
        {step === 'instructor' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Select an Instructor</h2>
            {instructors.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No instructors available at this time.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {instructors.map((instructor) => (
                  <button
                    key={instructor.id}
                    onClick={() => handleSelectInstructor(instructor.id)}
                    className="text-left p-4 bg-white rounded-lg border border-stone-200 hover:border-sage-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {instructor.avatar_url && (
                        <img
                          src={instructor.avatar_url}
                          alt={instructor.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{instructor.full_name}</h3>
                        {instructor.headline && (
                          <p className="text-xs text-slate-600 truncate">{instructor.headline}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'time' && booking.instructor_id && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Select a Time Slot</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
              {availableSlots.slice(0, 18).map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSlot(slot)}
                  className="p-3 bg-white rounded-lg border border-stone-200 hover:border-sage-500 hover:shadow-md transition-all text-center"
                >
                  <div className="text-sm font-semibold text-slate-900">{slot.date}</div>
                  <div className="text-sm text-slate-600">{slot.time}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('instructor')}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              Back
            </button>
          </div>
        )}

        {step === 'payment' && booking.date && booking.time && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Review Booking</h2>

              <div className="space-y-3 pb-4 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">Instructor</p>
                    <p className="font-semibold text-slate-900">
                      {instructors.find((i) => i.id === booking.instructor_id)?.full_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">Time</p>
                    <p className="font-semibold text-slate-900">{booking.time}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Duration</p>
                  <p className="font-semibold text-slate-900">{booking.duration_minutes} minutes</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Cost</p>
                  <p className="text-2xl font-bold text-sage-600">${booking.rate.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('time')}
                className="flex-1 px-4 py-3 border border-stone-300 rounded-lg font-medium text-slate-700 hover:bg-stone-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleProcessPayment}
                disabled={paymentStatus === 'processing'}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-sage-600 text-white rounded-lg font-medium hover:bg-sage-700 transition-colors disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {paymentStatus === 'processing' ? 'Processing...' : 'Complete Payment'}
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && paymentStatus === 'success' && (
          <div className="bg-white rounded-xl border border-sage-200 bg-sage-50 p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-sage-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-sage-900">Booking Confirmed!</h2>
            <p className="text-sage-800">
              Your 1:1 session has been booked and confirmed. Check your calendar for details.
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate('/dashboard/calendar')}
                className="px-6 py-2 bg-sage-600 text-white rounded-lg font-medium hover:bg-sage-700 transition-colors"
              >
                Back to Calendar
              </button>
            </div>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="bg-white rounded-xl border border-red-200 bg-red-50 p-6 text-center space-y-4">
            <p className="text-red-900 font-semibold">Payment Failed</p>
            <p className="text-red-800 text-sm">There was an error processing your payment. Please try again.</p>
            <button
              onClick={() => {
                setPaymentStatus('pending');
                setStep('payment');
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
