import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  applyScenario,
  resetScenario,
  saveAsBaseline,
  setParam,
} from "@/store/slices/scene";
import { DEFAULT_SCENARIO, type ScenarioParams } from "../../utils/simulation";

interface SliderDef {
  key: keyof ScenarioParams;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  hint: string;
}

interface Group {
  title: string;
  icon: string;
  sliders: SliderDef[];
}

const GROUPS: Group[] = [
  {
    title: "Traffic demand",
    icon: "🚦",
    sliders: [
      {
        key: "occupancyPct",
        label: "Activity level",
        min: 30,
        max: 120,
        step: 5,
        unit: "%",
        hint: "Occupancy & mobility vs typical weekday",
      },
      {
        key: "evSharePct",
        label: "EV share",
        min: 0,
        max: 100,
        step: 5,
        unit: "%",
        hint: "Electric vehicles as % of fleet",
      },
      {
        key: "signalTimingPct",
        label: "Signal timing efficiency",
        min: 50,
        max: 150,
        step: 5,
        unit: "%",
        hint: "Adaptive signal effectiveness vs baseline",
      },
    ],
  },
  {
    title: "Building energy",
    icon: "🏢",
    sliders: [
      {
        key: "solarAdoptionPct",
        label: "Solar PV adoption",
        min: 0,
        max: 100,
        step: 5,
        unit: "%",
        hint: "Share of solar-capable rooftops with PV",
      },
      {
        key: "hvacSetpointC",
        label: "HVAC setpoint",
        min: 16,
        max: 26,
        step: 0.5,
        unit: "°C",
        hint: "Building indoor target temperature",
      },
    ],
  },
  {
    title: "Weather",
    icon: "🌤",
    sliders: [
      {
        key: "outdoorTempC",
        label: "Outdoor temperature",
        min: -5,
        max: 35,
        step: 1,
        unit: "°C",
        hint: "Ambient weather condition",
      },
    ],
  },
];

interface Preset {
  name: string;
  desc: string;
  scenario: ScenarioParams;
}

const PRESETS: Preset[] = [
  {
    name: "Baseline today",
    desc: "Current district as-is",
    scenario: { ...DEFAULT_SCENARIO },
  },
  {
    name: "Green 2030",
    desc: "80% solar, 60% EV, tight signals",
    scenario: {
      solarAdoptionPct: 80,
      evSharePct: 60,
      hvacSetpointC: 22,
      signalTimingPct: 130,
      outdoorTempC: 16,
      occupancyPct: 100,
    },
  },
  {
    name: "Heatwave",
    desc: "35°C summer peak, high AC",
    scenario: {
      solarAdoptionPct: 40,
      evSharePct: 20,
      hvacSetpointC: 20,
      signalTimingPct: 100,
      outdoorTempC: 35,
      occupancyPct: 110,
    },
  },
  {
    name: "Cold snap",
    desc: "-5°C winter with heating load",
    scenario: {
      solarAdoptionPct: 25,
      evSharePct: 15,
      hvacSetpointC: 22,
      signalTimingPct: 90,
      outdoorTempC: -5,
      occupancyPct: 100,
    },
  },
  {
    name: "Rush hour",
    desc: "Peak demand, poor signals",
    scenario: {
      solarAdoptionPct: 25,
      evSharePct: 15,
      hvacSetpointC: 21,
      signalTimingPct: 70,
      outdoorTempC: 14,
      occupancyPct: 120,
    },
  },
];

export function ScenarioPanel() {
  const scenario = useAppSelector((s) => s.scenario.current);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
            What-if scenario
          </h2>
          <p className="text-xs text-muted-foreground">
            Adjust levers to re-simulate the district
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => dispatch(saveAsBaseline())}
            className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground hover:bg-muted"
          >
            Save baseline
          </button>
          <button
            onClick={() => dispatch(resetScenario())}
            className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground hover:bg-muted"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Presets */}
      <div>
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Scenario presets
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => dispatch(applyScenario(p.scenario))}
              className="rounded-md border border-border bg-secondary px-2 py-1.5 text-left transition hover:border-primary/50 hover:bg-muted"
            >
              <div className="text-[11px] font-semibold text-foreground">
                {p.name}
              </div>
              <div className="text-[9px] leading-tight text-muted-foreground">
                {p.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Grouped sliders */}
      {GROUPS.map((g) => (
        <div
          key={g.title}
          className="rounded-md border border-border/50 bg-background/40 p-2.5"
        >
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>{g.icon}</span>
            <span>{g.title}</span>
          </div>
          <div className="space-y-3">
            {g.sliders.map((s) => {
              const value = scenario[s.key];
              return (
                <div key={s.key}>
                  <div className="mb-1 flex items-baseline justify-between text-xs">
                    <label className="font-medium text-foreground">
                      {s.label}
                    </label>
                    <span className="tabular-nums text-primary">
                      {value.toFixed(s.step < 1 ? 1 : 0)}
                      {s.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={value}
                    onChange={(e) =>
                      dispatch(
                        setParam({ key: s.key, value: Number(e.target.value) }),
                      )
                    }
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--primary)]"
                  />
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {s.hint}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
