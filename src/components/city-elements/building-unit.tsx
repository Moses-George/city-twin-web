import { selectBuilding } from "@/store/slices/scene";
import { useAppDispatch } from "@/store/store";
import { hoursLoad, loadColor } from "@/utils/city.helpers";
import { DISTRICT } from "@/utils/district";
import { type BuildingResult, SOLAR_SHAPE_EXPORT } from "@/utils/simulation";
import { useMemo } from "react";
import * as THREE from "three";
import IndustrialBuilding from "../buildings/industrail-building";
import OfficeBuilding from "../buildings/office-building";
import ResidentialBuilding from "../buildings/residential-building";
import RetailBuilding from "../buildings/retail-building";
import type { HoverInfo } from "./city-commons";

export default function BuildingUnit({
  bIndex,
  result,
  hour,
  showSolar,
  selected,
  onHover,
  onLeave,
}: {
  bIndex: number;
  result: BuildingResult;
  hour: number;
  showSolar: boolean;
  selected: boolean;
  onHover: (info: HoverInfo) => void;
  onLeave: () => void;
}) {
  const b = DISTRICT.buildings[bIndex];
  const dispatch = useAppDispatch();
  const { kwAtHour, solarAtHour, net } = hoursLoad(b, result, hour);
  const intensity = Math.min(1, net / Math.max(1, result.peakLoadKw));
  const tint = useMemo(() => loadColor(intensity), [intensity]);
  // Night lights come on 18:00-6:00
  const litFraction = hour < 6 || hour > 18 ? 0.75 : 0.15;
  const hasSolar = showSolar && result.solarKwh > 0.01;
  const height =
    b.type === "industrial"
      ? Math.max(6, b.floors * 5)
      : b.type === "retail"
        ? Math.max(4, b.floors * 3.4)
        : b.floors * (b.type === "office" ? 3.3 : 3.0);

  const template =
    b.type === "office" ? (
      <OfficeBuilding b={b} tint={tint} litFraction={litFraction} />
    ) : b.type === "residential" ? (
      <ResidentialBuilding b={b} tint={tint} litFraction={litFraction} />
    ) : b.type === "retail" ? (
      <RetailBuilding b={b} tint={tint} litFraction={litFraction} />
    ) : (
      <IndustrialBuilding b={b} tint={tint} litFraction={litFraction} />
    );

  return (
    <group
      position={[b.x, 0, b.z]}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(selectBuilding(b.id));
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover({
          kind: "building",
          title: b.name,
          subtitle: `${b.type} · ${b.floors} floors`,
          rows: [
            ["Load @ hour", `${kwAtHour.toFixed(1)} kW`],
            ["Solar @ hour", `${solarAtHour.toFixed(1)} kW`],
            ["Net", `${net.toFixed(1)} kW`],
            ["Daily", `${result.dailyKwh.toFixed(0)} kWh`],
            ["Comfort", `${(result.comfortScore * 100).toFixed(0)}%`],
          ],
        });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onLeave();
      }}
    >
      {template}
      {hasSolar && (
        <group position={[0, height + 0.05, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[b.width * 0.72, b.depth * 0.72]} />
            <meshStandardMaterial
              color="#12213a"
              emissive="#5cc4ff"
              emissiveIntensity={0.35 + SOLAR_SHAPE_EXPORT[hour] * 0.7}
              metalness={0.85}
              roughness={0.18}
            />
          </mesh>
        </group>
      )}
      {selected && (
        <mesh position={[0, height + 4, 0]}>
          <ringGeometry args={[2, 2.4, 24]} />
          <meshBasicMaterial color="#5cc4ff" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
