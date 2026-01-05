import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play } from "lucide-react";

interface AnimationToggleProps {
  onToggle: (enabled: boolean) => void;
}

export default function AnimationToggle({ onToggle }: AnimationToggleProps) {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check for user's preference from localStorage
    const savedPreference = localStorage.getItem('animations-enabled');
    if (savedPreference !== null) {
      const enabled = savedPreference === 'true';
      setAnimationsEnabled(enabled);
      onToggle(enabled);
    }
  }, [onToggle]);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('home');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsVisible(window.scrollY < heroBottom - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggle = () => {
    const newState = !animationsEnabled;
    setAnimationsEnabled(newState);
    onToggle(newState);
    localStorage.setItem('animations-enabled', newState.toString());
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[9998]"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: 2 }}
    >
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-sm text-white/90">
                {animationsEnabled ? 'Disable animations' : 'Enable animations'}
                <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-white/10 border-y-[4px] border-y-transparent" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          onClick={handleToggle}
          className={`
            relative p-3 rounded-full backdrop-blur-sm border transition-all duration-300
            ${animationsEnabled 
              ? 'bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:border-white/30' 
              : 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30 hover:border-red-500/50'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={animationsEnabled ? 'Disable animations' : 'Enable animations'}
        >
          <motion.div
            initial={false}
            animate={{ rotate: animationsEnabled ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {animationsEnabled ? (
              <Pause size={16} />
            ) : (
              <Play size={16} />
            )}
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
}