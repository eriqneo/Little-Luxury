import Navbar from "./Navbar";
import Footer from "./Footer";
import FadeIn from "./FadeIn";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { useTeamMembers } from "../hooks/useTeamMembers";
import { useAboutValues, toRoman } from "../hooks/useAboutValues";
import { useAwards } from "../hooks/useAwards";
import { getFileUrl, pb } from "../lib/pocketbase";

// Renders text that may contain HTML from PocketBase rich text editor
const RichText = ({ text, className = '' }: { text: string; className?: string }) => {
  const isHtml = /<[a-z][\s\S]*>/i.test(text);
  return isHtml
    ? <div className={className} dangerouslySetInnerHTML={{ __html: text }} />
    : <p className={className}>{text}</p>;
};

// ── Fallback content — shown while CMS data is loading or not yet populated ──
const FALLBACK_VALUES = [
  { id: "1", title: "Rest Above All",  body: "We believe that silence is the foundation of recovery. Every sound, from our hallway acoustics to our linen selections, is engineered to protect your peace.", sort_order: 1 },
  { id: "2", title: "Details Matter",  body: "Small touches define the experience. Whether it's the specific light temperature in your bathroom or the weight of your room key—the details are the destination.", sort_order: 2 },
  { id: "3", title: "Warmth Always",   body: "Our service is invisible yet attentive. We anticipate your needs with genuine warmth, making you feel at once entirely at home and completely away.", sort_order: 3 },
];

const FALLBACK_TEAM = [
  { id: "1", collectionId: "", name: "Abasi Kariuki",  role: "FOUNDER & VISIONARY",    bio: "With two decades in global hospitality, Abasi founded Little Luxury to return to the core of service: the art of quietude.", photo: "", sort_order: 1, is_active: true },
  { id: "2", collectionId: "", name: "Elena M'beki",   role: "HEAD OF EXPERIENCE",     bio: "Elena crafts the sensory journey of every guest, from the bespoke lobby fragrance to the curated morning playlists.", photo: "", sort_order: 2, is_active: true },
];

const FALLBACK_AWARDS = [
  { id: "1", title: "Best Boutique Hotel 2024",   sort_order: 1, is_active: true },
  { id: "2", title: "TripAdvisor Excellence",       sort_order: 2, is_active: true },
  { id: "3", title: "5-Star Hygiene Rating",        sort_order: 3, is_active: true },
  { id: "4", title: "Top Rated on Booking.com",     sort_order: 4, is_active: true },
];

export default function AboutPage() {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { members, loading: teamLoading } = useTeamMembers();
  const { values, loading: valuesLoading } = useAboutValues();
  const { awards, loading: awardsLoading } = useAwards();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Show CMS data if loaded and has records. Show fallbacks only AFTER loading completes.
  const displayValues = valuesLoading ? [] : (values.length > 0 ? values : FALLBACK_VALUES);
  const displayTeam   = teamLoading   ? [] : (members.length > 0 ? members : FALLBACK_TEAM);
  const displayAwards = awardsLoading ? [] : (awards.length > 0 ? awards : FALLBACK_AWARDS);

  // Returns null while loading — prevents avatar placeholder from flashing
  // before CMS photo URL is confirmed.
  const teamPhotoUrl = (member: typeof FALLBACK_TEAM[0]): string | null => {
    if (teamLoading) return null;
    if (member.photo && member.collectionId) {
      return pb.files.getURL(member as any, member.photo, { thumb: '400x400' });
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=2C2418&color=C9A96E&bold=true&font-size=0.35`;
  };

  // Story text — CMS first, then hardcoded fallbacks
  const story_p1    = settings?.about_story_p1    || "Little Luxury began as an idea scribbled on the back of a travel journal in 2018. We observed that in a world that is increasingly loud, the ultimate luxury isn't excess—it's elegance and stillness.";
  const story_p2    = settings?.about_story_p2    || "Our philosophy is rooted in the belief that hospitality should be felt more than seen. Every corner of our hotel is designed to minimize friction and maximize comfort, creating a seamless environment where you can truly unwind.";
  const story_p3    = settings?.about_story_p3    || "Today, we remain a family-owned destination committed to the highest standards of personal service. Our team doesn't just manage rooms; they safeguard your experience, ensuring every stay is as unique as the individuals who walk through our doors.";
  const story_quote = settings?.about_story_quote || "We didn't set out to build another hotel. We set out to build a sanctuary for the modern seeker.";

  // Return null while settings is loading — prevents Unsplash from flashing
  // before PocketBase confirms which image to use.
  const storyImg1 = settingsLoading
    ? null
    : settings?.about_story_img_1
      ? getFileUrl(settings, settings.about_story_img_1, '800x600')
      : 'https://images.unsplash.com/photo-1551882547-ff40c63fe4cb?w=800&q=80';

  const storyImg2 = settingsLoading
    ? null
    : settings?.about_story_img_2
      ? getFileUrl(settings, settings.about_story_img_2, '800x600')
      : 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80';

  // No early return — heroRef must always be attached for useScroll to work.
  // Instead we show a loading overlay inside the hero section.

  return (
    <div className="min-h-screen bg-ivory">

      {/* ── HERO — always rendered so heroRef stays attached ────────────── */}
      <section ref={heroRef} className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {settingsLoading ? (
          /* Loading pulse while PocketBase responds */
          <div className="absolute inset-0 bg-espresso flex items-center justify-center">
            <div className="text-gold text-sm uppercase tracking-[0.4em] animate-pulse">Loading...</div>
          </div>
        ) : (
          <motion.div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${settings?.about_hero ? getFileUrl(settings, settings.about_hero, '1920x1080') : 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1920&q=80'}")`,
              y: heroY,
            }}
          >
            <div className="absolute inset-0 bg-espresso/60" />
          </motion.div>
        )}

        <div className="relative z-10 text-center px-6">
          <FadeIn direction="up">
            <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body block mb-6">OUR STORY</span>
            <h1 className="text-white text-5xl md:text-[72px] font-display italic font-light max-w-4xl leading-tight">
              Born from a Passion <br className="hidden md:block" /> for Quiet Luxury
            </h1>
            <div className="mt-12 animate-bounce opacity-40">
              <div className="w-[1px] h-12 bg-white mx-auto" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── OUR STORY ────────────────────────────────────────────────────── */}
      <section className="bg-ivory py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12 max-w-[1240px]">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">

            {/* Story Text */}
            <div className="lg:w-1/2">
              <FadeIn direction="right">
                <div className="space-y-8 text-charcoal font-display text-[20px] leading-[1.8] font-light">
                  <RichText text={story_p1} />

                  <div className="border-l-4 border-gold pl-8 my-12 italic text-[28px] text-gold py-2">
                    "{story_quote}"
                  </div>

                  <RichText text={story_p2} />
                  <RichText text={story_p3} />
                </div>
              </FadeIn>
            </div>

            {/* Stacked Images */}
            <div className="lg:w-1/2 relative pb-20">
              <FadeIn direction="left">
                <div className="relative">
                  {/* Main image — skeleton while loading */}
                  <div className="w-full h-[500px] overflow-hidden shadow-2xl relative z-10 bg-espresso/20">
                    {storyImg1 && (
                      <img
                        src={storyImg1}
                        alt="Hotel Interior"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {/* Offset image — skeleton while loading */}
                  <div className="absolute -bottom-12 -right-8 md:-right-16 w-3/4 h-[400px] overflow-hidden shadow-2xl z-20 border-[12px] border-ivory bg-espresso/20">
                    {storyImg2 && (
                      <img
                        src={storyImg2}
                        alt="Hotel Service"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ───────────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12 max-w-[1240px]">
          <FadeIn direction="up" className="text-center mb-24">
            <h2 className="text-ivory text-4xl md:text-[48px] font-display italic font-light">What We Stand For</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {displayValues.map((v, i) => (
              <div key={v.id}>
                <FadeIn delay={i * 0.2}>
                  <div className="relative group">
                    <span className="text-[120px] font-display font-extralight text-gold/10 absolute -top-16 -left-8 leading-none select-none">
                      {toRoman(v.sort_order)}
                    </span>
                    <div className="relative z-10">
                      <h3 className="text-ivory font-display text-[22px] mb-6">{v.title}</h3>
                      <RichText text={v.body} className="text-ivory/60 font-body font-light text-[14px] leading-relaxed" />
                    </div>
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────────────── */}
      <section className="bg-ivory py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12 max-w-[1240px]">
          <FadeIn className="text-center mb-20">
            <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body block mb-4">THE FAMILY</span>
            <h2 className="text-charcoal text-4xl font-display italic font-light">The People Behind Your Experience</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 max-w-4xl mx-auto">
            {displayTeam.map((member, i) => (
              <div key={member.id}>
                <FadeIn delay={i * 0.2}>
                  <div className="group">
                    <div className="aspect-square w-full overflow-hidden mb-8 shadow-sm bg-espresso/10">
                      {teamPhotoUrl(member) && (
                        <img
                          src={teamPhotoUrl(member)!}
                          alt={member.name}
                          className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <h4 className="text-charcoal font-display text-[22px] mb-1">{member.name}</h4>
                    <p className="text-gold text-[12px] uppercase tracking-[0.2em] font-body font-medium mb-4">{member.role}</p>
                    <RichText text={member.bio} className="text-[#666] font-body font-light text-[14px] leading-relaxed" />
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AWARDS ───────────────────────────────────────────────────────── */}
      <section className="bg-espresso py-20 border-t border-gold/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-24">
            {displayAwards.map((award, i) => (
              <div key={award.id}>
                <FadeIn delay={i * 0.1}>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full border border-gold/30 flex items-center justify-center p-4 mb-4 group hover:border-gold transition-colors duration-500">
                      <div className="w-full h-full rounded-full border border-gold/10 flex items-center justify-center text-[9px] uppercase tracking-widest text-gold/80 font-body leading-tight p-2 group-hover:text-gold">
                        {award.title}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
