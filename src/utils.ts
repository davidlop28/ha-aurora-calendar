import type { ViewMode, WeekStart } from "./types.js";
import { formatMonthTitle, formatRangeTitle, formatTodayTitle } from "./localize.js";

export const VIEW_MODES: ViewMode[] = [
  "Month",
  "Week",
  "Biweek",
  "Today",
  "Next 7 Days",
];

export function localToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function weekStartDay(weekStart: WeekStart): 0 | 1 {
  return weekStart === "monday" ? 1 : 0;
}

function startOfWeek(date: Date, weekStart: WeekStart): Date {
  const startDay = weekStartDay(weekStart);
  const d = new Date(date);
  const diff = (d.getDay() - startDay + 7) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

function endOfWeek(date: Date, weekStart: WeekStart): Date {
  const end = startOfWeek(date, weekStart);
  end.setDate(end.getDate() + 6);
  return end;
}

export function getDateRange(
  mode: ViewMode,
  offset: number,
  weekStart: WeekStart = "sunday"
): [Date, Date] {
  const today = localToday();

  if (mode === "Month") {
    // JS Date handles month overflow automatically (e.g. month 13 → Jan next year)
    const first = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const last  = new Date(today.getFullYear(), today.getMonth() + offset + 1, 0);
    return [startOfWeek(first, weekStart), endOfWeek(last, weekStart)];
  }

  if (mode === "Week") {
    const start = startOfWeek(today, weekStart);
    start.setDate(start.getDate() + offset * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return [start, end];
  }

  if (mode === "Biweek") {
    const start = startOfWeek(today, weekStart);
    start.setDate(start.getDate() + offset * 14);
    const end = new Date(start);
    end.setDate(start.getDate() + 13);
    return [start, end];
  }

  if (mode === "Today") {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return [d, new Date(d)];
  }

  // Next 7 Days
  const start = new Date(today);
  start.setDate(today.getDate() + offset * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return [start, end];
}

export function getViewTitle(
  mode: ViewMode,
  offset: number,
  start: Date,
  end: Date,
  locale = "en"
): string {
  if (mode === "Month") {
    // Use offset to find the actual displayed month (start may be prior-month padding)
    const today = localToday();
    const ref = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return formatMonthTitle(locale, ref);
  }

  if (mode === "Today") {
    return formatTodayTitle(locale, start);
  }

  return formatRangeTitle(locale, start, end);
}

// ------------------------------------------------------------------
// localStorage — per-device view mode persistence
// Offset intentionally NOT persisted (always starts from today)
// ------------------------------------------------------------------

interface PersistedState {
  viewMode: ViewMode;
}

export function loadPersistedView(key: string): ViewMode | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return VIEW_MODES.includes(parsed.viewMode as ViewMode)
      ? (parsed.viewMode as ViewMode)
      : null;
  } catch {
    return null;
  }
}

export function persistView(key: string, viewMode: ViewMode): void {
  try {
    localStorage.setItem(key, JSON.stringify({ viewMode }));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}
