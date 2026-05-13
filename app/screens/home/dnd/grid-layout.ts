import type { WidgetId } from "@stores/home-layout";

export const GRID_COLUMNS = 2;
export const CELL_GAP = 12;
export const H_PADDING = 16;
export const CELL_HEIGHT = 175;

export type WidgetSize = { w: 1 | 2; h: 1 | 2 };

export type Placement = { x: 0 | 1; y: number };

export type Slot = {
    id: WidgetId;
    x: 0 | 1;
    y: number;
    w: 1 | 2;
    h: 1 | 2;
};

export const WIDGET_SIZES: Record<WidgetId, WidgetSize> = {
    LEVEL: { w: 1, h: 1 },
    ACHIEVEMENTS: { w: 1, h: 1 },
    HEART_RATE: { w: 1, h: 1 },
    WEIGHT: { w: 1, h: 1 },
    STREAK: { w: 2, h: 1 },
    WEATHER: { w: 2, h: 1 },
    ABOUT_YOU: { w: 2, h: 2 },
};

export type GridMetrics = {
    cellWidth: number;
    cellHeight: number;
    gap: number;
    columns: number;
    totalHeight: number;
};

export function computeMetrics(
    screenWidth: number,
    horizontalPadding: number,
    rows: number,
): GridMetrics {
    const usableWidth = screenWidth - horizontalPadding * 2;
    const cellWidth = (usableWidth - CELL_GAP) / GRID_COLUMNS;
    const totalHeight =
        rows > 0 ? rows * CELL_HEIGHT + (rows - 1) * CELL_GAP : 0;
    return {
        cellWidth,
        cellHeight: CELL_HEIGHT,
        gap: CELL_GAP,
        columns: GRID_COLUMNS,
        totalHeight,
    };
}

export function slotPixelWidth(slot: Slot, cellWidth: number): number {
    return slot.w === 2 ? cellWidth * 2 + CELL_GAP : cellWidth;
}

export function slotPixelHeight(slot: Slot): number {
    return slot.h === 2 ? CELL_HEIGHT * 2 + CELL_GAP : CELL_HEIGHT;
}

export function slotPixelX(slot: Slot, cellWidth: number): number {
    return slot.x * (cellWidth + CELL_GAP);
}

export function slotPixelY(slot: Slot): number {
    return slot.y * (CELL_HEIGHT + CELL_GAP);
}

export function pxToCell(
    pxX: number,
    pxY: number,
    cellWidth: number,
): { x: 0 | 1; y: number } {
    const rawX = Math.round(pxX / (cellWidth + CELL_GAP));
    const clampedX = Math.max(0, Math.min(1, rawX)) as 0 | 1;
    const rawY = Math.round(pxY / (CELL_HEIGHT + CELL_GAP));
    const clampedY = Math.max(0, rawY);
    return { x: clampedX, y: clampedY };
}

type RowBitmap = [boolean, boolean];

function isRangeFree(
    bitmap: RowBitmap[],
    row: number,
    col: 0 | 1,
    w: 1 | 2,
    h: 1 | 2,
): boolean {
    for (let r = row; r < row + h; r++) {
        if (!bitmap[r]) return true;
        for (let c = col; c < col + w; c++) {
            if (bitmap[r][c as 0 | 1]) return false;
        }
    }
    return true;
}

function occupy(
    bitmap: RowBitmap[],
    row: number,
    col: 0 | 1,
    w: 1 | 2,
    h: 1 | 2,
): void {
    for (let r = row; r < row + h; r++) {
        while (bitmap.length <= r) bitmap.push([false, false]);
        for (let c = col; c < col + w; c++) {
            bitmap[r][c as 0 | 1] = true;
        }
    }
}

export function packGrid(
    order: WidgetId[],
    sizes: Record<WidgetId, WidgetSize>,
    columns?: Record<WidgetId, 0 | 1>,
): Slot[] {
    const bitmap: RowBitmap[] = [];
    const slots: Slot[] = [];

    for (const id of order) {
        const size = sizes[id];
        let placed = false;
        let row = 0;
        while (!placed) {
            while (bitmap.length <= row + size.h - 1) {
                bitmap.push([false, false]);
            }
            if (size.w === 1) {
                const preferred = columns?.[id];
                if (preferred !== undefined) {
                    if (isRangeFree(bitmap, row, preferred, 1, size.h)) {
                        occupy(bitmap, row, preferred, 1, size.h);
                        slots.push({
                            id,
                            x: preferred,
                            y: row,
                            w: 1,
                            h: size.h,
                        });
                        placed = true;
                        break;
                    }
                } else {
                    if (isRangeFree(bitmap, row, 0, 1, size.h)) {
                        occupy(bitmap, row, 0, 1, size.h);
                        slots.push({ id, x: 0, y: row, w: 1, h: size.h });
                        placed = true;
                        break;
                    }
                    if (isRangeFree(bitmap, row, 1, 1, size.h)) {
                        occupy(bitmap, row, 1, 1, size.h);
                        slots.push({ id, x: 1, y: row, w: 1, h: size.h });
                        placed = true;
                        break;
                    }
                }
            } else if (isRangeFree(bitmap, row, 0, 2, size.h)) {
                occupy(bitmap, row, 0, 2, size.h);
                slots.push({ id, x: 0, y: row, w: 2, h: size.h });
                placed = true;
                break;
            }
            row++;
        }
    }
    return slots;
}

export function totalRows(slots: Slot[]): number {
    let max = 0;
    for (const s of slots) {
        const bottom = s.y + s.h;
        if (bottom > max) max = bottom;
    }
    return max;
}

export function reorderForDrop(
    order: WidgetId[],
    draggedId: WidgetId,
    targetIndex: number,
): WidgetId[] {
    const next = [...order];
    const from = next.indexOf(draggedId);
    if (from === -1) return order;
    const clamped = Math.max(0, Math.min(next.length - 1, targetIndex));
    if (from === clamped) return order;
    next.splice(from, 1);
    next.splice(clamped, 0, draggedId);
    return next;
}

export function findSlotIndexAtCell(
    slots: Slot[],
    x: 0 | 1,
    y: number,
): number {
    for (let i = 0; i < slots.length; i++) {
        const s = slots[i];
        if (x >= s.x && x < s.x + s.w && y >= s.y && y < s.y + s.h) {
            return i;
        }
    }
    return -1;
}

export type Placements = Record<WidgetId, Placement>;

export function placementsToSlots(placements: Placements): Slot[] {
    const slots: Slot[] = [];
    for (const id of Object.keys(placements) as WidgetId[]) {
        const p = placements[id];
        if (!p) continue;
        const size = WIDGET_SIZES[id];
        slots.push({ id, x: p.x, y: p.y, w: size.w, h: size.h });
    }
    return slots;
}

export function getOccupantsInRegion(
    placements: Placements,
    targetX: 0 | 1,
    targetY: number,
    targetW: 1 | 2,
    targetH: 1 | 2,
    excludeId?: WidgetId,
): WidgetId[] {
    const result: WidgetId[] = [];
    for (const id of Object.keys(placements) as WidgetId[]) {
        if (id === excludeId) continue;
        const p = placements[id];
        if (!p) continue;
        const size = WIDGET_SIZES[id];
        const overlapsX = p.x < targetX + targetW && p.x + size.w > targetX;
        const overlapsY = p.y < targetY + targetH && p.y + size.h > targetY;
        if (overlapsX && overlapsY) result.push(id);
    }
    return result;
}

export function compactRows(placements: Placements): Placements {
    const occupied = new Set<number>();
    for (const id of Object.keys(placements) as WidgetId[]) {
        const p = placements[id];
        if (!p) continue;
        const h = WIDGET_SIZES[id].h;
        for (let r = p.y; r < p.y + h; r++) occupied.add(r);
    }
    const sorted = [...occupied].sort((a, b) => a - b);
    const rowMap = new Map<number, number>();
    for (let i = 0; i < sorted.length; i++) rowMap.set(sorted[i], i);

    const out = {} as Placements;
    for (const id of Object.keys(placements) as WidgetId[]) {
        const p = placements[id];
        if (!p) continue;
        out[id] = { x: p.x, y: rowMap.get(p.y) ?? 0 };
    }
    return out;
}

export type DropResult =
    | { kind: "place"; placements: Placements }
    | { kind: "swap"; placements: Placements }
    | { kind: "block" };

export function dropWidget(
    placements: Placements,
    draggedId: WidgetId,
    targetX: number,
    targetY: number,
): DropResult {
    const size = WIDGET_SIZES[draggedId];
    const clampedX = Math.max(0, Math.min(2 - size.w, targetX)) as 0 | 1;
    const clampedY = Math.max(0, targetY);

    const current = placements[draggedId];
    if (current && current.x === clampedX && current.y === clampedY) {
        return { kind: "block" };
    }

    const occupants = getOccupantsInRegion(
        placements,
        clampedX,
        clampedY,
        size.w,
        size.h,
        draggedId,
    );

    if (occupants.length === 0) {
        const next = compactRows({
            ...placements,
            [draggedId]: { x: clampedX, y: clampedY },
        });
        return { kind: "place", placements: next };
    }

    if (occupants.length === 1) {
        const otherId = occupants[0];
        const otherSize = WIDGET_SIZES[otherId];
        if (otherSize.w === size.w && otherSize.h === size.h) {
            const oldDragged = placements[draggedId];
            if (!oldDragged) return { kind: "block" };
            const next = compactRows({
                ...placements,
                [draggedId]: { x: clampedX, y: clampedY },
                [otherId]: { x: oldDragged.x, y: oldDragged.y },
            });
            return { kind: "swap", placements: next };
        }
    }

    return { kind: "block" };
}

export function placementsTotalRows(placements: Placements): number {
    let max = 0;
    for (const id of Object.keys(placements) as WidgetId[]) {
        const p = placements[id];
        if (!p) continue;
        const h = WIDGET_SIZES[id].h;
        const bottom = p.y + h;
        if (bottom > max) max = bottom;
    }
    return max;
}
