import { useEffect, useState } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export default function SplashCursor() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const addRipple = (e: MouseEvent) => {
      const size = Math.random() * 100 + 100;
      const newRipple: Ripple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        size,
      };

      setRipples((prevRipples) => [...prevRipples, newRipple]);

      setTimeout(() => {
        setRipples((prevRipples) =>
          prevRipples.filter((ripple) => ripple.id !== newRipple.id)
        );
      }, 600);
    };

    document.addEventListener("click", addRipple);

    return () => {
      document.removeEventListener("click", addRipple);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full animate-ping"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            background: "radial-gradient(circle, rgba(96, 102, 255, 0.6) 0%, transparent 70%)",
            animationDuration: "0.6s",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          }}
        />
      ))}
    </div>
  );
}