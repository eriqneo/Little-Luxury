import { 
  Bell, 
  Sparkles, 
  Car, 
  Wifi, 
  Video, 
  Camera, 
  Zap, 
  ShieldCheck 
} from "lucide-react";
import FadeIn from "./FadeIn";

const AMENITIES_DATA = [
  { title: "24-Hour Contact", desc: "Our host is available to assist you via WhatsApp or phone at any time.", icon: Bell },
  { title: "Daily Housekeeping", desc: "Meticulous daily care to ensure your space remains immaculate.", icon: Sparkles },
  { title: "Secure Parking", desc: "Dedicated on-site parking with controlled access and surveillance.", icon: Car },
  { title: "High-Speed WiFi", desc: "Seamless fiber-optic connectivity throughout the entire property.", icon: Wifi },
  { title: "Intercom Camera", desc: "Advanced video intercom system for secure visitor verification.", icon: Camera },
  { title: "CCTV Surveillance", desc: "24/7 continuous monitoring of common areas and property perimeter.", icon: Video },
  { title: "Electric Fence", desc: "State-of-the-art perimeter security for absolute guest peace of mind.", icon: Zap },
  { title: "Perimeter Wall", desc: "Substantial stone boundary wall ensuring privacy and added protection.", icon: ShieldCheck },
];

export default function Amenities() {
  return (
    <section id="amenities" className="bg-espresso py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-[1300px]">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <FadeIn direction="right">
            <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body font-light block mb-4">
              WHAT WE OFFER
            </span>
            <h2 className="text-ivory text-4xl md:text-[52px] font-display italic font-light leading-[1.2]">
              Every Comfort, Thoughtfully Provided
            </h2>
          </FadeIn>
        </div>

        {/* Updated Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {AMENITIES_DATA.map((item, index) => (
            <div 
              key={item.title} 
              className="border-t border-gold/20 pt-10 group"
            >
              <FadeIn delay={index * 0.1}>
                <div className="mb-6">
                  <item.icon 
                    size={32} 
                    strokeWidth={1.5} 
                    className="text-gold group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <h3 className="text-ivory text-lg md:text-[18px] font-display mb-3">
                  {item.title}
                </h3>
                <p className="text-ivory/60 text-[13px] font-body font-light leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
