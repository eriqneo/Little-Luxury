import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import FadeIn from "./FadeIn";
import { pb, getFileUrl, Room } from "../lib/pocketbase";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { useRooms } from "../hooks/useRooms";

export default function BookingSection() {
  const navigate = useNavigate();
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { rooms, loading: roomsLoading } = useRooms();
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  const handleBook = () => {
    if (selectedRoomId) {
      navigate(`/booking?room=${selectedRoomId}`);
      // Smooth scroll to the top of the booking interface on the next page is handled by BookingPage's useEffect
    }
  };

  const bgUrl = settingsLoading ? null : settings?.home_booking_bg
    ? getFileUrl(settings, settings.home_booking_bg, '1920x1080')
    : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80';

  const title = settings?.home_booking_title || "Book Your Stay";
  const text  = settings?.home_booking_text  || "Reserve directly for the best rate, guaranteed.";

  return (
    <section id="book" className="w-full overflow-hidden bg-ivory">
      <div className="flex flex-col lg:flex-row min-h-[700px] lg:min-h-[850px]">
        {/* Left Side - Image & Branding */}
        <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-0 flex items-center justify-center py-20 px-6 sm:px-12">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: bgUrl ? `url("${bgUrl}")` : 'none', opacity: bgUrl ? 1 : 0 }}
          >
            <div className="absolute inset-0 bg-[#1A100A]/60 z-10" />
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
            </FadeIn>
          </div>
        </div>

        {/* Right Side - Room Selection */}
        <div className="lg:w-1/2 bg-espresso p-6 sm:p-10 md:p-14 lg:p-20 relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10">
            <FadeIn direction="left">
              <h3 className="text-ivory text-[28px] sm:text-[32px] font-display font-light mb-4">
                Select Your Sanctuary
              </h3>
              <p className="text-ivory/40 font-body text-[13px] uppercase tracking-widest mb-10">Step 1: Choose a Room</p>
              
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {roomsLoading ? (
                   <div className="text-gold/50 text-xs animate-pulse py-10 text-center uppercase tracking-widest">Fetching Rooms...</div>
                ) : (
                  rooms.map((room) => (
                    <motion.div 
                      key={room.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`p-6 border transition-all duration-500 cursor-pointer group flex items-center gap-6
                        ${selectedRoomId === room.id ? "bg-white/10 border-gold shadow-xl" : "border-white/10 hover:border-white/30 hover:bg-white/5"}
                      `}
                    >
                      <div className="w-24 h-20 overflow-hidden flex-shrink-0 relative">
                         <img src={getFileUrl(room, room.image, '200x160')} alt={room.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                         <div className={`absolute inset-0 bg-gold/20 transition-opacity duration-500 ${selectedRoomId === room.id ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gold text-[9px] uppercase tracking-[0.2em] mb-1">{room.type_label || room.type}</p>
                        <h4 className="text-ivory text-lg font-display">{room.name}</h4>
                        <p className="text-ivory/40 text-[12px] font-body">From KSh {room.price.toLocaleString()}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500 ${
                        selectedRoomId === room.id ? 'bg-gold border-gold scale-110' : 'border-white/20'
                      }`}>
                        {selectedRoomId === room.id && <Check className="text-espresso" size={14} />}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <button 
                onClick={handleBook}
                disabled={!selectedRoomId}
                className={`w-full py-5 text-[13px] uppercase tracking-[0.2em] font-body font-medium transition-all duration-500 shadow-2xl mt-12 flex items-center justify-center gap-3 group
                  ${selectedRoomId ? "bg-gold text-ivory hover:bg-ivory hover:text-charcoal" : "bg-gold/10 text-ivory/20 cursor-not-allowed"}
                `}
              >
                {selectedRoom?.category === 'Residence' ? 'Book Home' : 'Check Availability'} 
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </FadeIn>
          </div>

          {/* Abstract Design Element */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 border border-white/5 rounded-full pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
