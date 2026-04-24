import FadeIn from "./FadeIn";

import { useSiteSettings } from "../hooks/useSiteSettings";
import { getFileUrl } from "../lib/pocketbase";

export default function About() {
  const { settings, loading } = useSiteSettings();

  const headline = settings?.home_about_headline || "Redefining the \n art of relaxation.";
  const text = settings?.home_about_text || "Nestled in the heart of serenity, Little Luxury offers an intimate escape from the rhythmic pulse of modern life. Every detail, from the hand-selected linens to the ambient lighting, is curated to inspire a profound sense of comfort.";
  
  const img1 = loading ? null : settings?.home_about_img_1 
    ? getFileUrl(settings, settings.home_about_img_1, '1000x1000') 
    : "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop";
    
  const img2 = loading ? null : settings?.home_about_img_2
    ? getFileUrl(settings, settings.home_about_img_2, '800x800')
    : "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop";

  return (
    <section id="about" className="py-24 md:py-40 bg-ivory">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center">
          {/* Text Content */}
          <div className="md:col-span-5 order-2 md:order-1">
            <FadeIn direction="right" delay={0.2}>
              <span className="text-gold-mid text-[11px] uppercase tracking-[0.3em] font-body block mb-6">
                Our Philosophy
              </span>
              <h2 className="text-charcoal text-4xl md:text-6xl font-display italic mb-8 leading-[1.1] whitespace-pre-line">
                {headline}
              </h2>
              <p className="text-charcoal/60 text-lg font-body leading-relaxed mb-10 max-w-md">
                {text}
              </p>
              <div className="pt-4">
                <a
                  href="#experience"
                  className="inline-flex items-center text-[12px] uppercase tracking-[0.2em] text-gold-mid font-body group"
                >
                  Learn More
                  <div className="ml-4 w-12 h-[1px] bg-gold-muted group-hover:w-20 group-hover:bg-gold transition-all duration-500" />
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Image Content - Asymmetric Layout */}
          <div className="md:col-span-7 order-1 md:order-2 relative h-[500px] md:h-[700px]">
            <FadeIn direction="up">
              <div className="absolute top-0 right-0 w-4/5 h-4/5 z-0 overflow-hidden shadow-2xl bg-espresso/10">
                {img1 && (
                  <img
                    src={img1}
                    alt="Spa Treatment"
                    className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <div className="absolute bottom-0 left-0 w-3/5 h-1/2 z-10 overflow-hidden shadow-2xl border-8 border-ivory bg-espresso/10">
                {img2 && (
                  <img
                    src={img2}
                    alt="Luxury Bedroom"
                    className="w-full h-full object-cover grayscale-[10%] hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              {/* Gold Ornament */}
              <div className="absolute top-1/2 -left-8 w-16 h-16 border border-gold-mid opacity-20 hidden md:block" />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
