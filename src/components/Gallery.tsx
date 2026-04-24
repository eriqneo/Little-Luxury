import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import FadeIn from "./FadeIn";
import { useGallery } from "../hooks/useGallery";
import { getFileUrl } from "../lib/pocketbase";

export default function Gallery() {
  const { assets, loading } = useGallery(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    document.body.style.overflow = "auto";
  }, []);

  const navigate = useCallback((direction: "next" | "prev") => {
    if (activeIndex === null || assets.length === 0) return;
    if (direction === "next") {
      setActiveIndex((activeIndex + 1) % assets.length);
    } else {
      setActiveIndex((activeIndex - 1 + assets.length) % assets.length);
    }
  }, [activeIndex, assets.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigate("next");
      if (e.key === "ArrowLeft") navigate("prev");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, closeLightbox, navigate]);

  if (loading) {
    return (
      <section id="gallery" className="py-24 bg-ivory text-center">
        <div className="text-gold text-sm uppercase tracking-widest animate-pulse">Curating Gallery...</div>
      </section>
    );
  }

  if (assets.length === 0) return null;

  return (
    <section id="gallery" className="py-24 md:py-32 bg-ivory">
      <div className="container mx-auto px-6 md:px-12 max-w-[1300px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <FadeIn direction="right">
            <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body font-light block mb-4">
              VISUAL JOURNEY
            </span>
            <h2 className="text-charcoal text-4xl md:text-[48px] font-display italic font-light">
              A Glimpse Inside
            </h2>
          </FadeIn>
          <FadeIn direction="left">
            <Link 
              to="/gallery" 
              className="group text-gold text-[13px] uppercase tracking-[0.15em] font-body font-medium flex items-center gap-3"
            >
              View Full Gallery 
              <span className="w-8 h-[1px] bg-gold group-hover:w-12 transition-all duration-500" />
            </Link>
          </FadeIn>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {assets.map((asset, index) => {
            // Simple span logic: Every 3rd item spans 2 columns on desktop
            const span = index % 3 === 1 ? "md:col-span-2" : index % 5 === 0 ? "md:row-span-2" : "";
            
            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className={`relative cursor-pointer overflow-hidden group ${span}`}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={getFileUrl(asset, asset.image, '800x600')}
                  alt={asset.caption || `Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-gold/60 flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Plus className="text-gold" size={24} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
          >
            {/* Close Button */}
            <button 
              onClick={closeLightbox}
              className="absolute top-8 right-8 text-white/60 hover:text-gold transition-colors z-[110]"
            >
              <X size={32} />
            </button>

            {/* Navigation Handles */}
            <button 
              onClick={(e) => { e.stopPropagation(); navigate("prev"); }}
              className="absolute left-4 md:left-12 text-white/40 hover:text-gold transition-colors z-[110] bg-black/20 p-4 rounded-full"
            >
              <ChevronLeft size={48} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate("next"); }}
              className="absolute right-4 md:right-12 text-white/40 hover:text-gold transition-colors z-[110] bg-black/20 p-4 rounded-full"
            >
              <ChevronRight size={48} />
            </button>

            {/* Image Container */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex items-center justify-center"
              onClick={closeLightbox}
            >
              <img
                src={getFileUrl(assets[activeIndex], assets[activeIndex].image)}
                alt="Lightbox Full"
                className="max-h-[85vh] max-w-full md:max-w-[85vw] object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ivory/40 font-body text-xs tracking-widest uppercase">
              {activeIndex + 1} / {assets.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
