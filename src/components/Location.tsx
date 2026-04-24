import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react";
import FadeIn from "./FadeIn";

export default function Location() {
  const contactDetails = [
    { 
      label: "Address", 
      value: "15 Peponi Road, Westlands, Nairobi, Kenya", 
      icon: MapPin 
    },
    { 
      label: "Phone", 
      value: "+254 700 000 000", 
      icon: Phone 
    },
    { 
      label: "Email", 
      value: "info@littleluxury.co.ke", 
      icon: Mail 
    },
    { 
      label: "Check-in / Check-out", 
      value: "2:00 PM | 11:00 AM", 
      icon: Clock 
    },
  ];

  return (
    <section id="contact" className="bg-ivory py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-[1300px]">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-0 bg-white shadow-xl lg:shadow-none overflow-hidden">
          {/* Map Column */}
          <div className="lg:w-[60%] relative h-[400px] lg:h-[600px] bg-[#eee]">
            <FadeIn className="h-full w-full">
              <iframe
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3988.4755982657825!2d36.95991517496623!3d-1.4865047984995294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMcKwMjknMTEuNCJTIDM2wrA1Nyc0NS4wIkU!5e0!3m2!1sen!2ske!4v1776975895111!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80"
              />
              {/* Custom Gold Pin Overlay (Centered in Map) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gold/20 animate-ping absolute" />
                  <div className="w-8 h-8 rounded-full bg-gold border-2 border-white shadow-lg relative flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-espresso" />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Contact Details Column */}
          <div className="lg:w-[40%] p-8 md:p-14 lg:p-20 flex flex-col justify-center">
            <FadeIn direction="left">
              <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-body font-light block mb-4">
                FIND US
              </span>
              <h2 className="text-charcoal text-4xl md:text-[40px] font-display italic font-light mb-12">
                Visit Little Luxury
              </h2>

              <div className="space-y-8 mb-12">
                {contactDetails.map((detail, index) => (
                  <div key={detail.label} className="group">
                    <div className="flex items-start gap-5">
                      <div className="mt-1">
                        <detail.icon size={18} strokeWidth={1.5} className="text-gold" />
                      </div>
                      <div>
                        <p className="text-gold text-[10px] uppercase tracking-[0.2em] font-body font-medium mb-1.5">
                          {detail.label}
                        </p>
                        <p className="text-charcoal text-[15px] font-body font-light leading-relaxed">
                          {detail.value}
                        </p>
                      </div>
                    </div>
                    {index < contactDetails.length - 1 && (
                      <div className="h-[1px] bg-gold-muted/20 w-full mt-8" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                <button className="px-8 py-3.5 border border-gold text-gold text-[12px] uppercase tracking-[0.15em] font-body font-medium hover:bg-gold hover:text-ivory transition-all duration-500">
                  Get Directions →
                </button>

                <div className="flex items-center gap-6">
                  {[Instagram, Facebook, Twitter].map((Icon, i) => (
                    <a key={i} href="#" className="text-gold hover:text-espresso transition-colors">
                      <Icon size={20} strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
