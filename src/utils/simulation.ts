// Deterministic what-if simulator for a 24h day at hourly resolution.
// Pure functions — same inputs -> same outputs. Runs entirely in-browser.

import { DISTRICT, type Building, type RoadSegment } from "./district";

export interface ScenarioParams {
  solarAdoptionPct: number; // 0..100 — % of solar-capable buildings with PV
  evSharePct: number; // 0..100 — % of vehicles that are EVs (shifts fuel->grid)
  hvacSetpointC: number; // 18..26 — target indoor temp (energy sensitivity)
  signalTimingPct: number; // 50..150 — green-time efficiency multiplier
  outdoorTempC: number; // -5..35 — ambient weather
  occupancyPct: number; // 30..120 — activity intensity vs baseline
}

export const DEFAULT_SCENARIO: ScenarioParams = {
  solarAdoptionPct: 25,
  evSharePct: 15,
  hvacSetpointC: 21,
  signalTimingPct: 100,
  outdoorTempC: 14,
  occupancyPct: 100,
};

export interface BuildingResult {
  id: string;
  dailyKwh: number;
  solarKwh: number;
  netKwh: number;
  comfortScore: number; // 0..1 — 1 = perfectly comfortable
  peakLoadKw: number;
}

export interface RoadResult {
  id: string;
  demand: number; // vehicles/hour peak
  throughput: number; // vehicles/hour actually flowing
  congestion: number; // 0..1
  co2KgPerHour: number;
}

export interface DistrictKpis {
  totalEnergyKwh: number;
  gridImportKwh: number;
  solarGenerationKwh: number;
  peakLoadKw: number;
  avgComfort: number;
  avgCongestion: number;
  co2KgPerDay: number;
  evGridLoadKwh: number;
  renewableSharePct: number;
}

export interface SimulationResult {
  buildings: BuildingResult[];
  roads: RoadResult[];
  kpis: DistrictKpis;
  hourly: {
    hour: number;
    demandKw: number;
    solarKw: number;
    netKw: number;
    trafficVeh: number;
  }[];
}

// Hourly shape factors (normalized) — occupancy driven.
const OFFICE_SHAPE = [
  0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.5, 0.8, 1.0, 1.0, 1.0, 0.95, 0.9, 1.0, 1.0,
  1.0, 0.9, 0.7, 0.4, 0.3, 0.25, 0.22, 0.2, 0.2,
];
const RESIDENTIAL_SHAPE = [
  0.4, 0.35, 0.32, 0.3, 0.3, 0.4, 0.7, 0.9, 0.7, 0.55, 0.5, 0.5, 0.55, 0.55,
  0.55, 0.6, 0.75, 0.95, 1.0, 1.0, 0.9, 0.75, 0.6, 0.5,
];
const RETAIL_SHAPE = [
  0.15, 0.1, 0.1, 0.1, 0.1, 0.15, 0.25, 0.4, 0.6, 0.85, 1.0, 1.0, 1.0, 1.0, 1.0,
  1.0, 0.95, 0.85, 0.7, 0.5, 0.3, 0.2, 0.18, 0.15,
];
const INDUSTRIAL_SHAPE = [
  0.6, 0.55, 0.5, 0.5, 0.55, 0.7, 0.9, 1.0, 1.0, 1.0, 1.0, 1.0, 0.95, 1.0, 1.0,
  1.0, 0.9, 0.75, 0.65, 0.6, 0.6, 0.6, 0.6, 0.6,
];
const TRAFFIC_SHAPE = [
  0.15, 0.1, 0.08, 0.07, 0.08, 0.15, 0.35, 0.7, 1.0, 0.85, 0.65, 0.6, 0.65, 0.7,
  0.72, 0.75, 0.85, 1.0, 0.9, 0.65, 0.45, 0.35, 0.25, 0.18,
];
// Solar irradiance shape (0..1) — bell curve 6am..8pm.
const SOLAR_SHAPE = Array.from({ length: 24 }, (_, h) => {
  const t = (h - 13) / 5;
  return Math.max(0, Math.exp(-t * t));
});

export const SOLAR_SHAPE_EXPORT = SOLAR_SHAPE;
export const TRAFFIC_SHAPE_EXPORT = TRAFFIC_SHAPE;

export function buildingShapeSum(type: Building["type"]) {
  return shapeFor(type).reduce((a, v) => a + v, 0);
}
export function buildingShapeAt(type: Building["type"], hour: number) {
  return shapeFor(type)[hour];
}

function shapeFor(type: Building["type"]) {
  switch (type) {
    case "office":
      return OFFICE_SHAPE;
    case "residential":
      return RESIDENTIAL_SHAPE;
    case "retail":
      return RETAIL_SHAPE;
    case "industrial":
      return INDUSTRIAL_SHAPE;
  }
}

// HVAC penalty: quadratic distance between setpoint and outdoor temp.
function hvacMultiplier(setpoint: number, outdoor: number) {
  const delta = Math.abs(setpoint - outdoor);
  return 1 + Math.pow(delta / 12, 2) * 0.6;
}

function comfortScore(setpoint: number, outdoor: number) {
  // Best comfort when setpoint in [20, 23] and delta manageable.
  const setpointFit = 1 - Math.min(1, Math.abs(setpoint - 21.5) / 5);
  const deltaFit = 1 - Math.min(1, Math.abs(setpoint - outdoor) / 25);
  return Math.max(0, Math.min(1, 0.5 * setpointFit + 0.5 * deltaFit));
}

function simulateBuilding(b: Building, s: ScenarioParams): BuildingResult {
  const area = b.width * b.depth * b.floors;
  // Baseline daily consumption from annual intensity, adjusted by occupancy + HVAC.
  const dailyBase =
    ((b.baseKwhPerM2 * area) / 365) *
    (s.occupancyPct / 100) *
    hvacMultiplier(s.hvacSetpointC, s.outdoorTempC);
  const shape = shapeFor(b.type);
  const shapeSum = shape.reduce((a, v) => a + v, 0);

  // Solar: only capable buildings, only if adoption% "reaches" them.
  // Deterministic: sort by id and pick first N%.
  const solarActive =
    b.hasSolarPotential && hashRank(b.id) < s.solarAdoptionPct / 100;
  const solarPeakKw = solarActive
    ? area * 0.12 * 0.18 // 12% roof usable, 180 W/m2 STC
    : 0;

  let dailyKwh = 0;
  let solarKwh = 0;
  let peakLoadKw = 0;
  for (let h = 0; h < 24; h++) {
    const kw = (dailyBase * shape[h]) / shapeSum;
    const solar = solarPeakKw * SOLAR_SHAPE[h];
    dailyKwh += kw;
    solarKwh += solar;
    peakLoadKw = Math.max(peakLoadKw, kw);
  }

  return {
    id: b.id,
    dailyKwh,
    solarKwh,
    netKwh: Math.max(0, dailyKwh - solarKwh),
    comfortScore: comfortScore(s.hvacSetpointC, s.outdoorTempC),
    peakLoadKw,
  };
}

function simulateRoad(r: RoadSegment, s: ScenarioParams): RoadResult {
  const demandFactor = s.occupancyPct / 100;
  const demand = r.baseVehiclesPerHour * demandFactor;
  // Signal timing scales effective capacity for signalized roads.
  const effCapacity = r.capacity * (r.hasSignal ? s.signalTimingPct / 100 : 1);
  const throughput = Math.min(demand, effCapacity);
  const congestion = Math.min(1, demand / Math.max(1, effCapacity));
  // CO2: ICE ~ 0.22 kg/veh-km assume 0.3km segment; EVs 0 tailpipe.
  const iceShare = 1 - s.evSharePct / 100;
  const co2KgPerHour = throughput * 0.3 * 0.22 * iceShare;
  return { id: r.id, demand, throughput, congestion, co2KgPerHour };
}

function hashRank(id: string): number {
  // Stable pseudo-rank in [0,1).
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

export function runSimulation(s: ScenarioParams): SimulationResult {
  const buildings = DISTRICT.buildings.map((b) => simulateBuilding(b, s));
  const roads = DISTRICT.roads.map((r) => simulateRoad(r, s));

  // Hourly aggregate
  const hourly = Array.from({ length: 24 }, (_, h) => {
    let demandKw = 0;
    let solarKw = 0;
    for (let i = 0; i < DISTRICT.buildings.length; i++) {
      const b = DISTRICT.buildings[i];
      const area = b.width * b.depth * b.floors;
      const dailyBase =
        ((b.baseKwhPerM2 * area) / 365) *
        (s.occupancyPct / 100) *
        hvacMultiplier(s.hvacSetpointC, s.outdoorTempC);
      const shape = shapeFor(b.type);
      const shapeSum = shape.reduce((a, v) => a + v, 0);
      demandKw += (dailyBase * shape[h]) / shapeSum;
      const bRes = buildings[i];
      // Reconstruct solar peak
      const solarPeak =
        bRes.solarKwh > 0
          ? bRes.solarKwh / SOLAR_SHAPE.reduce((a, v) => a + v, 0)
          : 0;
      solarKw += solarPeak * SOLAR_SHAPE[h];
    }
    let trafficVeh = 0;
    for (const r of DISTRICT.roads) {
      trafficVeh +=
        r.baseVehiclesPerHour * (s.occupancyPct / 100) * TRAFFIC_SHAPE[h];
    }
    return {
      hour: h,
      demandKw,
      solarKw,
      netKw: Math.max(0, demandKw - solarKw),
      trafficVeh,
    };
  });

  const totalEnergyKwh = buildings.reduce((a, b) => a + b.dailyKwh, 0);
  const solarGenerationKwh = buildings.reduce((a, b) => a + b.solarKwh, 0);
  const gridImportKwh = buildings.reduce((a, b) => a + b.netKwh, 0);
  const peakLoadKw = Math.max(...hourly.map((h) => h.netKw));
  const avgComfort =
    buildings.reduce((a, b) => a + b.comfortScore, 0) / buildings.length;
  const avgCongestion =
    roads.reduce((a, r) => a + r.congestion, 0) / roads.length;
  // EV grid load: assume 8 kWh/day per EV-share point across district.
  const evGridLoadKwh =
    (s.evSharePct / 100) * roads.reduce((a, r) => a + r.throughput, 0) * 0.06;
  const co2KgPerDay =
    roads.reduce((a, r) => a + r.co2KgPerHour, 0) * 12 + // ~12h of active traffic
    gridImportKwh * 0.25; // grid CO2 factor kg/kWh
  const renewableSharePct =
    totalEnergyKwh > 0
      ? Math.min(100, (solarGenerationKwh / totalEnergyKwh) * 100)
      : 0;

  return {
    buildings,
    roads,
    kpis: {
      totalEnergyKwh,
      gridImportKwh,
      solarGenerationKwh,
      peakLoadKw,
      avgComfort,
      avgCongestion,
      co2KgPerDay,
      evGridLoadKwh,
      renewableSharePct,
    },
    hourly,
  };
}
