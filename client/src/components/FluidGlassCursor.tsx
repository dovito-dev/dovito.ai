import { useEffect, useRef, RefObject } from 'react';

interface FluidGlassCursorProps {
  activeAreaRef?: RefObject<HTMLElement>;
  size?: number;
  blur?: number;
  distortion?: number;
  color?: string;
}

export default function FluidGlassCursor({
  activeAreaRef,
  size = 120,
  blur = 8,
  distortion = 0.15,
  color = 'rgba(148, 166, 255, 0.1)'
}: FluidGlassCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isActiveRef = useRef(true);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      if (activeAreaRef?.current) {
        const rect = activeAreaRef.current.getBoundingClientRect();
        isActiveRef.current = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
      }
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      if (!ctx || !canvas) return;

      const lerp = 0.15;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * lerp;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * lerp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isActiveRef.current) {
        const x = mouseRef.current.x;
        const y = mouseRef.current.y;
        const radius = size / 2;
        const time = Date.now() * 0.002;

        ctx.save();

        const gradient = ctx.createRadialGradient(
          x - radius * 0.3, y - radius * 0.3, 0,
          x, y, radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        gradient.addColorStop(0.3, color);
        gradient.addColorStop(0.7, 'rgba(148, 166, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        const innerGradient = ctx.createRadialGradient(
          x - radius * 0.2, y - radius * 0.2, 0,
          x, y, radius * 0.6
        );
        innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        innerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        innerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = innerGradient;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, radius - 1, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        const highlightX = x - radius * 0.35;
        const highlightY = y - radius * 0.35;
        const highlightRadius = radius * 0.25;
        
        const highlightGradient = ctx.createRadialGradient(
          highlightX, highlightY, 0,
          highlightX, highlightY, highlightRadius
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.ellipse(highlightX, highlightY, highlightRadius, highlightRadius * 0.6, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = highlightGradient;
        ctx.fill();

        const numRays = 6;
        for (let i = 0; i < numRays; i++) {
          const angle = (i / numRays) * Math.PI * 2 + time;
          const rayLength = radius * (0.3 + Math.sin(time * 2 + i) * 0.1);
          
          const rayGradient = ctx.createLinearGradient(
            x, y,
            x + Math.cos(angle) * rayLength,
            y + Math.sin(angle) * rayLength
          );
          rayGradient.addColorStop(0, 'rgba(148, 166, 255, 0.2)');
          rayGradient.addColorStop(1, 'rgba(148, 166, 255, 0)');

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(angle) * rayLength,
            y + Math.sin(angle) * rayLength
          );
          ctx.strokeStyle = rayGradient;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeAreaRef, size, color]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
