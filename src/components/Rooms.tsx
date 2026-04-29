import FadeIn from "./FadeIn";
import { Link } from "react-router-dom";
import { useRooms } from "../hooks/useRooms";
import { getFileUrl } from "../lib/pocketbase";

export default function Rooms() {
  const { rooms, loading } = useRooms();

  if (loading) {
    return (
      <section id="rooms" className="py-24 bg-ivory text-center">
        <div className="text-gold text-sm uppercase tracking-widest animate-pulse">Fetching Accommodations...</div>
      </section>
    );
  }

  const previewRooms = rooms.filter(r => r.category !== "Residence");
  const fullResidence = rooms.find(r => r.category === "Residence");

  return (
    <section id="rooms" className="py-24 bg-ivory">
      <div className="container mx-auto px-6 md:px-12 max-w-[1300px]">
        {/* Section Header */}
        <div className="text-center mb-20">
          <FadeIn direction="up">
            <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body font-light block mb-4">
              ACCOMMODATIONS
            </span>
            <h2 className="text-charcoal text-4xl md:text-[48px] font-display italic font-light mb-6">
              Our Bedrooms
            </h2>
            <div className="w-[60px] h-[1px] bg-gold mx-auto" />
          </FadeIn>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 md:gap-16">
          {previewRooms.map((room, index) => (
            <div key={room.id}>
              <FadeIn direction="up" delay={index * 0.1}>
                <div className="group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden shadow-md">
                    <img
                      src={getFileUrl(room, room.image, '600x800')}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.06]"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info Panel */}
                  <div className="py-6 sm:py-8">
                    <span className="text-gold text-[10px] uppercase tracking-[0.2em] font-body block mb-3">
                      {room.type_label}
                    </span>
                    <h3 className="text-charcoal text-[20px] sm:text-[22px] font-display font-normal mb-3 group-hover:text-gold transition-colors duration-300 truncate">
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[#888] text-[11px] sm:text-[12px] font-body font-light mb-4">
                      <span>{room.guests} Guests</span>
                      <span className="opacity-40">·</span>
                      <span>{room.bed}</span>
                    </div>
                    <div className="text-charcoal text-[16px] sm:text-[18px] font-display italic mb-6">
                      From KSh {room.price.toLocaleString()} <span className="text-[9px] sm:text-[10px] opacity-50 not-italic uppercase tracking-widest ml-1">/ night</span>
                    </div>
                    <Link
                      to={`/booking?room=${room.id}`}
                      className="inline-block text-gold text-[11px] sm:text-[12px] uppercase tracking-[0.1em] font-body font-medium transition-all group-hover:translate-x-2"
                    >
                      {room.category === 'Residence' ? 'Book Home →' : 'Book Room →'}
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </div>
          ))}
        </div>

        {/* Full Residence CTA */}
        {fullResidence && (
          <FadeIn direction="up" delay={0.4} className="mt-24">
            <div className="bg-espresso p-12 md:p-20 text-center relative overflow-hidden group">
              <div 
                className="absolute inset-0 opacity-20 group-hover:scale-105 transition-transform duration-[5s]"
                style={{ 
                  backgroundImage: `url(${getFileUrl(fullResidence, fullResidence.image, '1200x800')})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                }}
              />
              <div className="relative z-10">
                <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body font-medium block mb-6">
                  EXCLUSIVE ACCESS
                </span>
                <h3 className="text-ivory text-4xl md:text-[52px] font-display italic font-light mb-8">
                  {fullResidence.name}
                </h3>
                <p className="text-ivory/60 text-[15px] font-body font-light leading-relaxed mb-12 max-w-2xl mx-auto">
                  Experience ultimate privacy by reserving all 4 bedrooms. Exclusive use of the entire property, living areas, and gardens for your group or family.
                </p>
                <div className="text-gold text-2xl font-display italic mb-12">
                  Special Rate: KSh {fullResidence.price.toLocaleString()} <span className="text-xs not-italic opacity-40 uppercase tracking-[0.2em] ml-2">per night</span>
                </div>
                <Link
                  to="/booking"
                  className="inline-block px-12 py-5 bg-gold text-charcoal text-[13px] uppercase tracking-[0.2em] font-body font-medium hover:bg-ivory transition-colors duration-500 shadow-2xl"
                >
                  Reserve Entire Residence
                </Link>
              </div>
            </div>
          </FadeIn>
        )}

        <div className="mt-20 text-center">
          <Link
            to="/rooms"
            className="inline-block text-gold text-[13px] uppercase tracking-[0.2em] font-body border-b border-gold/30 hover:border-gold transition-all"
          >
            Explore Detailed Specifications
          </Link>
        </div>
      </div>
    </section>
  );
}
