// import { DISTRICT } from "@/utils/district";
// import { Instances, Instance } from "@react-three/drei";
// import { useMemo } from "react";


// export default function Trees() {
//   // Sprinkle deterministic trees in gaps
//   const positions = useMemo(() => {
//     const arr: [number, number][] = [];
//     let s = 7;
//     const rnd = () => {
//       s = (s * 1103515245 + 12345) & 0x7fffffff;
//       return (s % 1000) / 1000;
//     };
//     for (let i = 0; i < 40; i++) {
//       const x = -110 + rnd() * 220;
//       const z = -90 + rnd() * 180;
//       // avoid buildings
//       const near = DISTRICT.buildings.some(
//         (b) =>
//           Math.abs(b.x - x) < b.width / 2 + 4 &&
//           Math.abs(b.z - z) < b.depth / 2 + 4,
//       );
//       if (!near) arr.push([x, z]);
//     }
//     return arr;
//   }, []);
//   return (
//     <Instances limit={100} range={100} castShadow>
//       <coneGeometry args={[1.4, 4.5, 8]} />
//       <meshStandardMaterial color="#2d5a3a" roughness={0.9} />
//       {positions.map(([x, z], i) => (
//         <Instance key={i} position={[x, 2.3, z]} />
//       ))}
//     </Instances>
//   );
// }

import { DISTRICT } from "@/utils/district";
import { Instances, Instance } from "@react-three/drei";
import { useMemo } from "react";


export default function Trees() {
  // Sprinkle deterministic trees in gaps
  const positions = useMemo(() => {
    const arr: [number, number][] = [];
    let s = 7;
    const rnd = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return (s % 1000) / 1000;
    };
    for (let i = 0; i < 40; i++) {
      const x = -110 + rnd() * 220;
      const z = -90 + rnd() * 180;
      // avoid buildings
      const near = DISTRICT.buildings.some(
        (b) =>
          Math.abs(b.x - x) < b.width / 2 + 4 &&
          Math.abs(b.z - z) < b.depth / 2 + 4,
      );
      if (!near) arr.push([x, z]);
    }
    return arr;
  }, []);
  return (
    <Instances limit={100} range={100} castShadow>
      <coneGeometry args={[1.4, 4.5, 8]} />
      <meshStandardMaterial color="#2d5a3a" roughness={0.9} />
      {positions.map(([x, z], i) => (
        <Instance key={i} position={[x, 2.3, z]} />
      ))}
    </Instances>
  );
}