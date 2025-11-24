import { useEffect, useRef, useState } from 'react';

interface WavePosition {
  x: number;
  y: number;
  rotate: number;
}

interface FloatingLinesProps {
  linesGradient?: string[];
  enabledWaves?: Array<'top' | 'middle' | 'bottom'>;
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
}

const defaultGradient = [
  '#06b6d4', '#0ea5e9', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#14b8a6', '#22d3ee'
];

export default function FloatingLines({
  linesGradient = defaultGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = 6,
  lineDistance = 5,
  topWavePosition = { x: 0, y: -150, rotate: -5 },
  middleWavePosition = { x: 0, y: 100, rotate: 3 },
  bottomWavePosition = { x: 0, y: 250, rotate: -2 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 10.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
}: FloatingLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const padding = 60;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    setIsReady(true);

    const getLineCount = (index: number): number => {
      if (Array.isArray(lineCount)) return lineCount[index] || 4;
      return lineCount;
    };

    const getLineDistance = (index: number): number => {
      if (Array.isArray(lineDistance)) return lineDistance[index] || 5;
      return lineDistance;
    };

    const waveConfigs = [
      { name: 'top' as const, position: topWavePosition, index: 0 },
      { name: 'middle' as const, position: middleWavePosition, index: 1 },
      { name: 'bottom' as const, position: bottomWavePosition, index: 2 },
    ].filter(w => enabledWaves.includes(w.name));

    let time = 0;

    const drawWaveLine = (
      yOffset: number,
      color: string,
      phase: number,
      amplitude: number,
      frequency: number,
      thickness: number,
      rotation: number,
      xOffset: number,
      mouseX: number,
      mouseY: number
    ) => {
      const usableHeight = height - padding * 2;
      const centerY = padding + usableHeight / 2 + yOffset;
      const centerX = width / 2 + xOffset;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const segments = 200;
      const influenceRadius = bendRadius * 30;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = padding + t * (width - padding * 2);
        const normalizedX = t;
        
        let y = centerY;
        y += Math.sin(normalizedX * frequency * Math.PI + time + phase) * amplitude;
        y += Math.sin(normalizedX * frequency * 0.5 * Math.PI + time * 0.7 + phase * 1.3) * amplitude * 0.4;
        y += Math.sin(normalizedX * frequency * 0.3 * Math.PI + time * 0.4 + phase * 0.7) * amplitude * 0.2;

        if (interactive && mouseX > 0 && mouseY > 0) {
          const dx = x - mouseX;
          const dy = y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < influenceRadius && distance > 0) {
            const force = (1 - distance / influenceRadius);
            const smoothForce = force * force * force;
            const pushStrength = smoothForce * bendStrength * 150;
            
            const normalizedDy = dy / distance;
            y += normalizedDy * Math.abs(pushStrength);
          }
        }

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.012 * animationSpeed;

      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * mouseDamping;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * mouseDamping;

      ctx.save();
      
      if (parallax && mouseRef.current.x > 0) {
        const parallaxX = (mouseRef.current.x / width - 0.5) * parallaxStrength * 20;
        ctx.translate(parallaxX, 0);
      }

      waveConfigs.forEach((wave) => {
        const count = getLineCount(wave.index);
        const distance = getLineDistance(wave.index);

        for (let i = 0; i < count; i++) {
          const colorIndex = (wave.index * 2 + i) % linesGradient.length;
          const color = linesGradient[colorIndex];
          
          const lineOffset = (i - (count - 1) / 2) * distance;
          const yPos = wave.position.y + lineOffset;
          
          const baseAmplitude = 40 + i * 6;
          const frequency = 1.8 + i * 0.15;
          const phase = wave.index * 2 + i * 0.5;
          const thickness = 2.2 - i * 0.15;

          ctx.save();
          ctx.shadowColor = color;
          ctx.shadowBlur = 20;
          ctx.globalAlpha = 0.95;

          drawWaveLine(
            yPos,
            color,
            phase,
            baseAmplitude,
            frequency,
            Math.max(1.5, thickness),
            wave.position.rotate,
            wave.position.x,
            mouseRef.current.x,
            mouseRef.current.y
          );

          ctx.shadowBlur = 45;
          ctx.globalAlpha = 0.2;
          drawWaveLine(
            yPos,
            color,
            phase,
            baseAmplitude,
            frequency,
            Math.max(1.5, thickness) * 5,
            wave.position.rotate,
            wave.position.x,
            mouseRef.current.x,
            mouseRef.current.y
          );

          ctx.restore();
        }
      });

      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      targetMouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('resize', resize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationRef.current);
    };
  }, [
    enabledWaves,
    lineCount,
    lineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    mouseDamping,
    parallax,
    parallaxStrength,
    linesGradient,
  ]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      data-testid="floating-lines-container"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
        data-testid="floating-lines-canvas"
      />
    </div>
  );
}
