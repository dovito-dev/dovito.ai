/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, RefObject, useMemo, createContext, useContext } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';

interface FluidGlassCursorProps {
  activeAreaRef?: RefObject<HTMLElement>;
  ior?: number;
  thickness?: number;
  anisotropy?: number;
  chromaticAberration?: number;
  scale?: number;
}

function useFBO(width = 512, height = 512) {
  const target = useMemo(() => {
    const fbo = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
    });
    return fbo;
  }, [width, height]);

  useEffect(() => {
    return () => target.dispose();
  }, [target]);

  return target;
}

const TransmissionMaterialShader = {
  uniforms: {
    time: { value: 0 },
    buffer: { value: null },
    resolution: { value: new THREE.Vector2() },
    ior: { value: 1.15 },
    thickness: { value: 5.0 },
    chromaticAberration: { value: 0.1 },
    anisotropy: { value: 0.01 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform sampler2D buffer;
    uniform vec2 resolution;
    uniform float ior;
    uniform float thickness;
    uniform float chromaticAberration;
    uniform float anisotropy;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    
    vec3 sat(vec3 rgb, float adjustment) {
      vec3 W = vec3(0.2125, 0.7154, 0.0721);
      vec3 intensity = vec3(dot(rgb, W));
      return mix(intensity, rgb, adjustment);
    }
    
    void main() {
      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vNormal);
      
      float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 3.0);
      
      vec2 screenUV = gl_FragCoord.xy / resolution;
      
      vec3 refractVec = refract(-viewDir, normal, 1.0 / ior);
      vec2 refractOffset = refractVec.xy * thickness * 0.01;
      
      float aberrationR = chromaticAberration * 1.0;
      float aberrationG = chromaticAberration * 0.5;
      float aberrationB = chromaticAberration * 0.0;
      
      vec2 uvR = screenUV + refractOffset * (1.0 + aberrationR);
      vec2 uvG = screenUV + refractOffset * (1.0 + aberrationG);
      vec2 uvB = screenUV + refractOffset * (1.0 + aberrationB);
      
      float r = texture2D(buffer, uvR).r;
      float g = texture2D(buffer, uvG).g;
      float b = texture2D(buffer, uvB).b;
      
      vec3 refractColor = vec3(r, g, b);
      
      refractColor = sat(refractColor, 1.0 + anisotropy);
      
      vec3 rimColor = vec3(0.9, 0.95, 1.0);
      vec3 finalColor = mix(refractColor, rimColor, fresnel * 0.3);
      
      finalColor += vec3(0.02, 0.03, 0.05) * fresnel;
      
      float iridescence = sin(vUv.x * 20.0 + time) * 0.02 + 
                          cos(vUv.y * 15.0 - time * 0.7) * 0.02;
      finalColor += vec3(0.1, 0.15, 0.2) * iridescence * fresnel;
      
      float alpha = 0.95;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

const SceneContext = createContext<THREE.Scene | null>(null);

function Lens({ 
  mousePos,
  buffer,
  ior = 1.15,
  thickness = 5,
  anisotropy = 0.01,
  chromaticAberration = 0.1,
  scale = 0.15
}: { 
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  buffer: THREE.WebGLRenderTarget;
  ior?: number;
  thickness?: number;
  anisotropy?: number;
  chromaticAberration?: number;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, camera, size } = useThree();
  const geoWidthRef = useRef(1);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        buffer: { value: buffer.texture },
        resolution: { value: new THREE.Vector2(size.width, size.height) },
        ior: { value: ior },
        thickness: { value: thickness },
        chromaticAberration: { value: chromaticAberration },
        anisotropy: { value: anisotropy },
      },
      vertexShader: TransmissionMaterialShader.vertexShader,
      fragmentShader: TransmissionMaterialShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true,
    });
  }, [buffer.texture, size.width, size.height, ior, thickness, chromaticAberration, anisotropy]);

  useEffect(() => {
    const geo = new THREE.CylinderGeometry(1, 1, 0.3, 64, 1, false);
    geo.computeBoundingBox();
    if (geo.boundingBox) {
      geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
    }
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    
    const destX = (mousePos.current.x / window.innerWidth) * 2 - 1;
    const destY = -((mousePos.current.y / window.innerHeight) * 2 - 1);
    
    const targetX = (destX * v.width) / 2;
    const targetY = (destY * v.height) / 2;

    easing.damp3(meshRef.current.position, [targetX, targetY, 15], 0.15, delta);

    const maxWorld = v.width * 0.9;
    const desired = maxWorld / geoWidthRef.current;
    meshRef.current.scale.setScalar(Math.min(scale, desired));

    if (shaderMaterial.uniforms) {
      shaderMaterial.uniforms.time.value = state.clock.elapsedTime;
      shaderMaterial.uniforms.buffer.value = buffer.texture;
      shaderMaterial.uniforms.resolution.value.set(state.size.width, state.size.height);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      scale={scale} 
      rotation-x={Math.PI / 2} 
      material={shaderMaterial}
    >
      <cylinderGeometry args={[1, 1, 0.3, 64, 1, false]} />
    </mesh>
  );
}

function BackgroundPlane({ buffer }: { buffer: THREE.WebGLRenderTarget }) {
  const { viewport } = useThree();
  
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={buffer.texture} transparent />
    </mesh>
  );
}

function Scene({ 
  mousePos,
  ior,
  thickness,
  anisotropy,
  chromaticAberration,
  scale
}: { 
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  ior: number;
  thickness: number;
  anisotropy: number;
  chromaticAberration: number;
  scale: number;
}) {
  const buffer = useFBO(1024, 1024);
  const [scene] = useState(() => new THREE.Scene());
  const { gl, camera } = useThree();

  useFrame(() => {
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);
  });

  return (
    <>
      {createPortal(
        <SceneContext.Provider value={scene}>
          <ambientLight intensity={1} />
        </SceneContext.Provider>,
        scene
      )}
      <BackgroundPlane buffer={buffer} />
      <Lens 
        mousePos={mousePos}
        buffer={buffer}
        ior={ior}
        thickness={thickness}
        anisotropy={anisotropy}
        chromaticAberration={chromaticAberration}
        scale={scale}
      />
    </>
  );
}

export default function FluidGlassCursor({
  activeAreaRef,
  ior = 1.15,
  thickness = 5,
  anisotropy = 0.01,
  chromaticAberration = 0.1,
  scale = 0.15
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
        camera={{ position: [0, 0, 20], fov: 15 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <Scene 
          mousePos={mousePos}
          ior={ior}
          thickness={thickness}
          anisotropy={anisotropy}
          chromaticAberration={chromaticAberration}
          scale={scale}
        />
      </Canvas>
    </div>
  );
}
