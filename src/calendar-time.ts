import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { CalendarEvent, AuroraCalendarConfig, PersonInfo, ViewMode, WeatherByDate } from "./types.js";
import { contrastText, shadeColor } from "./color-utils.js";
import { eventHasConcluded } from "./event-utils.js";
import { dateKey, localToday } from "./utils.js";
import { formatMonth, formatWeekday, t } from "./localize.js";
import { weatherSvgUrl, weatherTempLabel } from "./weather-utils.js";

const HOUR_H     = 64;  // px per hour

interface PositionedEvent {
  event: CalendarEvent;
  top: number;
  height: number;
  col: number;
  numCols: number;
}

interface VisibleEvent {
  event: CalendarEvent;
  startMs: number;
  endMs: number;
  startMin: number;
  endMin: number;
}

interface DragState {
  event: CalendarEvent;
  pointerId: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startHour: number;
  endHour: number;
  durationMs: number;
  durationMin: number;
  moved: boolean;
  previewDayIndex: number;
  previewStartMin: number;
}

interface PendingMove {
  event: CalendarEvent;
  start: Date;
  end: Date;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function fmtTime(d: Date, format: AuroraCalendarConfig["time_format"]): string {
  if (format === "24h") {
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }
  const h = d.getHours() % 12 || 12;
  const m = d.getMinutes();
  const ap = d.getHours() >= 12 ? "pm" : "am";
  return m ? `${h}:${m.toString().padStart(2, "0")}${ap}` : `${h}${ap}`;
}

function fmtHour(h: number, format: AuroraCalendarConfig["time_format"]): string {
  if (format === "24h") {
    return `${h.toString().padStart(2, "0")}:00`;
  }
  const hour = h % 24;
  if (hour === 0)  return "12am";
  if (hour === 12) return "12pm";
  return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
}

@customElement("aurora-calendar-time-grid")
export class AuroraCalendarTimeGrid extends LitElement {
  @property({ attribute: false }) events: CalendarEvent[]       = [];
  @property({ attribute: false }) days:   Date[]                = [];
  @property({ attribute: false }) config!: AuroraCalendarConfig;
  @property({ attribute: false }) viewMode!: ViewMode;
  @property({ attribute: false }) weatherByDate: WeatherByDate = {};
  @property({ attribute: false }) weatherEntity = "";
  @property({ attribute: false }) locale = "en";
  @property({ attribute: false }) persons: PersonInfo[] = [];
  @property({ type: Boolean }) autoScrollToNow = false;

  private _timer?: ReturnType<typeof setInterval>;
  private _scrollbarRo?: ResizeObserver;
  private _scrollbarGutter = -1;
  private _autoScrollKey = "";
  @state() private _drag: DragState | null = null;
  @state() private _pendingMove: PendingMove | null = null;
  private _suppressClickEventId = "";

  connectedCallback() {
    super.connectedCallback();
    // Redraw every minute so the current-time bar stays accurate
    this._timer = setInterval(() => this.requestUpdate(), 60_000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
    this._scrollbarRo?.disconnect();
  }

  firstUpdated() {
    const scroll = this.shadowRoot?.querySelector<HTMLElement>(".tg-scroll");
    if (!scroll) return;
    this._scrollbarRo = new ResizeObserver(() => this._syncScrollbarGutter());
    this._scrollbarRo.observe(scroll);
    this._syncScrollbarGutter();
  }

  updated() {
    this._applyAppearanceVars();
    this._syncScrollbarGutter();
    this._autoScrollToCurrentTime();
  }

  private _applyAppearanceVars(): void {
    if (!this.config) return;
    this.style.setProperty("--aurora-event-font-size", `${this.config.event_font_size}px`);
    this.style.setProperty("--aurora-event-font-family", this.config.event_font_family || "inherit");
  }

  private _syncScrollbarGutter(): void {
    const scroll = this.shadowRoot?.querySelector<HTMLElement>(".tg-scroll");
    if (!scroll) return;
    const gutter = Math.max(0, scroll.offsetWidth - scroll.clientWidth);
    if (gutter === this._scrollbarGutter) return;
    this._scrollbarGutter = gutter;
    this.style.setProperty("--tg-scrollbar-gutter", `${gutter}px`);
  }

  private _autoScrollToCurrentTime(): void {
    if (!this.autoScrollToNow || this.days.length === 0) return;
    const [startHour, endHour] = this._timeBounds(this.events.filter((event) => !event.all_day));
    const key = [
      this.viewMode,
      this.days.map((day) => dateKey(day)).join(","),
      startHour,
      endHour,
    ].join("|");
    if (key === this._autoScrollKey) return;
    this._autoScrollKey = key;

    requestAnimationFrame(() => {
      const scroll = this.shadowRoot?.querySelector<HTMLElement>(".tg-scroll");
      if (!scroll) return;

      const now = new Date();
      const nowMin = (now.getHours() - startHour) * 60 + now.getMinutes();
      const windowMin = (endHour - startHour) * 60;
      let target = 0;

      if (nowMin >= windowMin) {
        target = scroll.scrollHeight - scroll.clientHeight;
      } else if (nowMin > 0) {
        target = nowMin * (HOUR_H / 60) - scroll.clientHeight * 0.28;
      }

      scroll.scrollTop = Math.max(0, Math.min(target, scroll.scrollHeight - scroll.clientHeight));
    });
  }

  render() {
    const today  = localToday();
    const allDay = this.events.filter((e) => e.all_day);
    const timed  = this.events.filter((e) => !e.all_day);
    const hasAllDay = this.days.some((d) => allDay.some((e) => this._onDay(e, d)));
    const [startHour, endHour] = this._timeBounds(timed);
    const pxPerMin = HOUR_H / 60;
    const totalPx = (endHour - startHour) * HOUR_H;
    const hourCells = Array.from({ length: endHour - startHour }, (_, i) => i + startHour);
    const hourTicks = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);
    const dayCount = Math.max(1, this.days.length);
    const drag = this._drag;
    const pendingMove = this._pendingMove;

    return html`
      <div class="tg-wrapper" style="--tg-day-count: ${dayCount}">

        <!-- ── Day header ── -->
        <div class="tg-header">
          <div class="tg-gutter"></div>
          <div class="tg-day-headers">
            ${this.days.map((day) => {
              const isToday = sameDay(day, today);
              const weather = this.weatherByDate[dateKey(day)];
              return html`
                <div class="tg-day-hdr ${isToday ? "today" : ""}">
                  <span class="dow">${formatWeekday(this.locale, day, "short")}</span>
                  <span class="date-num ${isToday ? "circle" : ""}">${day.getDate()}</span>
                  <span class="month-lbl">${formatMonth(this.locale, day, "short")}</span>
                  ${weather ? html`
                    <button
                      class="weather-pill"
                      title="${weather.condition}"
                      aria-label=${t(this.locale, "openWeatherForecast")}
                      @click=${this._openWeatherMoreInfo}
                    >
                      <img src=${weatherSvgUrl(weather.condition, this.config.weather_icon_style)} alt="${weather.condition}" />
                      <span>${weatherTempLabel(weather)}</span>
                    </button>
                  ` : nothing}
                </div>
              `;
            })}
          </div>
        </div>

        <!-- ── All-day strip ── -->
        ${hasAllDay ? html`
          <div class="tg-allday">
            <div class="tg-gutter tg-allday-lbl">${t(this.locale, "allDay")}</div>
            <div class="tg-allday-cols">
              ${this.days.map((day) => html`
                <div class="tg-allday-col">
                  ${allDay
                    .filter((e) => this._onDay(e, day))
                    .map((e) => {
                      const textColor = contrastText(e.color);
                      const dim = this.config.dim_past_events && eventHasConcluded(e);
                      const avatar = this._personAvatar(e);
                      return html`
                        <div
                          class="allday-chip aurora-event-chip ${dim ? "dim" : ""}"
                          @click=${() => this._openEvent(e)}
                          style="--aurora-chip-bg:${e.color};--aurora-chip-border-color:${shadeColor(e.color, -32)};--aurora-chip-fg:${textColor};"
                          title="${e.title}"
                        >
                          <span>${e.title}</span>
                          ${avatar}
                        </div>
                      `;
                    })}
                </div>
              `)}
            </div>
          </div>
        ` : nothing}

        <!-- ── Scrollable time body ── -->
        <div class="tg-scroll">
          <div class="tg-inner" style="height:${totalPx}px">

            <!-- Hour labels -->
            <div class="tg-gutter tg-time-gutter">
              ${hourTicks.map((h, i) => html`
                <div
                  class="hour-lbl ${i === 0 ? "first" : i === hourTicks.length - 1 ? "last" : ""}"
                  style="top:${i * HOUR_H}px"
                >${fmtHour(h, this.config.time_format)}</div>
              `)}
            </div>

            <!-- Day columns -->
            <div class="tg-cols">
              ${this.days.map((day) => {
                const isToday = sameDay(day, today);
                const isPast  = day < today && !isToday;
                const placed  = this._layout(timed.filter((e) => this._onDay(e, day)), day, startHour, endHour, pxPerMin);
                const nowPx   = isToday ? this._nowPx(startHour, endHour, pxPerMin) : null;

                return html`
                  <div class="tg-day-col ${isToday ? "today-col" : ""} ${isPast ? "past-col" : ""}">

                    <!-- Grid lines -->
                    ${hourTicks.map((_, i) => html`
                      <div class="hline"      style="top:${i * HOUR_H}px"></div>
                    `)}
                    ${hourCells.map((_, i) => html`
                      <div class="hline half" style="top:${i * HOUR_H + HOUR_H / 2}px"></div>
                    `)}

                    <!-- Events -->
                    ${placed.map((p) => {
                      const dim  = this.config.dim_past_events && eventHasConcluded(p.event);
                      const showT = this.config.show_event_time;
                      const s  = new Date(p.event.start);
                      const en = new Date(p.event.end);
                      const textColor = contrastText(p.event.color);
                      const avatar = this._personAvatar(p.event);
                      const timeStr = showT
                        ? `${fmtTime(s, this.config.time_format)} – ${fmtTime(en, this.config.time_format)}`
                        : "";

                      const isDragging = drag?.event.id === p.event.id;
                      return html`
                        <div
                          class="ev-block aurora-event-chip ${dim ? "dim" : ""} ${p.event.canDragEdit ? "can-drag" : ""} ${isDragging ? "drag-source" : ""}"
                          @pointerdown=${(event: PointerEvent) => this._handleEventPointerDown(event, p.event, startHour, endHour)}
                          @click=${() => this._handleEventClick(p.event)}
                          style="top:${p.top}px;height:${p.height}px;left:calc(${p.col} / ${p.numCols} * (100% - 4px) + 2px);width:calc(1 / ${p.numCols} * (100% - 4px) - 2px);--aurora-chip-bg:${p.event.color};--aurora-chip-border-color:${shadeColor(p.event.color, -32)};--aurora-chip-fg:${textColor};"
                          title="${p.event.title}${timeStr ? "\n" + timeStr : ""}"
                        >
                          ${p.event.canDragEdit ? html`
                            <button class="drag-handle" title="Move event" aria-label="Move event" @click=${(event: Event) => event.stopPropagation()}>
                              <ha-icon icon="mdi:drag"></ha-icon>
                            </button>
                          ` : nothing}
                          <div class="ev-title">${p.event.title}</div>
                          ${p.height > 38 && timeStr
                            ? html`<div class="ev-time">${timeStr}</div>`
                            : nothing}
                          ${avatar}
                        </div>
                      `;
                    })}

                    <!-- Current-time indicator -->
                    ${nowPx !== null ? html`
                      <div class="now-bar" style="top:${nowPx}px">
                        <div class="now-dot"></div>
                      </div>
                    ` : nothing}

                  </div>
                `;
              })}
              ${drag ? this._renderDragPreview(drag, dayCount) : nothing}
            </div>
          </div>
        </div>

      </div>
      ${pendingMove ? this._renderMoveConfirm(pendingMove) : nothing}
    `;
  }

  // ── helpers ──────────────────────────────────────────────────────────

  private _onDay(event: CalendarEvent, day: Date): boolean {
    if (event.all_day) {
      const s  = new Date(event.start + "T00:00:00");
      const en = new Date(event.end   + "T00:00:00");
      return s <= day && day < en;
    }
    // Timed: show on any day the event spans (handles cross-midnight and multi-day)
    const s = new Date(event.start);
    const en = new Date(event.end);
    const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
    const dayEnd   = new Date(day); dayEnd.setHours(23, 59, 59, 999);
    return s <= dayEnd && en > dayStart;
  }

  private _personAvatar(event: CalendarEvent) {
    const person = this.persons.find((p) => p.person === event.person);
    const color = person?.color || event.color;
    const initial = (person?.person || event.person || "?").charAt(0).toUpperCase();
    return html`
      <span class="event-avatar" style="--event-avatar-color: ${color}" title="${event.person}">
        ${person?.avatar
          ? html`<img src="${person.avatar}" alt="${event.person}" />`
          : html`${initial}`}
      </span>
    `;
  }

  private _openEvent(event: CalendarEvent): void {
    this.dispatchEvent(new CustomEvent("aurora-event-open", {
      detail: { event },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleEventClick(event: CalendarEvent): void {
    if (this._suppressClickEventId === event.id) {
      this._suppressClickEventId = "";
      return;
    }
    this._openEvent(event);
  }

  private _handleEventPointerDown(
    pointerEvent: PointerEvent,
    event: CalendarEvent,
    startHour: number,
    endHour: number
  ): void {
    if (!event.canDragEdit || event.all_day || pointerEvent.button !== 0) return;
    const target = pointerEvent.composedPath()[0] as HTMLElement | undefined;
    const isHandle = Boolean(target?.closest?.(".drag-handle"));
    // Drag is only initiated from the handle — clicking anywhere else opens the event details.
    if (!isHandle) return;

    pointerEvent.preventDefault();
    pointerEvent.stopPropagation();
    const start = new Date(event.start);
    const end = new Date(event.end);
    const durationMs = Math.max(60_000, end.getTime() - start.getTime());
    const durationMin = Math.max(1, Math.round(durationMs / 60_000));
    const startMin = (start.getHours() - startHour) * 60 + start.getMinutes();
    const dayIndex = Math.max(0, this.days.findIndex((day) => sameDay(day, start)));
    this._pendingMove = null;
    this._drag = {
      event,
      pointerId: pointerEvent.pointerId,
      startX: pointerEvent.clientX,
      startY: pointerEvent.clientY,
      currentX: pointerEvent.clientX,
      currentY: pointerEvent.clientY,
      startHour,
      endHour,
      durationMs,
      durationMin,
      moved: false,
      previewDayIndex: dayIndex === -1 ? 0 : dayIndex,
      previewStartMin: Math.max(0, startMin),
    };
    this.setPointerCapture(pointerEvent.pointerId);
    window.addEventListener("pointermove", this._handleDragPointerMove);
    window.addEventListener("pointerup", this._handleDragPointerUp);
    window.addEventListener("pointercancel", this._handleDragPointerCancel);
  }

  private _handleDragPointerMove = (pointerEvent: PointerEvent): void => {
    const drag = this._drag;
    if (!drag || pointerEvent.pointerId !== drag.pointerId) return;
    pointerEvent.preventDefault();
    const dx = pointerEvent.clientX - drag.startX;
    const dy = pointerEvent.clientY - drag.startY;
    const moved = drag.moved || Math.hypot(dx, dy) > 6;
    const preview = this._previewFromPointer(pointerEvent.clientX, pointerEvent.clientY, drag);
    this._drag = {
      ...drag,
      currentX: pointerEvent.clientX,
      currentY: pointerEvent.clientY,
      moved,
      previewDayIndex: preview.dayIndex,
      previewStartMin: preview.startMin,
    };
    this.requestUpdate();
  };

  private _handleDragPointerUp = (pointerEvent: PointerEvent): void => {
    const drag = this._drag;
    if (!drag || pointerEvent.pointerId !== drag.pointerId) return;
    pointerEvent.preventDefault();
    this._teardownDragListeners(pointerEvent.pointerId);

    if (!drag.moved) {
      this._drag = null;
      return;
    }

    const preview = this._previewFromPointer(pointerEvent.clientX, pointerEvent.clientY, drag);
    const start = this._dateTimeFromPreview(preview.dayIndex, preview.startMin, drag.startHour);
    const end = new Date(start.getTime() + drag.durationMs);
    this._suppressClickEventId = drag.event.id;
    this._pendingMove = { event: drag.event, start, end };
    this._drag = null;
  };

  private _handleDragPointerCancel = (pointerEvent: PointerEvent): void => {
    const drag = this._drag;
    if (!drag || pointerEvent.pointerId !== drag.pointerId) return;
    this._teardownDragListeners(pointerEvent.pointerId);
    this._drag = null;
  };

  private _teardownDragListeners(pointerId: number): void {
    try {
      this.releasePointerCapture(pointerId);
    } catch {
      // Pointer capture may already be gone after cancellation.
    }
    window.removeEventListener("pointermove", this._handleDragPointerMove);
    window.removeEventListener("pointerup", this._handleDragPointerUp);
    window.removeEventListener("pointercancel", this._handleDragPointerCancel);
  }

  private _previewFromPointer(x: number, y: number, drag: DragState): {
    dayIndex: number;
    startMin: number;
  } {
    const cols = Array.from(this.shadowRoot?.querySelectorAll<HTMLElement>(".tg-day-col") ?? []);
    if (cols.length === 0) {
      return { dayIndex: drag.previewDayIndex, startMin: drag.previewStartMin };
    }

    let dayIndex = cols.findIndex((col) => {
      const rect = col.getBoundingClientRect();
      return x >= rect.left && x <= rect.right;
    });
    if (dayIndex === -1) {
      const first = cols[0].getBoundingClientRect();
      const last = cols[cols.length - 1].getBoundingClientRect();
      dayIndex = x < first.left ? 0 : x > last.right ? cols.length - 1 : drag.previewDayIndex;
    }

    const colRect = cols[dayIndex].getBoundingClientRect();
    const windowMin = (drag.endHour - drag.startHour) * 60;
    const maxStartMin = Math.max(0, windowMin - drag.durationMin);
    const rawMin = ((y - colRect.top) / HOUR_H) * 60;
    const snapped = Math.round(rawMin / 15) * 15;
    return {
      dayIndex,
      startMin: Math.max(0, Math.min(maxStartMin, snapped)),
    };
  }

  private _dateTimeFromPreview(dayIndex: number, startMin: number, startHour: number): Date {
    const day = this.days[Math.max(0, Math.min(this.days.length - 1, dayIndex))] || localToday();
    const date = new Date(day);
    date.setHours(startHour, 0, 0, 0);
    date.setMinutes(date.getMinutes() + startMin);
    return date;
  }

  private _renderDragPreview(drag: DragState, dayCount: number) {
    const event = drag.event;
    const textColor = contrastText(event.color);
    const start = this._dateTimeFromPreview(drag.previewDayIndex, drag.previewStartMin, drag.startHour);
    const end = new Date(start.getTime() + drag.durationMs);
    const timeStr = `${fmtTime(start, this.config.time_format)} – ${fmtTime(end, this.config.time_format)}`;
    return html`
      <div
        class="drag-preview aurora-event-chip"
        style="--preview-day-count:${dayCount};--preview-day-index:${drag.previewDayIndex};top:${drag.previewStartMin * (HOUR_H / 60)}px;height:${Math.max(24, drag.durationMin * (HOUR_H / 60))}px;--aurora-chip-bg:${event.color};--aurora-chip-border-color:${shadeColor(event.color, -32)};--aurora-chip-fg:${textColor};"
      >
        <div class="ev-title">${event.title}</div>
        <div class="ev-time">${timeStr}</div>
      </div>
    `;
  }

  private _renderMoveConfirm(move: PendingMove) {
    return html`
      <div class="move-confirm" style="--move-color: ${move.event.color}">
        <div>
          <strong>Move event?</strong>
          <span>${move.event.title}</span>
          <small>${this._moveTimeLabel(move.start, move.end)}</small>
        </div>
        <div class="move-actions">
          <button @click=${this._cancelPendingMove}>Cancel</button>
          <button class="confirm" @click=${this._confirmPendingMove}>Move</button>
        </div>
      </div>
    `;
  }

  private _moveTimeLabel(start: Date, end: Date): string {
    const day = new Intl.DateTimeFormat(this.locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(start);
    return `${day}, ${fmtTime(start, this.config.time_format)} - ${fmtTime(end, this.config.time_format)}`;
  }

  private _cancelPendingMove = (): void => {
    this._pendingMove = null;
  };

  private _confirmPendingMove = (): void => {
    const move = this._pendingMove;
    if (!move) return;
    this._pendingMove = null;
    this.dispatchEvent(new CustomEvent("aurora-event-move", {
      detail: {
        event: move.event,
        start: move.start.toISOString(),
        end: move.end.toISOString(),
      },
      bubbles: true,
      composed: true,
    }));
  };

  /** Assign columns per overlap cluster so unrelated events can use full width. */
  private _layout(
    events: CalendarEvent[],
    day: Date,
    startHour: number,
    endHour: number,
    pxPerMin: number
  ): PositionedEvent[] {
    if (events.length === 0) return [];

    const dayMidnight    = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayVisibleEnd  = new Date(day.getFullYear(), day.getMonth(), day.getDate(), endHour);
    const windowMin = (endHour - startHour) * 60;
    const visibleEvents = events
      .map((event): VisibleEvent | null => {
        const s = new Date(event.start);
        const en = new Date(event.end);
        // Clip to this day: events starting before this day begin at top of window;
        // events ending after visible end are clamped to bottom of window.
        const rawStartMin = s < dayMidnight ? 0 : (s.getHours() - startHour) * 60 + s.getMinutes();
        const rawEndMin   = en >= dayVisibleEnd ? windowMin : (en.getHours() - startHour) * 60 + en.getMinutes();
        if (rawEndMin <= 0 || rawStartMin >= windowMin) return null;
        return {
          event,
          startMs: s.getTime(),
          endMs: en.getTime(),
          startMin: Math.max(0, rawStartMin),
          endMin: Math.min(windowMin, rawEndMin),
        };
      })
      .filter((event): event is VisibleEvent => event !== null)
      .sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs);
    if (visibleEvents.length === 0) return [];

    const positioned: PositionedEvent[] = [];
    let cluster: VisibleEvent[] = [];
    let clusterEndMs = -Infinity;

    const flushCluster = (): void => {
      if (cluster.length === 0) return;

      const colEnds: number[] = [];
      const cols: number[] = [];

      for (const item of cluster) {
        let col = colEnds.findIndex((endMs) => endMs <= item.startMs);
        if (col === -1) {
          col = colEnds.length;
          colEnds.push(item.endMs);
        } else {
          colEnds[col] = item.endMs;
        }
        cols.push(col);
      }

      const numCols = Math.max(...cols) + 1;
      cluster.forEach((item, index) => {
        positioned.push({
          event: item.event,
          top: item.startMin * pxPerMin,
          height: Math.max(24, (item.endMin - item.startMin) * pxPerMin),
          col: cols[index],
          numCols,
        });
      });
    };

    for (const item of visibleEvents) {
      if (cluster.length > 0 && item.startMs >= clusterEndMs) {
        flushCluster();
        cluster = [];
        clusterEndMs = -Infinity;
      }
      cluster.push(item);
      clusterEndMs = Math.max(clusterEndMs, item.endMs);
    }

    flushCluster();
    return positioned;
  }

  private _nowPx(startHour: number, endHour: number, pxPerMin: number): number | null {
    const now = new Date();
    const min = (now.getHours() - startHour) * 60 + now.getMinutes();
    if (min < 0 || now.getHours() >= endHour) return null;
    return min * pxPerMin;
  }

  private _startHour(): number {
    return Math.min(23, Math.max(0, Math.floor(this.config.visible_start_hour)));
  }

  private _endHour(startHour: number): number {
    const endHour = Math.min(24, Math.max(1, Math.floor(this.config.visible_end_hour)));
    return Math.max(startHour + 1, endHour);
  }

  private _timeBounds(events: CalendarEvent[]): [number, number] {
    let startHour = this._startHour();
    let endHour = this._endHour(startHour);

    for (const event of events) {
      const start = new Date(event.start);
      const end = new Date(event.end);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) continue;

      for (const day of this.days) {
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        if (start >= dayEnd || end <= dayStart) continue;

        const segmentStart = start <= dayStart ? 0 : start.getHours() + start.getMinutes() / 60;
        const segmentEnd = end >= dayEnd ? 24 : end.getHours() + end.getMinutes() / 60;
        startHour = Math.min(startHour, Math.floor(segmentStart));
        endHour = Math.max(endHour, Math.ceil(segmentEnd));
      }
    }

    startHour = Math.max(0, Math.min(23, startHour));
    endHour = Math.max(startHour + 1, Math.min(24, endHour));
    return [startHour, endHour];
  }

  private _openWeatherMoreInfo(event: Event): void {
    event.stopPropagation();
    if (!this.weatherEntity) return;

    const moreInfoEvent = new Event("hass-more-info", {
      bubbles: true,
      composed: true,
    }) as Event & { detail?: { entityId: string } };
    moreInfoEvent.detail = { entityId: this.weatherEntity };
    this.dispatchEvent(moreInfoEvent);
  }

  // ── styles ───────────────────────────────────────────────────────────

  static styles = css`
    :host {
      --tg-scrollbar-gutter: 0px;
      position: relative;
      display: block;
      height: 100%;
    }

    .tg-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      overflow: hidden;
    }

    /* ── Shared gutter ── */
    .tg-gutter {
      width: 52px;
      flex-shrink: 0;
    }

    /* ── Header ── */
    .tg-header {
      display: flex;
      border-bottom: 2px solid var(--divider-color, #e0e0e0);
      background: var(--secondary-background-color);
      flex-shrink: 0;
      padding-right: var(--tg-scrollbar-gutter);
      box-sizing: border-box;
    }

    .tg-day-headers {
      flex: 1;
      display: flex;
    }

    .tg-day-hdr {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6px 2px;
      border-left: 1px solid var(--divider-color, #e0e0e0);
      gap: 1px;
      min-width: 0;
    }

    .tg-day-hdr.today {
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }

    .dow {
      font-size: 0.62rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color);
    }

    .date-num {
      font-size: 1.05rem;
      font-weight: 500;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-text-color);
    }

    .date-num.circle {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-radius: 6px;
      font-weight: 700;
    }

    .month-lbl {
      font-size: 0.58rem;
      color: var(--secondary-text-color);
    }

    .weather-pill {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 0.72rem;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
    }

    .weather-pill img {
      width: 28px;
      height: 20px;
      object-fit: contain;
    }

    /* ── All-day strip ── */
    .tg-allday {
      display: grid;
      grid-template-columns: 52px minmax(0, 1fr);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
      min-height: 26px;
      padding-right: var(--tg-scrollbar-gutter);
      box-sizing: border-box;
    }

    .tg-allday-lbl {
      font-size: 0.58rem;
      color: var(--primary-text-color);
      font-weight: 700;
      text-shadow: 0 1px 2px color-mix(in srgb, var(--card-background-color, #fff) 75%, transparent);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 6px;
      width: auto;
      box-sizing: border-box;
    }

    .tg-allday-cols {
      min-width: 0;
      display: grid;
      grid-template-columns: repeat(var(--tg-day-count, 1), minmax(0, 1fr));
    }

    .tg-allday-col {
      min-width: 0;
      padding: 2px;
      border-left: 1px solid var(--divider-color, #e0e0e0);
      box-sizing: border-box;
    }

    .allday-chip {
      position: relative;
      padding: var(--aurora-allday-padding, 1px 4px 1px 5px);
      border-radius: var(--aurora-event-radius, 6px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
      line-height: 1.5;
      font-weight: 700;
      cursor: pointer;
      background: var(--aurora-chip-bg);
      border-left: var(--aurora-event-border-width, 4px) solid var(--aurora-chip-border-color);
      color: var(--aurora-chip-fg);
      font-size: var(--aurora-event-font-size);
      font-family: var(--aurora-event-font-family);
    }

    .allday-chip span:first-child {
      display: block;
      padding-right: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .allday-chip.dim {
      opacity: 0.35;
    }

    /* ── Scrollable time body ── */
    .tg-scroll {
      overflow-y: auto;
      flex: 1;
      min-height: 0;
      /* scroll-bar tracks only within this container */
      overscroll-behavior: contain;
    }

    .tg-inner {
      display: flex;
      position: relative;
      box-shadow: inset 0 -1px 0 var(--divider-color, #e0e0e0);
    }

    /* Hour labels */
    .tg-time-gutter {
      position: relative;
      background: color-mix(
        in srgb,
        var(--secondary-background-color, transparent) var(--aurora-card-opacity, 100%),
        transparent
      );
    }

    .hour-lbl {
      position: absolute;
      right: 0;
      transform: translateY(-50%);
      padding-right: 6px;
      font-size: 0.6rem;
      color: var(--primary-text-color);
      font-weight: 700;
      text-shadow: 0 1px 2px color-mix(in srgb, var(--card-background-color, #fff) 75%, transparent);
      box-sizing: border-box;
      line-height: 1;
      text-align: right;
      width: 100%;
    }

    .hour-lbl.first {
      transform: none;
    }

    .hour-lbl.last {
      transform: translateY(-100%);
    }

    /* ── Day columns ── */
    .tg-cols {
      flex: 1;
      display: flex;
      position: relative;
    }

    .tg-day-col {
      flex: 1;
      position: relative;
      border-left: 1px solid var(--divider-color, #e0e0e0);
    }

    .tg-day-col.today-col {
      background: color-mix(in srgb, var(--primary-color) 4%, transparent);
    }

    /* Grid lines */
    .hline {
      position: absolute;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--divider-color, #e0e0e0);
      pointer-events: none;
    }

    .hline.half {
      opacity: 0.45;
      background: repeating-linear-gradient(
        90deg,
        var(--divider-color, #ccc) 0,
        var(--divider-color, #ccc) 4px,
        transparent 4px,
        transparent 8px
      );
    }

    /* ── Event blocks ── */
    .ev-block {
      position: absolute;
      border-radius: var(--aurora-event-radius, 8px);
      overflow: hidden;
      padding: var(--aurora-event-padding, 6px 30px 6px 8px);
      box-sizing: border-box;
      cursor: pointer;
      transition: filter 0.12s;
      box-shadow: var(--aurora-event-shadow, 0 1px 2px rgba(0, 0, 0, 0.16));
      touch-action: manipulation;
      background: var(--aurora-chip-bg);
      border-left: var(--aurora-event-border-width, 4px) solid var(--aurora-chip-border-color);
      color: var(--aurora-chip-fg);
      font-size: var(--aurora-event-font-size);
      font-family: var(--aurora-event-font-family);
    }

    .ev-block:hover {
      filter: brightness(0.9);
      z-index: 10;
    }

    .ev-block.dim {
      opacity: 0.35;
    }

    .ev-block.can-drag {
      cursor: grab;
    }

    .ev-block.can-drag:active {
      cursor: grabbing;
    }

    .ev-block.drag-source {
      opacity: 0.28;
      filter: grayscale(0.2);
    }

    .drag-handle {
      position: absolute;
      top: 4px;
      right: 5px;
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.22);
      color: inherit;
      cursor: grab;
      padding: 0;
      opacity: 0.82;
    }

    .drag-handle ha-icon {
      width: 16px;
      height: 16px;
      pointer-events: none;
    }

    .drag-preview {
      position: absolute;
      z-index: 40;
      left: calc(var(--preview-day-index) / var(--preview-day-count) * 100% + 2px);
      width: calc(1 / var(--preview-day-count) * 100% - 4px);
      border-radius: var(--aurora-event-radius, 8px);
      overflow: hidden;
      padding: var(--aurora-event-padding, 6px 30px 6px 8px);
      box-sizing: border-box;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
      pointer-events: none;
      opacity: 0.92;
      background: var(--aurora-chip-bg);
      border-left: var(--aurora-event-border-width, 4px) solid var(--aurora-chip-border-color);
      color: var(--aurora-chip-fg);
      font-size: var(--aurora-event-font-size);
      font-family: var(--aurora-event-font-family);
    }

    .move-confirm {
      position: absolute;
      right: 16px;
      bottom: 16px;
      z-index: 80;
      width: min(360px, calc(100% - 32px));
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 14px;
      border-radius: 16px;
      border: 1px solid color-mix(in srgb, var(--move-color, var(--primary-color)) 34%, var(--divider-color));
      background: color-mix(in srgb, var(--card-background-color, #fff) 94%, var(--move-color, var(--primary-color)) 6%);
      color: var(--primary-text-color);
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.28);
      box-sizing: border-box;
      animation: move-confirm-in 0.16s ease-out both;
    }

    .move-confirm > div:first-child {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .move-confirm strong,
    .move-confirm span,
    .move-confirm small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .move-confirm strong {
      font-size: 0.95rem;
      font-weight: 900;
    }

    .move-confirm span {
      font-size: 0.86rem;
      font-weight: 700;
    }

    .move-confirm small {
      color: var(--secondary-text-color);
      font-size: 0.78rem;
      font-weight: 700;
    }

    .move-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .move-actions button {
      min-height: 38px;
      border: 2px solid var(--divider-color, #ccc);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 88%, var(--move-color, var(--primary-color)) 12%);
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
      font-size: 0.82rem;
      font-weight: 800;
      padding: 0 14px;
    }

    .move-actions button.confirm {
      border-color: color-mix(in srgb, var(--move-color, var(--primary-color)) 70%, var(--divider-color));
      background: var(--move-color, var(--primary-color));
      color: var(--text-primary-color, #fff);
    }

    @keyframes move-confirm-in {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .ev-title {
      font-size: 1em;
      font-weight: 800;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.15;
    }

    .ev-time {
      margin-top: 2px;
      font-size: 0.82em;
      font-weight: 500;
      opacity: 0.82;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .event-avatar {
      position: absolute;
      right: 6px;
      bottom: 5px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--event-avatar-color, var(--primary-color));
      border: 1.5px solid rgba(255, 255, 255, 0.72);
      color: #fff;
      font-size: 0.62rem;
      font-weight: 900;
      overflow: hidden;
      box-sizing: border-box;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      pointer-events: none;
    }

    .event-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* ── Current-time bar ── */
    .now-bar {
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--error-color, #e53935);
      z-index: 5;
      pointer-events: none;
    }

    .now-dot {
      position: absolute;
      left: -5px;
      top: -4px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--error-color, #e53935);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "aurora-calendar-time-grid": AuroraCalendarTimeGrid;
  }
}
