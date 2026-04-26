import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  Calendar as CalendarIcon,
  Users,
  CreditCard,
  Building,
  Wifi,
  Coffee,
  ShieldCheck,
  Phone
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FadeIn from "./FadeIn";
import { useRooms } from "../hooks/useRooms";
import { useReservations } from "../hooks/useReservations";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { getFileUrl, pb } from "../lib/pocketbase";

// --- Types & Constants ---
type Step = 1 | 2 | 3;

// Removed dayToISO as we now operate on strict date strings

// --- Sub-components ---

const StepIndicator = ({ currentStep }: { currentStep: Step }) => {
  const steps = [
    { num: 1, label: "Select Room" },
    { num: 2, label: "Choose Dates" },
    { num: 3, label: "Your Details" },
  ];

  return (
    <div className="flex items-center justify-center w-full max-w-4xl mx-auto mb-20 px-6">
      {steps.map((s, i) => (
        <React.Fragment key={s.num}>
          <div className="flex flex-col items-center relative z-10">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-body transition-all duration-500 border ${
                currentStep > s.num 
                  ? "bg-gold border-gold text-ivory" 
                  : currentStep === s.num 
                  ? "border-gold text-gold scale-110 shadow-[0_0_20px_rgba(197,160,103,0.3)]"
                  : "border-charcoal/10 text-charcoal/30"
              }`}
            >
              {currentStep > s.num ? <Check size={16} /> : s.num}
            </div>
            <span className={`absolute top-14 text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors duration-500 ${
              currentStep === s.num ? "text-gold font-medium" : "text-charcoal/30"
            }`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-20 md:w-32 h-[1px] bg-charcoal/10 mx-4 mt-[-10px]">
              <motion.div 
                className="h-full bg-gold"
                initial={{ width: 0 }}
                animate={{ width: currentStep > s.num ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// --- Page Component ---

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const roomParam = searchParams.get('room');
  const { rooms, loading: roomsLoading } = useRooms();
  const { reservations, loading: reservationsLoading } = useReservations(); // live from CMS
  const { settings, loading: settingsLoading } = useSiteSettings();
  const [step, setStep] = useState<Step>(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState('');
  
  // Selection State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", nationality: "Kenyan", 
    arrivalTime: "14:00", requests: "", agreed: false
  });

  // Handle room pre-selection from URL
  useEffect(() => {
    if (roomParam && rooms.length > 0) {
      const exists = rooms.some(r => r.id === roomParam);
      if (exists) {
        setSelectedRoomId(roomParam);
        setStep(2);
      }
    }
  }, [roomParam, rooms]);

  const selectedRoom = useMemo(() => rooms.find(r => r.id === selectedRoomId), [rooms, selectedRoomId]);
  
  const nights = selectedDates.length || 0;

  const sortedDates = [...selectedDates].sort();
  const checkInDateStr = sortedDates[0] || "";
  const checkOutDateStr = sortedDates[sortedDates.length - 1] || "";

  const formatSummaryDate = (dStr: string) => {
    if (!dStr) return "---";
    return new Date(dStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const subtotal = selectedRoom ? selectedRoom.price * nights : 0;
  const total = subtotal;

  // Build set of booked/pending day strings from live CMS reservations — FILTERED BY ROOM
  const { bookedDays, pendingDays } = useMemo(() => {
    const booked = new Set<string>();
    const pending = new Set<string>();

    // ONLY consider reservations for the selected room
    const relevantReservations = selectedRoomId 
      ? reservations.filter(r => r.room === selectedRoomId)
      : [];

    relevantReservations.forEach(r => {
      const target = (r.status === 'Booked' || r.status === 'Maintenance' || r.status === 'Closed')
        ? booked
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
    return { bookedDays: booked, pendingDays: pending };
  }, [reservations, selectedRoomId]);

  // Submit booking to PocketBase as a Pending reservation
  const handleSubmit = async () => {
    if (!form.agreed || !form.email || !form.firstName || !selectedRoomId || selectedDates.length === 0) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const sortedDates = [...selectedDates].sort();
      const checkInStr = sortedDates[0];
      const checkOutStr = sortedDates[sortedDates.length - 1];

      const record = await pb.collection('reservations').create({
        guest_name: `${form.firstName} ${form.lastName}`.trim(),
        guest_email: form.email,
        guest_phone: form.phone || 'N/A', // Add fallback to prevent validation failure
        room: selectedRoomId,
        check_in: checkInStr + " 12:00:00.000Z", // Append strict time format
        check_out: checkOutStr + " 12:00:00.000Z",
        guests_adults: guests.adults || 1,
        guests_children: guests.children || 0,
        arrival_time: form.arrivalTime || '14:00',
        special_requests: `[Dates: ${sortedDates.join(', ')}]\n${form.requests}`,
        payment_method: 'Pending',
        nationality: form.nationality || 'Kenyan',
        total_amount: total,
        status: 'Pending',  // Admin will change to Booked to block the calendar
        notes: '',
      });
      setBookingRef(`LL-${record.id.slice(-6).toUpperCase()}`);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Booking failed:', err);
      setSubmitError('Something went wrong. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar Logic
  const handleDateClick = (dateStr: string) => {
    if (bookedDays.has(dateStr)) return; // Blocked
    
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const isSelected = (dateStr: string) => selectedDates.includes(dateStr);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const nextStep = () => {
    if (step === 1 && !selectedRoomId) return;
    if (step === 2 && selectedDates.length === 0) return;
    setStep((prev) => (prev + 1) as Step);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  if (roomsLoading || settingsLoading || reservationsLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-gold text-sm uppercase tracking-[0.4em] animate-pulse">Consulting the Records...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url("${settings?.booking_hero ? getFileUrl(settings, settings.booking_hero, '1920x1080') : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1920&q=80'}")` 
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-6">
          <FadeIn direction="up">
            <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body block mb-4">RESERVATIONS</span>
            <h1 className="text-white text-5xl md:text-[60px] font-display italic font-light">Reserve Your Room</h1>
          </FadeIn>
        </div>
      </section>

      {/* Main Flow */}
      <section className="py-24 px-6 relative z-0">
        <StepIndicator currentStep={step} />

        <div className="container mx-auto max-w-[1200px]">
          <AnimatePresence mode="wait">
            {/* STEP 1: Room Selection */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="text-center mb-16">
                  <h3 className="text-charcoal text-3xl font-display italic mb-4">Step 1: Choose Your Sanctuary</h3>
                  <p className="text-charcoal/50 font-body text-[15px] max-w-lg mx-auto">
                    Select the room that resonates with your vision of luxury. Availability will be shown in the next step.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rooms.map((room) => (
                    <div 
                      key={room.id}
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        // Reset dates if room changes, as availability is room-specific
                        if (selectedRoomId !== room.id) setSelectedDates([]);
                      }}
                      className={`flex flex-col bg-white overflow-hidden cursor-pointer group transition-all duration-500 border-2 relative
                        ${selectedRoomId === room.id ? "border-gold shadow-2xl" : "border-transparent hover:border-gold/30 hover:shadow-xl"}
                      `}
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img src={getFileUrl(room, room.image, '600x400')} alt={room.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" referrerPolicy="no-referrer" />
                        {selectedRoomId === room.id && (
                          <div className="absolute top-4 left-4 bg-gold text-ivory text-[10px] uppercase font-body px-3 py-1 tracking-widest flex items-center gap-1.5 shadow-lg">
                            <Check size={10} /> Selected
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                           <p className="text-gold text-[10px] uppercase tracking-[0.3em] font-body mb-1">{room.type_label}</p>
                           <h3 className="text-white text-xl font-display">{room.name}</h3>
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <div className="mb-6">
                          <p className="text-charcoal/60 text-[13px] font-body leading-relaxed mb-6 line-clamp-2">
                             {room.description?.replace(/<[^>]*>/g, '')}
                          </p>
                          <div className="flex flex-wrap gap-x-6 gap-y-3">
                            {room.amenities?.slice(0, 3).map(f => (
                              <span key={f} className="text-charcoal/50 text-[11px] font-body flex items-center gap-2 whitespace-nowrap uppercase tracking-wider">
                                <span className="w-1 h-1 rounded-full bg-gold/50" /> {f}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-end justify-between border-t border-gold/10 pt-6">
                          <div>
                            <p className="text-charcoal/40 text-[10px] uppercase font-body mb-1">From</p>
                            <p className="text-2xl font-display text-gold italic">KSh {room.price.toLocaleString()}</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              if (selectedRoomId === room.id) {
                                e.stopPropagation();
                                nextStep();
                              }
                            }}
                            className={`px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-body transition-all duration-300
                              ${selectedRoomId === room.id ? "bg-gold text-white" : "border border-gold text-gold hover:bg-gold hover:text-white"}
                            `}
                          >
                            {selectedRoomId === room.id ? "Continue" : "Select"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-16">
                   <button 
                    onClick={nextStep}
                    disabled={!selectedRoomId}
                    className={`px-16 py-5 text-[13px] uppercase tracking-[0.2em] font-body transition-all duration-500
                      ${selectedRoomId ? "bg-gold text-ivory hover:bg-gold-mid shadow-2xl" : "bg-gold-muted/30 text-gold-muted cursor-not-allowed"}
                    `}
                  >
                    Select Dates →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Date Selection */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 md:p-16 shadow-sm border border-gold/5"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {/* Calendar Widget */}
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-charcoal text-2xl font-display italic">Choose Your Dates</h3>
                        <p className="text-gold text-[10px] uppercase tracking-widest mt-1">FOR {selectedRoom?.name}</p>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={prevMonth} className="text-gold hover:text-charcoal transition-colors"><ChevronLeft /></button>
                        <button onClick={nextMonth} className="text-gold hover:text-charcoal transition-colors"><ChevronRight /></button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {[0, 1].map((monthOffset) => {
                        const year = currentDate.getFullYear();
                        const month = currentDate.getMonth() + monthOffset;
                        const date = new Date(year, month, 1);
                        const actualYear = date.getFullYear();
                        const actualMonth = date.getMonth();
                        const monthName = date.toLocaleString('default', { month: 'long' });
                        const daysInMonth = new Date(actualYear, actualMonth + 1, 0).getDate();
                        const offset = new Date(actualYear, actualMonth, 1).getDay();

                        return (
                          <div key={monthOffset}>
                            <h4 className="font-display text-xl mb-6">{monthName} {actualYear}</h4>
                            <div className="grid grid-cols-7 gap-y-2 text-center text-[13px] font-body text-charcoal/40 mb-4">
                              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {Array.from({ length: offset }).map((_, i) => <div key={`empty-${i}`} />)}
                              {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${actualYear}-${String(actualMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const booked = bookedDays.has(dateStr);
                                const pending = pendingDays.has(dateStr);
                                const selected = isSelected(dateStr);

                                return (
                                  <button
                                    key={day}
                                    onClick={() => !booked && handleDateClick(dateStr)}
                                    disabled={booked}
                                    title={booked ? 'Reserved' : pending ? 'Pending' : 'Available'}
                                    className={`h-10 w-full flex items-center justify-center font-body text-[13px] transition-all relative rounded-full
                                      ${booked ? "bg-red-500 text-white cursor-not-allowed shadow-inner" : pending && !selected ? "bg-amber-400 text-charcoal hover:bg-amber-500" : "text-charcoal hover:bg-gold/10"}
                                      ${selected ? "bg-gold text-white hover:bg-gold border-none z-10 scale-110 shadow-lg" : ""}
                                    `}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Legend */}
                    <div className="mt-8 flex items-center gap-6 pt-6 border-t border-gold/10 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-sm shadow-sm" />
                        <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-body">Reserved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-400 rounded-sm shadow-sm" />
                        <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-body">Pending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-gold/30 rounded-sm" />
                        <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-body">Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Guests & Summary */}
                  <div className="flex flex-col justify-center">
                    <div className="space-y-12 max-w-sm mx-auto w-full">
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-charcoal font-display text-lg mb-1">Adults</p>
                            <p className="text-charcoal/40 text-[11px] uppercase tracking-wider">Age 12+</p>
                          </div>
                          <div className="flex items-center gap-6">
                            <button onClick={() => setGuests({...guests, adults: Math.max(1, guests.adults - 1)})} className="text-gold"><Minus size={18} /></button>
                            <span className="text-xl font-display tabular-nums w-4 text-center">{guests.adults}</span>
                            <button onClick={() => setGuests({...guests, adults: guests.adults + 1})} className="text-gold"><Plus size={18} /></button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-charcoal font-display text-lg mb-1">Children</p>
                            <p className="text-charcoal/40 text-[11px] uppercase tracking-wider">Age 0-11</p>
                          </div>
                          <div className="flex items-center gap-6">
                            <button onClick={() => setGuests({...guests, children: Math.max(0, guests.children - 1)})} className="text-gold"><Minus size={18} /></button>
                            <span className="text-xl font-display tabular-nums w-4 text-center">{guests.children}</span>
                            <button onClick={() => setGuests({...guests, children: guests.children + 1})} className="text-gold"><Plus size={18} /></button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gold/5 p-6 space-y-4">
                         <div className="flex justify-between text-[13px]">
                            <span className="font-body text-charcoal/50 uppercase tracking-widest">Nights</span>
                            <span className="font-display italic text-gold">{nights}</span>
                         </div>
                         <div className="flex justify-between text-[13px] border-t border-gold/10 pt-4">
                            <span className="font-body text-charcoal/50 uppercase tracking-widest">Est. Total</span>
                            <span className="font-display italic text-gold">KSh {total.toLocaleString()}</span>
                         </div>
                      </div>

                      <div className="space-y-4">
                        <button 
                          onClick={nextStep}
                          disabled={selectedDates.length === 0}
                          className={`w-full py-5 text-[13px] uppercase tracking-[0.2em] font-body transition-all duration-500
                            ${selectedDates.length > 0 ? "bg-gold text-ivory hover:bg-gold-mid shadow-xl" : "bg-gold-muted/30 text-gold-muted cursor-not-allowed"}
                          `}
                        >
                          Confirm Details →
                        </button>
                        <button 
                          onClick={() => setStep(1)}
                          className="w-full py-4 text-[11px] uppercase tracking-[0.2em] font-body text-charcoal/40 hover:text-gold transition-colors"
                        >
                          ← Back to Room Selection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}



            {/* STEP 3 */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-12"
              >
                <div className="lg:col-span-3 space-y-12">
                  <div className="bg-white p-8 md:p-14 shadow-sm border border-gold/5">
                    <h3 className="text-2xl font-display italic mb-10">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">First Name</label>
                        <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full border-b border-gold/20 py-2 font-body text-[15px] outline-none focus:border-gold bg-transparent" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">Last Name</label>
                        <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full border-b border-gold/20 py-2 font-body text-[15px] outline-none focus:border-gold bg-transparent" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">Email Address</label>
                        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border-b border-gold/20 py-2 font-body text-[15px] outline-none focus:border-gold bg-transparent" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">Phone</label>
                        <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border-b border-gold/20 py-2 font-body text-[15px] outline-none focus:border-gold bg-transparent" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-display italic mb-10">Stay Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                       <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">Estimated Arrival</label>
                        <select value={form.arrivalTime} onChange={e => setForm({...form, arrivalTime: e.target.value})} className="w-full border-b border-gold/20 py-2 font-body text-[15px] outline-none focus:border-gold bg-transparent">
                          {["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "Later"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">Nationality</label>
                        <select value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} className="w-full border-b border-gold/20 py-2 font-body text-[15px] outline-none focus:border-gold bg-transparent">
                          {["Kenyan", "Other East African", "International"].map(n => <option key={n}>{n}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">Special Requests</label>
                        <textarea rows={3} value={form.requests} onChange={e => setForm({...form, requests: e.target.value})} className="w-full border-b border-gold/20 py-2 font-body text-[15px] outline-none focus:border-gold bg-transparent resize-none" placeholder="Allergies, high floor, etc." />
                      </div>
                    </div>



                    <div className="flex items-start gap-4 mb-12">
                      <input type="checkbox" id="terms" checked={form.agreed} onChange={e => setForm({...form, agreed: e.target.checked})} className="mt-1 accent-gold cursor-pointer" />
                      <label 
                        htmlFor="terms" 
                        className="text-[13px] font-body font-light text-charcoal/60 leading-relaxed cursor-pointer select-none prose-charcoal [&_p]:m-0"
                        {...(settings?.booking_agreement_text?.includes('<') 
                          ? { dangerouslySetInnerHTML: { __html: settings.booking_agreement_text } }
                          : { children: settings?.booking_agreement_text || "I agree to the Little Luxury house rules, cancellation policy, and processing of my personal data for the reservation." }
                        )}
                      />
                    </div>

                    {submitError && (
                      <p className="text-red-400 text-sm font-body mb-4 text-center">{submitError}</p>
                    )}
                    <button 
                      onClick={handleSubmit}
                      disabled={!form.agreed || !form.email || !form.firstName || isSubmitting}
                      className={`w-full py-5 text-[14px] uppercase tracking-[0.25em] font-body font-semibold transition-all duration-500 flex items-center justify-center gap-3
                        ${form.agreed && form.email && form.firstName && !isSubmitting ? "bg-gold text-ivory hover:bg-gold-mid shadow-2xl" : "bg-gold-muted/30 text-gold-muted cursor-not-allowed"}
                      `}
                    >
                      {isSubmitting ? (
                        <><span className="w-4 h-4 border-2 border-ivory/40 border-t-ivory rounded-full animate-spin" /> Sending Request...</>
                      ) : 'Confirm Reservation'}
                    </button>
                    <button onClick={() => setStep(2)} className="w-full text-center text-charcoal/30 text-[11px] uppercase tracking-widest mt-6 hover:text-gold transition-colors font-body">
                      Back to Room Options
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-espresso p-8 md:p-12 text-ivory sticky top-32">
                    <div className="flex items-center gap-4 mb-12 opacity-80 scale-90 -ml-4">
                      <div className="w-10 h-10 border border-gold flex items-center justify-center font-display italic text-gold text-xl">L</div>
                      <h4 className="text-[12px] uppercase tracking-[0.3em] font-display">Little Luxury</h4>
                    </div>

                    <div className="space-y-8 mb-12">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-16 bg-white/10 overflow-hidden flex-shrink-0">
                            {selectedRoom && (
                              <img src={getFileUrl(selectedRoom, selectedRoom.image, '160x128')} alt="" className="w-full h-full object-cover opacity-60" />
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-gold mb-1">Room Selected</p>
                            <p className="text-lg font-display">{selectedRoom?.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 border-y border-white/10 py-8">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Arrival</p>
                          <p className="text-[15px] font-body">{formatSummaryDate(checkInDateStr)}</p>
                          <p className="text-[11px] text-ivory/40 mt-1">From 2:00 PM</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Departure</p>
                          <p className="text-[15px] font-body">{formatSummaryDate(checkOutDateStr)}</p>
                          <p className="text-[11px] text-ivory/40 mt-1">By 11:00 AM</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-ivory/50 text-[13px] font-body">{nights} Night Stay (x{guests.adults} Adults)</p>
                          <p className="text-[14px] font-body">KSh {subtotal.toLocaleString()}</p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                          <p className="text-gold text-[12px] uppercase tracking-[0.2em] font-body">Total Amount</p>
                          <p className="text-2xl font-display text-gold italic underline decoration-gold/30 underline-offset-8">KSh {total.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-6 space-y-4">
                      <div className="flex items-center gap-3 text-[12px] font-body text-ivory/70">
                         <ShieldCheck size={14} className="text-gold" /> Free cancellation 48hrs before
                      </div>
                      <div className="flex items-center gap-3 text-[12px] font-body text-ivory/70">
                         <ShieldCheck size={14} className="text-gold" /> Best rate guarantee
                      </div>
                      <div className="flex items-center gap-3 text-[12px] font-body text-ivory/70">
                         <ShieldCheck size={14} className="text-gold" /> Instant confirmation
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-4 text-ivory/40">
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest leading-none mb-1">Support Line</p>
                        <p className="text-[13px] font-body text-gold">{settings?.contact_phone || '+254 700 000 000'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 100 }}
            className="fixed inset-0 z-[100] bg-ivory flex flex-col items-center justify-center p-6 text-center"
          >
            <FadeIn>
              <div className="w-24 h-24 rounded-full border border-gold flex items-center justify-center mb-10 mx-auto relative">
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <Check className="text-gold" size={48} />
                </motion.div>
                <div className="absolute inset-0 rounded-full border border-gold animate-ping opacity-20" />
              </div>
              
              <h2 className="text-charcoal text-5xl md:text-[60px] font-display italic font-light mb-6">Reservation Confirmed!</h2>
              <p className="text-charcoal/60 text-lg font-body font-light mb-12 max-w-lg mx-auto">
                Thank you for your trust, {form.firstName}. Your booking reference is <span className="text-gold font-semibold">{bookingRef}</span>. Our team will review your request and contact you at {form.email} to confirm within a few hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md mx-auto">
                <button 
                  onClick={() => {
                    setIsSuccess(false);
                    setStep(2);
                  }}
                  className="flex-1 py-4 border border-gold text-gold text-[13px] uppercase tracking-[0.2em] font-body font-medium hover:bg-gold hover:text-ivory transition-all duration-500"
                >
                  View Booking
                </button>
                <Link to="/" className="flex-1 py-4 bg-espresso text-gold text-[13px] uppercase tracking-[0.2em] font-body font-medium hover:bg-black transition-all duration-500">
                  Return Home
                </Link>
              </div>
            </FadeIn>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
