import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { useSiteSettings } from "../hooks/useSiteSettings";

export default function Footer() {
  const { settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  // Custom SVG icon matching Lucide's style
  const TikTokIcon = ({ size = 24, strokeWidth = 2, className = "" }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
    </svg>
  );

  return (
    <footer className="bg-espresso pt-24 md:pt-32 relative overflow-hidden">
      {/* Decorative Monogram Watermark */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex flex-col items-center pointer-events-none select-none">
        <div className="w-full h-[1px] bg-gold/10" />
        <span className="text-[140px] md:text-[200px] font-display italic text-gold/5 leading-none mt-[-50px] md:mt-[-80px]">
          {settings?.site_name?.[0] || "L"}
        </span>
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-[1300px] relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-20 md:mb-32">
          {/* COLUMN 1 — Brand */}
          <div className="space-y-8">
            <div className="flex flex-col gap-4">
              <Logo />
              <p className="text-ivory/60 text-[13px] font-body italic font-light leading-relaxed max-w-[240px]">
                {settings?.tagline || "A peaceful Space Designed for Rest and Comfort."}
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-ivory/60 hover:text-gold transition-colors duration-300">
                  <Instagram size={20} strokeWidth={1.5} />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-ivory/60 hover:text-gold transition-colors duration-300">
                  <Facebook size={20} strokeWidth={1.5} />
                </a>
              )}
              {settings?.tiktok_url && (
                <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-ivory/60 hover:text-gold transition-colors duration-300">
                  <TikTokIcon size={20} strokeWidth={1.5} />
                </a>
              )}
              {settings?.whatsapp_number && (
                <a href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-ivory/60 hover:text-gold transition-colors duration-300">
                  <MessageCircle size={20} strokeWidth={1.5} />
                </a>
              )}
              <a href="#" className="text-ivory/60 hover:text-gold transition-colors duration-300">
                <MessageSquare size={20} strokeWidth={1.5} />
              </a>
            </div>

            <Link 
              to="/booking"
              className="inline-block px-10 py-4 border border-gold text-gold text-[12px] uppercase tracking-[0.2em] font-body font-medium hover:bg-gold hover:text-ivory transition-all duration-500"
            >
              Book Now
            </Link>
          </div>

          {/* COLUMN 2 — Navigation */}
          <div>
            <h4 className="text-gold text-[12px] uppercase tracking-[0.3em] font-body font-medium mb-8">
              Explore
            </h4>
            <div className="flex flex-col gap-3">
              {["Home", "About Us", "Our Rooms", "Amenities", "Gallery", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : item === "About Us" ? "/about" : item === "Our Rooms" ? "/rooms" : item === "Contact" ? "/contact" : "#"}
                  className="text-ivory/70 text-[14px] font-body font-light hover:text-gold transition-colors duration-300 w-fit"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMN 3 — Rooms */}
          <div>
            <h4 className="text-gold text-[12px] uppercase tracking-[0.3em] font-body font-medium mb-8">
              Accommodations
            </h4>
            <div className="flex flex-col gap-3">
              {["Classic Room", "Deluxe Suite", "Penthouse Suite", "Corporate Booking", "Group Reservations"].map((item) => (
                <Link
                  key={item}
                  to="/rooms"
                  className="text-ivory/70 text-[14px] font-body font-light hover:text-gold transition-colors duration-300 w-fit"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMN 4 — Contact Info */}
          <div>
            <h4 className="text-gold text-[12px] uppercase tracking-[0.3em] font-body font-medium mb-8">
              Contact
            </h4>
            <div className="space-y-6">
              <div className="flex gap-4 items-start text-ivory/70 text-[14px] font-body font-light">
                <MapPin size={16} className="text-gold mt-1 flex-shrink-0" />
                <span>{settings?.contact_address || "15 Peponi Road, Westlands, Nairobi, Kenya"}</span>
              </div>
              <div className="flex gap-4 items-center text-ivory/70 text-[14px] font-body font-light">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <span>{settings?.contact_phone || "+254 700 000 000"}</span>
              </div>
              <div className="flex gap-4 items-center text-ivory/70 text-[14px] font-body font-light">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <span>{settings?.contact_email || "info@littleluxury.co.ke"}</span>
              </div>
              
              <div className="pt-4">
                <a href="#contact" className="text-gold text-[13px] font-body font-medium border-b border-gold/40 pb-1 hover:border-gold transition-all">
                  View on Map
                </a>
                <p className="text-ivory/40 text-[13px] font-body font-light mt-6">
                  Open 24 hours · 7 days a week
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM BAR */}
        <div className="border-t border-gold/15 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-ivory/50 text-[12px] font-body font-light">
            © {currentYear} {settings?.site_name || "Little Luxury"}. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-ivory/50 text-[12px] font-body font-light hover:text-gold transition-all"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
