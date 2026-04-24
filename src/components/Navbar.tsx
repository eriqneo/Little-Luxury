import { useState, useEffect } from "react";
import Logo from "./Logo";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSiteSettings } from "../hooks/useSiteSettings";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Rooms", href: "/rooms" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
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
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        isScrolled 
          ? "bg-ivory/95 backdrop-blur-md border-b border-gold-muted/30 py-4 shadow-sm" 
          : "bg-transparent py-8"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Branding */}
        <Link to="/" className="flex items-center gap-3 group">
          <Logo className="transition-transform duration-500 group-hover:scale-110 shadow-lg border border-gold/30" />
          <span className={`font-display font-semibold transition-colors duration-700 text-lg tracking-[0.15em] uppercase leading-none ${
            isScrolled ? "text-gold" : "text-ivory"
          }`}>
            {settings?.site_name || "Little Luxury"}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-12">
          <div className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-[13px] uppercase tracking-[0.18em] font-body font-light transition-colors duration-700 ${
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
            className={`px-6 py-2.5 border transition-all duration-700 text-[13px] uppercase tracking-[0.12em] font-body font-medium ${
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
          className={`lg:hidden transition-colors duration-700 hover:opacity-80 ${
            isScrolled ? "text-gold" : "text-ivory"
          }`}
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

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
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-espresso z-[70] shadow-2xl p-12 flex flex-col items-center"
            >
              <button
                className="absolute top-8 right-8 text-gold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={32} />
              </button>

              <div className="flex flex-col items-center space-y-8 mt-20">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`text-sm uppercase tracking-[0.2em] font-body font-light transition-colors ${
                      location.pathname === link.href ? "text-gold" : "text-ivory hover:text-gold"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <Link 
                  to="/booking"
                  className="mt-8 px-10 py-4 bg-gold text-espresso text-sm uppercase tracking-[0.15em] font-body font-normal"
                >
                  Reserve Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
