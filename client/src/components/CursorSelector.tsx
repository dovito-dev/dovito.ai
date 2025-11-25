import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, CircleDot, MousePointer2 } from "lucide-react";

export type CursorType = 'splash' | 'glass' | 'normal';

interface CursorSelectorProps {
  onCursorChange: (cursor: CursorType) => void;
  currentCursor: CursorType;
}

export default function CursorSelector({ onCursorChange, currentCursor }: CursorSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cursorOptions: { type: CursorType; icon: typeof Droplets; label: string }[] = [
    { type: 'splash', icon: Droplets, label: 'Splash Effect' },
    { type: 'glass', icon: CircleDot, label: 'Glass Lens' },
    { type: 'normal', icon: MousePointer2, label: 'Normal Cursor' },
  ];

  const currentOption = cursorOptions.find(opt => opt.type === currentCursor);

  return (
    <motion.div
      className="fixed right-6 top-[calc(50%+60px)] z-[9998]"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.2 }}
    >
      <div
        className="relative"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                <div className="text-xs text-white/60 mb-2 font-medium whitespace-nowrap">Special Cursors</div>
                <div className="flex flex-col gap-2">
                  {cursorOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = currentCursor === option.type;
                    return (
                      <motion.button
                        key={option.type}
                        onClick={() => onCursorChange(option.type)}
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all
                          ${isActive 
                            ? 'bg-primary/30 border border-primary/50 text-white' 
                            : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        data-testid={`cursor-option-${option.type}`}
                      >
                        <Icon size={14} />
                        {option.label}
                        {isActive && (
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-primary ml-auto"
                            layoutId="cursor-indicator"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-white/10 border-y-[4px] border-y-transparent" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className={`
            relative p-3 rounded-full backdrop-blur-sm border transition-all duration-300
            ${currentCursor !== 'normal'
              ? 'bg-primary/20 border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/50' 
              : 'bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:border-white/30'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Cursor effects"
          data-testid="cursor-selector-button"
        >
          {currentOption && <currentOption.icon size={16} />}
        </motion.button>
      </div>
    </motion.div>
  );
}
