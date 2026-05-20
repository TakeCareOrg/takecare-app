import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type WidgetId =
    | "LEVEL"
    | "ACHIEVEMENTS"
    | "HEART_RATE"
    | "WEATHER"
    | "STREAK"
    | "DIARY"
    | "ACTIVITY_RINGS"
    | "WATER"
    | "SLEEP_MINI"
    | "BODY_COMPOSITION"
    | "VITALS";

export type ColumnPref = 0 | 1;

export const DEFAULT_ORDER: WidgetId[] = [
    "LEVEL",
    "ACHIEVEMENTS",
    "STREAK",
    "WATER",
    "DIARY",
    "ACTIVITY_RINGS",
    "SLEEP_MINI",
    "WEATHER",
    "HEART_RATE",
    "BODY_COMPOSITION",
    "VITALS",
];

export const DEFAULT_COLUMNS: Record<WidgetId, ColumnPref> = {
    LEVEL: 0,
    ACHIEVEMENTS: 1,
    STREAK: 0,
    DIARY: 1,
    ACTIVITY_RINGS: 0,
    WATER: 0,
    SLEEP_MINI: 0,
    WEATHER: 0,
    HEART_RATE: 1,
    BODY_COMPOSITION: 0,
    VITALS: 1,
};

const KNOWN_IDS: ReadonlySet<WidgetId> = new Set(DEFAULT_ORDER);

const INLINE_SIZES: Record<WidgetId, { w: 1 | 2; h: 1 | 2 }> = {
    LEVEL: { w: 1, h: 1 },
    ACHIEVEMENTS: { w: 1, h: 1 },
    HEART_RATE: { w: 1, h: 1 },
    STREAK: { w: 2, h: 1 },
    WEATHER: { w: 2, h: 1 },
    DIARY: { w: 1, h: 1 },
    ACTIVITY_RINGS: { w: 2, h: 1 },
    WATER: { w: 1, h: 2 },
    SLEEP_MINI: { w: 2, h: 1 },
    BODY_COMPOSITION: { w: 1, h: 1 },
    VITALS: { w: 1, h: 1 },
};

interface HomeLayoutState {
    order: WidgetId[];
    columns: Record<WidgetId, ColumnPref>;
    setOrder: (ids: WidgetId[]) => void;
    setColumns: (columns: Record<WidgetId, ColumnPref>) => void;
    setLayout: (partial: {
        order?: WidgetId[];
        columns?: Record<WidgetId, ColumnPref>;
    }) => void;
    reset: () => void;
}

type PersistedV1 = { order?: unknown };
type PersistedV2 = { placements?: unknown };
type PersistedV3 = { order?: unknown };

/**
 * v5 → v6: the legacy "ABOUT_YOU" widget was split into two full-width
 * widgets (ACTIVITY_RINGS + SLEEP_MINI). Any persisted order/columns
 * still referencing ABOUT_YOU must be rewritten BEFORE `cleanOrder`,
 * otherwise the unknown id is silently dropped and we lose its slot.
 */
function swapLegacyAboutYou(ids: unknown): string[] {
    if (!Array.isArray(ids)) return [];
    return ids.flatMap((id) =>
        typeof id === "string"
            ? id === "ABOUT_YOU"
                ? ["ACTIVITY_RINGS", "SLEEP_MINI"]
                : [id]
            : [],
    );
}

function dropLegacyAboutYouColumn(raw: unknown): unknown {
    if (!raw || typeof raw !== "object") return raw;
    return Object.fromEntries(
        Object.entries(raw as Record<string, unknown>).filter(
            ([k]) => k !== "ABOUT_YOU",
        ),
    );
}

function cleanOrder(raw: unknown): WidgetId[] {
    const cleaned = Array.isArray(raw)
        ? (raw.filter(
              (id): id is WidgetId =>
                  typeof id === "string" && KNOWN_IDS.has(id as WidgetId),
          ) as WidgetId[])
        : [];
    const seen = new Set(cleaned);
    const missing = DEFAULT_ORDER.filter((id) => !seen.has(id));
    return [...cleaned, ...missing];
}

function orderFromPlacements(placements: unknown): WidgetId[] {
    if (!placements || typeof placements !== "object") return DEFAULT_ORDER;
    const obj = placements as Record<string, { x?: number; y?: number }>;
    const entries: { id: WidgetId; x: number; y: number }[] = [];
    for (const id of DEFAULT_ORDER) {
        const p = obj[id];
        if (p && typeof p.x === "number" && typeof p.y === "number") {
            entries.push({ id, x: p.x, y: p.y });
        }
    }
    entries.sort((a, b) => a.y - b.y || a.x - b.x);
    const ordered = entries.map((e) => e.id);
    const seen = new Set(ordered);
    const missing = DEFAULT_ORDER.filter((id) => !seen.has(id));
    return [...ordered, ...missing];
}

function columnsFromOrder(order: WidgetId[]): Record<WidgetId, ColumnPref> {
    type Row = [boolean, boolean];
    const grid: Row[] = [];
    const result = { ...DEFAULT_COLUMNS };

    const isFree = (row: number, col: 0 | 1, w: 1 | 2, h: 1 | 2): boolean => {
        for (let r = row; r < row + h; r++) {
            if (!grid[r]) return true;
            for (let c = col; c < col + w; c++) {
                if (grid[r][c as 0 | 1]) return false;
            }
        }
        return true;
    };
    const occupy = (row: number, col: 0 | 1, w: 1 | 2, h: 1 | 2) => {
        for (let r = row; r < row + h; r++) {
            while (grid.length <= r) grid.push([false, false]);
            for (let c = col; c < col + w; c++) grid[r][c as 0 | 1] = true;
        }
    };

    for (const id of order) {
        const size = INLINE_SIZES[id];
        let placed = false;
        let row = 0;
        while (!placed) {
            while (grid.length <= row + size.h - 1) grid.push([false, false]);
            if (size.w === 1) {
                if (isFree(row, 0, 1, size.h)) {
                    occupy(row, 0, 1, size.h);
                    result[id] = 0;
                    placed = true;
                    break;
                }
                if (isFree(row, 1, 1, size.h)) {
                    occupy(row, 1, 1, size.h);
                    result[id] = 1;
                    placed = true;
                    break;
                }
            } else if (isFree(row, 0, 2, size.h)) {
                occupy(row, 0, 2, size.h);
                result[id] = 0;
                placed = true;
                break;
            }
            row++;
        }
    }
    return result;
}

function sanitizeColumns(
    raw: unknown,
): Record<WidgetId, ColumnPref> | undefined {
    if (!raw || typeof raw !== "object") return undefined;
    const obj = raw as Record<string, unknown>;
    const out = { ...DEFAULT_COLUMNS };
    let touched = false;
    for (const id of DEFAULT_ORDER) {
        const v = obj[id];
        if (v === 0 || v === 1) {
            out[id] = v;
            touched = true;
        }
    }
    return touched ? out : undefined;
}

export const useHomeLayoutStore = create<HomeLayoutState>()(
    persist(
        (set) => ({
            order: DEFAULT_ORDER,
            columns: DEFAULT_COLUMNS,
            setOrder: (ids) => set({ order: ids }),
            setColumns: (columns) => set({ columns }),
            setLayout: (partial) => set(partial),
            reset: () =>
                set({
                    order: DEFAULT_ORDER,
                    columns: DEFAULT_COLUMNS,
                }),
        }),
        {
            name: "home-layout-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                order: state.order,
                columns: state.columns,
            }),
            // v6 splits the legacy "ABOUT_YOU" widget into
            // ACTIVITY_RINGS + SLEEP_MINI. Every branch below rewrites
            // ABOUT_YOU into the two new widgets before `cleanOrder`,
            // since cleanOrder would otherwise drop the now-unknown id
            // and we'd lose its position.
            //
            // v7 drops the standalone "WEIGHT" widget: it's a subset of
            // BODY_COMPOSITION (which also exposes weight). `cleanOrder`
            // and `sanitizeColumns` already strip unknown ids, so this
            // is just a version bump to force the migrate path to run.
            //
            // v8 introduces AI_CHAT_PROMPT, HEALTH_SCORE, DIARY, WATER.
            // `cleanOrder` already appends missing widgets from
            // DEFAULT_ORDER, so this is a passthrough — the bump just
            // forces `migrate` to run on already-persisted layouts and
            // pick up the new widgets at the end of the list.
            //
            // v9 drops the short-lived HEALTH_SCORE widget (the derived
            // score was a stub). `cleanOrder` already strips unknown ids,
            // so this is again a passthrough bump.
            //
            // v10 lifts AI_CHAT_PROMPT out of the grid: it now renders
            // as a compact banner above DraggableGrid in home/index.tsx.
            // `cleanOrder` strips the now-unknown id from persisted
            // orders, so the migration is automatic.
            version: 10,
            migrate: (persisted, version) => {
                if (version >= 4) {
                    const raw = persisted as {
                        order?: unknown;
                        columns?: unknown;
                    };
                    const order = cleanOrder(swapLegacyAboutYou(raw?.order));
                    const cols =
                        sanitizeColumns(
                            dropLegacyAboutYouColumn(raw?.columns),
                        ) ?? columnsFromOrder(order);
                    return { order, columns: cols };
                }
                if (version === 3) {
                    const raw = persisted as PersistedV3 | undefined;
                    const order = cleanOrder(swapLegacyAboutYou(raw?.order));
                    return { order, columns: columnsFromOrder(order) };
                }
                if (version === 2) {
                    const raw = persisted as PersistedV2 | undefined;
                    const fromPlacements = orderFromPlacements(raw?.placements);
                    const order = cleanOrder(
                        swapLegacyAboutYou(fromPlacements),
                    );
                    return { order, columns: columnsFromOrder(order) };
                }
                const raw = persisted as PersistedV1 | undefined;
                const order = cleanOrder(swapLegacyAboutYou(raw?.order));
                return { order, columns: columnsFromOrder(order) };
            },
        },
    ),
);
