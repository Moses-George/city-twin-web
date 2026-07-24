// import { selectRoad } from "@/store/slices/scene";
// import { useAppDispatch } from "@/store/store";
// import { roadHourCongestion, loadColor } from "@/utils/city.helpers";
// import { DISTRICT } from "@/utils/district";
// import type { RoadResult } from "@/utils/simulation";
// import { useMemo } from "react";
// import type { HoverInfo } from "./city-commons";



// export default function Road({
//   rIndex,
//   result,
//   hour,
//   selected,
//   onHover,
//   onLeave,
// }: {
//   rIndex: number;
//   result: RoadResult;
//   hour: number;
//   selected: boolean;
//   onHover: (info: HoverInfo) => void;
//   onLeave: () => void;
// }) {
//   const r = DISTRICT.roads[rIndex];
//   const dispatch = useAppDispatch();
//   const dx = r.to[0] - r.from[0];
//   const dz = r.to[1] - r.from[1];
//   const length = Math.sqrt(dx * dx + dz * dz);
//   const angle = Math.atan2(dz, dx);
//   const cx = (r.from[0] + r.to[0]) / 2;
//   const cz = (r.from[1] + r.to[1]) / 2;
//   const width = 3 + r.lanes * 1.8;
//   const { congestion, demand } = roadHourCongestion(r, result, hour);
//   const cong = useMemo(() => loadColor(congestion), [congestion]);
//   // Dashed center line pieces
//   const dashes = useMemo(() => {
//     const arr: number[] = [];
//     const step = 6;
//     for (let s = -length / 2 + step / 2; s < length / 2; s += step) arr.push(s);
//     return arr;
//   }, [length]);

//   return (
//     <group position={[cx, 0.02, cz]} rotation={[0, -angle, 0]}>
//       {/* asphalt */}
//       <mesh
//         rotation={[-Math.PI / 2, 0, 0]}
//         receiveShadow
//         onClick={(e) => {
//           e.stopPropagation();
//           dispatch(selectRoad(r.id));
//         }}
//         onPointerOver={(e) => {
//           e.stopPropagation();
//           onHover({
//             kind: "road",
//             title: r.name,
//             subtitle: `${r.lanes} lanes · ${r.hasSignal ? "signalized" : "free-flow"}`,
//             rows: [
//               ["Demand @ hour", `${demand.toFixed(0)} veh/h`],
//               ["Throughput", `${result.throughput.toFixed(0)} veh/h`],
//               ["Congestion", `${(congestion * 100).toFixed(0)}%`],
//               ["CO₂", `${result.co2KgPerHour.toFixed(1)} kg/h`],
//             ],
//           });
//         }}
//         onPointerOut={(e) => {
//           e.stopPropagation();
//           onLeave();
//         }}
//       >
//         <planeGeometry args={[length, width]} />
//         <meshStandardMaterial color="#1a1e26" roughness={0.95} />
//       </mesh>
//       {/* congestion tint strip */}
//       <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
//         <planeGeometry args={[length, width * 0.85]} />
//         <meshBasicMaterial color={cong} transparent opacity={0.32} />
//       </mesh>
//       {/* dashed lane marker */}
//       {dashes.map((s, i) => (
//         <mesh key={i} position={[s, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
//           <planeGeometry args={[2.5, 0.18]} />
//           <meshBasicMaterial color="#e8dcac" />
//         </mesh>
//       ))}
//       {/* sidewalks */}
//       <mesh
//         position={[0, 0.05, width / 2 + 0.6]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <planeGeometry args={[length, 1.2]} />
//         <meshStandardMaterial color="#3a4152" />
//       </mesh>
//       <mesh
//         position={[0, 0.05, -width / 2 - 0.6]}
//         rotation={[-Math.PI / 2, 0, 0]}
//       >
//         <planeGeometry args={[length, 1.2]} />
//         <meshStandardMaterial color="#3a4152" />
//       </mesh>
//       {selected && (
//         <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
//           <planeGeometry args={[length, width + 1.2]} />
//           <meshBasicMaterial color="#5cc4ff" transparent opacity={0.25} />
//         </mesh>
//       )}
//     </group>
//   );
// }

import { selectRoad } from "@/store/slices/scene";
import { useAppDispatch } from "@/store/store";
import { roadHourCongestion, loadColor } from "@/utils/city.helpers";
import { DISTRICT } from "@/utils/district";
import type { RoadResult } from "@/utils/simulation";
import { useMemo } from "react";
import type { HoverInfo } from "./city-commons";



export default function Road({
  rIndex,
  result,
  hour,
  selected,
  onHover,
  onLeave,
}: {
  rIndex: number;
  result: RoadResult;
  hour: number;
  selected: boolean;
  onHover: (info: HoverInfo) => void;
  onLeave: () => void;
}) {
  const r = DISTRICT.roads[rIndex];
  const dispatch = useAppDispatch();
  const dx = r.to[0] - r.from[0];
  const dz = r.to[1] - r.from[1];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  const cx = (r.from[0] + r.to[0]) / 2;
  const cz = (r.from[1] + r.to[1]) / 2;
  const width = 3 + r.lanes * 1.8;
  const { congestion, demand } = roadHourCongestion(r, result, hour);
  const cong = useMemo(() => loadColor(congestion), [congestion]);
  // Dashed center line pieces
  const dashes = useMemo(() => {
    const arr: number[] = [];
    const step = 6;
    for (let s = -length / 2 + step / 2; s < length / 2; s += step) arr.push(s);
    return arr;
  }, [length]);

  return (
    <group position={[cx, 0.02, cz]} rotation={[0, -angle, 0]}>
      {/* asphalt */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          dispatch(selectRoad(r.id));
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover({
            kind: "road",
            title: r.name,
            subtitle: `${r.lanes} lanes · ${r.hasSignal ? "signalized" : "free-flow"}`,
            rows: [
              ["Demand @ hour", `${demand.toFixed(0)} veh/h`],
              ["Throughput", `${result.throughput.toFixed(0)} veh/h`],
              ["Congestion", `${(congestion * 100).toFixed(0)}%`],
              ["CO₂", `${result.co2KgPerHour.toFixed(1)} kg/h`],
            ],
          });
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onLeave();
        }}
      >
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color="#1a1e26" roughness={0.95} />
      </mesh>
      {/* congestion tint strip */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, width * 0.85]} />
        <meshBasicMaterial color={cong} transparent opacity={0.32} />
      </mesh>
      {/* dashed lane marker */}
      {dashes.map((s, i) => (
        <mesh key={i} position={[s, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 0.18]} />
          <meshBasicMaterial color="#e8dcac" />
        </mesh>
      ))}
      {/* sidewalks */}
      <mesh
        position={[0, 0.05, width / 2 + 0.6]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[length, 1.2]} />
        <meshStandardMaterial color="#3a4152" />
      </mesh>
      <mesh
        position={[0, 0.05, -width / 2 - 0.6]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[length, 1.2]} />
        <meshStandardMaterial color="#3a4152" />
      </mesh>
      {selected && (
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[length, width + 1.2]} />
          <meshBasicMaterial color="#5cc4ff" transparent opacity={0.25} />
        </mesh>
      )}
    </group>
  );
}