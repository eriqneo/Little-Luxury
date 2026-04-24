import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if it's the first visit in this session
    const hasLoaded = sessionStorage.getItem("hasLoaded");
    if (hasLoaded) {
      setIsVisible(false);
      return;
    }

    const duration = 1500;
    const interval = 10;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("hasLoaded", "true");
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-espresso flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out pointer-events-none">
      <div className="relative flex flex-col items-center">
        {/* Monogram L */}
        <span className="text-gold font-display italic text-[100px] leading-none mb-8 animate-pulse">
          L
        </span>
        
        {/* Progress Bar Container */}
        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
          {/* Animated Gold Progress Bar */}
          <div 
            className="absolute top-0 left-0 h-full bg-gold transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
