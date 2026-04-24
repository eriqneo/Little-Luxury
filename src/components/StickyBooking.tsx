import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, ChevronUp } from "lucide-react";

export default function StickyBooking() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hideBookBtn, setHideBookBtn] = useState(false);
  const bookingRef = useRef<HTMLElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Scroll listener for back to top
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    // Hide button if already on booking page
    if (location.pathname === "/booking") {
      setHideBookBtn(true);
    } else {
      // Intersection observer for booking section on other pages (e.g. homepage)
      bookingRef.current = document.getElementById("book");
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          setHideBookBtn(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );

      if (bookingRef.current) {
        observer.observe(bookingRef.current);
      }

      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (bookingRef.current) observer.unobserve(bookingRef.current);
      };
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-8 right-8 z-[90] flex flex-col items-end gap-4 pointer-events-none">
      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-espresso/90 border border-gold/40 text-gold flex items-center justify-center hover:bg-espresso hover:border-gold transition-all duration-300 pointer-events-auto shadow-2xl backdrop-blur-md"
            aria-label="Back to top"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sticky Book Now Button */}
      <AnimatePresence>
        {(!hideBookBtn && location.pathname !== "/booking") && (
          <Link to="/booking" className="pointer-events-auto">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-gold text-ivory px-6 py-4 rounded-full shadow-[0_8px_32px_rgba(201,169,110,0.3)] transition-colors duration-500 hover:bg-gold-dark ring-4 ring-gold/10"
            >
              <Calendar size={18} />
              <span className="text-[12px] uppercase tracking-[0.15em] font-body font-medium">
                Book Now
              </span>
            </motion.button>
          </Link>
        )}
      </AnimatePresence>
    </div>
  );
}
