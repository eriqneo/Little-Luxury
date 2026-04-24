import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 w-full bg-[#1A1A1A] border-t border-gold/20 z-[100] p-6 lg:p-8"
        >
          <div className="container mx-auto max-w-[1300px] flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-ivory/80 text-[13px] font-body font-light text-center md:text-left leading-relaxed">
              We use cookies to give you the best experience on our website. 
              By continuing to browse, you agree to our use of cookies.
            </p>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsVisible(false)}
                className="px-6 py-3 border border-gold/40 text-gold text-[12px] uppercase tracking-[0.15em] font-body font-medium hover:border-gold transition-all"
              >
                Preferences
              </button>
              <button 
                onClick={handleAccept}
                className="px-8 py-3 bg-gold text-ivory text-[12px] uppercase tracking-[0.15em] font-body font-medium hover:bg-gold-dark transition-all shadow-lg"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
