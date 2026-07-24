// import {
//   type LayerVisibility,
//   toggleLayer,
//   setPlaying,
//   setHour,
// } from "@/store/slices/scene";
// import { useAppSelector, useAppDispatch } from "@/store/store";

// const LAYER_LABELS: {
//   key: keyof LayerVisibility;
//   label: string;
//   icon: string;
// }[] = [
//   { key: "buildings", label: "Buildings", icon: "🏢" },
//   { key: "roads", label: "Roads", icon: "🛣" },
//   { key: "vehicles", label: "Vehicles", icon: "🚗" },
//   { key: "solar", label: "Solar", icon: "☀" },
//   { key: "heatmap", label: "Heatmap", icon: "🔥" },
//   { key: "trees", label: "Trees", icon: "🌲" },
//   { key: "labels", label: "Labels", icon: "🏷" },
// ];

// export default function OverlayControls() {
//   const hour = useAppSelector((s) => s.scenario.hour);
//   const playing = useAppSelector((s) => s.scenario.playing);
//   const layers = useAppSelector((s) => s.scenario.layers);
//   const dispatch = useAppDispatch();
//   const isDay = hour >= 6 && hour <= 19;
//   const hh = hour.toString().padStart(2, "0");

//   return (
//     <>
//       {/* Layer toggles — top right */}
//       <div className="absolute right-3 top-3 z-10 rounded-md border border-border bg-card/90 p-2 shadow-lg backdrop-blur">
//         <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
//           Layers
//         </div>
//         <div className="grid grid-cols-2 gap-1">
//           {LAYER_LABELS.map((l) => {
//             const active = layers[l.key];
//             return (
//               <button
//                 key={l.key}
//                 onClick={() => dispatch(toggleLayer(l.key))}
//                 className={`flex items-center gap-1.5 rounded px-2 py-1 text-[11px] transition ${
//                   active
//                     ? "bg-primary/20 text-primary"
//                     : "bg-muted/50 text-muted-foreground hover:bg-muted"
//                 }`}
//               >
//                 <span>{l.icon}</span>
//                 <span>{l.label}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Time slider — bottom */}
//       <div className="absolute bottom-3 left-3 right-3 z-10 rounded-md border border-border bg-card/90 px-3 py-2 shadow-lg backdrop-blur">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => dispatch(setPlaying(!playing))}
//             className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
//             title={playing ? "Pause" : "Play"}
//           >
//             {playing ? (
//               <svg
//                 viewBox="0 0 24 24"
//                 width="14"
//                 height="14"
//                 fill="currentColor"
//               >
//                 <rect x="6" y="5" width="4" height="14" />
//                 <rect x="14" y="5" width="4" height="14" />
//               </svg>
//             ) : (
//               <svg
//                 viewBox="0 0 24 24"
//                 width="14"
//                 height="14"
//                 fill="currentColor"
//               >
//                 <path d="M8 5v14l11-7z" />
//               </svg>
//             )}
//           </button>
//           <div className="flex flex-col text-[10px] leading-tight">
//             <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
//               {hh}:00
//             </span>
//             <span className={isDay ? "text-amber-400" : "text-indigo-300"}>
//               {isDay ? "☀ Daylight" : "🌙 Night"}
//             </span>
//           </div>
//           <input
//             type="range"
//             min={0}
//             max={23}
//             step={1}
//             value={hour}
//             onChange={(e) => dispatch(setHour(Number(e.target.value)))}
//             className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-[var(--primary)]"
//           />
//           <div className="hidden gap-1 md:flex">
//             {[6, 9, 12, 15, 18, 21].map((h) => (
//               <button
//                 key={h}
//                 onClick={() => dispatch(setHour(h))}
//                 className={`rounded px-1.5 py-0.5 text-[10px] tabular-nums ${
//                   hour === h
//                     ? "bg-primary/25 text-primary"
//                     : "bg-muted/50 text-muted-foreground hover:bg-muted"
//                 }`}
//               >
//                 {h}:00
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import {
  type LayerVisibility,
  toggleLayer,
  setPlaying,
  setHour,
} from "@/store/slices/scene";
import { useAppSelector, useAppDispatch } from "@/store/store";

const LAYER_LABELS: {
  key: keyof LayerVisibility;
  label: string;
  icon: string;
}[] = [
  { key: "buildings", label: "Buildings", icon: "🏢" },
  { key: "roads", label: "Roads", icon: "🛣" },
  { key: "vehicles", label: "Vehicles", icon: "🚗" },
  { key: "solar", label: "Solar", icon: "☀" },
  { key: "heatmap", label: "Heatmap", icon: "🔥" },
  { key: "trees", label: "Trees", icon: "🌲" },
  { key: "labels", label: "Labels", icon: "🏷" },
];

export default function OverlayControls() {
  const hour = useAppSelector((s) => s.scenario.hour);
  const playing = useAppSelector((s) => s.scenario.playing);
  const layers = useAppSelector((s) => s.scenario.layers);
  const dispatch = useAppDispatch();
  const isDay = hour >= 6 && hour <= 19;
  const hh = hour.toString().padStart(2, "0");

  return (
    <>
      {/* Layer toggles — top right */}
      <div className="absolute right-3 top-3 z-10 rounded-md border border-border bg-card/90 p-2 shadow-lg backdrop-blur">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Layers
        </div>
        <div className="grid grid-cols-2 gap-1">
          {LAYER_LABELS.map((l) => {
            const active = layers[l.key];
            return (
              <button
                key={l.key}
                onClick={() => dispatch(toggleLayer(l.key))}
                className={`flex items-center gap-1.5 rounded px-2 py-1 text-[11px] transition ${
                  active
                    ? "bg-primary/20 text-primary"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                <span>{l.icon}</span>
                <span>{l.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slider — bottom */}
      <div className="absolute bottom-3 left-3 right-3 z-10 rounded-md border border-border bg-card/90 px-3 py-2 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(setPlaying(!playing))}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            title={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="currentColor"
              >
                <rect x="6" y="5" width="4" height="14" />
                <rect x="14" y="5" width="4" height="14" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div className="flex flex-col text-[10px] leading-tight">
            <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
              {hh}:00
            </span>
            <span className={isDay ? "text-amber-400" : "text-indigo-300"}>
              {isDay ? "☀ Daylight" : "🌙 Night"}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={23}
            step={1}
            value={hour}
            onChange={(e) => dispatch(setHour(Number(e.target.value)))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-[var(--primary)]"
          />
          <div className="hidden gap-1 md:flex">
            {[6, 9, 12, 15, 18, 21].map((h) => (
              <button
                key={h}
                onClick={() => dispatch(setHour(h))}
                className={`rounded px-1.5 py-0.5 text-[10px] tabular-nums ${
                  hour === h
                    ? "bg-primary/25 text-primary"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {h}:00
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
