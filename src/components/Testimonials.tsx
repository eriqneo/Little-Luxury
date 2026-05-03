import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useRef, useState, useMemo, useEffect } from "react";
import FadeIn from "./FadeIn";
import { useTestimonials } from "../hooks/useTestimonials";
import { Testimonial } from "../lib/pocketbase";
import { Link } from "react-router-dom";

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="w-[85vw] max-w-[320px] md:max-w-none md:w-[450px] flex-shrink-0 px-6 md:px-8 py-10 md:py-12 bg-white border border-gold/10 mx-3 md:mx-4 whitespace-normal flex flex-col h-full">
      <div className="flex gap-1 text-gold text-[14px] md:text-[16px] mb-6">
        {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
      </div>
      <blockquote className="text-charcoal text-[16px] md:text-[18px] font-display italic font-light leading-relaxed mb-8 flex-grow">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4 border-t border-gold/10 pt-6 mt-auto">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center font-display text-gold italic text-xl flex-shrink-0">
          {t.guest_name.charAt(0)}
        </div>
        <div>
          <h4 className="text-charcoal text-[12px] md:text-[13px] uppercase tracking-[0.1em] font-body font-medium">
            {t.guest_name}
          </h4>
          <p className="text-[#888] text-[10px] md:text-[11px] font-body font-light uppercase tracking-widest mt-0.5">
            {t.location}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { testimonials, loading } = useTestimonials();
  const [isHovered, setIsHovered] = useState(false);
  const scrollX = useMotionValue(0);
  const [halfWidth, setHalfWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create exactly two identical halves
  const duplicatedTestimonials = useMemo(() => {
    if (testimonials.length === 0) return [];
    // Repeat enough times to cover a large screen for one half
    const repetitions = Math.max(1, Math.ceil(8 / testimonials.length));
    const singleHalf = Array(repetitions).fill(testimonials).flat();
    return [...singleHalf, ...singleHalf];
  }, [testimonials]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Full width of the flex container divided by 2
        setHalfWidth(containerRef.current.scrollWidth / 2);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    // Add a small delay to ensure rendering is complete before measuring
    const timeout = setTimeout(updateWidth, 100);
    
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timeout);
    };
  }, [duplicatedTestimonials]);

  useAnimationFrame((t, delta) => {
    if (!isHovered && halfWidth > 0) {
      // Delta is ms since last frame
      // Speed multiplier
      const moveBy = delta * 0.04;
      let newX = scrollX.get() - moveBy;
      
      // Seamlessly wrap when one full half is scrolled
      if (newX <= -halfWidth) {
        newX += halfWidth;
      }
      scrollX.set(newX);
    }
  });

  return (
    <section id="testimonials" className="bg-ivory py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-[1300px] mb-16 md:mb-20 text-center">
        <FadeIn direction="up">
          <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body font-light block mb-4">
            THE LITTLE LUXURY EXPERIENCE
          </span>
          <h2 className="text-charcoal text-4xl md:text-[48px] font-display italic font-light">
            Guest Testimonials
          </h2>
        </FadeIn>
      </div>

      <div 
        className="w-full relative cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <motion.div 
          ref={containerRef}
          className="flex w-fit items-stretch"
          style={{ x: scrollX }}
        >
          {loading ? (
            <div className="w-[100vw] text-center py-20 text-gold text-sm tracking-widest uppercase animate-pulse">
              Loading Testimonials...
            </div>
          ) : duplicatedTestimonials.length > 0 ? (
            duplicatedTestimonials.map((t, i) => (
              <div key={i} className="flex-shrink-0 flex items-stretch">
                <TestimonialCard t={t} />
              </div>
            ))
          ) : (
            <div className="w-[100vw] text-center py-20 text-charcoal/50 text-sm tracking-widest uppercase">
              No testimonials available yet.
            </div>
          )}
        </motion.div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-12">
        <Link
          to="/survey"
          className="text-gold text-[12px] uppercase tracking-[0.2em] font-body font-medium border-b border-gold/40 pb-1 hover:border-gold transition-all"
        >
          Share Your Experience →
        </Link>

        <div className="flex items-center justify-center gap-3">
          <div className="w-16 md:w-24 h-[1px] bg-gold/30" />
          <span className="text-[9px] md:text-[10px] uppercase font-body tracking-[0.3em] text-gold/60 text-center">Verified Experiences</span>
          <div className="w-16 md:w-24 h-[1px] bg-gold/30" />
        </div>
      </div>
    </section>
  );
}
