import { useState, useEffect } from "react";
import Logo from "./Logo";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Play } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSiteSettings } from "../hooks/useSiteSettings";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Rooms", href: "/rooms" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar({ onTourClick }: { onTourClick?: () => void }) {
  const { settings } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          isScrolled 
            ? "bg-ivory/95 backdrop-blur-md border-b border-gold-muted/30 py-4 shadow-sm" 
            : "bg-transparent py-8"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-4 min-w-0">
          <div className="flex items-center gap-4 flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0 min-w-0">
              <Logo className="transition-transform duration-500 group-hover:scale-110 shadow-lg border border-gold/30 flex-shrink-0" />
              <span className={`font-display font-semibold transition-colors duration-700 tracking-[0.1em] uppercase leading-none truncate ${
                isScrolled ? "text-gold" : "text-ivory"
              }`} style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)' }}>
                {settings?.site_name || "Little Luxury"}
              </span>
            </Link>

            {/* Creative Virtual Tour Button */}
            {settings?.virtual_tour_enabled && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  onTourClick?.();
                }}
                className={`relative flex items-center group/tour ml-2 transition-all duration-500 ${
                  isScrolled ? "text-gold" : "text-ivory"
                }`}
              >
                {/* Outer Glow/Ring */}
                <div className="absolute inset-0 rounded-full bg-gold/20 scale-125 blur-md opacity-0 group-hover/tour:opacity-100 transition-opacity duration-700 animate-pulse" />
                
                {/* The "Lens" Button */}
                <div className={`relative flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border backdrop-blur-sm overflow-hidden transition-all duration-500 ${
                  isScrolled 
                    ? "border-gold/30 bg-white/5 hover:border-gold hover:bg-gold/10" 
                    : "border-ivory/20 bg-ivory/5 hover:border-gold hover:bg-gold/20"
                }`}>
                  {/* Rotating Play/360 Icon */}
                  <div className="relative w-6 h-6 flex items-center justify-center rounded-full bg-gold/10 group-hover/tour:bg-gold transition-colors duration-500">
                    <Play 
                      size={10} 
                      className={`fill-current group-hover/tour:text-ivory transition-colors duration-500 ${
                        isScrolled ? "text-gold" : "text-ivory"
                      }`} 
                    />
                    {/* Subtle spinning ring on hover */}
                    <div className="absolute inset-[-2px] border border-gold/40 border-t-transparent rounded-full opacity-0 group-hover/tour:opacity-100 animate-spin transition-opacity duration-500" />
                  </div>

                  <span className="text-[9px] uppercase tracking-[0.25em] font-body font-semibold whitespace-nowrap">
                    Virtual Tour
                  </span>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover/tour:translate-x-[250%] transition-transform duration-1000 ease-in-out" />
                </div>
              </motion.button>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden 2xl:flex items-center gap-4 2xl:gap-8 flex-shrink-0">
            <div className="flex items-center gap-4 2xl:gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-[11px] 2xl:text-[13px] uppercase tracking-[0.15em] font-body font-light transition-colors duration-700 whitespace-nowrap ${
                    location.pathname === link.href 
                      ? "text-gold" 
                      : isScrolled ? "text-charcoal hover:text-gold" : "text-ivory/80 hover:text-gold"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <Link 
              to="/booking"
              onClick={(e) => {
                if (location.pathname === "/booking") {
                  e.preventDefault();
                  const el = document.getElementById("booking-interface");
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 120;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }
              }}
              className={`px-4 2xl:px-6 py-2 border transition-all duration-700 text-[11px] 2xl:text-[13px] uppercase tracking-[0.1em] font-body font-medium whitespace-nowrap ${
                isScrolled 
                  ? "border-gold text-gold hover:bg-gold hover:text-ivory" 
                  : "border-ivory/30 text-ivory hover:bg-ivory hover:text-espresso"
              }`}
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Hamburger Icon */}
          <button
            className={`2xl:hidden transition-colors duration-700 hover:opacity-80 flex-shrink-0 ${
              isScrolled ? "text-gold" : "text-ivory"
            }`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel (Slide from Right) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[60]"
            />
            
            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-[100dvh] w-[80%] max-w-sm bg-espresso z-[70] shadow-2xl p-12 flex flex-col items-center overflow-y-auto"
            >
              <button
                className="absolute top-8 right-8 text-gold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={32} />
              </button>

              <div className="flex flex-col items-center space-y-8 mt-20 pb-12 w-full">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm uppercase tracking-[0.2em] font-body font-light transition-colors ${
                      location.pathname === link.href ? "text-gold" : "text-ivory hover:text-gold"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {settings?.virtual_tour_enabled && (
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onTourClick?.();
                    }}
                    className="text-sm uppercase tracking-[0.2em] font-body font-light text-gold flex items-center gap-2 group/tour"
                  >
                    <Play size={14} className="fill-current" />
                    Virtual Tour
                  </button>
                )}
                
                <Link 
                  to="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-8 px-10 py-4 bg-gold text-espresso text-sm uppercase tracking-[0.15em] font-body font-normal w-full text-center hover:bg-ivory transition-colors"
                >
                  Reserve Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
