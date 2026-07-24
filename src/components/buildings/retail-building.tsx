// import { RETAIL_MAT } from "@/utils/city.helpers";
// import type { Building } from "@/utils/district";
// import * as THREE from "three";

// export default function RetailBuilding({ 
//   b,
//   tint,
// }: {
//   b: Building;
//   tint: THREE.Color;
//   litFraction: number;
// }) {
//   const height = Math.max(4, b.floors * 3.4);
//   return (
//     <group>
//       <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
//         <boxGeometry args={[b.width, height, b.depth]} />
//         <meshStandardMaterial color={RETAIL_MAT.wall} roughness={0.7} />
//       </mesh>
//       {/* storefront band */}
//       <mesh position={[0, 1.6, b.depth / 2 + 0.02]}>
//         <planeGeometry args={[b.width * 0.95, 2.6]} />
//         <meshStandardMaterial
//           color={RETAIL_MAT.window}
//           emissive={RETAIL_MAT.window}
//           emissiveIntensity={0.6}
//           metalness={0.6}
//           roughness={0.2}
//         />
//       </mesh>
//       {/* signage strip */}
//       <mesh position={[0, 3.4, b.depth / 2 + 0.05]}>
//         <planeGeometry args={[b.width * 0.9, 0.9]} />
//         <meshStandardMaterial
//           color={RETAIL_MAT.band}
//           emissive={RETAIL_MAT.band}
//           emissiveIntensity={0.9}
//         />
//       </mesh>
//       {/* parapet roof */}
//       <mesh position={[0, height + 0.4, 0]} castShadow>
//         <boxGeometry args={[b.width + 0.6, 0.8, b.depth + 0.6]} />
//         <meshStandardMaterial color={RETAIL_MAT.roof} />
//       </mesh>
//       {/* canopy */}
//       <mesh position={[0, 3, b.depth / 2 + 0.9]} castShadow>
//         <boxGeometry args={[b.width * 0.95, 0.1, 1.6]} />
//         <meshStandardMaterial color={RETAIL_MAT.band} />
//       </mesh>
//       <mesh position={[0, height / 2, 0]}>
//         <boxGeometry args={[b.width + 0.05, height + 0.05, b.depth + 0.05]} />
//         <meshStandardMaterial
//           color={tint}
//           transparent
//           opacity={0.16}
//           depthWrite={false}
//         />
//       </mesh>
//     </group>
//   );
// }


import { RETAIL_MAT } from "@/utils/city.helpers";
import type { Building } from "@/utils/district";
import * as THREE from "three";

export default function RetailBuilding({ 
  b,
  tint,
}: {
  b: Building;
  tint: THREE.Color;
  litFraction: number;
}) {
  const height = Math.max(4, b.floors * 3.4);
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[b.width, height, b.depth]} />
        <meshStandardMaterial color={RETAIL_MAT.wall} roughness={0.7} />
      </mesh>
      {/* storefront band */}
      <mesh position={[0, 1.6, b.depth / 2 + 0.02]}>
        <planeGeometry args={[b.width * 0.95, 2.6]} />
        <meshStandardMaterial
          color={RETAIL_MAT.window}
          emissive={RETAIL_MAT.window}
          emissiveIntensity={0.6}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      {/* signage strip */}
      <mesh position={[0, 3.4, b.depth / 2 + 0.05]}>
        <planeGeometry args={[b.width * 0.9, 0.9]} />
        <meshStandardMaterial
          color={RETAIL_MAT.band}
          emissive={RETAIL_MAT.band}
          emissiveIntensity={0.9}
        />
      </mesh>
      {/* parapet roof */}
      <mesh position={[0, height + 0.4, 0]} castShadow>
        <boxGeometry args={[b.width + 0.6, 0.8, b.depth + 0.6]} />
        <meshStandardMaterial color={RETAIL_MAT.roof} />
      </mesh>
      {/* canopy */}
      <mesh position={[0, 3, b.depth / 2 + 0.9]} castShadow>
        <boxGeometry args={[b.width * 0.95, 0.1, 1.6]} />
        <meshStandardMaterial color={RETAIL_MAT.band} />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[b.width + 0.05, height + 0.05, b.depth + 0.05]} />
        <meshStandardMaterial
          color={tint}
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}