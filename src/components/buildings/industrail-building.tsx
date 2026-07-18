import { IND_MAT } from "@/utils/city.helpers";
import type { Building } from "@/utils/district";
import * as THREE from "three";


export default function IndustrialBuilding({
  b,
  tint,
}: {
  b: Building;
  tint: THREE.Color;
  litFraction: number;
}) {
  const height = Math.max(6, b.floors * 5);
  // sawtooth roof: 3 triangular prisms
  const teeth = 4;
  const toothW = b.width / teeth;
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[b.width, height, b.depth]} />
        <meshStandardMaterial color={IND_MAT.wall} roughness={0.9} />
      </mesh>
      {/* horizontal accent stripe */}
      <mesh position={[0, height * 0.6, b.depth / 2 + 0.02]}>
        <planeGeometry args={[b.width * 0.98, 0.6]} />
        <meshStandardMaterial
          color={IND_MAT.accent}
          emissive={IND_MAT.accent}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* sawtooth roof */}
      {Array.from({ length: teeth }).map((_, i) => (
        <group
          key={i}
          position={[-b.width / 2 + toothW * (i + 0.5), height, 0]}
        >
          <mesh position={[0, toothW * 0.35, 0]} castShadow>
            <boxGeometry args={[toothW * 0.98, 0.15, b.depth]} />
            <meshStandardMaterial color={IND_MAT.roof} />
          </mesh>
          <mesh
            position={[toothW * 0.25, toothW * 0.18, 0]}
            rotation={[0, 0, -0.6]}
          >
            <planeGeometry args={[toothW * 0.6, b.depth]} />
            <meshStandardMaterial
              color="#7ec8f0"
              emissive="#334455"
              emissiveIntensity={0.2}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
      {/* vent stack */}
      <mesh position={[b.width * 0.35, height + 3, -b.depth * 0.3]} castShadow>
        <cylinderGeometry args={[0.5, 0.6, 4, 12]} />
        <meshStandardMaterial color="#4a5058" />
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