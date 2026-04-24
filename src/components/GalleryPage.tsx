import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FadeIn from "./FadeIn";
import { useGallery } from "../hooks/useGallery";
import { getFileUrl } from "../lib/pocketbase";

const CATEGORIES = ["ALL", "LIVING", "BEDROOMS", "OUTDOORS"];

export default function GalleryPage() {
  const { assets, loading } = useGallery();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredImages = filter === "ALL" 
    ? assets 
    : assets.filter(img => img.category.toUpperCase() === filter);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    document.body.style.overflow = "auto";
  }, []);

  const navigate = useCallback((direction: "next" | "prev") => {
    if (activeIndex === null || filteredImages.length === 0) return;
    if (direction === "next") {
      setActiveIndex((activeIndex + 1) % filteredImages.length);
    } else {
      setActiveIndex((activeIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  }, [activeIndex, filteredImages]);

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
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-gold text-sm uppercase tracking-[0.4em] animate-pulse">Opening the Archives...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      <main className="pt-24 md:pt-32">
        {/* Header Section */}
        <section className="py-20 bg-charcoal">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <FadeIn direction="up">
              <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body block mb-6">VISUAL PORTFOLIO</span>
              <h1 className="text-ivory text-5xl md:text-[72px] font-display italic font-light leading-tight mb-8">
                The Gallery
              </h1>
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setFilter(cat); setActiveIndex(null); }}
                    className={`text-[12px] uppercase tracking-[0.2em] font-body transition-colors duration-300 ${
                      filter === cat ? "text-gold" : "text-ivory/40 hover:text-ivory"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredImages.map((img, index) => (
                  <div key={img.id}>
                    <FadeIn delay={index * 0.1}>
                      <div 
                        className="group relative cursor-pointer overflow-hidden aspect-[4/5]"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={getFileUrl(img, img.image, '800x1000')}
                          alt={img.caption || `Gallery Item ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-8">
                          <Plus className="text-gold mb-4" size={32} />
                          <p className="text-ivory font-display italic text-lg">{img.caption}</p>
                          <span className="mt-2 text-gold/60 text-[10px] uppercase tracking-widest">{img.category}</span>
                        </div>
                      </div>
                    </FadeIn>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-charcoal/30 font-display italic text-2xl">
                No images found in this category.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && filteredImages[activeIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 md:p-12"
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-8 right-8 text-white/60 hover:text-gold transition-colors z-[110]"
            >
              <X size={32} />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); navigate("prev"); }}
              className="absolute left-4 md:left-12 text-white/40 hover:text-gold transition-colors z-[110]"
            >
              <ChevronLeft size={64} strokeWidth={1} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate("next"); }}
              className="absolute right-4 md:right-12 text-white/40 hover:text-gold transition-colors z-[110]"
            >
              <ChevronRight size={64} strokeWidth={1} />
            </button>

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex flex-col items-center justify-center"
              onClick={closeLightbox}
            >
              <img
                src={getFileUrl(filteredImages[activeIndex], filteredImages[activeIndex].image)}
                alt="Lightbox Full"
                className="max-h-[75vh] max-w-full object-contain mb-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                referrerPolicy="no-referrer"
              />
              <div className="text-center">
                <p className="text-ivory font-display italic text-2xl mb-2">{filteredImages[activeIndex].caption}</p>
                <p className="text-gold/60 text-xs tracking-[0.3em] uppercase">{filteredImages[activeIndex].category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
