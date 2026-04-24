import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import FadeIn from "./FadeIn";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { pb, getFileUrl } from "../lib/pocketbase";
import { useSiteSettings } from "../hooks/useSiteSettings";

export default function BookingSection() {
  const { settings, loading } = useSiteSettings();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    checkIn: "",
    checkOut: "",
    adults: "2",
    children: "0",
    roomType: "Any Room",
    specialRequests: "",
    agreed: false,
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Required";
    if (!formData.email) newErrors.email = "Required";
    if (!formData.checkIn) newErrors.checkIn = "Required";
    if (!formData.checkOut) newErrors.checkOut = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        await pb.collection('reservations').create({
          guest_name: formData.name,
          guest_email: formData.email,
          guest_phone: 'N/A', // fallback
          check_in: formData.checkIn + " 12:00:00.000Z", // Ensure valid date if strict
          check_out: formData.checkOut + " 12:00:00.000Z",
          guests_adults: parseInt(formData.adults) || 2,
          guests_children: parseInt(formData.children) || 0,
          status: 'Pending', // Must be capitalized as per schema
          special_requests: `Preferred Room: ${formData.roomType}. ${formData.specialRequests}`,
          room: "", // Empty relation
          total_amount: 0,
        });
        setIsSubmitted(true);
      } catch (err) {
        console.error("Booking failed", err);
        alert("Sorry, there was an issue sending your booking request. Please try calling us instead.");
      }
    }
  };

  const bgUrl = loading ? null : settings?.home_booking_bg
    ? getFileUrl(settings, settings.home_booking_bg, '1920x1080')
    : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80';

  const title = settings?.home_booking_title || "Book Your Stay";
  const text  = settings?.home_booking_text  || "Reserve directly for the best rate, guaranteed.";

  return (
    <section id="book" className="w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[700px]">
        {/* Left Side - Image & Branding */}
        <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-0 flex items-center justify-center py-20 px-6 sm:px-12">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: bgUrl ? `url("${bgUrl}")` : 'none', opacity: bgUrl ? 1 : 0 }}
          >
            <div className="absolute inset-0 bg-[#1A100A]/50 z-10" />
          </div>
          
          <div className="relative z-20 text-center text-white max-w-2xl">
            <FadeIn direction="up">
              <span className="text-gold text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-body font-light block mb-6">
                RESERVATIONS
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-display italic font-light leading-tight mb-6">
                {title}
              </h2>
              <p className="text-white/80 font-body font-light text-[14px] sm:text-[15px] mb-12">
                {text}
              </p>
              
              {/* Gold Seal/Badge */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[7.5px] uppercase tracking-[0.2em] font-body fill-gold">
                    <textPath xlinkHref="#circlePath">
                      · Best Rate Guarantee · Best Rate Guarantee ·
                    </textPath>
                  </text>
                </svg>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gold/30 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                  <span className="text-gold text-xs font-display italic tracking-widest font-semibold">LL</span>
                </div>
              </div>

              {/* At-a-glance Calendar */}
              <div className="mt-16 sm:mt-20 flex flex-col items-center">
                <p className="text-gold/40 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mb-8">Availability at a glance</p>
                <div className="w-full max-w-md mx-auto overflow-x-auto lg:overflow-visible">
                  <AvailabilityCalendar />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 bg-espresso p-6 sm:p-10 md:p-14 lg:p-20 relative overflow-hidden flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-ivory text-[28px] font-display font-light mb-12">
                  Check Availability
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Row 0: Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="group">
                      <label className="block text-[11px] uppercase tracking-[0.25em] font-body font-medium text-ivory/90 mb-2">
                        Full Name
                      </label>
                      <input 
                        type="text"
                        className={`w-full bg-transparent border-b ${errors.name ? 'border-gold' : 'border-gold/40'} text-ivory font-body font-light py-3 outline-none focus:border-gold transition-colors block appearance-none placeholder:text-white/20`}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                      {errors.name && <span className="text-gold text-[10px] uppercase font-body mt-2 block">{errors.name}</span>}
                    </div>
                    <div className="group">
                      <label className="block text-[11px] uppercase tracking-[0.25em] font-body font-medium text-ivory/90 mb-2">
                        Email Address
                      </label>
                      <input 
                        type="email"
                        className={`w-full bg-transparent border-b ${errors.email ? 'border-gold' : 'border-gold/40'} text-ivory font-body font-light py-3 outline-none focus:border-gold transition-colors block appearance-none placeholder:text-white/20`}
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                      {errors.email && <span className="text-gold text-[10px] uppercase font-body mt-2 block">{errors.email}</span>}
                    </div>
                  </div>

                  {/* Row 1: Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="group">
                      <label className="block text-[11px] uppercase tracking-[0.25em] font-body font-medium text-ivory/90 mb-2">
                        Check-in Date
                      </label>
                      <input 
                        type="date"
                        className={`w-full bg-transparent border-b ${errors.checkIn ? 'border-gold' : 'border-gold/40'} text-ivory font-body font-light py-3 outline-none focus:border-gold transition-colors block appearance-none`}
                        value={formData.checkIn}
                        onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                      />
                      {errors.checkIn && <span className="text-gold text-[10px] uppercase font-body mt-2 block">{errors.checkIn}</span>}
                    </div>
                    <div className="group">
                      <label className="block text-[11px] uppercase tracking-[0.25em] font-body font-medium text-ivory/90 mb-2">
                        Check-out Date
                      </label>
                      <input 
                        type="date"
                        className={`w-full bg-transparent border-b ${errors.checkOut ? 'border-gold' : 'border-gold/40'} text-ivory font-body font-light py-3 outline-none focus:border-gold transition-colors block appearance-none`}
                        value={formData.checkOut}
                        onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                      />
                      {errors.checkOut && <span className="text-gold text-[10px] uppercase font-body mt-2 block">{errors.checkOut}</span>}
                    </div>
                  </div>

                  {/* Row 2: Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.25em] font-body font-medium text-ivory/90 mb-2">
                        Adults
                      </label>
                      <select 
                        className="w-full bg-transparent border-b border-gold/40 text-ivory font-body font-light py-3 outline-none focus:border-gold transition-colors"
                        value={formData.adults}
                        onChange={(e) => setFormData({...formData, adults: e.target.value})}
                      >
                        {[1, 2, 3, 4].map(n => <option key={n} value={n} className="bg-espresso">{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.25em] font-body font-medium text-ivory/90 mb-2">
                        Children
                      </label>
                      <select 
                        className="w-full bg-transparent border-b border-gold/40 text-ivory font-body font-light py-3 outline-none focus:border-gold transition-colors"
                        value={formData.children}
                        onChange={(e) => setFormData({...formData, children: e.target.value})}
                      >
                        {[0, 1, 2, 3].map(n => <option key={n} value={n} className="bg-espresso">{n}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Room Type */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.25em] font-body font-medium text-ivory/90 mb-2">
                      Room Type
                    </label>
                    <select 
                      className="w-full bg-transparent border-b border-gold/40 text-ivory font-body font-light py-3 outline-none focus:border-gold transition-colors"
                      value={formData.roomType}
                      onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                    >
                      {["Any Room", "Classic Room", "Deluxe Suite", "Penthouse Suite"].map(r => (
                        <option key={r} value={r} className="bg-espresso">{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* Row 4: Special Requests */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.25em] font-body font-medium text-ivory/90 mb-2">
                      Special Requests
                    </label>
                    <textarea 
                      rows={3}
                      className="w-full bg-transparent border-b border-gold/40 text-ivory font-body font-light py-3 outline-none focus:border-gold transition-colors resize-none placeholder:text-white/20"
                      placeholder="Extra pillows, airport pickup, or celebratory items..."
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                    />
                  </div>

                  {/* Row 5: Agreement */}
                  <div className="flex items-start gap-3 pt-4">
                    <input 
                      type="checkbox" 
                      id="agree-home"
                      checked={formData.agreed}
                      onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                      className="mt-1 accent-gold cursor-pointer"
                    />
                    <label htmlFor="agree-home" className="text-[12px] font-body font-light text-ivory/60 leading-relaxed cursor-pointer select-none">
                      {settings?.booking_agreement_text || "I agree to the Little Luxury house rules and cancellation policy."}
                    </label>
                  </div>

                  <button 
                    type="submit"
                    disabled={!formData.agreed}
                    className={`w-full py-5 text-[13px] uppercase tracking-[0.2em] font-body font-medium transition-all duration-500 shadow-2xl mt-8
                      ${formData.agreed ? "bg-gold text-ivory hover:bg-ivory hover:text-charcoal" : "bg-gold/20 text-ivory/30 cursor-not-allowed"}
                    `}
                  >
                    Check Availability
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] font-body font-light text-ivory/40">
                    <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="text-gold">✓</span> Free cancellation</span>
                    <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="text-gold">✓</span> No credit card required</span>
                    <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="text-gold">✓</span> Best rate guaranteed</span>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-8 flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full border border-gold flex items-center justify-center mb-8">
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <Check className="text-gold" size={40} />
                  </motion.div>
                </div>
                <h3 className="text-ivory text-3xl font-display italic mb-6">Request Received</h3>
                <p className="text-ivory/70 text-base font-body font-light max-w-sm leading-relaxed mb-10">
                  Thank you for choosing Little Luxury. Our concierge team is checking our availability and will contact you at your provided email shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-gold text-sm uppercase tracking-[0.2em] font-body border-b border-gold pb-1 hover:text-white hover:border-white transition-all"
                >
                  Make another request
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
