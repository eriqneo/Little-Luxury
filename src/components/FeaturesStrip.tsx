import FadeIn from "./FadeIn";

const FEATURES = [
  "Prime Location",
  "Safe & Private",
  "Rooftop Terrace",
  "Concierge",
  "Free WiFi",
];

export default function FeaturesStrip() {
  return (
    <section className="bg-charcoal py-10 md:py-16 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-6 overflow-x-auto no-scrollbar pb-4 md:pb-0 scroll-smooth">
          {FEATURES.map((feature, index) => (
            <div key={feature} className="flex-shrink-0">
              <FadeIn direction="up" delay={index * 0.1}>
                <div className="border border-gold/30 px-7 py-3 md:px-8 md:py-4 text-gold text-[12px] md:text-[13px] uppercase tracking-[0.15em] font-body font-light whitespace-nowrap hover:bg-gold/10 transition-colors duration-500 cursor-default">
                  {feature}
                </div>
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </section>
  );
}
