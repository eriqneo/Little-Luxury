import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { getFileUrl } from "../lib/pocketbase";
import { useSiteSettings } from "../hooks/useSiteSettings";

interface VirtualTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VirtualTourModal({ isOpen, onClose }: VirtualTourModalProps) {
  const { settings } = useSiteSettings();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const videoUrl = settings ? getFileUrl(settings, settings.virtual_tour_video || "") : "";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-espresso/95 backdrop-blur-md p-4 md:p-12"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-12 md:right-12 text-white/50 hover:text-white transition-colors p-2 z-10"
          >
            <X size={40} strokeWidth={1} />
          </button>

          {/* Video Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-6xl aspect-video relative shadow-2xl bg-black"
          >
            {videoUrl ? (
              <video
                src={videoUrl}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gold/40 space-y-4">
                <p className="font-display italic text-2xl">Cinematic Experience Loading...</p>
                <div className="w-12 h-[1px] bg-gold/20" />
              </div>
            )}
          </motion.div>

          {/* Footer Label */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <span className="text-gold/60 text-[10px] uppercase tracking-[0.4em] font-body block mb-2">
              LITTLE LUXURY NAIROBI
            </span>
            <span className="text-ivory/40 text-[12px] font-display italic">
              Virtual Property Tour
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
