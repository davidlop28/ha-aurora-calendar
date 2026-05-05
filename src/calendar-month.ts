import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { CalendarEvent, AuroraCalendarConfig, PersonInfo, WeatherByDate, WeekStart } from "./types.js";
import { contrastText, shadeColor } from "./color-utils.js";
import { eventHasConcluded } from "./event-utils.js";
import { dateKey, localToday } from "./utils.js";
import { formatWeekday, t } from "./localize.js";
import { weatherSvgUrl, weatherTempParts } from "./weather-utils.js";

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function fillsFullDay(event: CalendarEvent, day: Date): boolean {
  if (event.all_day) return true;
  const s = new Date(event.start);
  const en = new Date(event.end);
  const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
  const nextDay  = new Date(day); nextDay.setHours(24, 0, 0, 0);
  return s <= dayStart && en >= nextDay;
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

function fmtTimeRange(
  event: CalendarEvent,
  format: AuroraCalendarConfig["time_format"],
  locale: string
): string {
  const s = new Date(event.start);
  const en = new Date(event.end);
  const startT = fmtTime(s, format);
  const endT = fmtTime(en, format);
  if (sameDay(s, en)) {
    return `${startT} - ${endT}`;
  }
  const dateOpts: Intl.DateTimeFormatOptions = { month: "numeric", day: "numeric" };
  const sD = s.toLocaleDateString(locale, dateOpts);
  const enD = en.toLocaleDateString(locale, dateOpts);
  return `${sD} ${startT} - ${enD} ${endT}`;
}

@customElement("aurora-calendar-month")
export class AuroraCalendarMonth extends LitElement {
  @property({ attribute: false }) events: CalendarEvent[] = [];
  @property({ attribute: false }) start!: Date;
  @property({ attribute: false }) end!: Date;
  @property({ attribute: false }) currentMonth!: number;
  @property({ attribute: false }) currentYear!: number;
  @property({ attribute: false }) config!: AuroraCalendarConfig;
  @property({ type: Boolean }) dimOtherMonths = true;
  @property({ attribute: false }) weekStart: WeekStart = "sunday";
  @property({ attribute: false }) weatherByDate: WeatherByDate = {};
  @property({ attribute: false }) weatherEntity = "";
  @property({ attribute: false }) locale = "en";
  @property({ attribute: false }) persons: PersonInfo[] = [];
  private _autoScrollKey = "";

  updated(): void {
    this._applyAppearanceVars();
    this._syncScrollFades();
    this._autoScrollCurrentDayEvents();
  }

  private _applyAppearanceVars(): void {
    if (!this.config) return;
    this.style.setProperty("--aurora-event-font-size", `${this.config.event_font_size}px`);
    this.style.setProperty("--aurora-event-font-family", this.config.event_font_family || "inherit");
  }

  render() {
    const today = localToday();
    const days = this._days();
    const firstHeader = this.weekStart === "monday" ? 1 : 0;
    const dayHeaders = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2026, 1, 1 + ((firstHeader + i) % 7));
      return formatWeekday(this.locale, date, "short");
    });

    return html`
      <div class="month-grid ${this.config.show_calendar_grid_lines ? "" : "no-grid"}">
        <div class="col-headers">
          ${dayHeaders.map((d) => html`<div class="col-header">${d}</div>`)}
        </div>
        <div class="cells">
          ${days.map((day) => {
            const isToday = sameDay(day, today);
            const isCurrent =
              !this.dimOtherMonths ||
              (day.getMonth() === this.currentMonth &&
                day.getFullYear() === this.currentYear);
            const isPast = day < today && !isToday;
            const events = this._eventsOn(day);
            const grouped = this._groupEvents(events, day);
            const focusEventId = isToday ? this._focusEventId(events, day) : "";
            const weather = this.weatherByDate[dateKey(day)];
            const temps = weather ? weatherTempParts(weather) : null;
            const shouldDimOtherMonth = this.dimOtherMonths && !isCurrent;

            return html`
              <div
                class="cell
                  ${isToday ? "today" : ""}
                  ${!isCurrent ? "other-month" : ""}
                  ${isPast ? "past" : ""}"
              >
                <div class="day-meta">
                  <div class="day-num ${isToday ? "circle" : ""}">
                    ${day.getDate()}
                  </div>
                  ${weather ? html`
                    <button
                      class="weather-pill"
                      title="${weather.condition}"
                      aria-label=${t(this.locale, "openWeatherForecast")}
                      @click=${this._openWeatherMoreInfo}
                    >
                      <span class="weather-temps">
                        <span>${t(this.locale, "hi")}: ${temps?.high || "--"}</span>
                        <span>${t(this.locale, "lo")}: ${temps?.low || "--"}</span>
                      </span>
                      <img src=${weatherSvgUrl(weather.condition, this.config.weather_icon_style)} alt="${weather.condition}" />
                    </button>
                  ` : ""}
                </div>
                <div class="events-wrap">
                  <div
                    class="events-scroll"
                    data-current-day=${isToday ? "true" : "false"}
                    @scroll=${this._handleEventScroll}
                  >
                  ${grouped.allDay.length ? html`
                    <div class="all-day-stack ${focusEventId ? "yields-to-focus" : ""}">
                      <div class="all-day-label">All day</div>
                      ${grouped.allDay.map((e) => this._renderEventChip(e, focusEventId, shouldDimOtherMonth, true))}
                    </div>
                  ` : ""}
                  ${grouped.expiredTimed.map((e) => this._renderEventChip(e, focusEventId, shouldDimOtherMonth, false))}
                  ${grouped.activeTimed.map((e) => this._renderEventChip(e, focusEventId, shouldDimOtherMonth, false))}
                  </div>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderEventChip(e: CalendarEvent, focusEventId: string, shouldDimOtherMonth: boolean, asAllDay: boolean) {
    const concluded = eventHasConcluded(e);
    const dim = this.config.dim_past_events && concluded;
    const time =
      this.config.show_event_time && !e.all_day && !asAllDay
        ? fmtTimeRange(e, this.config.time_format, this.locale)
        : "";
    const textColor = contrastText(e.color);
    const avatar = this._personAvatar(e);
    return html`
      <div
        class="chip aurora-event-chip ${e.all_day ? "all-day-chip" : ""} ${dim || shouldDimOtherMonth ? "dim" : ""}"
        data-focus-event=${e.id === focusEventId ? "true" : "false"}
        data-event-concluded=${concluded ? "true" : "false"}
        @click=${() => this._openEvent(e)}
        style="--aurora-chip-bg:${e.color};--aurora-chip-border-color:${shadeColor(e.color, -32)};--aurora-chip-fg:${textColor};"
      >
        <div class="chip-title">${e.title}</div>
        ${time ? html`<div class="chip-time">${time}</div>` : ""}
        ${avatar}
      </div>
    `;
  }

  private _days(): Date[] {
    const days: Date[] = [];
    const cur = new Date(this.start);
    while (cur <= this.end) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }

  private _eventsOn(day: Date): CalendarEvent[] {
    return this.events
      .filter((e) => {
        if (e.all_day) {
          // HA all-day end is exclusive (next day midnight)
          const s = new Date(e.start + "T00:00:00");
          const en = new Date(e.end + "T00:00:00");
          return s <= day && day < en;
        }
        // Timed: show on any day the event spans (cross-midnight and multi-day)
        const s = new Date(e.start);
        const en = new Date(e.end);
        const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
        const dayEnd   = new Date(day); dayEnd.setHours(23, 59, 59, 999);
        return s <= dayEnd && en > dayStart;
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }

  private _handleEventScroll(event: Event): void {
    this._updateScrollFade(event.currentTarget as HTMLElement);
  }

  private _syncScrollFades(): void {
    this.shadowRoot
      ?.querySelectorAll<HTMLElement>(".events-scroll")
      .forEach((el) => this._updateScrollFade(el));
  }

  private _updateScrollFade(el: HTMLElement): void {
    const canScrollUp = el.scrollTop > 1;
    const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
    el.classList.toggle("can-scroll-up", canScrollUp);
    el.classList.toggle("can-scroll-down", canScrollDown);
    this._updateAllDayStickiness(el);
    this._updateFadeOffset(el);
    this._updateUnderAllDayDimming(el);
  }

  private _updateAllDayStickiness(el: HTMLElement): void {
    const stack = el.querySelector<HTMLElement>(".all-day-stack.yields-to-focus");
    const target = el.querySelector<HTMLElement>('.chip[data-focus-event="true"]');
    if (!stack || !target) {
      // Today: keep sticky (no focus event yet, or no timed events). Non-today: always static.
      if (el.dataset.currentDay === "true") {
        el.classList.remove("all-day-static");
      } else {
        el.classList.add("all-day-static");
      }
      el.querySelectorAll<HTMLElement>(".all-day-stack").forEach((stackEl) => {
        stackEl.style.setProperty("--all-day-shift", "0px");
        stackEl.style.setProperty("--all-day-collapse", "0px");
        stackEl.style.setProperty("--all-day-progress", "0");
        stackEl.style.pointerEvents = "auto";
      });
      return;
    }
    if (this.config.keep_all_day_events_visible) {
      el.classList.remove("all-day-static");
      stack.style.setProperty("--all-day-shift", "0px");
      stack.style.setProperty("--all-day-collapse", "0px");
      stack.style.setProperty("--all-day-progress", "0");
      stack.style.pointerEvents = "auto";
      return;
    }
    const stackHeight = Math.max(1, stack.offsetHeight);
    const targetCollisionPoint = Math.max(0, target.offsetTop - stackHeight - 1);
    const targetHasReachedAllDay = el.scrollTop >= targetCollisionPoint;
    // Size-based fallback is disabled while we validate the collision-based flow.
    const needsStaticFlow = targetHasReachedAllDay;

    if (needsStaticFlow) {
      el.classList.add("all-day-static");
      stack.style.setProperty("--all-day-shift", "0px");
      stack.style.setProperty("--all-day-collapse", "0px");
      stack.style.setProperty("--all-day-progress", "0");
      stack.style.pointerEvents = "auto";
      return;
    }
    el.classList.remove("all-day-static");
    stack.style.setProperty("--all-day-shift", "0px");
    stack.style.setProperty("--all-day-collapse", "0px");
    stack.style.setProperty("--all-day-progress", "0");
    stack.style.pointerEvents = "auto";
  }

  private _updateFadeOffset(el: HTMLElement): void {
    const stack = el.querySelector<HTMLElement>(".all-day-stack");
    const rawProgress = stack ? Number(stack.style.getPropertyValue("--all-day-progress") || "0") : 1;
    const progress = Number.isFinite(rawProgress) ? rawProgress : 1;
    const offset = stack && getComputedStyle(stack).position === "sticky"
      ? Math.max(0, stack.offsetHeight * (1 - progress) - 2)
      : 0;
    el.style.setProperty("--fade-top-offset", `${offset}px`);
  }

  private _updateUnderAllDayDimming(el: HTMLElement): void {
    const stack = el.querySelector<HTMLElement>(".all-day-stack");
    const stackIsSticky =
      stack &&
      !el.classList.contains("all-day-static") &&
      getComputedStyle(stack).position === "sticky";
    const stackHeight = stackIsSticky ? stack.offsetHeight : 0;

    el.querySelectorAll<HTMLElement>(".chip:not(.all-day-chip)").forEach((chip) => {
      const top = chip.offsetTop - el.scrollTop;
      const bottom = top + chip.offsetHeight;
      const chipHeight = Math.max(1, chip.offsetHeight);
      const fadeStartTop = stackHeight - chipHeight * 0.25;
      const fullyHiddenTop = stackHeight - chipHeight;

      if (stackHeight <= 0 || bottom <= 0 || top >= fadeStartTop) {
        chip.classList.remove("under-all-day");
        chip.classList.remove("under-all-day-hidden");
        chip.style.removeProperty("--under-all-day-opacity");
        return;
      }

      const baseOpacity = chip.classList.contains("dim") ? 0.35 : 1;
      const ratio = bottom <= stackHeight
        ? 1
        : Math.min(1, Math.max(0, (fadeStartTop - top) / Math.max(1, fadeStartTop - fullyHiddenTop)));
      const opacity = ratio >= 1 ? 0 : Math.max(0.06, baseOpacity * (1 - ratio * 0.94));
      chip.classList.add("under-all-day");
      chip.classList.toggle("under-all-day-hidden", opacity === 0);
      chip.style.setProperty("--under-all-day-opacity", opacity.toFixed(2));
    });
  }

  private _autoScrollCurrentDayEvents(): void {
    const today = localToday();
    const events = this._eventsOn(today);
    const focusEventId = this._focusEventId(events, today);
    const key = `${dateKey(today)}|${focusEventId}|${events.map((event) => event.id).join(",")}`;
    if (!focusEventId || key === this._autoScrollKey) return;

    requestAnimationFrame(() => {
      const scroll = this.shadowRoot?.querySelector<HTMLElement>('.events-scroll[data-current-day="true"]');
      const target = scroll?.querySelector<HTMLElement>('.chip[data-focus-event="true"]');
      if (!scroll || !target) return;
      const allDayStack = scroll.querySelector<HTMLElement>(".all-day-stack");
      const shouldReserveAllDaySpace = allDayStack && !target.classList.contains("all-day-chip");
      const scrollOffset = shouldReserveAllDaySpace
        ? allDayStack.offsetHeight + 6
        : 4;
      scroll.scrollTop = Math.max(0, target.offsetTop - scrollOffset);
      this._autoScrollKey = key;
      this._updateScrollFade(scroll);
    });
  }

  private _focusEventId(events: CalendarEvent[], day: Date): string {
    if (events.length === 0) return "";
    // Exclude events rendered as all-day chips (either native all-day or spanning the full day),
    // since their offsetTop is relative to the sticky stack, not the scroll container.
    const timed = events.filter((event) => !event.all_day && !fillsFullDay(event, day));
    return timed.find((event) => !eventHasConcluded(event))?.id || "";
  }

  private _groupEvents(events: CalendarEvent[], day: Date): {
    allDay: CalendarEvent[];
    expiredTimed: CalendarEvent[];
    activeTimed: CalendarEvent[];
  } {
    return {
      allDay: events.filter((event) => fillsFullDay(event, day)),
      expiredTimed: events.filter((event) => !fillsFullDay(event, day) && eventHasConcluded(event)),
      activeTimed: events.filter((event) => !fillsFullDay(event, day) && !eventHasConcluded(event)),
    };
  }

  private _openEvent(event: CalendarEvent): void {
    this.dispatchEvent(new CustomEvent("aurora-event-open", {
      detail: { event },
      bubbles: true,
      composed: true,
    }));
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

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    .month-grid {
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      overflow: hidden;
      box-shadow:
        inset 0 -1px 0 var(--divider-color, #e0e0e0),
        inset 0 0 0 1px var(--divider-color, #e0e0e0);
    }

    .col-headers {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: var(--secondary-background-color);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }

    .col-header {
      text-align: center;
      padding: 8px 0 6px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color);
    }

    .cells {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: 1fr;
      flex: 1;
      min-height: 0;
    }

    .cell {
      min-height: 72px;
      padding: 6px;
      border-right: 1px solid var(--divider-color, #e0e0e0);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .events-wrap {
      position: relative;
      flex: 1;
      min-height: 0;
    }

    .events-scroll {
      height: 100%;
      flex: 1;
      overflow-y: auto;
      min-height: 0;
      scrollbar-width: none;
      overscroll-behavior: contain;
      overflow-anchor: none;
      padding-bottom: 18px;
      --fade-top-offset: 0px;
      --fade-top-size: 12px;
      --fade-bottom-size: 22px;
    }

    .events-scroll.can-scroll-down {
      -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - var(--fade-bottom-size)), transparent);
      mask-image: linear-gradient(to bottom, #000 calc(100% - var(--fade-bottom-size)), transparent);
    }

    .events-scroll.can-scroll-up {
      -webkit-mask-image: linear-gradient(
        to bottom,
        #000 0,
        #000 var(--fade-top-offset),
        transparent var(--fade-top-offset),
        #000 calc(var(--fade-top-offset) + var(--fade-top-size)),
        #000 100%
      );
      mask-image: linear-gradient(
        to bottom,
        #000 0,
        #000 var(--fade-top-offset),
        transparent var(--fade-top-offset),
        #000 calc(var(--fade-top-offset) + var(--fade-top-size)),
        #000 100%
      );
    }

    .events-scroll.can-scroll-up.can-scroll-down {
      -webkit-mask-image: linear-gradient(
        to bottom,
        #000 0,
        #000 var(--fade-top-offset),
        transparent var(--fade-top-offset),
        #000 calc(var(--fade-top-offset) + var(--fade-top-size)),
        #000 calc(100% - var(--fade-bottom-size)),
        transparent
      );
      mask-image: linear-gradient(
        to bottom,
        #000 0,
        #000 var(--fade-top-offset),
        transparent var(--fade-top-offset),
        #000 calc(var(--fade-top-offset) + var(--fade-top-size)),
        #000 calc(100% - var(--fade-bottom-size)),
        transparent
      );
    }

    .events-scroll::-webkit-scrollbar {
      display: none;
    }

    .all-day-stack {
      --all-day-shift: 0px;
      --all-day-collapse: 0px;
      --all-day-progress: 0;
      position: sticky;
      top: 0;
      z-index: 3;
      padding: 0 0 4px;
      margin: 0;
      margin-bottom: calc(var(--all-day-collapse, 0px) * -1);
      background: transparent;
      transform: translateY(var(--all-day-shift, 0px));
      transition: none;
      will-change: transform, margin-bottom;
    }

    .events-scroll.all-day-static .all-day-stack {
      position: relative;
      top: auto;
      z-index: 1;
      margin-bottom: 0;
      transform: none;
      will-change: auto;
    }

    .all-day-label {
      margin: 0 0 2px 2px;
      color: var(--secondary-text-color);
      font-size: 0.58rem;
      font-weight: 900;
      letter-spacing: 0.06em;
      line-height: 1;
      text-transform: uppercase;
    }

    .cell:nth-child(7n) {
      border-right: none;
    }

    .cell.other-month .day-num {
      color: var(--disabled-text-color, #bbb);
    }

    .cell.other-month .day-meta,
    .cell.other-month .events-wrap {
      opacity: 0.48;
    }

    .day-num {
      font-size: var(--aurora-day-num-font-size, 1.7rem);
      font-weight: 800;
      width: 1.4em;
      height: 1.4em;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      color: var(--primary-text-color);
      line-height: 1;
    }

    .day-meta {
      position: relative;
      min-height: 42px;
      margin-bottom: 6px;
      min-width: 0;
    }

    .day-num.circle {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-radius: 6px;
      font-weight: 700;
    }

    .chip {
      display: block;
      position: relative;
      min-height: 34px;
      padding: var(--aurora-event-padding, 4px 26px 4px 6px);
      border-radius: var(--aurora-event-radius, 7px);
      margin-bottom: 4px;
      overflow: hidden;
      line-height: 1.18;
      box-shadow: var(--aurora-event-shadow, 0 1px 2px rgba(0, 0, 0, 0.16));
      cursor: pointer;
      background: var(--aurora-chip-bg);
      border-left: var(--aurora-event-border-width, 4px) solid var(--aurora-chip-border-color);
      color: var(--aurora-chip-fg);
      font-size: var(--aurora-event-font-size);
      font-family: var(--aurora-event-font-family);
    }

    .chip.all-day-chip {
      min-height: 0;
      height: 28px;
      padding-top: 3px;
      padding-bottom: 3px;
      margin-bottom: 2px;
      font-size: var(--aurora-allday-font-size, 13px);
      line-height: 1.05;
    }

    .all-day-stack .chip.all-day-chip:last-child {
      margin-bottom: 0;
    }

    .chip.under-all-day {
      opacity: var(--under-all-day-opacity, 0.18) !important;
      filter: saturate(0.55);
    }

    .chip.under-all-day-hidden {
      pointer-events: none;
    }

    .chip.all-day-chip .chip-title {
      font-size: 1em;
      line-height: 1.05;
    }

    .chip.all-day-chip .event-avatar {
      width: 20px;
      height: 20px;
      font-size: 0.58rem;
    }

    .chip-title,
    .chip-time {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chip-title {
      font-size: 1em;
      font-weight: 800;
    }

    .chip-time {
      margin-top: 2px;
      font-size: 0.82em;
      font-weight: 500;
      opacity: 0.82;
    }

    .chip.dim {
      opacity: 0.38;
    }

    .event-avatar {
      position: absolute;
      right: 5px;
      bottom: 4px;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--event-avatar-color, var(--primary-color));
      border: 1.5px solid rgba(255, 255, 255, 0.72);
      color: #fff;
      font-size: 0.58rem;
      font-weight: 900;
      overflow: hidden;
      box-sizing: border-box;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .event-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .weather-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      max-width: calc(100% - 44px);
      position: absolute;
      top: 0;
      right: 0;
      height: 38px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--secondary-text-color);
      font: inherit;
      font-weight: 600;
      overflow: hidden;
      cursor: pointer;
    }

    .weather-pill img {
      width: 38px;
      height: 38px;
      object-fit: contain;
      flex-shrink: 0;
    }

    .weather-temps {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1px;
      font-size: 0.68rem;
      font-weight: 700;
      line-height: 1;
      text-align: right;
      white-space: nowrap;
    }

    .weather-temps span {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .month-grid.no-grid {
      box-shadow: none;
    }

    .month-grid.no-grid .col-headers,
    .month-grid.no-grid .cell {
      border-right-color: transparent;
      border-bottom-color: transparent;
    }

  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "aurora-calendar-month": AuroraCalendarMonth;
  }
}
