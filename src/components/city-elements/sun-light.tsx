

export default function SunLight({ hour }: { hour: number }) {
  // Sun arcs from east(6)->zenith(12)->west(18)
  const t = (hour - 6) / 12; // -0.5..1.5
  const angle = t * Math.PI;
  const x = Math.cos(angle) * 260;
  const y = Math.max(20, Math.sin(angle) * 220);
  const isDay = hour >= 6 && hour <= 19;
  return (
    <>
      <ambientLight
        intensity={isDay ? 0.55 : 0.25}
        color={isDay ? "#dfeaff" : "#2a3a58"}
      />
      <directionalLight
        position={[x, y, 120]}
        intensity={isDay ? 1.2 : 0.35}
        color={isDay ? "#fff2d6" : "#8caed6"}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight
        args={[isDay ? "#a9c8ff" : "#2f3a55", "#151a24", 0.35]}
      />
    </>
  );
}