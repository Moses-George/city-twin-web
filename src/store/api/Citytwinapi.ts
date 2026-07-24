import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ScenarioParams, SimulationResult } from "@/utils/simulation";
import type { District } from "@/utils/district";
import { toCamel, toSnake } from "./convert";
import { VITE_API_URL } from "@/lib/variables";

const API_BASE = VITE_API_URL ?? "http://localhost:8000";

export interface SavedScenario extends ScenarioParams {
  id: number;
  name: string;
  createdAt: string;
}

export interface EnergyPredictRequest {
  buildingType: "residential" | "office" | "retail" | "industrial";
  floors: number;
  areaM2: number;
  outdoorTempC: number;
  occupancyPct: number;
  hvacSetpointC: number;
  hour: number;
}

export interface AnomalyLiveResult {
  sourceId: string;
  kind: string;
  nReadings: number;
  modelLoaded: boolean;
  anomalyScore?: number | null;
  isAnomaly?: boolean | null;
  latestValue?: number | null;
}

export interface SensorReadingInput {
  sourceId: string;
  kind: string;
  value: number;
  ts?: string;
}

export const citytwinApi = createApi({
  reducerPath: "citytwinApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE }),
  tagTypes: ["Scenario", "District", "Sensor"],
  endpoints: (builder) => ({
    getDistrict: builder.query<District, void>({
      query: () => "/district",
      transformResponse: (raw) => toCamel<District>(raw as never),
      providesTags: ["District"],
    }),

    simulate: builder.query<SimulationResult, ScenarioParams>({
      query: (params) => ({
        url: "/simulate",
        method: "POST",
        body: toSnake(params),
      }),
      transformResponse: (raw) => toCamel<SimulationResult>(raw as never),
    }),

    listScenarios: builder.query<SavedScenario[], void>({
      query: () => "/scenarios",
      transformResponse: (raw) => toCamel<SavedScenario[]>(raw as never),
      providesTags: ["Scenario"],
    }),

    saveScenario: builder.mutation<SavedScenario, ScenarioParams & { name: string }>({
      query: (body) => ({
        url: "/scenarios",
        method: "POST",
        body: toSnake(body),
      }),
      transformResponse: (raw) => toCamel<SavedScenario>(raw as never),
      invalidatesTags: ["Scenario"],
    }),

    deleteScenario: builder.mutation<void, number>({
      query: (id) => ({ url: `/scenarios/${id}`, method: "DELETE" }),
      invalidatesTags: ["Scenario"],
    }),

    predictEnergy: builder.mutation<{ modelLoaded: boolean; predictedKwh: number | null }, EnergyPredictRequest>({
      query: (body) => ({ url: "/ml/energy/predict", method: "POST", body: toSnake(body) }),
      transformResponse: (raw) => toCamel(raw as never),
    }),

    predictTraffic: builder.mutation<{ modelLoaded: boolean; nextHourVehicles: number | null }, { roadId: string; history: number[] }>({
      query: (body) => ({ url: "/ml/traffic/predict", method: "POST", body: toSnake(body) }),
      transformResponse: (raw) => toCamel(raw as never),
    }),

    getLiveAnomaly: builder.query<AnomalyLiveResult, string | void>({
      query: (sourceId) => `/ml/anomaly/live?source_id=${encodeURIComponent(sourceId ?? "district")}`,
      transformResponse: (raw) => toCamel<AnomalyLiveResult>(raw as never),
      providesTags: ["Sensor"],
    }),

    predictScenarioSurrogate: builder.mutation<{ modelLoaded: boolean; kpis: Record<string, number> | null }, ScenarioParams>({
      query: (body) => ({ url: "/ml/scenario/predict", method: "POST", body: toSnake(body) }),
      transformResponse: (raw) => toCamel(raw as never),
    }),

    ingestSensorReading: builder.mutation<void, SensorReadingInput>({
      query: (body) => ({ url: "/sensors", method: "POST", body: toSnake(body) }),
      invalidatesTags: ["Sensor"],
    }),
  }),
});

export const {
  useGetDistrictQuery,
  useSimulateQuery,
  useListScenariosQuery,
  useSaveScenarioMutation,
  useDeleteScenarioMutation,
  usePredictEnergyMutation,
  usePredictTrafficMutation,
  useGetLiveAnomalyQuery,
  usePredictScenarioSurrogateMutation,
  useIngestSensorReadingMutation,
} = citytwinApi;