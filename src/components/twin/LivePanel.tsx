import { useEffect, useRef, useState } from "react";
import {
  useGetLiveAnomalyQuery,
  useIngestSensorReadingMutation,
  usePredictScenarioSurrogateMutation,
} from "@/store/api/Citytwinapi";
import { useAppSelector } from "@/store/store";
import { toCamel } from "@/store/api/convert";
import { VITE_WS_URL } from "@/lib/variables";

const WS_BASE = VITE_WS_URL;

interface LivePoint {
  hour: number;
  demandKw: number;
  solarKw: number;
  netKw: number;
  trafficVeh: number;
  kpis?: Record<string, number>;
}

export function LivePanel() {
  const scenario = useAppSelector((s) => s.scenario.current);
  const selectedB = useAppSelector((s) => s.scenario.selectedBuildingId);
  const [point, setPoint] = useState<LivePoint | null>(null);
  const [connected, setConnected] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const { data: anomaly, refetch: refetchAnomaly } = useGetLiveAnomalyQuery(
    selectedB ?? "district",
    { pollingInterval: 60000 },
  );
  const [ingest, { isLoading: sending }] = useIngestSensorReadingMutation();
  const [surrogate, { data: surro, isLoading: surroLoading }] =
    usePredictScenarioSurrogateMutation();

  // WebSocket live-stream
  useEffect(() => {
    if (!enabled) {
      wsRef.current?.close();
      wsRef.current = null;
      setConnected(false);
      return;
    }
    const ws = new WebSocket(`${WS_BASE}/ws/simulate`);
    wsRef.current = ws;
    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify(toSnakeParams(scenario)));
    };
    ws.onmessage = (ev) => {
      try {
        const raw = JSON.parse(ev.data);
        if (raw.error) return;
        setPoint(toCamel<LivePoint>(raw));
      } catch {}
    };
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    return () => ws.close();
  }, [enabled]);

  // Push scenario updates over the socket
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(toSnakeParams(scenario)));
    }
  }, [scenario]);

  const sendFakeSensor = async () => {
    await ingest({
      sourceId: selectedB ?? "district",
      kind: "energy_kw",
      value: 100 + Math.random() * 400,
    }).catch(() => {});
    refetchAnomaly();
  };

  return (
    <div className="space-y-2 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Live · realtime
        </h3>
        <label className="flex items-center gap-1.5 text-[11px]">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Stream
          <span
            className={`ml-1 inline-block h-2 w-2 rounded-full ${
              connected
                ? "bg-[color:var(--twin-good)]"
                : "bg-muted-foreground/50"
            }`}
          />
        </label>
      </div>

      {enabled && point && (
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <MiniStat label="Hour" value={String(point.hour).padStart(2, "0")} />
          <MiniStat label="Demand" value={`${point.demandKw.toFixed(0)} kW`} />
          <MiniStat label="Solar" value={`${point.solarKw.toFixed(0)} kW`} />
          <MiniStat label="Net grid" value={`${point.netKw.toFixed(0)} kW`} />
          <MiniStat
            label="Traffic"
            value={`${point.trafficVeh.toFixed(0)} v/h`}
          />
          {point.kpis && (
            <MiniStat
              label="CO₂/day"
              value={`${(point.kpis.co2_kg_per_day ?? 0).toFixed(0)} kg`}
            />
          )}
        </div>
      )}

      <div className="rounded border border-border/60 bg-background/40 p-2">
        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Anomaly ({selectedB ?? "district"})</span>
          <button
            onClick={sendFakeSensor}
            disabled={sending}
            className="rounded bg-primary/80 px-1.5 py-0.5 text-[10px] text-primary-foreground disabled:opacity-40"
          >
            {sending ? "…" : "Push reading"}
          </button>
        </div>
        <div className="text-[11px]">
          {anomaly?.modelLoaded ? (
            <>
              <div>
                Score:{" "}
                <span className="font-mono tabular-nums">
                  {(anomaly.anomalyScore ?? 0).toFixed(3)}
                </span>
              </div>
              <div>
                Status:{" "}
                <span
                  className={
                    anomaly.isAnomaly
                      ? "text-[color:var(--twin-bad)]"
                      : "text-[color:var(--twin-good)]"
                  }
                >
                  {anomaly.isAnomaly ? "ANOMALY" : "normal"}
                </span>{" "}
                · {anomaly.nReadings} readings
              </div>
            </>
          ) : (
            <div className="text-muted-foreground">
              Model not trained yet — run ml/train_anomaly_detector.py
            </div>
          )}
        </div>
      </div>

      <div className="rounded border border-border/60 bg-background/40 p-2">
        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>ML surrogate</span>
          <button
            onClick={() => surrogate(scenario).catch(() => {})}
            disabled={surroLoading}
            className="rounded bg-primary/80 px-1.5 py-0.5 text-[10px] text-primary-foreground disabled:opacity-40"
          >
            {surroLoading ? "…" : "Predict KPIs"}
          </button>
        </div>
        {surro?.modelLoaded && surro.kpis ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] font-mono tabular-nums">
            {Object.entries(surro.kpis).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="truncate text-muted-foreground">{k}</span>
                <span>{Number(v).toFixed(1)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[11px] text-muted-foreground">
            {surro && !surro.modelLoaded
              ? "Surrogate model not trained yet"
              : "Click Predict to run the trained regressor"}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border/60 bg-background/40 px-2 py-1">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-mono tabular-nums text-foreground">{value}</div>
    </div>
  );
}

function toSnakeParams(p: import("@/utils/simulation").ScenarioParams) {
  return {
    solar_adoption_pct: p.solarAdoptionPct,
    ev_share_pct: p.evSharePct,
    hvac_setpoint_c: p.hvacSetpointC,
    signal_timing_pct: p.signalTimingPct,
    outdoor_temp_c: p.outdoorTempC,
    occupancy_pct: p.occupancyPct,
  };
}
