// import {  DISTRICT } from "@/utils/district";
// import { useAppSelector } from "@/store/store";
// import type { SimulationResult } from "@/utils/simulation";

// function Kpi({
//   label,
//   value,
//   unit,
//   delta,
//   tone = "neutral",
// }: {
//   label: string;
//   value: string;
//   unit: string;
//   delta?: string;
//   tone?: "good" | "warn" | "bad" | "neutral";
// }) {
//   const toneClass =
//     tone === "good"
//       ? "text-[color:var(--twin-good)]"
//       : tone === "warn"
//         ? "text-[color:var(--twin-warn)]"
//         : tone === "bad"
//           ? "text-[color:var(--twin-bad)]"
//           : "text-muted-foreground";
//   return (
//     <div className="rounded-lg border border-border bg-card p-3">
//       <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
//         {label}
//       </div>
//       <div className="mt-1 flex items-baseline gap-1">
//         <div className="text-2xl font-semibold tabular-nums text-foreground">
//           {value}
//         </div>
//         <div className="text-xs text-muted-foreground">{unit}</div>
//       </div>
//       {delta && (
//         <div className={`mt-0.5 text-[11px] ${toneClass}`}>{delta}</div>
//       )}
//     </div>
//   );
// }

// function HourlyChart({ result }: { result: SimulationResult }) {
//   const w = 320;
//   const h = 110;
//   const pad = 22;
//   const max = Math.max(...result.hourly.map((p) => p.demandKw));
//   const trafficMax = Math.max(...result.hourly.map((p) => p.trafficVeh));
//   const xs = (i: number) => pad + (i / 23) * (w - pad * 2);
//   const yEnergy = (v: number) => h - pad - (v / max) * (h - pad * 2);
//   const yTraffic = (v: number) => h - pad - (v / trafficMax) * (h - pad * 2);

//   const demandPath = result.hourly
//     .map(
//       (p, i) =>
//         `${i === 0 ? "M" : "L"}${xs(i).toFixed(1)},${yEnergy(p.demandKw).toFixed(1)}`,
//     )
//     .join(" ");
//   const netPath = result.hourly
//     .map(
//       (p, i) =>
//         `${i === 0 ? "M" : "L"}${xs(i).toFixed(1)},${yEnergy(p.netKw).toFixed(1)}`,
//     )
//     .join(" ");
//   const trafficPath = result.hourly
//     .map(
//       (p, i) =>
//         `${i === 0 ? "M" : "L"}${xs(i).toFixed(1)},${yTraffic(p.trafficVeh).toFixed(1)}`,
//     )
//     .join(" ");

//   return (
//     <div className="rounded-lg border border-border bg-card p-3">
//       <div className="mb-1 flex items-center justify-between">
//         <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
//           24-hour profile
//         </div>
//         <div className="flex gap-2 text-[10px]">
//           <span className="flex items-center gap-1 text-muted-foreground">
//             <span
//               className="h-1.5 w-3 rounded-full"
//               style={{ background: "var(--chart-4)" }}
//             />
//             Gross demand
//           </span>
//           <span className="flex items-center gap-1 text-muted-foreground">
//             <span
//               className="h-1.5 w-3 rounded-full"
//               style={{ background: "var(--primary)" }}
//             />
//             Grid import
//           </span>
//           <span className="flex items-center gap-1 text-muted-foreground">
//             <span
//               className="h-1.5 w-3 rounded-full"
//               style={{ background: "var(--accent)" }}
//             />
//             Traffic
//           </span>
//         </div>
//       </div>
//       <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
//         <path
//           d={demandPath}
//           fill="none"
//           stroke="var(--chart-4)"
//           strokeWidth={1.5}
//         />
//         <path
//           d={netPath}
//           fill="none"
//           stroke="var(--primary)"
//           strokeWidth={1.5}
//         />
//         <path
//           d={trafficPath}
//           fill="none"
//           stroke="var(--accent)"
//           strokeWidth={1.5}
//           strokeDasharray="3 2"
//         />
//         {[0, 6, 12, 18, 23].map((h) => (
//           <text
//             key={h}
//             x={xs(h)}
//             y={110 - 4}
//             fontSize={8}
//             fill="var(--muted-foreground)"
//             textAnchor="middle"
//           >
//             {h.toString().padStart(2, "0")}:00
//           </text>
//         ))}
//       </svg>
//     </div>
//   );
// }

// function SelectionDetail({ result }: { result: SimulationResult }) {
//   const selB = useAppSelector((s) => s.scenario.selectedBuildingId);
//   const selR = useAppSelector((s) => s.scenario.selectedRoadId);
//   if (!selB && !selR) return null;
//   if (selB) {
//     const b = DISTRICT.buildings.find((x) => x.id === selB)!;
//     const r = result.buildings.find((x) => x.id === selB)!;
//     return (
//       <div className="rounded-lg border border-primary/40 bg-card p-3">
//         <div className="text-[10px] font-medium uppercase tracking-wider text-primary">
//           Building selected
//         </div>
//         <div className="mt-1 flex items-baseline justify-between">
//           <div className="text-base font-semibold">{b.name}</div>
//           <div className="text-xs capitalize text-muted-foreground">
//             {b.type} · {b.floors}fl
//           </div>
//         </div>
//         <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
//           <div>
//             <span className="text-muted-foreground">Daily use</span>
//             <div className="font-medium tabular-nums">
//               {r.dailyKwh.toFixed(0)} kWh
//             </div>
//           </div>
//           <div>
//             <span className="text-muted-foreground">Solar</span>
//             <div className="font-medium tabular-nums">
//               {r.solarKwh.toFixed(0)} kWh
//             </div>
//           </div>
//           <div>
//             <span className="text-muted-foreground">Grid import</span>
//             <div className="font-medium tabular-nums">
//               {r.netKwh.toFixed(0)} kWh
//             </div>
//           </div>
//           <div>
//             <span className="text-muted-foreground">Comfort</span>
//             <div className="font-medium tabular-nums">
//               {(r.comfortScore * 100).toFixed(0)}%
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   const road = DISTRICT.roads.find((x) => x.id === selR)!;
//   const r = result.roads.find((x) => x.id === selR)!;
//   return (
//     <div className="rounded-lg border border-primary/40 bg-card p-3">
//       <div className="text-[10px] font-medium uppercase tracking-wider text-primary">
//         Road selected
//       </div>
//       <div className="mt-1 flex items-baseline justify-between">
//         <div className="text-base font-semibold">{road.name}</div>
//         <div className="text-xs text-muted-foreground">
//           {road.lanes} lane · {road.hasSignal ? "signalized" : "free"}
//         </div>
//       </div>
//       <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
//         <div>
//           <span className="text-muted-foreground">Demand</span>
//           <div className="font-medium tabular-nums">
//             {r.demand.toFixed(0)} veh/h
//           </div>
//         </div>
//         <div>
//           <span className="text-muted-foreground">Throughput</span>
//           <div className="font-medium tabular-nums">
//             {r.throughput.toFixed(0)} veh/h
//           </div>
//         </div>
//         <div>
//           <span className="text-muted-foreground">Congestion</span>
//           <div className="font-medium tabular-nums">
//             {(r.congestion * 100).toFixed(0)}%
//           </div>
//         </div>
//         <div>
//           <span className="text-muted-foreground">CO₂</span>
//           <div className="font-medium tabular-nums">
//             {r.co2KgPerHour.toFixed(1)} kg/h
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function KpiDashboard({ result }: { result: SimulationResult }) {
//   const k = result.kpis;
//   return (
//     <div className="space-y-3">
//       <div className="grid grid-cols-2 gap-2">
//         <Kpi
//           label="Grid import"
//           value={k.gridImportKwh.toFixed(0)}
//           unit="kWh/day"
//           tone={
//             k.gridImportKwh < 8000
//               ? "good"
//               : k.gridImportKwh < 14000
//                 ? "warn"
//                 : "bad"
//           }
//         />
//         <Kpi
//           label="Solar gen"
//           value={k.solarGenerationKwh.toFixed(0)}
//           unit="kWh/day"
//           tone="good"
//         />
//         <Kpi
//           label="Peak load"
//           value={k.peakLoadKw.toFixed(0)}
//           unit="kW"
//           tone={k.peakLoadKw < 800 ? "good" : "warn"}
//         />
//         <Kpi
//           label="Renewables"
//           value={k.renewableSharePct.toFixed(1)}
//           unit="%"
//           tone={k.renewableSharePct > 20 ? "good" : "warn"}
//         />
//         <Kpi
//           label="Avg comfort"
//           value={(k.avgComfort * 100).toFixed(0)}
//           unit="%"
//           tone={
//             k.avgComfort > 0.7 ? "good" : k.avgComfort > 0.4 ? "warn" : "bad"
//           }
//         />
//         <Kpi
//           label="Avg congestion"
//           value={(k.avgCongestion * 100).toFixed(0)}
//           unit="%"
//           tone={
//             k.avgCongestion < 0.5
//               ? "good"
//               : k.avgCongestion < 0.8
//                 ? "warn"
//                 : "bad"
//           }
//         />
//         <Kpi
//           label="CO₂ / day"
//           value={k.co2KgPerDay.toFixed(0)}
//           unit="kg"
//           tone={k.co2KgPerDay < 4000 ? "good" : "warn"}
//         />
//         <Kpi
//           label="EV grid load"
//           value={k.evGridLoadKwh.toFixed(0)}
//           unit="kWh"
//           tone="neutral"
//         />
//       </div>
//       <HourlyChart result={result} />
//       <SelectionDetail result={result} />
//     </div>
//   );
// }


import {  DISTRICT } from "@/utils/district";
import { useAppSelector } from "@/store/store";
import type { SimulationResult } from "@/utils/simulation";

function Kpi({
  label,
  value,
  unit,
  delta,
  tone = "neutral",
}: {
  label: string;
  value: string;
  unit: string;
  delta?: string;
  tone?: "good" | "warn" | "bad" | "neutral";
}) {
  const toneClass =
    tone === "good"
      ? "text-[color:var(--twin-good)]"
      : tone === "warn"
        ? "text-[color:var(--twin-warn)]"
        : tone === "bad"
          ? "text-[color:var(--twin-bad)]"
          : "text-muted-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <div className="text-2xl font-semibold tabular-nums text-foreground">
          {value}
        </div>
        <div className="text-xs text-muted-foreground">{unit}</div>
      </div>
      {delta && (
        <div className={`mt-0.5 text-[11px] ${toneClass}`}>{delta}</div>
      )}
    </div>
  );
}

function HourlyChart({ result }: { result: SimulationResult }) {
  const w = 320;
  const h = 110;
  const pad = 22;
  const max = Math.max(...result.hourly.map((p) => p.demandKw));
  const trafficMax = Math.max(...result.hourly.map((p) => p.trafficVeh));
  const xs = (i: number) => pad + (i / 23) * (w - pad * 2);
  const yEnergy = (v: number) => h - pad - (v / max) * (h - pad * 2);
  const yTraffic = (v: number) => h - pad - (v / trafficMax) * (h - pad * 2);

  const demandPath = result.hourly
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${xs(i).toFixed(1)},${yEnergy(p.demandKw).toFixed(1)}`,
    )
    .join(" ");
  const netPath = result.hourly
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${xs(i).toFixed(1)},${yEnergy(p.netKw).toFixed(1)}`,
    )
    .join(" ");
  const trafficPath = result.hourly
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${xs(i).toFixed(1)},${yTraffic(p.trafficVeh).toFixed(1)}`,
    )
    .join(" ");

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-1 flex items-center justify-between">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          24-hour profile
        </div>
        <div className="flex gap-2 text-[10px]">
          <span className="flex items-center gap-1 text-muted-foreground">
            <span
              className="h-1.5 w-3 rounded-full"
              style={{ background: "var(--chart-4)" }}
            />
            Gross demand
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <span
              className="h-1.5 w-3 rounded-full"
              style={{ background: "var(--primary)" }}
            />
            Grid import
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <span
              className="h-1.5 w-3 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            Traffic
          </span>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <path
          d={demandPath}
          fill="none"
          stroke="var(--chart-4)"
          strokeWidth={1.5}
        />
        <path
          d={netPath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={1.5}
        />
        <path
          d={trafficPath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
          strokeDasharray="3 2"
        />
        {[0, 6, 12, 18, 23].map((h) => (
          <text
            key={h}
            x={xs(h)}
            y={110 - 4}
            fontSize={8}
            fill="var(--muted-foreground)"
            textAnchor="middle"
          >
            {h.toString().padStart(2, "0")}:00
          </text>
        ))}
      </svg>
    </div>
  );
}

function SelectionDetail({ result }: { result: SimulationResult }) {
  const selB = useAppSelector((s) => s.scenario.selectedBuildingId);
  const selR = useAppSelector((s) => s.scenario.selectedRoadId);
  if (!selB && !selR) return null;
  if (selB) {
    const b = DISTRICT.buildings.find((x) => x.id === selB)!;
    const r = result.buildings.find((x) => x.id === selB)!;
    return (
      <div className="rounded-lg border border-primary/40 bg-card p-3">
        <div className="text-[10px] font-medium uppercase tracking-wider text-primary">
          Building selected
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <div className="text-base font-semibold">{b.name}</div>
          <div className="text-xs capitalize text-muted-foreground">
            {b.type} · {b.floors}fl
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Daily use</span>
            <div className="font-medium tabular-nums">
              {r.dailyKwh.toFixed(0)} kWh
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Solar</span>
            <div className="font-medium tabular-nums">
              {r.solarKwh.toFixed(0)} kWh
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Grid import</span>
            <div className="font-medium tabular-nums">
              {r.netKwh.toFixed(0)} kWh
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Comfort</span>
            <div className="font-medium tabular-nums">
              {(r.comfortScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    );
  }
  const road = DISTRICT.roads.find((x) => x.id === selR)!;
  const r = result.roads.find((x) => x.id === selR)!;
  return (
    <div className="rounded-lg border border-primary/40 bg-card p-3">
      <div className="text-[10px] font-medium uppercase tracking-wider text-primary">
        Road selected
      </div>
      <div className="mt-1 flex items-baseline justify-between">
        <div className="text-base font-semibold">{road.name}</div>
        <div className="text-xs text-muted-foreground">
          {road.lanes} lane · {road.hasSignal ? "signalized" : "free"}
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Demand</span>
          <div className="font-medium tabular-nums">
            {r.demand.toFixed(0)} veh/h
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Throughput</span>
          <div className="font-medium tabular-nums">
            {r.throughput.toFixed(0)} veh/h
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Congestion</span>
          <div className="font-medium tabular-nums">
            {(r.congestion * 100).toFixed(0)}%
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">CO₂</span>
          <div className="font-medium tabular-nums">
            {r.co2KgPerHour.toFixed(1)} kg/h
          </div>
        </div>
      </div>
    </div>
  );
}

export function KpiDashboard({ result }: { result: SimulationResult }) {
  const k = result.kpis;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Kpi
          label="Grid import"
          value={k.gridImportKwh.toFixed(0)}
          unit="kWh/day"
          tone={
            k.gridImportKwh < 8000
              ? "good"
              : k.gridImportKwh < 14000
                ? "warn"
                : "bad"
          }
        />
        <Kpi
          label="Solar gen"
          value={k.solarGenerationKwh.toFixed(0)}
          unit="kWh/day"
          tone="good"
        />
        <Kpi
          label="Peak load"
          value={k.peakLoadKw.toFixed(0)}
          unit="kW"
          tone={k.peakLoadKw < 800 ? "good" : "warn"}
        />
        <Kpi
          label="Renewables"
          value={k.renewableSharePct.toFixed(1)}
          unit="%"
          tone={k.renewableSharePct > 20 ? "good" : "warn"}
        />
        <Kpi
          label="Avg comfort"
          value={(k.avgComfort * 100).toFixed(0)}
          unit="%"
          tone={
            k.avgComfort > 0.7 ? "good" : k.avgComfort > 0.4 ? "warn" : "bad"
          }
        />
        <Kpi
          label="Avg congestion"
          value={(k.avgCongestion * 100).toFixed(0)}
          unit="%"
          tone={
            k.avgCongestion < 0.5
              ? "good"
              : k.avgCongestion < 0.8
                ? "warn"
                : "bad"
          }
        />
        <Kpi
          label="CO₂ / day"
          value={k.co2KgPerDay.toFixed(0)}
          unit="kg"
          tone={k.co2KgPerDay < 4000 ? "good" : "warn"}
        />
        <Kpi
          label="EV grid load"
          value={k.evGridLoadKwh.toFixed(0)}
          unit="kWh"
          tone="neutral"
        />
      </div>
      <HourlyChart result={result} />
      <SelectionDetail result={result} />
    </div>
  );
}

