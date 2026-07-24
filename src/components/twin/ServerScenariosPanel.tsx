import { useState } from "react";
import {
  useListScenariosQuery,
  useSaveScenarioMutation,
  useDeleteScenarioMutation,
  type SavedScenario,
} from "@/store/api/Citytwinapi";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { applyScenario } from "@/store/slices/scene";
import type { ScenarioParams } from "@/utils/simulation";

export function ServerScenariosPanel() {
  const current = useAppSelector((s) => s.scenario.current);
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, refetch } = useListScenariosQuery();
  const [save, { isLoading: saving }] = useSaveScenarioMutation();
  const [del] = useDeleteScenarioMutation();
  const [name, setName] = useState("");

  const onSave = async () => {
    if (!name.trim()) return;
    try {
      await save({ ...current, name: name.trim() }).unwrap();
      setName("");
    } catch (e) {
      alert("Save failed. Is the backend running on VITE_API_BASE?");
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Cloud scenarios
        </h3>
        <button
          onClick={() => refetch()}
          className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] hover:bg-muted"
        >
          ⟳ Refresh
        </button>
      </div>
      <div className="flex gap-1.5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Scenario name"
          className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs"
        />
        <button
          onClick={onSave}
          disabled={saving || !name.trim()}
          className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground disabled:opacity-40"
        >
          {saving ? "…" : "Save"}
        </button>
      </div>
      {isLoading && (
        <div className="text-[11px] text-muted-foreground">Loading…</div>
      )}
      {isError && (
        <div className="text-[11px] text-[color:var(--twin-bad)]">
          Backend offline — using local state only
        </div>
      )}
      <div className="max-h-40 space-y-1 overflow-y-auto">
        {(data ?? []).map((s: SavedScenario) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded border border-border/60 bg-background/40 px-2 py-1"
          >
            <button
              onClick={() =>
                dispatch(applyScenario(pickParams(s) as ScenarioParams))
              }
              className="flex-1 truncate text-left text-[11px] font-medium hover:text-primary"
            >
              {s.name}
            </button>
            <button
              onClick={() => del(s.id)}
              className="ml-2 text-[10px] text-muted-foreground hover:text-[color:var(--twin-bad)]"
              title="Delete"
            >
              ✕
            </button>
          </div>
        ))}
        {data && data.length === 0 && (
          <div className="text-[11px] text-muted-foreground">No cloud scenarios yet.</div>
        )}
      </div>
    </div>
  );
}

function pickParams(s: SavedScenario) {
  const { id: _id, name: _name, createdAt: _c, ...rest } = s;
  return rest;
}
