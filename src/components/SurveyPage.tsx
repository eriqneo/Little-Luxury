import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, CheckCircle2, ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FadeIn from "./FadeIn";
import { pb } from "../lib/pocketbase";

export default function SurveyPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    quote: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    setLoading(true);

    try {
      await pb.collection('testimonials').create({
        guest_name: formData.name,
        location: formData.location,
        quote: formData.quote,
        rating: rating,
        is_published: false,
      });
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Survey submission failed", err);
      alert("There was an issue submitting your review. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      
      {/* Hero / Header Section */}
      <section className="relative pt-40 pb-20 bg-espresso overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <FadeIn>
            <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body font-light block mb-6">
              Guest Feedback
            </span>
            <h1 className="text-ivory text-5xl md:text-7xl font-display italic font-light mb-8">
              Share Your Experience
            </h1>
            <p className="text-ivory/60 font-body font-light text-lg max-w-2xl mx-auto leading-relaxed">
              Your insights allow us to refine the art of quietude. Thank you for being a part of the Little Luxury story.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-[800px]">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-8 md:p-16 shadow-xl border border-gold/5"
              >
                <form onSubmit={handleSubmit} className="space-y-12">
                  {/* Star Rating Selector */}
                  <div className="text-center space-y-4">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-gold font-body font-medium block">
                      Overall Rating
                    </label>
                    <div className="flex justify-center gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110 active:scale-95 p-1"
                        >
                          <Star
                            size={32}
                            strokeWidth={1}
                            className={`transition-colors duration-300 ${
                              (hoverRating || rating) >= star
                                ? "fill-gold text-gold"
                                : "text-gold/30"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-transparent border-b border-gold/20 py-3 font-body text-[15px] outline-none focus:border-gold transition-colors"
                        placeholder="E.g. Alexander Knight"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">
                        Your Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-transparent border-b border-gold/20 py-3 font-body text-[15px] outline-none focus:border-gold transition-colors"
                        placeholder="E.g. Nairobi, Kenya"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-body font-medium">
                      Your Thoughts
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.quote}
                      onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                      className="w-full bg-transparent border-b border-gold/20 py-3 font-body text-[15px] outline-none focus:border-gold transition-colors resize-none"
                      placeholder="Tell us about your stay, the service, or what made it special..."
                    />
                  </div>

                  <div className="pt-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
                    <Link
                      to="/"
                      className="text-charcoal/40 text-[11px] uppercase tracking-widest font-body hover:text-gold transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft size={14} /> Back to Home
                    </Link>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-12 py-5 bg-gold text-white text-[13px] uppercase tracking-[0.2em] font-body font-medium hover:bg-gold-mid transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Submitting..." : (
                        <>
                          Submit Review <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 md:p-24 text-center shadow-xl border border-gold/5"
              >
                <div className="w-24 h-24 rounded-full border border-gold flex items-center justify-center mx-auto mb-10">
                  <CheckCircle2 className="text-gold" size={48} />
                </div>
                <h2 className="text-4xl font-display italic text-charcoal mb-6">
                  Thank You
                </h2>
                <p className="text-charcoal/60 font-body font-light text-[17px] max-w-md mx-auto leading-relaxed mb-12">
                  Your feedback has been received. We review every submission personally as part of our commitment to excellence.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    to="/"
                    className="px-10 py-4 bg-gold text-white text-[12px] uppercase tracking-widest font-body font-medium hover:bg-gold-mid transition-all shadow-lg"
                  >
                    Return Home
                  </Link>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setRating(0);
                      setFormData({ name: "", location: "", quote: "" });
                    }}
                    className="px-10 py-4 border border-gold text-gold text-[12px] uppercase tracking-widest font-body font-medium hover:bg-gold hover:text-white transition-all"
                  >
                    Write Another
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
