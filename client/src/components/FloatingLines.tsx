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
  '#00d4ff', '#7b68ee', '#9945ff', '#14f195',
  '#00bcd4', '#8b5cf6', '#c084fc', '#06b6d4'
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
  mouseDamping = 0.08,
  parallax = true,
  parallaxStrength = 0.2,
}: FloatingLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const targetMouseRef = useRef({ x: -1000, y: -1000 });
  const smoothMouseRef = useRef({ x: -1000, y: -1000 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

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

    const easeOutQuad = (t: number): number => 1 - (1 - t) * (1 - t);

    const drawWaveLine = (
      yOffset: number,
      color: string,
      phase: number,
      amplitude: number,
      frequency: number,
      thickness: number,
      rotation: number,
      xOffset: number
    ) => {
      const centerY = height / 2 + yOffset;
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
      const extendedWidth = width * 1.6;
      const startX = -extendedWidth * 0.3;

      for (let i = 0; i <= segments; i++) {
        const x = startX + (i / segments) * extendedWidth;
        const normalizedX = (x + width * 0.3) / width;
        
        let y = centerY;
        y += Math.sin(normalizedX * frequency * Math.PI + time + phase) * amplitude;
        y += Math.sin(normalizedX * frequency * 0.5 * Math.PI + time * 0.7 + phase * 1.3) * amplitude * 0.4;
        y += Math.sin(normalizedX * frequency * 0.3 * Math.PI + time * 0.4 + phase * 0.7) * amplitude * 0.2;

        if (interactive) {
          const mouseX = smoothMouseRef.current.x;
          const mouseY = smoothMouseRef.current.y;
          
          if (mouseX > 0 && mouseY > 0) {
            const cosR = Math.cos((rotation * Math.PI) / 180);
            const sinR = Math.sin((rotation * Math.PI) / 180);
            
            const rotatedX = centerX + (x - centerX) * cosR - (y - centerY) * sinR;
            const rotatedY = centerY + (x - centerX) * sinR + (y - centerY) * cosR;
            
            const dx = mouseX - rotatedX;
            const dy = mouseY - rotatedY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = bendRadius * 25;
            
            if (dist < radius) {
              const normalizedDist = dist / radius;
              const influence = easeOutQuad(1 - normalizedDist);
              const bendAmount = influence * bendStrength * 80;
              y += bendAmount;
            }
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

      if (interactive) {
        mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * mouseDamping;
        mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * mouseDamping;
        
        smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.15;
        smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.15;
      }

      if (parallax && smoothMouseRef.current.x > 0) {
        const parallaxX = (smoothMouseRef.current.x / width - 0.5) * parallaxStrength * 30;
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
          
          const baseAmplitude = 60 + i * 8;
          const frequency = 1.8 + i * 0.2;
          const phase = wave.index * 2 + i * 0.6;
          const thickness = 2.5 - i * 0.2;

          ctx.save();
          ctx.shadowColor = color;
          ctx.shadowBlur = 25;
          ctx.globalAlpha = 0.9;

          drawWaveLine(
            yPos,
            color,
            phase,
            baseAmplitude,
            frequency,
            Math.max(1.5, thickness),
            wave.position.rotate,
            wave.position.x
          );

          ctx.shadowBlur = 50;
          ctx.globalAlpha = 0.25;
          drawWaveLine(
            yPos,
            color,
            phase,
            baseAmplitude,
            frequency,
            Math.max(1.5, thickness) * 4,
            wave.position.rotate,
            wave.position.x
          );

          ctx.restore();
        }
      });

      ctx.setTransform(Math.min(window.devicePixelRatio, 2), 0, 0, Math.min(window.devicePixelRatio, 2), 0, 0);

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        targetMouseRef.current = { x, y };
      }
    };

    const handleMouseLeave = () => {
      targetMouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('resize', resize);
    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
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
