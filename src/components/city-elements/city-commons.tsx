// // ---------- hover tooltip ----------

// import { DISTRICT } from "@/utils/district";
// import { Html } from "@react-three/drei";

// export interface HoverInfo {
//   kind: "building" | "road";
//   title: string;
//   subtitle: string;
//   rows: [string, string][];
// }

// export function HoverTooltip({ hover }: { hover: HoverInfo | null }) {
//   if (!hover) return null;
//   return (
//     <div
//       className="pointer-events-none absolute left-3 top-3 z-20 rounded-md border border-primary/40 bg-card/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
//       style={{ minWidth: 180 }}
//     >
//       <div className="flex items-baseline justify-between gap-3">
//         <div className="font-semibold text-foreground">{hover.title}</div>
//         <div className="text-[10px] uppercase tracking-wider text-primary">
//           {hover.kind}
//         </div>
//       </div>
//       <div className="text-[10px] capitalize text-muted-foreground">
//         {hover.subtitle}
//       </div>
//       <div className="mt-1.5 space-y-0.5">
//         {hover.rows.map(([k, v]) => (
//           <div key={k} className="flex justify-between gap-3">
//             <span className="text-muted-foreground">{k}</span>
//             <span className="font-medium tabular-nums text-foreground">
//               {v}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export function BuildingLabels() {
//   return (
//     <>
//       {DISTRICT.buildings.map((b) => {
//         const h =
//           b.type === "industrial" ? b.floors * 5 + 4 : b.floors * 3.2 + 4;
//         return (
//           <Html key={b.id} position={[b.x, h, b.z]} center distanceFactor={100}>
//             <div className="pointer-events-none whitespace-nowrap rounded bg-background/85 px-1.5 py-0.5 text-[9px] text-foreground shadow-md">
//               {b.name}
//             </div>
//           </Html>
//         );
//       })}
//     </>
//   );
// }


// ---------- hover tooltip ----------

import { DISTRICT } from "@/utils/district";
import { Html } from "@react-three/drei";

export interface HoverInfo {
  kind: "building" | "road";
  title: string;
  subtitle: string;
  rows: [string, string][];
}

export function HoverTooltip({ hover }: { hover: HoverInfo | null }) {
  if (!hover) return null;
  return (
    <div
      className="pointer-events-none absolute left-3 top-3 z-20 rounded-md border border-primary/40 bg-card/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
      style={{ minWidth: 180 }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-semibold text-foreground">{hover.title}</div>
        <div className="text-[10px] uppercase tracking-wider text-primary">
          {hover.kind}
        </div>
      </div>
      <div className="text-[10px] capitalize text-muted-foreground">
        {hover.subtitle}
      </div>
      <div className="mt-1.5 space-y-0.5">
        {hover.rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <span className="text-muted-foreground">{k}</span>
            <span className="font-medium tabular-nums text-foreground">
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BuildingLabels() {
  return (
    <>
      {DISTRICT.buildings.map((b) => {
        const h =
          b.type === "industrial" ? b.floors * 5 + 4 : b.floors * 3.2 + 4;
        return (
          <Html key={b.id} position={[b.x, h, b.z]} center distanceFactor={100}>
            <div className="pointer-events-none whitespace-nowrap rounded bg-background/85 px-1.5 py-0.5 text-[9px] text-foreground shadow-md">
              {b.name}
            </div>
          </Html>
        );
      })}
    </>
  );
}