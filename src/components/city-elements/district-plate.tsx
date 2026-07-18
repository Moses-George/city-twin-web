export default function DistrictPlate() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
      <planeGeometry args={[280, 220]} />
      <meshStandardMaterial color="#1f2635" roughness={1} />
    </mesh>
  );
}
