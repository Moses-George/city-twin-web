import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { DISTRICT } from "../../utils/district";
import { type SimulationResult } from "../../utils/simulation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectBuilding, tickHour } from "@/store/slices/scene";
import BuildingUnit from "../city-elements/building-unit";
import { type HoverInfo, HoverTooltip, BuildingLabels } from "../city-elements/city-commons";
import OverlayControls from "../city-elements/controls";
import DistrictPlate from "../city-elements/district-plate";
import Ground from "../city-elements/ground";
import Road from "../city-elements/road";
import SunLight from "../city-elements/sun-light";
import Trees from "../city-elements/trees";
import Vehicles from "../city-elements/vehicles";

function CameraFit() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(200, 170, 220);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

function ClockAdvance() {
  const playing = useAppSelector((s) => s.scenario.playing);
  const dispatch = useAppDispatch();
  const acc = useRef(0);
  useFrame((_, dt) => {
    if (!playing) return;
    acc.current += dt;
    if (acc.current > 0.6) {
      acc.current = 0;
      dispatch(tickHour());
    }
  });
  return null;
}

// ---------- main scene ----------
export function CityScene({ result }: { result: SimulationResult }) {
  const selectedB = useAppSelector((s) => s.scenario.selectedBuildingId);
  const selectedR = useAppSelector((s) => s.scenario.selectedRoadId);
  const hour = useAppSelector((s) => s.scenario.hour);
  const layers = useAppSelector((s) => s.scenario.layers);
  const dispatch = useAppDispatch();
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const isDay = hour >= 6 && hour <= 19;

  return (
    <div className="relative h-full w-full">
      <HoverTooltip hover={hover} />
      <OverlayControls />
      <Canvas
        shadows
        camera={{ position: [200, 170, 220], fov: 45, near: 1, far: 3000 }}
        onPointerMissed={() => dispatch(selectBuilding(null))}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[isDay ? "#8ab5d6" : "#0a1220"]} />
        <fog attach="fog" args={[isDay ? "#8ab5d6" : "#0a1220", 350, 900]} />
        <Suspense fallback={null}>
          <CameraFit />
          <ClockAdvance />
          <SunLight hour={hour} />
          {isDay && (
            <Sky
              distance={2000}
              sunPosition={[
                Math.cos(((hour - 6) / 12) * Math.PI) * 100,
                Math.max(2, Math.sin(((hour - 6) / 12) * Math.PI) * 100),
                50,
              ]}
              turbidity={hour < 8 || hour > 17 ? 8 : 4}
              rayleigh={hour < 8 || hour > 17 ? 4 : 2}
            />
          )}
          <Ground />
          <DistrictPlate />
          {layers.trees && <Trees />}
          {layers.roads &&
            DISTRICT.roads.map((_, i) => (
              <Road
                key={i}
                rIndex={i}
                result={result.roads[i]}
                hour={hour}
                selected={selectedR === DISTRICT.roads[i].id}
                onHover={setHover}
                onLeave={() => setHover(null)}
              />
            ))}
          {layers.vehicles && layers.roads && (
            <Vehicles hour={hour} results={result.roads} />
          )}
          {layers.buildings &&
            DISTRICT.buildings.map((_, i) => (
              <BuildingUnit
                key={i}
                bIndex={i}
                result={result.buildings[i]}
                hour={hour}
                showSolar={layers.solar}
                selected={selectedB === DISTRICT.buildings[i].id}
                onHover={setHover}
                onLeave={() => setHover(null)}
              />
            ))}
          {layers.labels && <BuildingLabels />}
          <OrbitControls
            enableDamping
            maxPolarAngle={Math.PI / 2.05}
            minDistance={60}
            maxDistance={600}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ---------- overlay controls ----------
