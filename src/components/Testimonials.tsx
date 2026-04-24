import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState, useMemo } from "react";
import FadeIn from "./FadeIn";
import { useTestimonials } from "../hooks/useTestimonials";
import { Testimonial } from "../lib/pocketbase";

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="w-[350px] md:w-[450px] flex-shrink-0 px-8 py-12 bg-white border border-gold/10 mx-4">
      <div className="flex gap-1 text-gold text-[16px] mb-6">
        {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
      </div>
      <blockquote className="text-charcoal text-[17px] md:text-[18px] font-display italic font-light leading-relaxed mb-8">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4 border-t border-gold/10 pt-6">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center font-display text-gold italic text-xl">
          {t.guest_name.charAt(0)}
        </div>
        <div>
          <h4 className="text-charcoal text-[13px] uppercase tracking-[0.1em] font-body font-medium">
            {t.guest_name}
          </h4>
          <p className="text-[#888] text-[11px] font-body font-light uppercase tracking-widest">
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
  
  // Create a triple-length array for infinite effect
  const duplicatedTestimonials = useMemo(() => {
    if (testimonials.length === 0) return [];
    return [...testimonials, ...testimonials, ...testimonials];
  }, [testimonials]);

  useAnimationFrame((t, delta) => {
    if (!isHovered) {
      // Delta is ms since last frame, so roughly 16.6ms at 60fps
      // delta * 0.05 gives a smooth speed
      scrollX.set(scrollX.get() - (delta * 0.05));
    }

    // Reset when we've scrolled past one full set
    // This is a bit of a hack, but with enough duplication it works for visual-only marquees
    const limit = -100 * duplicatedTestimonials.length / 3;
    if (scrollX.get() < -2500) {
      scrollX.set(0);
    }
  });

  return (
    <section id="testimonials" className="bg-ivory py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-[1300px] mb-20 text-center">
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
      >
        <motion.div 
          className="flex whitespace-nowrap"
          style={{ x: scrollX }}
        >
          {loading ? (
            <div className="w-full text-center py-20 text-gold text-sm tracking-widest uppercase animate-pulse">
              Loading Testimonials...
            </div>
          ) : duplicatedTestimonials.length > 0 ? (
            duplicatedTestimonials.map((t, i) => (
              <div key={i}>
                <TestimonialCard t={t} />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-20 text-charcoal/50 text-sm tracking-widest uppercase">
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
          <div className="w-24 h-[1px] bg-gold/30" />
          <span className="text-[10px] uppercase font-body tracking-[0.3em] text-gold/60">Verified Experiences</span>
          <div className="w-24 h-[1px] bg-gold/30" />
        </div>
      </div>
    </section>
  );
}
