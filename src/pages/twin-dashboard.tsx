// import { Suspense, useMemo } from "react";
// import { runSimulation } from "../utils/simulation";
// import { ScenarioPanel } from "../components/twin/ScenarioPanel";
// import { CityScene } from "../components/twin/CityScene";
// import { KpiDashboard } from "../components/twin/KpiDashboard";
// import { useAppSelector } from "../store/store";

// export default function TwinDashboard() {
//   const scenario = useAppSelector((s) => s.scenario.current);
//   const result = useMemo(() => runSimulation(scenario), [scenario]);

//   return (
//     <div className="flex h-screen w-full flex-col bg-background text-foreground">
//       <header className="flex items-center justify-between border-b border-border px-5 py-3">
//         <div className="flex items-center gap-3">
//           <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
//             <svg
//               viewBox="0 0 24 24"
//               width="18"
//               height="18"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" />
//             </svg>
//           </div>
//           <div>
//             <h1 className="text-sm font-semibold tracking-tight">CityTwin</h1>
//             <p className="text-[11px] text-muted-foreground">
//               Integrated Smart District Digital Twin · Energy · Traffic ·
//               Buildings
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
//           <span className="flex items-center gap-1.5">
//             <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--twin-good)]" />{" "}
//             Low load
//           </span>
//           <span className="flex items-center gap-1.5">
//             <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--twin-warn)]" />{" "}
//             Medium
//           </span>
//           <span className="flex items-center gap-1.5">
//             <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--twin-bad)]" />{" "}
//             High
//           </span>
//         </div>
//       </header>
//       <div className="grid flex-1 min-h-0 grid-cols-12 gap-3 p-3">
//         <aside className="col-span-3 min-h-0 overflow-y-auto">
//           <ScenarioPanel />
//         </aside>
//         <main className="col-span-6 min-h-0 overflow-hidden rounded-lg border border-border bg-card">
//           {/* <ClientOnly fallback={<SceneLoading />}> */}
//           <Suspense fallback={<SceneLoading />}>
//             <CityScene result={result} />
//           </Suspense>
//           {/* </ClientOnly> */}
//         </main>
//         <aside className="col-span-3 min-h-0 overflow-y-auto">
//           <KpiDashboard result={result} />
//         </aside>
//       </div>
//     </div>
//   );
// }

// function SceneLoading() {
//   return (
//     <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
//       Loading district…
//     </div>
//   );
// }


import { Suspense, useMemo } from "react";
import { runSimulation, type SimulationResult } from "../utils/simulation";
import { ScenarioPanel } from "../components/twin/ScenarioPanel";
import { CityScene } from "../components/twin/CityScene";
import { KpiDashboard } from "../components/twin/KpiDashboard";
import { ServerScenariosPanel } from "../components/twin/ServerScenariosPanel";
import { LivePanel } from "../components/twin/LivePanel";
import { useAppDispatch, useAppSelector } from "../store/store";
import { toggleUseBackend } from "@/store/slices/scene";
import { useSimulateQuery } from "@/store/api/Citytwinapi";

export default function TwinDashboard() {
  const scenario = useAppSelector((s) => s.scenario.current);
  const useBackend = useAppSelector((s) => s.scenario.useBackend);
  const dispatch = useAppDispatch();

  const local = useMemo(() => runSimulation(scenario), [scenario]);
  const { data: remote, isFetching, isError } = useSimulateQuery(scenario, {
    skip: !useBackend,
  });
  const result: SimulationResult = useBackend && remote ? remote : local;

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">CityTwin</h1>
            <p className="text-[11px] text-muted-foreground">
              Integrated Smart District Digital Twin · Energy · Traffic · Buildings · Realtime
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <label className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2 py-1">
            <input
              type="checkbox"
              checked={useBackend}
              onChange={() => dispatch(toggleUseBackend())}
            />
            <span className="text-foreground">Use FastAPI backend</span>
            {useBackend && isFetching && <span className="text-primary">…</span>}
            {useBackend && isError && (
              <span className="text-[color:var(--twin-bad)]">offline</span>
            )}
          </label>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--twin-good)]" /> Low load
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--twin-warn)]" /> Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--twin-bad)]" /> High
          </span>
        </div>
      </header>
      <div className="grid flex-1 min-h-0 grid-cols-12 gap-3 p-3">
        <aside className="col-span-3 min-h-0 overflow-y-auto space-y-3">
          <ScenarioPanel />
          <ServerScenariosPanel />
        </aside>
        <main className="col-span-6 min-h-0 overflow-hidden rounded-lg border border-border bg-card">
          <Suspense fallback={<SceneLoading />}>
            <CityScene result={result} />
          </Suspense>
        </main>
        <aside className="col-span-3 min-h-0 overflow-y-auto space-y-3">
          <KpiDashboard result={result} />
          <LivePanel />
        </aside>
      </div>
    </div>
  );
}

function SceneLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
      Loading district…
    </div>
  );
}
