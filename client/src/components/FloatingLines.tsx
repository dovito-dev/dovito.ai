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

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
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
      mouseInfluence: { x: number; y: number }
    ) => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
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

      const segments = 150;
      const extendedWidth = width * 1.5;

      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * extendedWidth - extendedWidth * 0.25;
        const normalizedX = x / width;
        
        let y = centerY;
        y += Math.sin(normalizedX * frequency * Math.PI + time + phase) * amplitude;
        y += Math.sin(normalizedX * frequency * 0.5 * Math.PI + time * 0.7 + phase) * amplitude * 0.5;
        y += Math.sin(normalizedX * frequency * 0.25 * Math.PI + time * 0.3) * amplitude * 0.25;

        if (interactive && bendRadius > 0) {
          const dx = mouseInfluence.x - x;
          const dy = mouseInfluence.y - (y - centerY + height / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = bendRadius * 30;
          
          if (dist < radius) {
            const influence = Math.pow(1 - dist / radius, 2);
            y += influence * bendStrength * 100 * Math.sign(dy);
          }
        }

        if (parallax) {
          const parallaxOffset = (mouseInfluence.x / width - 0.5) * parallaxStrength * 50;
          y += parallaxOffset * (1 - Math.abs(normalizedX - 0.5) * 2) * 0.5;
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
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      time += 0.015 * animationSpeed;

      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * mouseDamping;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * mouseDamping;

      waveConfigs.forEach((wave) => {
        const count = getLineCount(wave.index);
        const distance = getLineDistance(wave.index);

        for (let i = 0; i < count; i++) {
          const colorIndex = i % linesGradient.length;
          const color = linesGradient[colorIndex];
          
          const lineOffset = (i - (count - 1) / 2) * distance;
          const yPos = wave.position.y + lineOffset;
          
          const baseAmplitude = 80 + i * 10;
          const frequency = 2 + i * 0.3;
          const phase = i * 0.8;
          const thickness = 3 - i * 0.3;

          ctx.shadowColor = color;
          ctx.shadowBlur = 20;

          drawWaveLine(
            yPos,
            color,
            phase,
            baseAmplitude,
            frequency,
            Math.max(1.5, thickness),
            wave.position.rotate,
            wave.position.x,
            mouseRef.current
          );

          ctx.shadowBlur = 40;
          ctx.globalAlpha = 0.3;
          drawWaveLine(
            yPos,
            color,
            phase,
            baseAmplitude,
            frequency,
            Math.max(1.5, thickness) * 3,
            wave.position.rotate,
            wave.position.x,
            mouseRef.current
          );
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener('resize', resize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
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
