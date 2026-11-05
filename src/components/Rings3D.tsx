"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

function Ring({ x, tilt }: { x: number; tilt: number }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.5; });
  return (
    <mesh ref={ref} position={[x, 0, 0]} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[1, 0.17, 32, 96]} />
      <meshStandardMaterial color="#D6B46A" metalness={0.95} roughness={0.22} />
    </mesh>
  );
}

/** Two interlinked gold bands. Desktop only; loaded lazily. */
export default function Rings3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} aria-hidden>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 5]} intensity={90} color="#fff1c7" />
      <pointLight position={[-4, -2, 3]} intensity={40} color="#ffb86b" />
      <group rotation={[0.2, 0, 0.25]}>
        <Ring x={-0.55} tilt={0.35} />
        <Ring x={0.55} tilt={-0.35} />
      </group>
    </Canvas>
  );
}
