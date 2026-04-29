import FadeIn from "./FadeIn";
import { Link } from "react-router-dom";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { getFileUrl } from "../lib/pocketbase";

export default function Introduction() {
  const { settings, loading } = useSiteSettings();

  const subtitle = settings?.home_intro_subtitle || "EST. 2024 · NAIROBI";
  const headline = settings?.home_intro_headline || "Cozy & Refined — \n An atmosphere that holds you";
  const p1 = settings?.home_intro_p1 || "Nestled in the heart of Nairobi, Little Luxury is a sanctuary where every corner is designed with intention. From the hand-picked linens to the curated scents that greet you at the door — we believe true luxury lives in the details.";
  const p2 = settings?.home_intro_p2 || "Whether you're here for a weekend escape or a longer stay, you'll find a space that feels like home — only better.";
  const statNum = settings?.home_intro_stat_num || "98%";
  const statText = settings?.home_intro_stat_text || "Guest Satisfaction";

  const imgUrl = loading ? null : settings?.home_intro_image
    ? getFileUrl(settings, settings.home_intro_image, '800x1000')
    : "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80";

  return (
    <section id="experience" className="py-24 md:py-32 bg-ivory overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-[1300px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left Column */}
          <FadeIn direction="right" className="order-2 md:order-1">
            <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body font-light block mb-6">
              {subtitle}
            </span>
            <h2 className="text-charcoal text-4xl md:text-[52px] font-display italic leading-[1.2] mb-8 font-light whitespace-pre-line">
              {headline}
            </h2>
            <div className="space-y-6 mb-10">
              <div 
                className="text-[#555] text-[15px] font-body font-light leading-[1.9] max-w-[460px] [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: p1 }}
              />
              <div 
                className="text-[#555] text-[15px] font-body font-light leading-[1.9] max-w-[460px] [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: p2 }}
              />
            </div>
            <Link
              to="/about"
              className="inline-block text-gold text-[13px] uppercase tracking-[0.1em] font-body font-medium hover:underline transition-all underline-offset-4"
            >
              Our Story →
            </Link>
          </FadeIn>

          {/* Right Column */}
          <FadeIn direction="left" className="order-1 md:order-2 relative pt-8 md:pt-0">
            <div className="relative aspect-[4/5] w-full overflow-hidden shadow-2xl bg-espresso/10">
              {imgUrl && (
                <img
                  src={imgUrl}
                  alt="Luxury Hotel Room Detail"
                  className="w-full h-full object-cover grayscale-[10%] hover:scale-105 transition-transform duration-[2s]"
                  referrerPolicy="no-referrer"
                />
              )}
              
              {/* Floating Stat Card */}
              <div className="absolute bottom-[-20px] left-[-20px] md:bottom-[-30px] md:left-[-30px] bg-espresso p-6 md:p-8 md:px-10 shadow-2xl z-20">
                <div className="text-gold font-display font-semibold text-4xl md:text-[42px] leading-tight mb-1">
                  {statNum}
                </div>
                <div className="text-ivory text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-body font-light opacity-80 whitespace-nowrap">
                  {statText}
                </div>
              </div>
            </div>
            
            {/* Decorative Offset Border */}
            <div className="absolute top-[-15px] right-[-15px] w-full h-full border border-gold/20 -z-10 translate-x-4 translate-y-4" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
