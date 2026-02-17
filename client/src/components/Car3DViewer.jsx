import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg:       "#f4f6f8",
  panel:    "#ffffff",
  card:     "#f8fafc",
  border:   "#e2e8f0",
  green:    "#22c55e",
  greenDk:  "#16a34a",
  greenLt:  "#dcfce7",
  sidebar:  "#111827",
  sideText: "#ffffff",
  sideMut:  "#9ca3af",
  text:     "#111827",
  textSoft: "#475569",
  muted:    "#94a3b8",
};

// 3D Image Card Component
function ImageCard({ imageUrl }) {
  const meshRef = useRef();
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  // Auto-rotate the card
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group>
      {/* Main image plane */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>

      {/* Frame/Border */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[4.2, 2.7]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Spotlight on the image */}
      <spotLight
        position={[0, 3, 5]}
        angle={0.5}
        penumbra={0.5}
        intensity={1}
        castShadow
      />
    </group>
  );
}

// Fallback component while loading
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[4, 2.5, 0.1]} />
      <meshStandardMaterial color={C.muted} />
    </mesh>
  );
}

function Car3DViewer({ carImage = '/taxi.jpeg' }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div style={{
      width: '100%',
      height: '300px',
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)`,
      border: `1px solid ${C.border}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '32px'
    }}>
      {/* 3D Canvas */}
      <Canvas
        style={{ width: '100%', height: '100%' }}
        onCreated={() => setIsLoading(false)}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4a9eff" />
        <pointLight position={[5, -5, 5]} intensity={0.3} color="#ff4a9e" />

        {/* 3D Image Card with Suspense for loading */}
        <Suspense fallback={<LoadingFallback />}>
          <ImageCard imageUrl={carImage} />
        </Suspense>

        {/* Interactive Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={10}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Loading State */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'none'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid rgba(255,255,255,0.2)`,
            borderTop: `3px solid ${C.green}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ color: '#fff', fontSize: '14px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Loading 3D view...
          </div>
        </div>
      )}

      {/* Controls Hint */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        🖱️ Drag to rotate • Scroll to zoom
      </div>

      {/* Vehicle Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: C.green,
        color: '#fff',
        padding: '6px 14px',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '600',
        boxShadow: `0 2px 8px ${C.green}60`,
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        🚗 3D VEHICLE VIEW
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Car3DViewer;
