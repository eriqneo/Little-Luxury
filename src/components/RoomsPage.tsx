import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FadeIn from "./FadeIn";
import { useRooms } from "../hooks/useRooms";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { getFileUrl } from "../lib/pocketbase";

const CATEGORIES = ["All Rooms", "Standard", "Deluxe", "Suite", "Residence"];

export default function RoomsPage() {
  const { rooms, loading: roomsLoading } = useRooms();
  const { settings, loading: settingsLoading } = useSiteSettings();
  const [activeFilter, setActiveFilter] = useState("All Rooms");
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (roomsLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-gold text-sm uppercase tracking-[0.4em] animate-pulse">Consulting the Records...</div>
      </div>
    );
  }

  const filteredRooms = activeFilter === "All Rooms" 
    ? rooms 
    : rooms.filter(room => room.category === activeFilter);

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      <main>
        {/* Hero Banner */}
        <section className="relative h-[50vh] w-full flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${settings?.rooms_hero ? getFileUrl(settings, settings.rooms_hero, '1920x1080') : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1920&q=80'}")`
            }}
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
          </div>
          
          <div className="relative z-20 text-center px-6">
            <FadeIn direction="up">
              <span className="text-gold text-xs md:text-sm uppercase tracking-[0.3em] font-body block mb-4">
                OUR ACCOMMODATIONS
              </span>
              <h1 className="text-ivory text-5xl md:text-[64px] font-display font-light italic leading-tight">
                Find Your Perfect Space
              </h1>
            </FadeIn>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-[80px] z-40 bg-ivory border-b border-gold/10 shadow-sm py-4 md:py-6">
          <div className="container mx-auto px-6 md:px-12 flex items-center justify-center gap-4 md:gap-12 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-2 text-[12px] md:text-[13px] uppercase tracking-[0.15em] font-body font-normal transition-all duration-300 whitespace-nowrap ${
                  activeFilter === cat 
                    ? "bg-gold text-ivory" 
                    : "text-charcoal hover:text-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Rooms Grid */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-6 md:px-12 max-w-[1300px]">
            <div className="grid grid-cols-1 gap-16 md:gap-24">
              {filteredRooms.map((room, index) => (
                <div key={room.id}>
                  <FadeIn direction="up" delay={index % 2 * 0.1}>
                    <div className="flex flex-col md:flex-row bg-white shadow-xl overflow-hidden group min-h-[450px]">
                      {/* Image Column */}
                      <div className="md:w-[40%] relative overflow-hidden">
                        <img
                          src={getFileUrl(room, room.image, '800x600')}
                          alt={room.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.08]"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                    {/* Details Column */}
                    <div className="md:w-[60%] p-8 md:p-14 flex flex-col">
                      <div className="mb-4">
                        <span className="inline-block border border-gold text-gold px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-body font-medium mb-4">
                          {room.category}
                        </span>
                        <h2 className="text-charcoal text-3xl md:text-[42px] font-display font-semibold italic mb-6">
                          {room.name}
                        </h2>
                        <div 
                          className="text-charcoal/70 text-sm md:text-base font-body font-light leading-relaxed mb-10 max-w-lg prose-p:mb-4"
                          dangerouslySetInnerHTML={{ __html: room.description }}
                        />
                      </div>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-y-6 gap-x-12 border-t border-b border-gold/10 py-8 mb-8">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-gold mb-1 font-body">Capacity</p>
                          <p className="text-charcoal text-sm font-body font-light">{room.guests} Guests</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-gold mb-1 font-body">Bed Type</p>
                          <p className="text-charcoal text-sm font-body font-light">{room.bed}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-gold mb-1 font-body">Room Size</p>
                          <p className="text-charcoal text-sm font-body font-light">{room.size}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-gold mb-1 font-body">Floor</p>
                          <p className="text-charcoal text-sm font-body font-light">{room.floor}</p>
                        </div>
                      </div>

                      {/* Amenities & Price/CTAs */}
                      <div className="mt-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
                        {/* Amenities List */}
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-[0.15em] text-gold mb-3 font-body">Amenities</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {room.amenities?.map(item => (
                              <div key={item} className="flex items-center gap-2 text-[13px] text-[#888] font-body font-light">
                                <span className="text-gold">✓</span> {item}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price & Book */}
                        <div className="text-right">
                          <div className="text-charcoal text-2xl font-display italic mb-6">
                            KSh {room.price.toLocaleString()} <span className="text-xs not-italic opacity-50 uppercase tracking-widest ml-1">/ Night</span>
                          </div>
                          <button className="px-10 py-4 bg-gold text-ivory text-[13px] uppercase tracking-[0.15em] font-body font-medium hover:bg-espresso transition-all duration-500 shadow-lg">
                            Book This Room
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}
