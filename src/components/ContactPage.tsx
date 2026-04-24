import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Instagram, 
  ChevronDown, 
  CheckCircle2, 
  Send
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FadeIn from "./FadeIn";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { useFaqs } from "../hooks/useFaqs";
import { getFileUrl } from "../lib/pocketbase";

// ── Fallback FAQs shown until CMS data loads ─────────────────────────────────
const FALLBACK_FAQS = [
  { id: "1", question: "What time is check-in and check-out?", answer: "Our standard check-in time is 2:00 PM and check-out is at 11:00 AM. If you require early arrival or a late departure, please contact us in advance and we will do our best to accommodate your request, subject to availability.", sort_order: 1, is_active: true },
  { id: "2", question: "Do you offer airport transfers?", answer: "Yes, we provide luxury airport transfers from Jomo Kenyatta International Airport. Please provide your flight details at least 48 hours before arrival, and our private chauffeur will meet you at the terminal.", sort_order: 2, is_active: true },
  { id: "3", question: "What is your cancellation policy?", answer: "We offer free cancellation up to 48 hours prior to your scheduled arrival. Cancellations made within 48 hours of arrival will be subject to a one-night room charge.", sort_order: 3, is_active: true },
  { id: "4", question: "Do you cater for special occasions like anniversaries?", answer: "Absolutely. From bespoke floral arrangements and chilled champagne to curated local experiences, we delight in making your milestone memorable. Please specify your occasion when booking or contact your host.", sort_order: 4, is_active: true },
  { id: "5", question: "Is there secure parking on site?", answer: "Yes, we offer complimentary, 24-hour monitored secure parking for all our guests within the hotel premises.", sort_order: 5, is_active: true },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gold/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-[17px] font-display transition-colors duration-300 ${isOpen ? "text-gold" : "text-charcoal group-hover:text-gold"}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gold flex-shrink-0 ml-4"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
        className="overflow-hidden"
      >
        <div className="pb-8 pr-8 border-l-2 border-gold/40 pl-6 ml-1">
          <p className="text-charcoal/70 text-[14px] font-body font-light leading-relaxed">
            {answer}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function ContactPage() {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { faqs, loading: faqsLoading } = useFaqs();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const maxMessageLength = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-gold text-sm uppercase tracking-[0.4em] animate-pulse">Loading Details...</div>
      </div>
    );
  }

  // ── Resolve all values with CMS-first, fallback-second pattern ──────────────
  const heroUrl = settings?.contact_hero
    ? getFileUrl(settings, settings.contact_hero, '1920x1080')
    : 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80';

  const phone1    = settings?.contact_phone   || "+254 700 000 000";
  const phone2    = settings?.contact_phone_2 || "+254 200 000 000";
  const email1    = settings?.contact_email   || "info@littleluxury.co.ke";
  const email2    = settings?.contact_email_2 || "bookings@littleluxury.co.ke";
  const address   = settings?.contact_address || "15 Peponi Road, Westlands, Nairobi, Kenya";
  const whatsapp  = settings?.whatsapp_number?.replace(/\D/g, '') || "254700000000";
  const igUrl     = settings?.instagram_url   || "#";
  const igHandle  = igUrl.replace(/\/$/, '').split('/').pop() || "littleluxury";

  const hoursReception = settings?.business_hours_reception || "24 Hours / 7 Days";
  const hoursSupport   = settings?.business_hours_support   || "08:00 — 21:00";

  let mapsUrl = settings?.maps_embed_url ||
    "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3988.4755982657825!2d36.95991517496623!3d-1.4865047984995294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMcKwMjknMTEuNCJTIDM2wrA1Nyc0NS4wIkU!5e0!3m2!1sen!2ske!4v1776975895111!5m2!1sen!2ske";

  // If user pasted the entire HTML snippet, extract just the URL
  if (mapsUrl.includes('<iframe') && mapsUrl.includes('src="')) {
    mapsUrl = mapsUrl.match(/src="([^"]+)"/)?.[1] || mapsUrl;
  }

  // Instagram preview images — null while loading so no Unsplash flash
  const igPreviews = [
    settings?.instagram_preview_1 ? getFileUrl(settings, settings.instagram_preview_1, '400x400') : null,
    settings?.instagram_preview_2 ? getFileUrl(settings, settings.instagram_preview_2, '400x400') : null,
    settings?.instagram_preview_3 ? getFileUrl(settings, settings.instagram_preview_3, '400x400') : null,
  ].filter(Boolean) as string[];

  // FAQs — show fallback only AFTER loading is complete and CMS has none
  const displayFaqs = faqsLoading ? [] : (faqs.length > 0 ? faqs : FALLBACK_FAQS);

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[35vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${heroUrl}")` }}
        >
          <div className="absolute inset-0 bg-espresso/60" />
        </div>
        <div className="relative z-10 text-center px-6">
          <FadeIn direction="up">
            <h1 className="text-white text-5xl md:text-[60px] font-display italic font-light">Get in Touch</h1>
          </FadeIn>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-24 md:py-32 bg-ivory">
        <div className="container mx-auto px-6 md:px-12 max-w-[1300px]">
          <div className="flex flex-col lg:flex-row gap-20 lg:gap-32">

            {/* LEFT — CONTACT FORM */}
            <div className="lg:w-[55%]">
              <FadeIn direction="right">
                <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body font-medium block mb-6">
                  SEND US A MESSAGE
                </span>

                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">Full Name</label>
                          <input required type="text" className="w-full bg-transparent border-b border-gold/20 py-3 font-body text-[15px] outline-none focus:border-gold transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">Email Address</label>
                          <input required type="email" className="w-full bg-transparent border-b border-gold/20 py-3 font-body text-[15px] outline-none focus:border-gold transition-colors" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">Phone</label>
                          <input type="tel" className="w-full bg-transparent border-b border-gold/20 py-3 font-body text-[15px] outline-none focus:border-gold transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">Subject</label>
                          <select className="w-full bg-transparent border-b border-gold/20 py-3 font-body text-[15px] outline-none focus:border-gold transition-colors">
                            <option>General Enquiry</option>
                            <option>Room Reservation</option>
                            <option>Special Occasion</option>
                            <option>Corporate Booking</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2 relative">
                        <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">Message</label>
                        <textarea
                          required
                          rows={5}
                          maxLength={maxMessageLength}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full bg-transparent border-b border-gold/20 py-3 font-body text-[15px] outline-none focus:border-gold transition-colors resize-none"
                          placeholder="Tell us how we can help..."
                        />
                        <div className="absolute bottom-[-24px] right-0 text-[10px] font-body text-charcoal/30">
                          {message.length} / {maxMessageLength} characters
                        </div>
                      </div>

                      <div className="pt-8">
                        <button
                          type="submit"
                          className="px-12 py-5 bg-gold text-white text-[13px] uppercase tracking-[0.2em] font-body font-medium hover:bg-gold-mid transition-all shadow-xl flex items-center gap-3"
                        >
                          Send Message <Send size={16} />
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gold/5 border border-gold/20 p-12 text-center"
                    >
                      <div className="w-20 h-20 rounded-full border border-gold flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="text-gold" size={40} />
                      </div>
                      <h3 className="text-2xl font-display italic text-charcoal mb-4">Message Sent Successfully</h3>
                      <p className="text-charcoal/60 font-body font-light text-[15px] max-w-sm mx-auto leading-relaxed">
                        Thank you for reaching out. A guest representative will review your inquiry and contact you within the next 24 hours.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-10 text-gold text-[12px] uppercase tracking-widest font-semibold border-b border-gold/40 hover:border-gold"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FadeIn>
            </div>

            {/* RIGHT — CONTACT INFO */}
            <div className="lg:w-[45%]">
              <FadeIn direction="left" delay={0.2}>
                <div className="space-y-12">

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex lg:inline-flex items-center justify-center gap-4 bg-[#25D366] text-white px-10 py-5 rounded-none hover:bg-[#1ebd5d] transition-all shadow-lg group w-full lg:w-auto"
                  >
                    <MessageCircle size={24} fill="currentColor" className="text-white" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-body tracking-widest leading-none mb-1 opacity-80">Quick support</p>
                      <p className="text-[14px] font-body font-medium tracking-[0.05em]">Chat via WhatsApp</p>
                    </div>
                  </a>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 text-gold mb-3">
                        <Phone size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-body font-medium">Call Us</span>
                      </div>
                      <p className="text-charcoal font-body text-[15px] font-light">{phone1}</p>
                      {phone2 && <p className="text-charcoal font-body text-[15px] font-light">{phone2}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 text-gold mb-3">
                        <Mail size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-body font-medium">Email Us</span>
                      </div>
                      <p className="text-charcoal font-body text-[15px] font-light">{email1}</p>
                      {email2 && <p className="text-charcoal font-body text-[15px] font-light">{email2}</p>}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5 pt-4">
                    <div className="flex items-center gap-3 text-gold mb-3">
                      <MapPin size={16} />
                      <span className="text-[10px] uppercase tracking-widest font-body font-medium">Location</span>
                    </div>
                    <p className="text-charcoal font-body text-[15px] font-light leading-relaxed">{address}</p>
                  </div>

                  {/* Business Hours */}
                  <div className="pt-4">
                    <div className="flex items-center gap-3 text-gold mb-6">
                      <Clock size={16} />
                      <span className="text-[10px] uppercase tracking-widest font-body font-medium">Business Hours</span>
                    </div>
                    <div className="border border-gold/10 overflow-hidden">
                      <table className="w-full text-[13px] font-body">
                        <tbody>
                          <tr className="border-b border-gold/10">
                            <td className="py-4 px-6 text-charcoal/50">Reception</td>
                            <td className="py-4 px-6 text-charcoal font-light text-right">{hoursReception}</td>
                          </tr>
                          <tr>
                            <td className="py-4 px-6 text-charcoal/50">Host Support</td>
                            <td className="py-4 px-6 text-charcoal font-light text-right">{hoursSupport}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Instagram Preview */}
                  {igPreviews.length > 0 && (
                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3 text-gold">
                          <Instagram size={16} />
                          <span className="text-[10px] uppercase tracking-widest font-body font-medium">Instagram</span>
                        </div>
                        <a href={igUrl} target="_blank" rel="noreferrer" className="text-gold text-[11px] font-body font-medium hover:underline">
                          @{igHandle}
                        </a>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {igPreviews.map((src, i) => (
                          <a key={i} href={igUrl} target="_blank" rel="noreferrer" className="aspect-square bg-espresso/10 overflow-hidden group block">
                            <img
                              src={src}
                              alt={`Instagram preview ${i + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* GOOGLE MAP */}
      <section className="w-full h-[450px] relative overflow-hidden bg-[#eee]">
        <div className="absolute inset-0 grayscale-[40%] sepia-[20%] opacity-80">
          <iframe
            title="Google Maps Location"
            src={mapsUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 md:py-32 bg-ivory">
        <div className="container mx-auto px-6 md:px-12 max-w-[900px]">
          <FadeIn className="text-center mb-16">
            <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body block mb-4">ASSISTANCE</span>
            <h2 className="text-charcoal text-4xl font-display italic font-light">Common Inquiries</h2>
          </FadeIn>

          <div className="space-y-2">
            {faqsLoading ? (
              // Skeleton rows while loading
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-b border-gold/10 py-6 animate-pulse">
                  <div className="h-4 bg-gold/10 rounded w-3/4" />
                </div>
              ))
            ) : (
              displayFaqs.map((faq, idx) => (
                <div key={faq.id}>
                  <FadeIn delay={idx * 0.08}>
                    <AccordionItem question={faq.question} answer={faq.answer} />
                  </FadeIn>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
