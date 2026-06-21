"use client";
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

/* ── Floating particles field ── */
function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.04;
    ref.current.rotation.y = state.clock.elapsedTime * 0.06;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#d4af37"
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

/* ── Central glowing orb ── */
function GlowOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    // Follow mouse subtly
    meshRef.current.position.x += (mouse.x * 0.8 - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (mouse.y * 0.5 - meshRef.current.position.y) * 0.05;
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <Sphere args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#d4af37"
            distort={0.35}
            speed={2}
            roughness={0}
            metalness={0.9}
            transparent
            opacity={0.18}
            wireframe={false}
          />
        </Sphere>
        {/* Inner core */}
        <Sphere args={[0.7, 32, 32]}>
          <meshStandardMaterial
            color="#e8c84a"
            emissive="#d4af37"
            emissiveIntensity={0.5}
            transparent
            opacity={0.12}
            roughness={0}
            metalness={1}
          />
        </Sphere>
      </mesh>
    </Float>
  );
}

/* ── Orbiting rings ── */
function OrbitRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) { ring1.current.rotation.x = t * 0.5; ring1.current.rotation.z = t * 0.3; }
    if (ring2.current) { ring2.current.rotation.y = t * 0.4; ring2.current.rotation.x = t * 0.2; }
    if (ring3.current) { ring3.current.rotation.z = t * 0.6; ring3.current.rotation.y = -t * 0.15; }
  });

  const ringMat = (opacity = 0.25) => (
    <meshBasicMaterial color="#d4af37" transparent opacity={opacity} side={THREE.DoubleSide} />
  );

  return (
    <>
      <mesh ref={ring1}>
        <torusGeometry args={[1.8, 0.008, 8, 100]} />
        {ringMat(0.3)}
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[2.4, 0.005, 8, 100]} />
        {ringMat(0.18)}
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[3.1, 0.004, 8, 100]} />
        {ringMat(0.1)}
      </mesh>
    </>
  );
}

/* ── Scene ── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#d4af37" />
      <pointLight position={[-3, 2, -2]} intensity={0.5} color="#b8962e" />
      <ParticleField />
      <GlowOrb />
      <OrbitRings />
    </>
  );
}

/* ── Export ── */
export function HeroCanvas() {
  return (
    <Canvas
      className="hero-canvas"
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
