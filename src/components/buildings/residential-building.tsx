import { RES_MAT } from "@/utils/city.helpers";
import type { Building } from "@/utils/district";
import { useMemo } from "react";
import * as THREE from "three";


export default function ResidentialBuilding({
  b,
  tint,
  litFraction,
}: {
  b: Building;
  tint: THREE.Color;
  litFraction: number;
}) {
  const floorH = 3.0;
  const height = b.floors * floorH;
  const cols = Math.max(2, Math.round(b.width / 4));
  const windows = useMemo(() => {
    const arr: { x: number; y: number; lit: boolean; side: number }[] = [];
    for (let f = 0; f < b.floors; f++) {
      for (let c = 0; c < cols; c++) {
        const lit = Math.random() < litFraction;
        arr.push({
          x: -b.width / 2 + (b.width / cols) * (c + 0.5),
          y: f * floorH + floorH * 0.55,
          lit,
          side: 0,
        });
        arr.push({
          x: -b.width / 2 + (b.width / cols) * (c + 0.5),
          y: f * floorH + floorH * 0.55,
          lit: Math.random() < litFraction,
          side: 1,
        });
      }
    }
    return arr;
  }, [b.floors, b.width, cols, litFraction]);
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[b.width, height, b.depth]} />
        <meshStandardMaterial color={RES_MAT.wall} roughness={0.85} />
      </mesh>
      {/* pitched roof */}
      <mesh
        position={[0, height + (b.depth * 0.35) / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.01,
            b.depth * 0.55,
            b.width * 1.02,
            3,
            1,
            false,
            Math.PI / 2,
          ]}
        />
        <meshStandardMaterial color={RES_MAT.roof} roughness={0.8} />
      </mesh>
      {/* windows front/back */}
      {windows.map((w, i) => (
        <mesh
          key={i}
          position={[
            w.x,
            w.y,
            w.side === 0 ? b.depth / 2 + 0.02 : -b.depth / 2 - 0.02,
          ]}
          rotation={[0, w.side === 0 ? 0 : Math.PI, 0]}
        >
          <planeGeometry args={[1.4, 1.4]} />
          <meshStandardMaterial
            color={w.lit ? RES_MAT.window : "#3a3020"}
            emissive={w.lit ? RES_MAT.window : "#000"}
            emissiveIntensity={w.lit ? 0.8 : 0}
          />
        </mesh>
      ))}
      {/* door */}
      <mesh position={[0, 1.1, b.depth / 2 + 0.03]}>
        <planeGeometry args={[1.2, 2.2]} />
        <meshStandardMaterial color={RES_MAT.trim} />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[b.width + 0.05, height + 0.05, b.depth + 0.05]} />
        <meshStandardMaterial
          color={tint}
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}