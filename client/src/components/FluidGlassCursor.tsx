/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect, RefObject, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';

interface FluidGlassCursorProps {
  activeAreaRef?: RefObject<HTMLElement>;
  size?: number;
  distortion?: number;
  color?: string;
}

const GlassShader = {
  uniforms: {
    time: { value: 0 },
    resolution: { value: new THREE.Vector2() },
    distortion: { value: 0.3 },
    glassColor: { value: new THREE.Color('#94a6ff') },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec2 resolution;
    uniform float distortion;
    uniform vec3 glassColor;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);
      
      float rim = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
      
      vec3 refractColor = glassColor * (0.3 + 0.2 * sin(time * 2.0));
      
      float iridescence = sin(vUv.x * 10.0 + time) * 0.1 + 
                          cos(vUv.y * 8.0 - time * 0.5) * 0.1;
      
      vec3 finalColor = mix(
        refractColor,
        vec3(1.0),
        fresnel * 0.6 + rim * 0.3
      );
      
      finalColor += vec3(0.2, 0.3, 0.5) * iridescence;
      
      float alpha = 0.4 + fresnel * 0.4 + rim * 0.2;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

function GlassLens({ 
  mousePos,
  distortion = 0.3,
  color = '#94a6ff'
}: { 
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  distortion?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, camera } = useThree();

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        distortion: { value: distortion },
        glassColor: { value: new THREE.Color(color) },
      },
      vertexShader: GlassShader.vertexShader,
      fragmentShader: GlassShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [distortion, color]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const v = viewport.getCurrentViewport(camera, [0, 0, 5]);
    
    const destX = (mousePos.current.x / window.innerWidth) * 2 - 1;
    const destY = -((mousePos.current.y / window.innerHeight) * 2 - 1);
    
    const targetX = (destX * v.width) / 2;
    const targetY = (destY * v.height) / 2;

    easing.damp3(meshRef.current.position, [targetX, targetY, 5], 0.08, delta);

    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.z += delta * 0.2;

    if (shaderMaterial.uniforms) {
      shaderMaterial.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} scale={0.5} material={shaderMaterial}>
      <torusGeometry args={[1, 0.35, 64, 128]} />
    </mesh>
  );
}

function InnerRing({ 
  mousePos,
  color = '#94a6ff'
}: { 
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, camera } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const v = viewport.getCurrentViewport(camera, [0, 0, 5]);
    
    const destX = (mousePos.current.x / window.innerWidth) * 2 - 1;
    const destY = -((mousePos.current.y / window.innerHeight) * 2 - 1);
    
    const targetX = (destX * v.width) / 2;
    const targetY = (destY * v.height) / 2;

    easing.damp3(meshRef.current.position, [targetX, targetY, 5.1], 0.12, delta);

    meshRef.current.rotation.x -= delta * 0.4;
    meshRef.current.rotation.y -= delta * 0.6;
  });

  return (
    <mesh ref={meshRef} scale={0.35}>
      <torusGeometry args={[0.6, 0.15, 32, 64]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.1}
        roughness={0.1}
        transmission={0.9}
        thickness={0.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function GlowSphere({ 
  mousePos,
  color = '#94a6ff'
}: { 
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, camera } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const v = viewport.getCurrentViewport(camera, [0, 0, 5]);
    
    const destX = (mousePos.current.x / window.innerWidth) * 2 - 1;
    const destY = -((mousePos.current.y / window.innerHeight) * 2 - 1);
    
    const targetX = (destX * v.width) / 2;
    const targetY = (destY * v.height) / 2;

    easing.damp3(meshRef.current.position, [targetX, targetY, 4.9], 0.06, delta);

    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 0.2;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

export default function FluidGlassCursor({
  activeAreaRef,
  size = 120,
  distortion = 0.3,
  color = '#94a6ff'
}: FluidGlassCursorProps) {
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isActive, setIsActive] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (activeAreaRef?.current) {
        const rect = activeAreaRef.current.getBoundingClientRect();
        const inArea = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
        setIsActive(inArea);
      } else {
        setIsActive(true);
      }

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activeAreaRef, isVisible]);

  if (!isActive || !isVisible) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'normal' }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 25 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, 5]} intensity={0.5} color="#94a6ff" />
        
        <GlowSphere mousePos={mousePos} color={color} />
        <GlassLens mousePos={mousePos} distortion={distortion} color={color} />
        <InnerRing mousePos={mousePos} color={color} />
      </Canvas>
    </div>
  );
}
