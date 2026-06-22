"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Icosahedron, Line, Sparkles, AdaptiveDpr } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const ACCENT = "#ff8a00";
// Deeper steel so the wireframe + dots stay legible on a light/white canvas.
const STEEL = "#2f6fb0";

/** Evenly distribute n points on a unit sphere (Fibonacci sphere). */
function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(
      new THREE.Vector3(
        Math.cos(theta) * r,
        y,
        Math.sin(theta) * r,
      ).multiplyScalar(radius),
    );
  }
  return pts;
}

/** A great-circle-style arc that bows outward between two surface points. */
function arcPoints(a: THREE.Vector3, b: THREE.Vector3, segments = 24) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const lift = 1 + a.distanceTo(b) * 0.28;
  mid.setLength(a.length() * lift);
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  return curve.getPoints(segments);
}

function Globe({ dotCount }: { dotCount: number }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const dots = useMemo(() => fibonacciSphere(dotCount, 2), [dotCount]);

  // A few arcs connecting selected dots (acts as the "network").
  const arcs = useMemo(() => {
    const pairs: Array<[number, number]> = [
      [0, Math.floor(dotCount * 0.4)],
      [Math.floor(dotCount * 0.2), Math.floor(dotCount * 0.7)],
      [Math.floor(dotCount * 0.55), dotCount - 1],
      [Math.floor(dotCount * 0.1), Math.floor(dotCount * 0.85)],
    ];
    return pairs.map(([i, j]) => arcPoints(dots[i], dots[j]));
  }, [dots, dotCount]);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Continuous slow spin.
    group.current.rotation.y += delta * 0.12;
    // Parallax tilt toward the pointer (eased).
    const targetX = pointer.y * 0.25;
    const targetZ = pointer.x * 0.15;
    group.current.rotation.x +=
      (targetX - group.current.rotation.x) * 0.05;
    group.current.rotation.z +=
      (targetZ - group.current.rotation.z) * 0.05;
  });

  return (
    <group ref={group}>
      {/* Wireframe globe shell */}
      <Icosahedron args={[2, 3]}>
        <meshBasicMaterial
          color={STEEL}
          wireframe
          transparent
          opacity={0.32}
        />
      </Icosahedron>

      {/* Inner sphere — light fill that occludes the back wireframe so the globe
          reads with depth on a white background. */}
      <Icosahedron args={[1.96, 3]}>
        <meshBasicMaterial color="#eef2f7" />
      </Icosahedron>

      {/* Glowing location dots */}
      {dots.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshBasicMaterial color={i % 4 === 0 ? ACCENT : STEEL} />
        </mesh>
      ))}

      {/* Network arcs */}
      {arcs.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color={ACCENT}
          lineWidth={1}
          transparent
          opacity={0.55}
        />
      ))}

      {/* Ambient floating motes for depth */}
      <Sparkles
        count={40}
        scale={6}
        size={2}
        speed={0.3}
        opacity={0.4}
        color={STEEL}
      />
    </group>
  );
}

interface HeroSceneProps {
  /** lower fidelity for small screens */
  mobile?: boolean;
  /** pause the render loop when the hero is scrolled out of view */
  paused?: boolean;
}

export default function HeroScene({ mobile = false, paused = false }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={mobile ? [1, 1] : [1, 1.6]}
      frameloop={paused ? "never" : "always"}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      {/* All scene materials are unlit (meshBasicMaterial); a single ambient
          light is enough and keeps the look consistent on a white background. */}
      <ambientLight intensity={1} />
      <Globe dotCount={mobile ? 14 : 26} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
