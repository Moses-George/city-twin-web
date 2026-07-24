import * as THREE from "three";
import type { Building, RoadSegment } from "./district";
import {
  type BuildingResult,
  buildingShapeAt,
  buildingShapeSum,
  SOLAR_SHAPE_EXPORT,
  type RoadResult,
  TRAFFIC_SHAPE_EXPORT,
} from "./simulation";

// ---------- helpers ----------

export function loadColor(t: number): THREE.Color {
  const clamped = Math.max(0, Math.min(1, t));
  const c = new THREE.Color();
  if (clamped < 0.5) c.setHSL(0.33 - clamped * 0.33, 0.75, 0.5);
  else c.setHSL(0.16 - (clamped - 0.5) * 0.32, 0.85, 0.5);
  return c;
}

export function hoursLoad(b: Building, br: BuildingResult, hour: number) {
  const shape = buildingShapeAt(b?.type, hour);
  const sum = buildingShapeSum(b?.type);
  const kwAtHour = (br?.dailyKwh * shape) / sum;
  const solarAtHour =
    (br?.solarKwh * SOLAR_SHAPE_EXPORT[hour]) /
    SOLAR_SHAPE_EXPORT.reduce((a, v) => a + v, 0);
  const net = Math.max(0, kwAtHour - solarAtHour);
  return { kwAtHour, solarAtHour, net };
}

export function roadHourCongestion(
  r: RoadSegment,
  rr: RoadResult,
  hour: number,
) {
  const factor = TRAFFIC_SHAPE_EXPORT[hour];
  const demand = rr?.demand * factor;
  const cap = rr?.throughput > 0 ? rr?.throughput / (rr?.congestion || 1) : 1;
  return {
    demand,
    congestion: Math.min(1, demand / Math.max(1, cap)),
  };
}

// ---------- building templates ----------

export const OFFICE_MAT = {
  wall: "#2a3a52",
  glass: "#7ec8f0",
  roof: "#141c2b",
};
export const RES_MAT = {
  wall: "#c9a98a",
  trim: "#5a3b28",
  roof: "#8a3a2a",
  window: "#f5e7b0",
};
export const RETAIL_MAT = {
  wall: "#e8e2d2",
  band: "#e94a4a",
  window: "#9ad8ff",
  roof: "#3a3a44",
};
export const IND_MAT = {
  wall: "#8a9099",
  roof: "#4a5058",
  accent: "#c85a2a",
};
