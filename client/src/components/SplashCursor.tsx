import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Splash {
  id: number;
  x: number;
  y: number;
}

export default function SplashCursor() {
  const [splashes, setSplashes] = useState<Splash[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const lastSplashTime = useRef(0);
  const splashInterval = 100; // Create splash every 100ms while moving

  const createSplash = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastSplashTime.current < splashInterval) return;
    
    lastSplashTime.current = now;
    
    const newSplash: Splash = {
      id: now + Math.random(),
      x,
      y,
    };

    setSplashes((prev) => [...prev, newSplash]);

    // Clean up after animation
    setTimeout(() => {
      setSplashes((prev) => prev.filter((splash) => splash.id !== newSplash.id));
    }, 1000);
  }, []);

  useEffect(() => {
    let animationFrame: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create splash on movement
      createSplash(e.clientX, e.clientY);
    };

    const handleMouseEnter = () => {
      document.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseLeave = () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };

    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    // Start tracking immediately if mouse is already over the document
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [createSplash]);

  return (
    <>
      {/* Mouse follower dot */}
      <motion.div
        className="fixed pointer-events-none z-[9998] w-2 h-2 bg-primary/60 rounded-full mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      />
      
      {/* Splash effects */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        <AnimatePresence>
          {splashes.map((splash) => (
            <motion.div
              key={splash.id}
              className="absolute w-8 h-8 rounded-full"
              style={{
                left: splash.x - 16,
                top: splash.y - 16,
                background: "radial-gradient(circle, rgba(96, 102, 255, 0.4) 0%, rgba(96, 102, 255, 0.2) 50%, transparent 70%)",
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ scale: 4, opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}