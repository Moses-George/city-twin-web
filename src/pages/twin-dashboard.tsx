import { Suspense, useMemo } from "react";
import { runSimulation } from "../utils/simulation";
import { ScenarioPanel } from "../components/twin/ScenarioPanel";
import { CityScene } from "../components/twin/CityScene";
import { KpiDashboard } from "../components/twin/KpiDashboard";
import { useAppSelector } from "../store/store";

export default function TwinDashboard() {
  const scenario = useAppSelector((s) => s.scenario.current);
  const result = useMemo(() => runSimulation(scenario), [scenario]);

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">CityTwin</h1>
            <p className="text-[11px] text-muted-foreground">
              Integrated Smart District Digital Twin · Energy · Traffic ·
              Buildings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--twin-good)]" />{" "}
            Low load
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--twin-warn)]" />{" "}
            Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--twin-bad)]" />{" "}
            High
          </span>
        </div>
      </header>
      <div className="grid flex-1 min-h-0 grid-cols-12 gap-3 p-3">
        <aside className="col-span-3 min-h-0 overflow-y-auto">
          <ScenarioPanel />
        </aside>
        <main className="col-span-6 min-h-0 overflow-hidden rounded-lg border border-border bg-card">
          {/* <ClientOnly fallback={<SceneLoading />}> */}
          <Suspense fallback={<SceneLoading />}>
            <CityScene result={result} />
          </Suspense>
          {/* </ClientOnly> */}
        </main>
        <aside className="col-span-3 min-h-0 overflow-y-auto">
          <KpiDashboard result={result} />
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
