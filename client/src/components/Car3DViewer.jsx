import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere } from '@react-three/drei';
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

// Car Model Component
function CarModel({ position = [0, 0, 0] }) {
  const meshRef = useRef();

  return (
    <group position={position} ref={meshRef}>
      {/* Car Body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color={C.green} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Car Roof */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.8, 1.8]} />
        <meshStandardMaterial color={C.greenDk} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windows */}
      <mesh position={[0, 1.3, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.6, 1.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} opacity={0.7} transparent />
      </mesh>

      {/* Wheels */}
      <mesh position={[1.2, -0.3, 1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1.2, -0.3, -1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-1.2, -0.3, 1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-1.2, -0.3, -1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Headlights */}
      <mesh position={[2, 0.5, 0.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[2, 0.5, -0.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.5} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-2, 0.5, 0.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-2, 0.5, -0.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Car3DViewer({ carImage = '/taxi.jpeg' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div style={{
      width: '100%',
      height: '300px',
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${C.card} 0%, ${C.bg} 100%)`,
      border: `1px solid ${C.border}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '32px'
    }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        onCreated={() => setIsLoading(false)}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* 3D Car Model */}
        <CarModel position={[0, 0, 0]} />

        {/* Ground Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color={C.bg} opacity={0.5} transparent />
        </mesh>

        {/* Orbit Controls for rotation */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={true}
          autoRotateSpeed={1}
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
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${C.border}`,
            borderTop: `3px solid ${C.green}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ color: C.muted, fontSize: '14px' }}>Loading 3D Model...</div>
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
        backdropFilter: 'blur(4px)'
      }}>
        🖱️ Drag to rotate • Scroll to zoom
      </div>

      {/* Car Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: C.green,
        color: '#fff',
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '600',
        boxShadow: `0 2px 8px ${C.green}40`
      }}>
        3D VIEW
      </div>

      {/* CSS Animation */}
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
