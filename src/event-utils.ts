import type {
  HomeAssistant,
  CalendarEvent,
  CalendarInfo,
  HassCalendarEventRaw,
} from "./types.js";

export function getEnabledCalendars(
  calendars: CalendarInfo[],
  filters: Record<string, boolean>
): CalendarInfo[] {
  return calendars.filter((c) => filters[c.person] !== false);
}

export function eventHasConcluded(event: CalendarEvent, now = new Date()): boolean {
  if (event.all_day) {
    return new Date(`${event.end}T00:00:00`).getTime() <= now.getTime();
  }
  return new Date(event.end).getTime() <= now.getTime();
}

export async function fetchEventsForRange(
  hass: HomeAssistant,
  calendars: CalendarInfo[],
  start: Date,
  end: Date
): Promise<CalendarEvent[]> {
  if (calendars.length === 0) return [];

  const s = encodeURIComponent(start.toISOString());
  const fetchEnd = new Date(end);
  fetchEnd.setDate(fetchEnd.getDate() + 1);
  const e = encodeURIComponent(fetchEnd.toISOString());

  const results = await Promise.all(
    calendars.map(async (cal) => {
      try {
        const raw = await hass.callApi<HassCalendarEventRaw[]>(
          "GET",
          `calendars/${cal.entity_id}?start=${s}&end=${e}`
        );
        return raw.map((ev, i): CalendarEvent => ({
          id:
            ev.uid ??
            `${cal.entity_id}:${i}:${ev.start.dateTime ?? ev.start.date ?? ""}`,
          title: ev.summary ?? "(no title)",
          start: ev.start.dateTime ?? ev.start.date ?? "",
          end:   ev.end.dateTime   ?? ev.end.date   ?? "",
          all_day: !ev.start.dateTime,
          person: cal.person,
          color:  cal.color,
          description: ev.description,
          location: ev.location,
          calendarEntity: cal.entity_id,
          calendarName: cal.person,
          uid: ev.uid,
          recurrenceId: ev.recurrence_id ?? ev.recurrenceId,
        }));
      } catch {
        return [] as CalendarEvent[];
      }
    })
  );

  return results.flat();
}
