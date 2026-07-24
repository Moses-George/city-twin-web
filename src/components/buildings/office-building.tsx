// import { OFFICE_MAT } from "@/utils/city.helpers";
// import type { Building } from "@/utils/district";
// import { useMemo } from "react";
// import * as THREE from "three";

// export default function OfficeBuilding({
//   b,
//   tint,
//   litFraction,
// }: {
//   b: Building;
//   tint: THREE.Color;
//   litFraction: number;
// }) {
//   const height = b.floors * 3.3;
//   const floorH = 3.3;
//   const rows = b.floors;
//   const glassRows = useMemo(
//     () =>
//       Array.from({ length: rows }, (_, i) => ({
//         y: i * floorH + floorH * 0.55,
//         lit: Math.random() < litFraction || i === 0,
//       })),
//     [rows, litFraction],
//   );
//   return (
//     <group>
//       {/* main structure */}
//       <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
//         <boxGeometry args={[b.width, height, b.depth]} />
//         <meshStandardMaterial
//           color={OFFICE_MAT.wall}
//           roughness={0.55}
//           metalness={0.25}
//         />
//       </mesh>
//       {/* window bands: 4 faces */}
//       {glassRows.map((row, i) => (
//         <group key={i} position={[0, row.y, 0]}>
//           {[0, 1, 2, 3].map((side) => {
//             const rot = (side * Math.PI) / 2;
//             const w = side % 2 === 0 ? b.width : b.depth;
//             const off = side % 2 === 0 ? b.depth / 2 : b.width / 2;
//             const emissive = row.lit ? OFFICE_MAT.glass : "#22334a";
//             return (
//               <mesh
//                 key={side}
//                 position={[Math.sin(rot) * off, 0, Math.cos(rot) * off]}
//                 rotation={[0, rot, 0]}
//               >
//                 <planeGeometry args={[w * 0.9, floorH * 0.55]} />
//                 <meshStandardMaterial
//                   color={OFFICE_MAT.glass}
//                   emissive={emissive}
//                   emissiveIntensity={row.lit ? 0.6 : 0.05}
//                   metalness={0.9}
//                   roughness={0.15}
//                 />
//               </mesh>
//             );
//           })}
//         </group>
//       ))}
//       {/* roof cap + rooftop unit */}
//       <mesh position={[0, height + 0.3, 0]} castShadow>
//         <boxGeometry args={[b.width + 0.4, 0.6, b.depth + 0.4]} />
//         <meshStandardMaterial color={OFFICE_MAT.roof} />
//       </mesh>
//       <mesh
//         position={[b.width * 0.15, height + 1.4, b.depth * 0.15]}
//         castShadow
//       >
//         <boxGeometry args={[b.width * 0.35, 2, b.depth * 0.35]} />
//         <meshStandardMaterial color="#3a4358" />
//       </mesh>
//       {/* subtle tint overlay for load intensity */}
//       <mesh position={[0, height / 2, 0]}>
//         <boxGeometry args={[b.width + 0.05, height + 0.05, b.depth + 0.05]} />
//         <meshStandardMaterial
//           color={tint}
//           transparent
//           opacity={0.18}
//           depthWrite={false}
//         />
//       </mesh>
//     </group>
//   );
// }

import { OFFICE_MAT } from "@/utils/city.helpers";
import type { Building } from "@/utils/district";
import { useMemo } from "react";
import * as THREE from "three";

export default function OfficeBuilding({
  b,
  tint,
  litFraction,
}: {
  b: Building;
  tint: THREE.Color;
  litFraction: number;
}) {
  const height = b.floors * 3.3;
  const floorH = 3.3;
  const rows = b.floors;
  const glassRows = useMemo(
    () =>
      Array.from({ length: rows }, (_, i) => ({
        y: i * floorH + floorH * 0.55,
        lit: Math.random() < litFraction || i === 0,
      })),
    [rows, litFraction],
  );
  return (
    <group>
      {/* main structure */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[b.width, height, b.depth]} />
        <meshStandardMaterial
          color={OFFICE_MAT.wall}
          roughness={0.55}
          metalness={0.25}
        />
      </mesh>
      {/* window bands: 4 faces */}
      {glassRows.map((row, i) => (
        <group key={i} position={[0, row.y, 0]}>
          {[0, 1, 2, 3].map((side) => {
            const rot = (side * Math.PI) / 2;
            const w = side % 2 === 0 ? b.width : b.depth;
            const off = side % 2 === 0 ? b.depth / 2 : b.width / 2;
            const emissive = row.lit ? OFFICE_MAT.glass : "#22334a";
            return (
              <mesh
                key={side}
                position={[Math.sin(rot) * off, 0, Math.cos(rot) * off]}
                rotation={[0, rot, 0]}
              >
                <planeGeometry args={[w * 0.9, floorH * 0.55]} />
                <meshStandardMaterial
                  color={OFFICE_MAT.glass}
                  emissive={emissive}
                  emissiveIntensity={row.lit ? 0.6 : 0.05}
                  metalness={0.9}
                  roughness={0.15}
                />
              </mesh>
            );
          })}
        </group>
      ))}
      {/* roof cap + rooftop unit */}
      <mesh position={[0, height + 0.3, 0]} castShadow>
        <boxGeometry args={[b.width + 0.4, 0.6, b.depth + 0.4]} />
        <meshStandardMaterial color={OFFICE_MAT.roof} />
      </mesh>
      <mesh
        position={[b.width * 0.15, height + 1.4, b.depth * 0.15]}
        castShadow
      >
        <boxGeometry args={[b.width * 0.35, 2, b.depth * 0.35]} />
        <meshStandardMaterial color="#3a4358" />
      </mesh>
      {/* subtle tint overlay for load intensity */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[b.width + 0.05, height + 0.05, b.depth + 0.05]} />
        <meshStandardMaterial
          color={tint}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}