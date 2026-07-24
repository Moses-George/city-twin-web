// import * as THREE from "three";
// import { roadHourCongestion } from "@/utils/city.helpers";
// import { DISTRICT } from "@/utils/district";
// import type { RoadResult } from "@/utils/simulation";
// import { useFrame } from "@react-three/fiber";
// import { useMemo, useRef } from "react";


// export default function Vehicles({
//   hour,
//   results,
// }: {
//   hour: number;
//   results: RoadResult[];
// }) {
//   // Precompute per-road vehicle positions
//   const roadData = useMemo(() => {
//     return DISTRICT.roads.map((r, i) => {
//       const rr = results[i];
//       const { congestion } = roadHourCongestion(r, rr, hour);
//       const dx = r.to[0] - r.from[0];
//       const dz = r.to[1] - r.from[1];
//       const length = Math.sqrt(dx * dx + dz * dz);
//       const nx = dx / length;
//       const nz = dz / length;
//       const nVeh = Math.max(1, Math.round(4 + congestion * 12));
//       const speed = (1 - congestion) * 14 + 2;
//       const cong = congestion;
//       return {
//         r,
//         length,
//         nx,
//         nz,
//         cx: (r.from[0] + r.to[0]) / 2,
//         cz: (r.from[1] + r.to[1]) / 2,
//         nVeh,
//         speed,
//         cong,
//       };
//     });
//   }, [hour, results]);

//   const totalVeh = useMemo(
//     () => roadData.reduce((a, d) => a + d.nVeh, 0),
//     [roadData],
//   );
//   const meshRef = useRef<THREE.InstancedMesh>(null);
//   const tRef = useRef(0);
//   const dummy = useMemo(() => new THREE.Object3D(), []);

//   useFrame((_, delta) => {
//     tRef.current += delta;
//     const mesh = meshRef.current;
//     if (!mesh) return;
//     let idx = 0;
//     for (const d of roadData) {
//       for (let k = 0; k < d.nVeh; k++) {
//         const offset =
//           (k / d.nVeh) * d.length + ((tRef.current * d.speed) % d.length);
//         const pos = ((offset + d.length) % d.length) - d.length / 2;
//         const px = d.cx + d.nx * pos;
//         const pz = d.cz + d.nz * pos;
//         // perpendicular offset onto correct lane
//         const perpX = -d.nz;
//         const perpZ = d.nx;
//         const lane = k % 2 === 0 ? 1.2 : -1.2;
//         dummy.position.set(px + perpX * lane, 0.55, pz + perpZ * lane);
//         dummy.rotation.set(
//           0,
//           Math.atan2(d.nz * (lane > 0 ? 1 : -1), d.nx * (lane > 0 ? 1 : -1)),
//           0,
//         );
//         dummy.updateMatrix();
//         mesh.setMatrixAt(idx, dummy.matrix);
//         const c = new THREE.Color().setHSL(0.55 - d.cong * 0.55, 0.7, 0.55);
//         mesh.setColorAt(idx, c);
//         idx++;
//       }
//     }
//     mesh.instanceMatrix.needsUpdate = true;
//     if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
//   });

//   return (
//     <instancedMesh
//       ref={meshRef}
//       args={[undefined, undefined, totalVeh]}
//       castShadow
//     >
//       <boxGeometry args={[2.2, 1.0, 1.1]} />
//       <meshStandardMaterial color="#ffffff" metalness={0.4} roughness={0.4} />
//     </instancedMesh>
//   );
// }


import * as THREE from "three";
import { roadHourCongestion } from "@/utils/city.helpers";
import { DISTRICT } from "@/utils/district";
import type { RoadResult } from "@/utils/simulation";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";


export default function Vehicles({
  hour,
  results,
}: {
  hour: number;
  results: RoadResult[];
}) {
  // Precompute per-road vehicle positions
  const roadData = useMemo(() => {
    return DISTRICT.roads.map((r, i) => {
      const rr = results[i];
      const { congestion } = roadHourCongestion(r, rr, hour);
      const dx = r.to[0] - r.from[0];
      const dz = r.to[1] - r.from[1];
      const length = Math.sqrt(dx * dx + dz * dz);
      const nx = dx / length;
      const nz = dz / length;
      const nVeh = Math.max(1, Math.round(4 + congestion * 12));
      const speed = (1 - congestion) * 14 + 2;
      const cong = congestion;
      return {
        r,
        length,
        nx,
        nz,
        cx: (r.from[0] + r.to[0]) / 2,
        cz: (r.from[1] + r.to[1]) / 2,
        nVeh,
        speed,
        cong,
      };
    });
  }, [hour, results]);

  const totalVeh = useMemo(
    () => roadData.reduce((a, d) => a + d.nVeh, 0),
    [roadData],
  );
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tRef = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    tRef.current += delta;
    const mesh = meshRef.current;
    if (!mesh) return;
    let idx = 0;
    for (const d of roadData) {
      for (let k = 0; k < d.nVeh; k++) {
        const offset =
          (k / d.nVeh) * d.length + ((tRef.current * d.speed) % d.length);
        const pos = ((offset + d.length) % d.length) - d.length / 2;
        const px = d.cx + d.nx * pos;
        const pz = d.cz + d.nz * pos;
        // perpendicular offset onto correct lane
        const perpX = -d.nz;
        const perpZ = d.nx;
        const lane = k % 2 === 0 ? 1.2 : -1.2;
        dummy.position.set(px + perpX * lane, 0.55, pz + perpZ * lane);
        dummy.rotation.set(
          0,
          Math.atan2(d.nz * (lane > 0 ? 1 : -1), d.nx * (lane > 0 ? 1 : -1)),
          0,
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);
        const c = new THREE.Color().setHSL(0.55 - d.cong * 0.55, 0.7, 0.55);
        mesh.setColorAt(idx, c);
        idx++;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, totalVeh]}
      castShadow
    >
      <boxGeometry args={[2.2, 1.0, 1.1]} />
      <meshStandardMaterial color="#ffffff" metalness={0.4} roughness={0.4} />
    </instancedMesh>
  );
}
