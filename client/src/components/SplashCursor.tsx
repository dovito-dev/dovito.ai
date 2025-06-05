import { useEffect, useState } from "react";

interface SplashElement {
  id: number;
  x: number;
  y: number;
}

export default function SplashCursor() {
  const [splashes, setSplashes] = useState<SplashElement[]>([]);

  useEffect(() => {
    let splashId = 0;

    const handleClick = (e: MouseEvent) => {
      const newSplash: SplashElement = {
        id: splashId++,
        x: e.clientX,
        y: e.clientY,
      };

      setSplashes(prev => [...prev, newSplash]);

      // Remove splash after animation completes
      setTimeout(() => {
        setSplashes(prev => prev.filter(splash => splash.id !== newSplash.id));
      }, 600);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      {splashes.map(splash => (
        <div
          key={splash.id}
          className="splash-cursor"
          style={{
            left: splash.x,
            top: splash.y,
          }}
        />
      ))}
    </>
  );
}