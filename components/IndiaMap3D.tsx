"use client";

/**
 * Geometry source:
 * The existing per-state SVG paths are parsed with Three.js SVGLoader and
 * extruded into real meshes. Pins use the same 612 x 696 source coordinate
 * system, so Surat and Dewas remain aligned without a second projection.
 *
 * Performance:
 * The WebGL canvas is scoped to this component, rendered on demand, capped at
 * 1.5 device pixel ratio, and dynamically imported by the parent section.
 */

import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { INDIA_STATES, INDIA_VIEWBOX } from "@/data/india-geo";
import { LOCATIONS, type OfficeLocation } from "@/data/locations";

const [, , VIEWBOX_WIDTH, VIEWBOX_HEIGHT] = INDIA_VIEWBOX.split(" ").map(Number);
const MAP_SCALE = 0.0112;
const MAP_DEPTH = 0.16;
const REST_CAMERA = new THREE.Vector3(0.05, 0.05, 10.75);
const REST_LOOK_AT = new THREE.Vector3(0.08, -0.08, 0);

interface IndiaMap3DProps {
  activePinId: string | null;
  onSelectPin: (pinId: string | null) => void;
  onReady?: () => void;
  reduceMotion?: boolean;
}

function mapPoint(location: Pick<OfficeLocation, "x" | "y">) {
  return new THREE.Vector3(
    (location.x - VIEWBOX_WIDTH / 2) * MAP_SCALE,
    (VIEWBOX_HEIGHT / 2 - location.y) * MAP_SCALE,
    MAP_DEPTH + 0.08,
  );
}

function buildStateGeometries() {
  const loader = new SVGLoader();

  return INDIA_STATES.flatMap((state) => {
    const source = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${INDIA_VIEWBOX}"><path d="${state.d}" /></svg>`;
    const parsed = loader.parse(source);

    return parsed.paths.flatMap((path, pathIndex) =>
      SVGLoader.createShapes(path).map((shape, shapeIndex) => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: MAP_DEPTH / MAP_SCALE,
          bevelEnabled: false,
          curveSegments: 2,
        });

        geometry.translate(-VIEWBOX_WIDTH / 2, -VIEWBOX_HEIGHT / 2, 0);
        geometry.scale(MAP_SCALE, -MAP_SCALE, MAP_SCALE);
        geometry.computeVertexNormals();

        return {
          id: `${state.id}-${pathIndex}-${shapeIndex}`,
          stateName: state.name,
          geometry,
          edges: new THREE.EdgesGeometry(geometry, 24),
        };
      }),
    );
  });
}

function StateMeshes({ activeState }: { activeState: string | null }) {
  const { invalidate } = useThree();
  const geometries = useMemo(() => buildStateGeometries(), []);
  const [displayedState, setDisplayedState] = useState<string | null>(
    activeState,
  );
  const pendingState = useRef<string | null>(activeState);
  const baseFaceMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#cbc6bc",
        roughness: 0.76,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const baseSideMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8f887c",
        roughness: 0.82,
        metalness: 0.01,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const baseEdgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#716b62",
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
      }),
    [],
  );
  const highlightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#a49d92",
        roughness: 0.68,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    [],
  );
  const highlightEdgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#59544d",
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    pendingState.current = activeState;
    if (!displayedState && activeState) setDisplayedState(activeState);
    invalidate();
  }, [activeState, displayedState, invalidate]);

  useFrame((_, delta) => {
    const switching = pendingState.current !== displayedState;
    const targetOpacity = pendingState.current && !switching ? 0.48 : 0;
    highlightMaterial.opacity = THREE.MathUtils.damp(
      highlightMaterial.opacity,
      targetOpacity,
      7,
      delta,
    );
    highlightEdgeMaterial.opacity = THREE.MathUtils.damp(
      highlightEdgeMaterial.opacity,
      targetOpacity * 1.45,
      7,
      delta,
    );

    if (switching && highlightMaterial.opacity < 0.015) {
      setDisplayedState(pendingState.current);
    }
    if (
      Math.abs(highlightMaterial.opacity - targetOpacity) > 0.002 ||
      Math.abs(highlightEdgeMaterial.opacity - targetOpacity * 1.45) >
        0.002 ||
      switching
    ) {
      invalidate();
    }
  });

  const highlighted = displayedState
    ? geometries.filter(({ stateName }) => stateName === displayedState)
    : [];

  return (
    <group>
      {geometries.map(({ id, geometry, edges }) => (
        <group key={id}>
          <mesh
            geometry={geometry}
            material={[baseFaceMaterial, baseSideMaterial]}
          />
          <lineSegments
            geometry={edges}
            material={baseEdgeMaterial}
            position={[0, 0, 0.004]}
            renderOrder={2}
          />
        </group>
      ))}
      {highlighted.map(({ id, geometry, edges }) => (
        <group key={`highlight-${id}`}>
          <mesh
            geometry={geometry}
            material={highlightMaterial}
            position={[0, 0, 0.008]}
          />
          <lineSegments
            geometry={edges}
            material={highlightEdgeMaterial}
            position={[0, 0, 0.012]}
            renderOrder={3}
          />
        </group>
      ))}
    </group>
  );
}

function LocationPin({
  location,
  active,
  sceneFocused,
  onSelect,
}: {
  location: OfficeLocation;
  active: boolean;
  sceneFocused: boolean;
  onSelect?: () => void;
}) {
  const { invalidate } = useThree();
  const position = useMemo(() => mapPoint(location), [location]);
  const marker = useRef<THREE.Group>(null);
  const isHeadOffice = location.type === "Head Office";
  const [hovered, setHovered] = useState(false);
  const labelPosition = [0.17, 0.31, 0.27] as const;
  const handleSelect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect?.();
  };
  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "";
  };

  useEffect(() => {
    invalidate();
  }, [active, hovered, invalidate]);

  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );

  useFrame((_, delta) => {
    const targetScale = active ? 1.16 : hovered ? 1.07 : 1;

    if (marker.current) {
      const scale = THREE.MathUtils.damp(
        marker.current.scale.x,
        targetScale,
        8,
        delta,
      );
      marker.current.scale.setScalar(scale);
    }

    if (
      !marker.current ||
      Math.abs(marker.current.scale.x - targetScale) > 0.002
    ) {
      invalidate();
    }
  });

  return (
    <group position={position}>
      <group ref={marker}>
        <mesh
          position={[0, 0, 0.12]}
          onClick={handleSelect}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
            colorWrite={false}
          />
        </mesh>

        <mesh position={[0, 0.18, 0.15]}>
          <sphereGeometry args={[isHeadOffice ? 0.105 : 0.09, 24, 24]} />
          <meshPhysicalMaterial
            color={active || hovered ? "#ff2866" : "#e91e58"}
            roughness={0.22}
            metalness={0.02}
            clearcoat={0.9}
            clearcoatRoughness={0.16}
          />
        </mesh>

        <mesh position={[-0.03, 0.215, 0.232]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#ff9fbd" />
        </mesh>

        <mesh position={[0, 0.085, 0.07]}>
          <cylinderGeometry args={[0.014, 0.014, 0.16, 12]} />
          <meshStandardMaterial color="#29262b" roughness={0.52} />
        </mesh>

        <mesh position={[0, 0, 0.065]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#29262b" roughness={0.48} />
        </mesh>

        {active && (
          <>
            <mesh position={[0, 0, 0.025]}>
              <ringGeometry args={[0.105, 0.12, 40]} />
              <meshBasicMaterial
                color="#777169"
                transparent
                opacity={0.62}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, 0, 0.024]}>
              <ringGeometry args={[0.16, 0.172, 40]} />
              <meshBasicMaterial
                color="#9a948a"
                transparent
                opacity={0.38}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </>
        )}
      </group>

      <Html
        position={labelPosition}
        center={false}
        transform
        distanceFactor={sceneFocused ? 5.6 : 7.4}
        occlude={false}
        style={{ pointerEvents: "none" }}
      >
        {active && (
          <div className="india-map-3d-label india-map-3d-label--active">
            <strong>{location.city}</strong>
            <span>
              {isHeadOffice
                ? "HQ"
                : location.city === location.state
                  ? "Site Office"
                  : location.state}
            </span>
          </div>
        )}
      </Html>
    </group>
  );
}

function CameraRig({
  activePinId,
  reduceMotion,
  mapGroup,
}: {
  activePinId: string | null;
  reduceMotion: boolean;
  mapGroup: React.RefObject<THREE.Group>;
}) {
  const { camera, invalidate } = useThree();
  const lookAt = useRef(REST_LOOK_AT.clone());
  const activeLocation = LOCATIONS.find(
    (location) => location.id === activePinId,
  );
  const activePoint = useMemo(
    () => (activeLocation ? mapPoint(activeLocation) : null),
    [activeLocation],
  );

  useEffect(() => {
    invalidate();
  }, [activePinId, invalidate]);

  useFrame((_, delta) => {
    const focused = Boolean(activePoint);
    const direction = activePoint && activePoint.x < -1.5 ? 1 : -1;
    const targetCamera = activePoint
      ? new THREE.Vector3(
          activePoint.x * 0.26,
          activePoint.y * 0.24,
          8.75,
        )
      : REST_CAMERA;
    const targetLookAt = activePoint
      ? new THREE.Vector3(activePoint.x * 0.35, activePoint.y * 0.32, 0)
      : REST_LOOK_AT;
    const targetRotation = activePoint
      ? new THREE.Euler(-0.16, 0.18 * direction, -0.018 * direction)
      : new THREE.Euler(-0.11, -0.055, 0.018);

    if (reduceMotion) {
      camera.position.copy(targetCamera);
      lookAt.current.copy(targetLookAt);
      if (mapGroup.current) mapGroup.current.rotation.copy(targetRotation);
    } else {
      const cameraRate = focused ? 2.85 : 3.6;
      const lookRate = focused ? 3.25 : 4;
      const rotationRate = focused ? 2.55 : 3.4;
      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        targetCamera.x,
        cameraRate,
        delta,
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        targetCamera.y,
        cameraRate,
        delta,
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        targetCamera.z,
        cameraRate,
        delta,
      );
      lookAt.current.x = THREE.MathUtils.damp(
        lookAt.current.x,
        targetLookAt.x,
        lookRate,
        delta,
      );
      lookAt.current.y = THREE.MathUtils.damp(
        lookAt.current.y,
        targetLookAt.y,
        lookRate,
        delta,
      );
      lookAt.current.z = THREE.MathUtils.damp(
        lookAt.current.z,
        targetLookAt.z,
        lookRate,
        delta,
      );

      if (mapGroup.current) {
        mapGroup.current.rotation.x = THREE.MathUtils.damp(
          mapGroup.current.rotation.x,
          targetRotation.x,
          rotationRate,
          delta,
        );
        mapGroup.current.rotation.y = THREE.MathUtils.damp(
          mapGroup.current.rotation.y,
          targetRotation.y,
          rotationRate,
          delta,
        );
        mapGroup.current.rotation.z = THREE.MathUtils.damp(
          mapGroup.current.rotation.z,
          targetRotation.z,
          rotationRate,
          delta,
        );
      }
    }

    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = focused ? 35.5 : 39;
      const nextFov = reduceMotion
        ? targetFov
        : THREE.MathUtils.damp(camera.fov, targetFov, 3.1, delta);
      if (Math.abs(camera.fov - nextFov) > 0.0001) {
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }
    }

    camera.lookAt(lookAt.current);

    const cameraSettled = camera.position.distanceTo(targetCamera) < 0.002;
    const lookSettled = lookAt.current.distanceTo(targetLookAt) < 0.002;
    const rotationSettled =
      !mapGroup.current ||
      Math.abs(mapGroup.current.rotation.x - targetRotation.x) < 0.001 &&
        Math.abs(mapGroup.current.rotation.y - targetRotation.y) < 0.001 &&
        Math.abs(mapGroup.current.rotation.z - targetRotation.z) < 0.001;
    const fovSettled =
      !(camera instanceof THREE.PerspectiveCamera) ||
      Math.abs(camera.fov - (focused ? 35.5 : 39)) < 0.002;

    if (
      !cameraSettled ||
      !lookSettled ||
      !rotationSettled ||
      !fovSettled
    ) {
      invalidate();
    }
  });

  return null;
}

function MapScene({
  activePinId,
  onSelectPin,
  reduceMotion,
}: IndiaMap3DProps) {
  const mapGroup = useRef<THREE.Group>(null);
  const activeLocation = LOCATIONS.find(
    (location) => location.id === activePinId,
  );

  return (
    <>
      <hemisphereLight
        intensity={1.05}
        color="#fffdf8"
        groundColor="#777169"
      />
      <ambientLight intensity={0.58} />
      <directionalLight
        position={[-5, 8, 10]}
        intensity={1.75}
        color="#fffaf0"
      />
      <directionalLight
        position={[5, -2, 5]}
        intensity={0.42}
        color="#b8c2cb"
      />

      <CameraRig
        activePinId={activePinId}
        reduceMotion={Boolean(reduceMotion)}
        mapGroup={mapGroup}
      />

      <group
        ref={mapGroup}
        rotation={[-0.11, -0.055, 0.018]}
        position={[0.12, -0.08, 0]}
      >
        <StateMeshes activeState={activeLocation?.state ?? null} />

        {LOCATIONS.map((location) => (
          <LocationPin
            key={location.id}
            location={location}
            active={activePinId === location.id}
            sceneFocused={Boolean(activePinId)}
            onSelect={() =>
              onSelectPin(activePinId === location.id ? null : location.id)
            }
          />
        ))}
      </group>
    </>
  );
}

function SceneReady({ onReady }: { onReady?: () => void }) {
  const announced = useRef(false);

  useFrame(() => {
    if (announced.current) return;
    announced.current = true;
    requestAnimationFrame(() => onReady?.());
  });

  return null;
}

export default function IndiaMap3D({
  activePinId,
  onSelectPin,
  onReady,
  reduceMotion = false,
}: IndiaMap3DProps) {
  return (
    <div
      className={`india-map-3d${activePinId ? " is-focused" : ""}`}
      aria-label="3D map of India showing office locations"
    >
      <Canvas
        dpr={[1, 1.3]}
        frameloop="demand"
        onPointerMissed={() => {
          if (activePinId) onSelectPin(null);
        }}
        camera={{ position: [0, 0.15, 11.2], fov: 39, near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.92;
        }}
      >
        <MapScene
          activePinId={activePinId}
          onSelectPin={onSelectPin}
          reduceMotion={reduceMotion}
        />
        <SceneReady onReady={onReady} />
      </Canvas>
      <div className="india-map-3d__fade" aria-hidden />
    </div>
  );
}
