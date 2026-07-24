// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import { DEFAULT_SCENARIO, type ScenarioParams } from "../../utils/simulation";

// export interface LayerVisibility {
//   buildings: boolean;
//   roads: boolean;
//   vehicles: boolean;
//   solar: boolean;
//   heatmap: boolean;
//   labels: boolean;
//   trees: boolean;
// }

// const DEFAULT_LAYERS: LayerVisibility = {
//   buildings: true,
//   roads: true,
//   vehicles: true,
//   solar: true,
//   heatmap: true,
//   labels: false,
//   trees: true,
// };

// interface ScenarioState {
//   current: ScenarioParams;
//   baseline: ScenarioParams;
//   selectedBuildingId: string | null;
//   selectedRoadId: string | null;
//   hour: number; // 0..23 — current time-slice for scene visualization
//   playing: boolean; // clock auto-advance
//   layers: LayerVisibility;
// }

// const initialState: ScenarioState = {
//   current: { ...DEFAULT_SCENARIO },
//   baseline: { ...DEFAULT_SCENARIO },
//   selectedBuildingId: null,
//   selectedRoadId: null,
//   hour: 12,
//   playing: false,
//   layers: { ...DEFAULT_LAYERS },
// };

// const slice = createSlice({
//   name: "scenario",
//   initialState,
//   reducers: {
//     setParam(
//       state,
//       action: PayloadAction<{ key: keyof ScenarioParams; value: number }>,
//     ) {
//       state.current[action.payload.key] = action.payload.value;
//     },
//     resetScenario(state) {
//       state.current = { ...state.baseline };
//     },
//     applyScenario(state, action: PayloadAction<ScenarioParams>) {
//       state.current = { ...action.payload };
//     },
//     saveAsBaseline(state) {
//       state.baseline = { ...state.current };
//     },
//     selectBuilding(state, action: PayloadAction<string | null>) {
//       state.selectedBuildingId = action.payload;
//       state.selectedRoadId = null;
//     },
//     selectRoad(state, action: PayloadAction<string | null>) {
//       state.selectedRoadId = action.payload;
//       state.selectedBuildingId = null;
//     },
//     setHour(state, action: PayloadAction<number>) {
//       state.hour = Math.max(0, Math.min(23, action.payload));
//     },
//     tickHour(state) {
//       state.hour = (state.hour + 1) % 24;
//     },
//     setPlaying(state, action: PayloadAction<boolean>) {
//       state.playing = action.payload;
//     },
//     toggleLayer(state, action: PayloadAction<keyof LayerVisibility>) {
//       state.layers[action.payload] = !state.layers[action.payload];
//     },
//   },
// });

// export const {
//   setParam,
//   resetScenario,
//   applyScenario,
//   saveAsBaseline,
//   selectBuilding,
//   selectRoad,
//   setHour,
//   tickHour,
//   setPlaying,
//   toggleLayer,
// } = slice.actions;

// export default slice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_SCENARIO, type ScenarioParams } from "../../utils/simulation";

export interface LayerVisibility {
  buildings: boolean;
  roads: boolean;
  vehicles: boolean;
  solar: boolean;
  heatmap: boolean;
  labels: boolean;
  trees: boolean;
}

const DEFAULT_LAYERS: LayerVisibility = {
  buildings: true,
  roads: true,
  vehicles: true,
  solar: true,
  heatmap: true,
  labels: false,
  trees: true,
};

interface ScenarioState {
  current: ScenarioParams;
  baseline: ScenarioParams;
  selectedBuildingId: string | null;
  selectedRoadId: string | null;
  hour: number; // 0..23 — current time-slice for scene visualization
  playing: boolean; // clock auto-advance
  layers: LayerVisibility;
  useBackend: boolean;
}

const initialState: ScenarioState = {
  current: { ...DEFAULT_SCENARIO },
  baseline: { ...DEFAULT_SCENARIO },
  selectedBuildingId: null,
  selectedRoadId: null,
  hour: 12,
  playing: false,
  layers: { ...DEFAULT_LAYERS },
  useBackend: false,
};

const slice = createSlice({
  name: "scenario",
  initialState,
  reducers: {
    setParam(
      state,
      action: PayloadAction<{ key: keyof ScenarioParams; value: number }>,
    ) {
      state.current[action.payload.key] = action.payload.value;
    },
    resetScenario(state) {
      state.current = { ...state.baseline };
    },
    applyScenario(state, action: PayloadAction<ScenarioParams>) {
      state.current = { ...action.payload };
    },
    saveAsBaseline(state) {
      state.baseline = { ...state.current };
    },
    selectBuilding(state, action: PayloadAction<string | null>) {
      state.selectedBuildingId = action.payload;
      state.selectedRoadId = null;
    },
    selectRoad(state, action: PayloadAction<string | null>) {
      state.selectedRoadId = action.payload;
      state.selectedBuildingId = null;
    },
    setHour(state, action: PayloadAction<number>) {
      state.hour = Math.max(0, Math.min(23, action.payload));
    },
    tickHour(state) {
      state.hour = (state.hour + 1) % 24;
    },
    setPlaying(state, action: PayloadAction<boolean>) {
      state.playing = action.payload;
    },
    toggleLayer(state, action: PayloadAction<keyof LayerVisibility>) {
      state.layers[action.payload] = !state.layers[action.payload];
    },
    toggleUseBackend(state) {
      state.useBackend = !state.useBackend;
    },
    setUseBackend(state, action: PayloadAction<boolean>) {
      state.useBackend = action.payload;
    },
  },
});

export const {
  setParam,
  resetScenario,
  applyScenario,
  saveAsBaseline,
  selectBuilding,
  selectRoad,
  setHour,
  tickHour,
  setPlaying,
  toggleLayer,
  toggleUseBackend,
  setUseBackend,
} = slice.actions;

export default slice.reducer;
