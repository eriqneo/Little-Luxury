import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useReservations } from '../hooks/useReservations';

export default function AvailabilityCalendar() {
  const { reservations, loading } = useReservations();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Confirmed dates → red. Pending dates → amber.
  const { confirmedDates, pendingDates } = useMemo(() => {
    const confirmed = new Set<string>();
    const pending = new Set<string>();
    reservations.forEach(r => {
      const target = (r.status === 'Booked' || r.status === 'Maintenance' || r.status === 'Closed')
        ? confirmed
        : r.status === 'Pending' ? pending : null;
      if (!target) return;
      
      let hasAlternateDates = false;
      if (r.special_requests) {
        const match = r.special_requests.match(/\[Dates: (.*?)\]/);
        if (match) {
          const dates = match[1].split(', ').filter(d => d);
          if (dates.length > 0) {
            hasAlternateDates = true;
            dates.forEach(d => target.add(d));
          }
        }
      }

      if (!hasAlternateDates && r.check_in && r.check_out) {
        const start = new Date(r.check_in);
        const end = new Date(r.check_out);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          target.add(d.toISOString().split('T')[0]);
        }
      }
    });
    return { confirmedDates: confirmed, pendingDates: pending };
  }, [reservations]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const totalDays = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isBooked = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return confirmedDates.has(dateStr);
  };

  const isPending = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return pendingDates.has(dateStr);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  if (loading) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl border border-gold/10 p-10 md:p-12 rounded-sm w-full max-w-2xl shadow-2xl flex items-center justify-center min-h-[400px]">
        <div className="text-gold text-xs uppercase tracking-[0.4em] animate-pulse">Syncing Availability...</div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-gold/10 p-10 md:p-12 md:px-14 rounded-sm w-full max-w-2xl shadow-2xl">
      <div className="flex items-center justify-between mb-10">
        <h4 className="text-ivory font-display italic text-2xl tracking-wide">
          {monthName} <span className="text-gold/60 not-italic text-base ml-2">{year}</span>
        </h4>
        <div className="flex gap-6">
          <button onClick={prevMonth} className="text-gold hover:text-ivory transition-all hover:scale-110 active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextMonth} className="text-gold hover:text-ivory transition-all hover:scale-110 active:scale-95">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-6">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`day-header-${i}`} className="text-[11px] text-gold font-body font-medium text-center uppercase tracking-[0.25em] opacity-40">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`offset-${i}`} className="h-10 md:h-12" />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const booked = isBooked(day);
          const pending = isPending(day);
          return (
            <div
              key={day}
              className={`h-10 md:h-12 flex items-center justify-center text-base font-body transition-all relative group cursor-default ${
                booked 
                  ? 'text-white/40' 
                  : pending
                  ? 'text-white/40'
                  : 'text-ivory/70 hover:text-gold hover:bg-gold/5'
              }`}
              title={booked ? 'Date reserved' : pending ? 'Pending reservation' : 'Available'}
            >
              <span className="relative z-10">{day}</span>
              {booked && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-1.5 md:inset-2 bg-red-500/80 rounded-full z-0 blur-[1px]" 
                />
              )}
              {pending && !booked && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-1.5 md:inset-2 bg-amber-400/70 rounded-full z-0 blur-[1px]" 
                />
              )}
              {!booked && !pending && (
                 <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-all rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-center gap-6 border-t border-gold/10 pt-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-red-500/80 rounded-full blur-[0.5px]" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-ivory/40 font-body">Reserved</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-amber-400/70 rounded-full blur-[0.5px]" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-ivory/40 font-body">Pending</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 border border-gold/30 rounded-full" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-ivory/40 font-body">Available</span>
        </div>
      </div>
    </div>
  );
}
