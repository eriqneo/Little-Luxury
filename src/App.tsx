import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Introduction from "./components/Introduction";
import FeaturesStrip from "./components/FeaturesStrip";
import Rooms from "./components/Rooms";
import Amenities from "./components/Amenities";
import Testimonials from "./components/Testimonials";
import BookingSection from "./components/BookingSection";
import Gallery from "./components/Gallery";
import Location from "./components/Location";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import StickyBooking from "./components/StickyBooking";
import CookieBanner from "./components/CookieBanner";
import FadeIn from "./components/FadeIn";
import RoomsPage from "./components/RoomsPage";
import BookingPage from "./components/BookingPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import GalleryPage from "./components/GalleryPage";

function HomePage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      
      <main>
        <Hero />
        
        <Introduction />
        
        <FeaturesStrip />

        <Rooms />

        <Amenities />

        <Testimonials />

        <BookingSection />

        <Gallery />

        <Location />

        {/* Final CTA / Quote */}
        <section className="py-40 bg-espresso text-center">
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="max-w-3xl mx-auto">
                <blockquote className="text-gold-muted text-3xl md:text-5xl font-display italic leading-snug mb-12">
                  "In every walk with nature, one receives far more than he seeks. Little Luxury is where that seeking finds its rest."
                </blockquote>
                <div className="w-12 h-[1px] bg-gold mx-auto mb-8" />
                <span className="text-ivory text-[12px] uppercase tracking-[0.4em] font-body">
                  Book Your Sanctuary
                </span>
                <div className="mt-12">
                  <Link 
                    to="/booking"
                    className="inline-block px-12 py-5 bg-gold text-charcoal text-[13px] uppercase tracking-[0.2em] font-body hover:bg-ivory transition-colors duration-500 shadow-xl"
                  >
                    Check Availability
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LoadingScreen />
      <StickyBooking />
      <CookieBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}
