// The FastAPI backend speaks snake_case (Pydantic default). The existing
// TS engine (utils/simulation.ts, utils/district.ts) speaks camelCase.
// Rather than rewrite one side, we convert at the RTK Query boundary so
// both the offline in-browser simulator and the live backend produce the
// exact same shapes the components already expect.

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

function toCamelKey(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

function toSnakeKey(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

export function toCamel<T = unknown>(value: Json): T {
  if (Array.isArray(value)) {
    return value.map((v) => toCamel(v)) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[toCamelKey(k)] = toCamel(v as Json);
    }
    return out as unknown as T;
  }
  return value as unknown as T;
}

export function toSnake<T = Json>(value: unknown): T {
  if (Array.isArray(value)) {
    return value.map((v) => toSnake(v)) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[toSnakeKey(k)] = toSnake(v);
    }
    return out as unknown as T;
  }
  return value as unknown as T;
}