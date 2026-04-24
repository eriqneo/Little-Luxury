import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { getCarouselUrls } from "../lib/pocketbase";

export default function Hero() {
  const { settings, loading } = useSiteSettings();
  const [index, setIndex] = useState(0);


  // Use SDK's getUrl — handles collection ID automatically.
  // '1920x1080' tells PocketBase to serve a compressed thumbnail, not full-res.
  const heroImages = getCarouselUrls(settings, settings?.hero_carousel ?? [], '1920x1080');

  const line1 = (settings?.site_name || "Little Luxury").split(" ");
  const line2 = (settings?.tagline || "Designed for Rest and Comfort").split(" ");

  useEffect(() => {
    if (heroImages.length > 0) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % heroImages.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [heroImages.length]);

  if (loading) {
    return (
      <section className="relative h-screen w-full bg-espresso flex items-center justify-center">
        <div className="text-gold text-sm uppercase tracking-widest animate-pulse">Loading Sanctuary...</div>
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center">
      {/* Automated Carousel Background */}
      <div className="absolute inset-0 z-0 bg-espresso">
        <AnimatePresence mode="wait">
          {heroImages.length > 0 ? (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 1.1, x: 20 }}
              animate={{ opacity: 1, scale: 1.05, x: 0 }}
              exit={{ opacity: 0, scale: 1.1, x: -20 }}
              transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${heroImages[index]}")`,
              }}
            >
              {/* Dark Overlay Gradient */}
              <div 
                className="absolute inset-0 z-10"
                style={{
                  background: 'linear-gradient(to bottom, rgba(26,16,10,0.3) 0%, rgba(26,16,10,0.6) 100%)'
                }}
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-espresso flex items-center justify-center">
              <div className="text-ivory/20 text-8xl font-display italic">Little Luxury</div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-6 md:px-[8%] relative z-20">
        <div className="max-w-4xl">
          {/* Overline Label Removed as requested */}

          {/* Headline */}
          <h1 className="text-ivory leading-[1.1] mb-8">
            <div className="overflow-hidden flex flex-wrap gap-x-[0.3em] gap-y-2 text-5xl md:text-8xl font-display font-light italic">
              {line1.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="overflow-hidden flex flex-wrap gap-x-[0.3em] gap-y-2 text-5xl md:text-8xl font-display font-semibold italic mt-2">
              {line2.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="text-ivory/80 text-base md:text-lg font-body font-light max-w-[500px] mb-12 leading-relaxed"
          >
            An exclusive sanctuary where refined elegance, uncompromising privacy, and bespoke service converge to elevate the art of living.
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <Link 
                to="/rooms"
                className="inline-block px-10 py-5 bg-gold text-ivory text-[13px] uppercase tracking-[0.12em] font-body font-medium hover:bg-ivory hover:text-gold transition-all duration-500 shadow-xl"
              >
                Reserve Your Room
              </Link>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <Link 
                to="/rooms"
                className="inline-block text-ivory text-[13px] uppercase tracking-[0.1em] font-body font-light border-b border-gold/60 pb-1 hover:border-gold transition-colors"
              >
                Explore Rooms →
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Carousel Pagination Pips */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-24 right-6 md:right-12 z-30 flex flex-col gap-3">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="group relative flex items-center justify-end"
            >
              <span className={`text-[10px] uppercase font-body tracking-widest mr-4 transition-all duration-500 ${
                index === i ? "text-gold opacity-100 translate-x-0" : "text-ivory opacity-0 translate-x-4"
              }`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={`h-[2px] transition-all duration-700 ${
                index === i ? "w-12 bg-gold" : "w-4 bg-white/30 group-hover:bg-white/60"
              }`} />
            </button>
          ))}
        </div>
      )}

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
        <div className="flex flex-col items-center gap-2">
          <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-body opacity-70">
            Scroll to Explore
          </span>
          <motion.div 
            animate={{ height: [20, 50, 20], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gold"
          />
        </div>
      </div>
    </section>
  );
}
