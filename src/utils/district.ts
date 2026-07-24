// District definition — enlarged: 8 cols × 6 rows = 48 buildings, 18 road segments.
// Deterministic layout so 3D scene, simulation and Python backend agree.

export type BuildingType = "residential" | "office" | "retail" | "industrial";

export interface Building {
  id: string;
  name: string;
  type: BuildingType;
  x: number;
  z: number;
  width: number;
  depth: number;
  floors: number;
  baseKwhPerM2: number;
  hasSolarPotential: boolean;
}

export interface RoadSegment {
  id: string;
  name: string;
  from: [number, number];
  to: [number, number];
  lanes: number;
  baseVehiclesPerHour: number;
  capacity: number;
  hasSignal: boolean;
}

export interface District {
  buildings: Building[];
  roads: RoadSegment[];
  extent: number;
}

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
  const cols = 8;
  const rows = 6;
  const spacing = 42;
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
            ? 3 + Math.floor(rng() * 7)
            : 3 + Math.floor(rng() * 10);
      buildings.push({
        id: `B${idx + 1}`,
        name: `Block ${String.fromCharCode(65 + r)}${c + 1}`,
        type,
        x: originX + c * spacing,
        z: originZ + r * spacing,
        width: type === "industrial" ? 28 : 18 + rng() * 6,
        depth: type === "industrial" ? 24 : 16 + rng() * 6,
        floors,
        baseKwhPerM2: INTENSITY[type] * (0.9 + rng() * 0.2),
        hasSolarPotential: type !== "industrial" ? rng() > 0.15 : rng() > 0.5,
      });
      idx++;
    }
  }

  const halfW = ((cols - 1) * spacing) / 2 + spacing;
  const halfH = ((rows - 1) * spacing) / 2 + spacing;
  const roads: RoadSegment[] = [];
  let rid = 1;
  // horizontal roads at every other row line
  for (let r = 0; r <= rows; r += 1) {
    const z = originZ + (r - 0.5) * spacing;
    const signal = r % 2 === 0;
    roads.push({
      id: `R${rid++}`,
      name: `Row ${r}`,
      from: [-halfW, z],
      to: [halfW, z],
      lanes: signal ? 2 : 1,
      baseVehiclesPerHour: 500 + Math.floor(rng() * 700),
      capacity: signal ? 1400 : 900,
      hasSignal: signal,
    });
  }
  // vertical roads at every other column line
  for (let c = 0; c <= cols; c += 1) {
    const x = originX + (c - 0.5) * spacing;
    const signal = c % 2 === 0;
    roads.push({
      id: `R${rid++}`,
      name: `Col ${c}`,
      from: [x, -halfH],
      to: [x, halfH],
      lanes: signal ? 2 : 1,
      baseVehiclesPerHour: 450 + Math.floor(rng() * 700),
      capacity: signal ? 1400 : 900,
      hasSignal: signal,
    });
  }
  // ring road
  roads.push({
    id: `R${rid++}`,
    name: "Ring",
    from: [-halfW, 0],
    to: [halfW, 0],
    lanes: 2,
    baseVehiclesPerHour: 900,
    capacity: 1600,
    hasSignal: true,
  });

  return { buildings, roads, extent: Math.max(halfW, halfH) + 40 };
}

export const DISTRICT = buildDistrict();
