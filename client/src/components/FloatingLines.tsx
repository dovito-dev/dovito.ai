import { useEffect, useRef, useMemo } from 'react';
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
  '#ff0000', '#ff7700', '#ffdd00', '#00ff00',
  '#0099ff', '#6600ff', '#ff00ff', '#ff0066'
];

export default function FloatingLines({
  linesGradient = defaultGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = 6,
  lineDistance = 5,
  topWavePosition = { x: 0, y: 0.8, rotate: 0.3 },
  middleWavePosition = { x: 0, y: 0, rotate: 0 },
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 10.0,
  bendStrength = -5.0,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'screen',
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number | null>(null);
  const wavesRef = useRef<THREE.Group[]>([]);

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

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
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

      for (let i = 0; i < count; i++) {
        const points: THREE.Vector3[] = [];
        const segments = 100;

        for (let j = 0; j <= segments; j++) {
          const x = (j / segments) * 20 - 10;
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
          opacity: 0.8,
          linewidth: 2,
        });

        const line = new THREE.Line(geometry, material);
        line.position.y = (i - count / 2) * (distance / 100);
        line.userData = { 
          originalY: line.position.y,
          index: i,
          phase: Math.random() * Math.PI * 2,
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
      targetMouseRef.current = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);

    let time = 0;

    const animate = () => {
      time += 0.016 * animationSpeed;

      if (interactive) {
        mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * mouseDamping;
        mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * mouseDamping;
      }

      wavesRef.current.forEach((waveGroup, waveIndex) => {
        if (parallax) {
          const parallaxOffset = parallaxStrength * (waveIndex + 1) * 0.3;
          waveGroup.position.x += (mouseRef.current.x * parallaxOffset - waveGroup.position.x) * 0.02;
        }

        waveGroup.children.forEach((child) => {
          if (child instanceof THREE.Line) {
            const line = child;
            const geometry = line.geometry as THREE.BufferGeometry;
            const positions = geometry.attributes.position;
            const userData = line.userData;

            for (let i = 0; i < positions.count; i++) {
              const x = positions.getX(i);
              
              let waveY = Math.sin(x * 0.5 + time + userData.phase) * 0.3;
              waveY += Math.sin(x * 0.3 + time * 0.7 + userData.phase) * 0.2;

              if (interactive) {
                const worldX = x + waveGroup.position.x;
                const worldY = userData.originalY + waveGroup.position.y;
                const dx = mouseRef.current.x * 5 - worldX;
                const dy = mouseRef.current.y * 3 - worldY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < bendRadius) {
                  const influence = 1 - dist / bendRadius;
                  const bend = influence * influence * bendStrength * 0.1;
                  waveY += bend * (dy > 0 ? 1 : -1);
                }
              }

              positions.setY(i, waveY);
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
        container.removeEventListener('mousemove', handleMouseMove);
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

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      data-testid="floating-lines-container"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ mixBlendMode }}
        data-testid="floating-lines-canvas"
      />
    </div>
  );
}
