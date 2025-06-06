import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SplashEffect {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export default function SplashCursor() {
  const [splashes, setSplashes] = useState<SplashEffect[]>([]);

  const createSplash = useCallback((e: MouseEvent) => {
    const newSplash: SplashEffect = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now(),
    };

    setSplashes((prev) => [...prev, newSplash]);

    // Clean up after animation
    setTimeout(() => {
      setSplashes((prev) => prev.filter((splash) => splash.id !== newSplash.id));
    }, 1200);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      createSplash(e);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [createSplash]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence mode="popLayout">
        {splashes.map((splash) => (
          <motion.div
            key={splash.id}
            className="absolute"
            style={{
              left: splash.x,
              top: splash.y,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Main splash circle */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 80,
                height: 80,
                left: -40,
                top: -40,
                background: "radial-gradient(circle, rgba(96, 102, 255, 0.6) 0%, rgba(96, 102, 255, 0.3) 30%, rgba(96, 102, 255, 0.1) 60%, transparent 100%)",
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1.2, 2], opacity: [1, 0.7, 0] }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.3, 1],
              }}
            />
            
            {/* Secondary ripple */}
            <motion.div
              className="absolute rounded-full border-2 border-primary/40"
              style={{
                width: 60,
                height: 60,
                left: -30,
                top: -30,
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: [0, 1, 1.8], opacity: [0.8, 0.5, 0] }}
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
            />
            
            {/* Inner pulse */}
            <motion.div
              className="absolute rounded-full bg-primary/80"
              style={{
                width: 12,
                height: 12,
                left: -6,
                top: -6,
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: [1, 0.8, 0], opacity: [1, 0.8, 0] }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}