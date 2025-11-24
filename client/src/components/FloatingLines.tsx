import { useEffect, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

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
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
}

const defaultGradient = [
  '#8B5CF6', '#A78BFA', '#C4B5FD', '#7C3AED',
  '#6D28D9', '#5B21B6', '#9333EA', '#A855F7'
];

export default function FloatingLines({
  linesGradient = defaultGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = 6,
  lineDistance = 5,
  topWavePosition = { x: 0, y: 2, rotate: 0.2 },
  middleWavePosition = { x: 0, y: 0, rotate: 0 },
  bottomWavePosition = { x: 0, y: -2, rotate: -0.2 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 10.0,
  bendStrength = -5.0,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'normal',
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number | null>(null);
  const wavesRef = useRef<THREE.Group[]>([]);
  const [webglSupported, setWebglSupported] = useState(true);

  const lineCounts = useMemo(() => {
    if (Array.isArray(lineCount)) return lineCount;
    return [lineCount, lineCount, lineCount];
  }, [lineCount]);

  const lineDistances = useMemo(() => {
    if (Array.isArray(lineDistance)) return lineDistance;
    return [lineDistance, lineDistance, lineDistance];
  }, [lineDistance]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
    } catch (e) {
      console.warn('WebGL not supported, FloatingLines disabled');
      setWebglSupported(false);
      return;
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    const waveConfigs = [
      { name: 'top', position: topWavePosition, index: 0 },
      { name: 'middle', position: middleWavePosition, index: 1 },
      { name: 'bottom', position: bottomWavePosition, index: 2 },
    ];

    wavesRef.current = [];

    waveConfigs.forEach((config) => {
      if (!enabledWaves.includes(config.name as 'top' | 'middle' | 'bottom')) return;

      const waveGroup = new THREE.Group();
      const count = lineCounts[config.index] || 6;
      const distance = lineDistances[config.index] || 5;
      const spacing = distance / 20;

      for (let i = 0; i < count; i++) {
        const points: THREE.Vector3[] = [];
        const segments = 200;

        for (let j = 0; j <= segments; j++) {
          const x = (j / segments) * 40 - 20;
          const y = 0;
          const z = 0;
          points.push(new THREE.Vector3(x, y, z));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const colorIndex = i % linesGradient.length;
        const color = new THREE.Color(linesGradient[colorIndex]);
        
        const material = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.7,
        });

        const line = new THREE.Line(geometry, material);
        line.position.y = (i - (count - 1) / 2) * spacing;
        line.userData = { 
          originalY: line.position.y,
          index: i,
          phase: i * 0.5,
        };
        waveGroup.add(line);
      }

      waveGroup.position.x = config.position.x;
      waveGroup.position.y = config.position.y;
      waveGroup.rotation.z = config.position.rotate;
      waveGroup.userData = { name: config.name };

      scene.add(waveGroup);
      wavesRef.current.push(waveGroup);
    });

    const handleMouseMove = (event: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        targetMouseRef.current = {
          x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
          y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
        };
      }
    };

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);

    let time = 0;

    const animate = () => {
      time += 0.01 * animationSpeed;

      if (interactive) {
        mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * mouseDamping;
        mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * mouseDamping;
      }

      wavesRef.current.forEach((waveGroup, waveIndex) => {
        if (parallax) {
          const parallaxOffset = parallaxStrength * (waveIndex + 1);
          const targetX = mouseRef.current.x * parallaxOffset;
          waveGroup.position.x += (targetX - waveGroup.position.x) * 0.05;
        }

        waveGroup.children.forEach((child) => {
          if (child instanceof THREE.Line) {
            const line = child;
            const geometry = line.geometry as THREE.BufferGeometry;
            const positions = geometry.attributes.position;
            const userData = line.userData;

            for (let i = 0; i < positions.count; i++) {
              const x = positions.getX(i);
              
              let waveY = Math.sin(x * 0.15 + time + userData.phase) * 0.8;
              waveY += Math.sin(x * 0.1 + time * 0.5 + userData.phase * 2) * 0.4;
              waveY += Math.sin(x * 0.05 + time * 0.3) * 0.2;

              if (interactive && bendRadius > 0) {
                const worldX = x;
                const worldY = userData.originalY;
                const mouseWorldX = mouseRef.current.x * 10;
                const mouseWorldY = mouseRef.current.y * 5;
                const dx = mouseWorldX - worldX;
                const dy = mouseWorldY - worldY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < bendRadius) {
                  const influence = Math.pow(1 - dist / bendRadius, 2);
                  waveY += influence * bendStrength * 0.5;
                }
              }

              positions.setY(i, waveY + userData.originalY);
            }

            positions.needsUpdate = true;
          }
        });
      });

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      
      wavesRef.current.forEach((wave) => {
        wave.children.forEach((child) => {
          if (child instanceof THREE.Line) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
      });
      
      renderer.dispose();
    };
  }, [
    enabledWaves,
    lineCounts,
    lineDistances,
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

  if (!webglSupported) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      data-testid="floating-lines-container"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ mixBlendMode, opacity: 0.6 }}
        data-testid="floating-lines-canvas"
      />
    </div>
  );
}
