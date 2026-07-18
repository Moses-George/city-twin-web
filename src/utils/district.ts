// District definition — 20 buildings, 10 road segments.
// Deterministic layout so 3D scene, simulation and Python backend agree.

export type BuildingType = "residential" | "office" | "retail" | "industrial";

export interface Building {
  id: string;
  name: string;
  type: BuildingType;
  x: number; // grid meters
  z: number;
  width: number;
  depth: number;
  floors: number;
  baseKwhPerM2: number; // annual baseline intensity
  hasSolarPotential: boolean;
}

export interface RoadSegment {
  id: string;
  name: string;
  from: [number, number]; // x,z
  to: [number, number];
  lanes: number;
  baseVehiclesPerHour: number; // free-flow demand
  capacity: number; // vehicles/hour
  hasSignal: boolean;
}

export interface District {
  buildings: Building[];
  roads: RoadSegment[];
  extent: number;
}

// Simple deterministic PRNG so the district is stable.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TYPES: BuildingType[] = ["residential", "office", "retail", "industrial"];
const INTENSITY: Record<BuildingType, number> = {
  residential: 110,
  office: 180,
  retail: 220,
  industrial: 320,
};

export function buildDistrict(): District {
  const rng = mulberry32(42);
  const buildings: Building[] = [];
  // 4x5 grid, spaced 40m apart
  const cols = 5;
  const rows = 4;
  const spacing = 40;
  const originX = -((cols - 1) * spacing) / 2;
  const originZ = -((rows - 1) * spacing) / 2;
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const type = TYPES[Math.floor(rng() * TYPES.length)];
      const floors =
        type === "industrial"
          ? 1 + Math.floor(rng() * 2)
          : type === "residential"
            ? 3 + Math.floor(rng() * 6)
            : 2 + Math.floor(rng() * 8);
      buildings.push({
        id: `B${idx + 1}`,
        name: `Block ${String.fromCharCode(65 + r)}${c + 1}`,
        type,
        x: originX + c * spacing,
        z: originZ + r * spacing,
        width: type === "industrial" ? 26 : 18 + rng() * 6,
        depth: type === "industrial" ? 22 : 16 + rng() * 6,
        floors,
        baseKwhPerM2: INTENSITY[type] * (0.9 + rng() * 0.2),
        hasSolarPotential: type !== "industrial" ? rng() > 0.15 : rng() > 0.5,
      });
      idx++;
    }
  }

  // Road segments — a simple grid: 2 horizontal + 3 vertical + 5 collectors.
  const halfW = ((cols - 1) * spacing) / 2 + spacing;
  const halfH = ((rows - 1) * spacing) / 2 + spacing;
  const roads: RoadSegment[] = [
    {
      id: "R1",
      name: "North Ave",
      from: [-halfW, -halfH],
      to: [halfW, -halfH],
      lanes: 2,
      baseVehiclesPerHour: 900,
      capacity: 1400,
      hasSignal: true,
    },
    {
      id: "R2",
      name: "South Ave",
      from: [-halfW, halfH],
      to: [halfW, halfH],
      lanes: 2,
      baseVehiclesPerHour: 1100,
      capacity: 1400,
      hasSignal: true,
    },
    {
      id: "R3",
      name: "West Blvd",
      from: [-halfW, -halfH],
      to: [-halfW, halfH],
      lanes: 2,
      baseVehiclesPerHour: 800,
      capacity: 1400,
      hasSignal: true,
    },
    {
      id: "R4",
      name: "East Blvd",
      from: [halfW, -halfH],
      to: [halfW, halfH],
      lanes: 2,
      baseVehiclesPerHour: 850,
      capacity: 1400,
      hasSignal: true,
    },
    {
      id: "R5",
      name: "Central St",
      from: [0, -halfH],
      to: [0, halfH],
      lanes: 1,
      baseVehiclesPerHour: 600,
      capacity: 900,
      hasSignal: false,
    },
    {
      id: "R6",
      name: "Cross A",
      from: [-halfW, -20],
      to: [halfW, -20],
      lanes: 1,
      baseVehiclesPerHour: 500,
      capacity: 900,
      hasSignal: false,
    },
    {
      id: "R7",
      name: "Cross B",
      from: [-halfW, 20],
      to: [halfW, 20],
      lanes: 1,
      baseVehiclesPerHour: 550,
      capacity: 900,
      hasSignal: false,
    },
    {
      id: "R8",
      name: "Link N",
      from: [-40, -halfH],
      to: [-40, 0],
      lanes: 1,
      baseVehiclesPerHour: 350,
      capacity: 800,
      hasSignal: false,
    },
    {
      id: "R9",
      name: "Link S",
      from: [40, 0],
      to: [40, halfH],
      lanes: 1,
      baseVehiclesPerHour: 380,
      capacity: 800,
      hasSignal: false,
    },
    {
      id: "R10",
      name: "Ring",
      from: [-halfW, 0],
      to: [halfW, 0],
      lanes: 1,
      baseVehiclesPerHour: 700,
      capacity: 1100,
      hasSignal: true,
    },
  ];

  return { buildings, roads, extent: Math.max(halfW, halfH) + 30 };
}

export const DISTRICT = buildDistrict();
