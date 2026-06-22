"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Line, Sparkles, Icosahedron, AdaptiveDpr } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

const ACCENT = "#ff8a00";
const STEEL = "#2f6fb0";
const FRAME_SPACING = 6;

/** Square outline (blueprint "portal") in the XY plane. */
function squarePoints(s: number): THREE.Vector3[] {
  return [
    new THREE.Vector3(-s, -s, 0),
    new THREE.Vector3(s, -s, 0),
    new THREE.Vector3(s, s, 0),
    new THREE.Vector3(-s, s, 0),
    new THREE.Vector3(-s, -s, 0),
  ];
}

/**
 * Drives the camera straight down the tunnel from the scroll progress (0→1),
 * with a gentle organic sway + roll so the fly-through feels alive. Reads the
 * MotionValue every frame — no React re-renders, so it stays buttery.
 */
function ScrollRig({
  progress,
  totalDepth,
}: {
  progress: MotionValue<number>;
  totalDepth: number;
}) {
  const { camera } = useThree();
  useFrame(() => {
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1);
    const z = 14 - p * (totalDepth + 6);
    camera.position.set(
      Math.sin(p * Math.PI * 2.2) * 1.2,
      Math.cos(p * Math.PI * 1.7) * 0.55,
      z,
    );
    camera.lookAt(0, 0, z - 12);
    camera.rotation.z = Math.sin(p * Math.PI * 2) * 0.07;
  });
  return null;
}

/** The receding rings of blueprint portals with glowing corner nodes. */
function Tunnel({ frames }: { frames: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: frames }, (_, i) => ({
        key: i,
        z: -i * FRAME_SPACING,
        s: 3.1 + (i % 3) * 0.18,
        rot: i * 0.11,
        accent: i % 2 === 0,
      })),
    [frames],
  );

  return (
    <>
      {items.map((it) => (
        <group key={it.key} position={[0, 0, it.z]} rotation={[0, 0, it.rot]}>
          <Line
            points={squarePoints(it.s)}
            color={it.accent ? STEEL : "#7d93ab"}
            lineWidth={1}
            transparent
            opacity={0.6}
          />
          {(
            [
              [-it.s, -it.s],
              [it.s, -it.s],
              [it.s, it.s],
              [-it.s, it.s],
            ] as const
          ).map(([x, y], ci) => (
            <mesh key={ci} position={[x, y, 0]}>
              <sphereGeometry args={[0.075, 8, 8]} />
              <meshBasicMaterial color={ci % 2 === 0 ? ACCENT : STEEL} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

/** The "arrival" object at the end of the tunnel — a nod to the hero globe. */
function Destination({ z }: { z: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * 0.3;
    ref.current.rotation.x += d * 0.12;
  });
  return (
    <group ref={ref} position={[0, 0, z]}>
      <Icosahedron args={[2.1, 1]}>
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.75} />
      </Icosahedron>
      <Icosahedron args={[1.25, 0]}>
        <meshBasicMaterial color={STEEL} wireframe transparent opacity={0.5} />
      </Icosahedron>
    </group>
  );
}

export default function JourneyScene({
  progress,
  mobile = false,
}: {
  progress: MotionValue<number>;
  mobile?: boolean;
}) {
  const frames = mobile ? 12 : 18;
  const totalDepth = frames * FRAME_SPACING;
  const destZ = -totalDepth - 2;

  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 62 }}
      dpr={mobile ? [1, 1] : [1, 1.6]}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      {/* White fog blends distant geometry into the white page background. */}
      <fog attach="fog" args={["#ffffff", 7, totalDepth * 0.85]} />
      <ambientLight intensity={1} />

      <ScrollRig progress={progress} totalDepth={totalDepth} />
      <Tunnel frames={frames} />
      <Destination z={destZ} />

      {/* Floor + ceiling grids form the corridor. */}
      <Grid
        position={[0, -4, 0]}
        args={[40, 40]}
        cellSize={2}
        cellThickness={0.6}
        cellColor="#c6cfda"
        sectionSize={10}
        sectionColor={STEEL}
        fadeDistance={46}
        fadeStrength={2}
        infiniteGrid
      />
      <Grid
        position={[0, 4, 0]}
        rotation={[Math.PI, 0, 0]}
        args={[40, 40]}
        cellSize={2}
        cellThickness={0.6}
        cellColor="#cdd6e0"
        sectionSize={10}
        sectionColor={STEEL}
        fadeDistance={46}
        fadeStrength={2}
        infiniteGrid
      />

      <Sparkles
        count={mobile ? 30 : 60}
        scale={[18, 8, totalDepth]}
        position={[0, 0, -totalDepth / 2]}
        size={2.2}
        speed={0.25}
        color={ACCENT}
        opacity={0.5}
      />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
