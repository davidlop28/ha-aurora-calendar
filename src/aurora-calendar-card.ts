import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type {
  AuroraBackgroundMedia,
  AuroraCalendarConfig,
  CalendarEvent,
  CalendarInfo,
  HassConnection,
  HassStateChangedEvent,
  HassUnsubscribe,
  HeightMode,
  HomeAssistant,
  PersonInfo,
  TimeFormat,
  ViewMode,
  WeatherByDate,
  WeatherIconStyle,
  WeekStart,
} from "./types.js";
import { CONFIG_DEFAULTS } from "./types.js";
import {
  VIEW_MODES,
  getDateRange,
  getViewTitle,
  loadPersistedView,
  localToday,
  persistView,
} from "./utils.js";
import { fetchEventsForRange } from "./event-utils.js";
import { fetchDailyWeather } from "./weather-utils.js";
import { localeFromHass, t, viewModeLabel } from "./localize.js";
import "./calendar-month.js";
import "./calendar-week-box.js";
import "./calendar-time.js";

const VIEW_ICONS: Record<ViewMode, string> = {
  Month: "mdi:calendar-month",
  Week: "mdi:calendar-week",
  Biweek: "mdi:calendar-week-begin",
  Today: "mdi:white-balance-sunny",
  "Next 7 Days": "mdi:calendar-range",
};

const CALENDAR_FEATURE_CREATE_EVENT = 1;
const CALENDAR_FEATURE_DELETE_EVENT = 2;
const CALENDAR_FEATURE_UPDATE_EVENT = 4;

interface CreateEventDraft {
  calendarEntity: string;
  title: string;
  allDay: boolean;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
}

type DialogKind = "event" | "create" | "edit";

@customElement("aurora-calendar-card")
export class AuroraCalendarCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;

  @state() private _config!: AuroraCalendarConfig;
  @state() private _viewMode: ViewMode = "Month";
  @state() private _offset = 0;
  @state() private _events: CalendarEvent[] = [];
  @state() private _weatherByDate: WeatherByDate = {};
  @state() private _loading = false;
  @state() private _filterMenuOpen = false;
  @state() private _viewMenuOpen = false;
  @state() private _jumpMenuOpen = false;
  @state() private _selectedEvent: CalendarEvent | null = null;
  @state() private _createDialogOpen = false;
  @state() private _createDraft: CreateEventDraft | null = null;
  @state() private _createCalendarMenuOpen = false;
  @state() private _editDialogOpen = false;
  @state() private _editDraft: CreateEventDraft | null = null;
  @state() private _eventActionError = "";
  @state() private _savingEvent = false;
  @state() private _deletingEvent = false;
  @state() private _deleteConfirmOpen = false;
  @state() private _closingDialog: DialogKind | null = null;
  @state() private _resolvedBackgroundImage = "";

  private _defaultViewLoaded = false;
  private _storageKey = "";
  private _lastFetchKey = "";
  private _lastWeatherFetchKey = "";
  private _gridHeightRaf?: number;
  private _gridHeightRetry?: number;
  private _subscribedConnection?: HassConnection;
  private _unsubscribeStateChanged?: HassUnsubscribe;
  private _realtimeRefreshTimer?: number;
  private _pendingEventsRefresh = false;
  private _pendingWeatherRefresh = false;
  private _fetchRequestId = 0;
  private _backgroundMediaKey = "";
  private _backgroundMediaRequestId = 0;
  private _dialogCloseTimer?: number;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this._scheduleGridHeightSync);
    document.addEventListener("click", this._handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this._scheduleGridHeightSync);
    document.removeEventListener("click", this._handleDocumentClick);
    if (this._gridHeightRaf) {
      cancelAnimationFrame(this._gridHeightRaf);
    }
    if (this._gridHeightRetry) {
      window.clearTimeout(this._gridHeightRetry);
    }
    this._clearRealtimeRefreshTimer();
    this._clearDialogCloseTimer();
    this._teardownRealtimeSubscriptions();
  }

  firstUpdated() {
    this._scheduleGridHeightSync();
  }

  private _scheduleGridHeightSync = (): void => {
    if (this._gridHeightRaf) {
      cancelAnimationFrame(this._gridHeightRaf);
    }
    this._gridHeightRaf = requestAnimationFrame(() => {
      this._gridHeightRaf = requestAnimationFrame(() => {
        this._gridHeightRaf = undefined;
        this._syncGridHeightToViewport();
      });
    });
  };

  private _scheduleSettledGridHeightSync(): void {
    this._scheduleGridHeightSync();
    if (this._gridHeightRetry) {
      window.clearTimeout(this._gridHeightRetry);
    }
    this._gridHeightRetry = window.setTimeout(() => {
      this._gridHeightRetry = undefined;
      this._scheduleGridHeightSync();
    }, 120);
  }

  private _syncGridHeightToViewport(): void {
    const mode = this._config?.height_mode || "auto";
    if (mode === "ha") {
      this.style.removeProperty("--aurora-grid-height");
      return;
    }
    if (mode === "natural") {
      this.style.setProperty("--aurora-grid-height", "auto");
      return;
    }
    if (mode === "fixed") {
      this.style.setProperty("--aurora-grid-height", this._safeCssHeight(this._config.fixed_height));
      return;
    }

    const area = this.shadowRoot?.querySelector<HTMLElement>(".calendar-area");
    if (!area) return;
    const bottomGap = 16;
    const available = window.innerHeight - area.getBoundingClientRect().top - bottomGap;
    const gridH = Math.max(320, Math.floor(available));
    this.style.setProperty("--aurora-grid-height", `${gridH}px`);
  }

  private _handleDocumentClick = (event: MouseEvent): void => {
    if (event.composedPath().includes(this)) return;
    this._filterMenuOpen = false;
    this._viewMenuOpen = false;
    this._jumpMenuOpen = false;
  };

  // ------------------------------------------------------------------
  // HA card lifecycle
  // ------------------------------------------------------------------

  setConfig(config: AuroraCalendarConfig): void {
    const integration = config.integration || "aurora_calendar";
    this._config = { ...CONFIG_DEFAULTS, ...config, integration };
    this._storageKey = `aurora-calendar-${integration}`;
  }

  getCardSize(): number {
    return 6;
  }

  getGridOptions() {
    return {
      columns: "full",
      min_columns: 6,
      rows: 12,
      min_rows: 6,
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("aurora-calendar-card-editor");
  }

  static getStubConfig(): AuroraCalendarConfig {
    return { type: "custom:aurora-calendar-card", integration: "aurora_calendar", ...CONFIG_DEFAULTS };
  }

  // hass is set by HA on every state change — init view only once, then keep events fresh
  updated(changed: Map<string, unknown>): void {
    this._scheduleSettledGridHeightSync();
    if (changed.has("hass") && this.hass && !this._defaultViewLoaded) {
      this._initViewMode();
      this._defaultViewLoaded = true;
    }
    if (this.hass && this._config) {
      this._syncRealtimeSubscriptions();
      this._resolveBackgroundMediaIfNeeded();
      const key = this._fetchKey;
      if (key !== this._lastFetchKey) {
        this._lastFetchKey = key;
        void this._fetchEvents();
      }
      const weatherKey = this._weatherFetchKey;
      if (weatherKey !== this._lastWeatherFetchKey) {
        this._lastWeatherFetchKey = weatherKey;
        void this._fetchWeather();
      }
    }
  }

  // ------------------------------------------------------------------
  // View mode initialisation (localStorage → HA default → "Month")
  // ------------------------------------------------------------------

  private _initViewMode(): void {
    const persisted = loadPersistedView(this._storageKey);
    if (persisted) {
      this._viewMode = persisted;
      return;
    }
    const selectId = `select.${this._config.integration}_view_mode`;
    const haDefault = this.hass?.states[selectId]?.state as ViewMode | undefined;
    if (haDefault && VIEW_MODES.includes(haDefault)) {
      this._viewMode = haDefault;
    }
  }

  // ------------------------------------------------------------------
  // Derived data from HA entities
  // ------------------------------------------------------------------

  private get _calendars(): CalendarInfo[] {
    const persons = this._persons;
    return ((this._configAttrs.calendars as CalendarInfo[] | undefined) ?? []).map((cal) => {
      const fallbackPerson = cal.entity_id
        .replace(/^calendar\./, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      const person = cal.person || fallbackPerson;
      const personInfo = persons.find((p) => p.person === person);
      return {
        ...cal,
        person,
        color: personInfo?.color || cal.color || "#3B82F6",
        avatar: personInfo?.avatar || cal.avatar || "",
      };
    });
  }

  private get _writableCalendars(): CalendarInfo[] {
    return this._calendars.filter((calendar) =>
      this._supportsCalendarFeature(calendar.entity_id, CALENDAR_FEATURE_CREATE_EVENT)
    );
  }

  private _calendarByEntity(entityId: string): CalendarInfo | undefined {
    return this._calendars.find((calendar) => calendar.entity_id === entityId);
  }

  private _draftColor(draft: CreateEventDraft | null): string {
    if (!draft) return "var(--primary-color)";
    return this._calendarByEntity(draft.calendarEntity)?.color || "var(--primary-color)";
  }

  private _personAvatarMarkup(person: string, color: string, avatarUrl?: string): unknown {
    const initial = (person || "?").charAt(0).toUpperCase();
    return html`
      <span class="event-dialog-avatar" style="--person-color: ${color}">
        ${avatarUrl
          ? html`<img src="${avatarUrl}" alt="${person}" />`
          : html`${initial}`}
      </span>
    `;
  }

  private _eventAvatarMarkup(event: CalendarEvent): unknown {
    const calendar = this._calendarByEntity(event.calendarEntity);
    return this._personAvatarMarkup(event.person, calendar?.color || event.color, calendar?.avatar);
  }

  private get _fetchKey(): string {
    const [start, end] = getDateRange(this._viewMode, this._offset, this._config.week_start);
    const cals = this._calendars.map((c) => c.entity_id).sort().join(",");
    return `${start.toISOString()}|${end.toISOString()}|${cals}`;
  }

  private get _filteredEvents(): CalendarEvent[] {
    return this._events.filter((e) => this._filters[e.person] !== false);
  }

  private get _weatherEntity(): string {
    return String(this._configAttrs.weather_entity ?? "");
  }

  private get _weatherFetchKey(): string {
    const [start, end] = getDateRange(this._viewMode, this._offset, this._config.week_start);
    return [
      this._config.show_weather ? "show" : "hide",
      this._weatherEntity,
      start.toISOString(),
      end.toISOString(),
    ].join("|");
  }

  private async _fetchEvents(): Promise<void> {
    const [start, end] = getDateRange(this._viewMode, this._offset, this._config.week_start);
    const calendars = this._calendars;
    const requestId = ++this._fetchRequestId;
    if (calendars.length === 0) {
      this._events = [];
      this._loading = false;
      return;
    }
    this._loading = true;
    try {
      const events = await fetchEventsForRange(this.hass, calendars, start, end);
      if (requestId === this._fetchRequestId) {
        this._events = events;
      }
    } finally {
      if (requestId === this._fetchRequestId) {
        this._loading = false;
      }
    }
  }

  private _syncRealtimeSubscriptions(): void {
    const connection = this.hass?.connection;
    if (!connection || connection === this._subscribedConnection) return;

    this._teardownRealtimeSubscriptions();
    this._subscribedConnection = connection;

    void connection
      .subscribeEvents<HassStateChangedEvent>(this._handleStateChanged, "state_changed")
      .then((unsubscribe) => {
        if (this._subscribedConnection === connection) {
          this._unsubscribeStateChanged = unsubscribe;
        } else {
          unsubscribe();
        }
      });
  }

  private _teardownRealtimeSubscriptions(): void {
    this._unsubscribeStateChanged?.();
    this._unsubscribeStateChanged = undefined;
    this._subscribedConnection = undefined;
  }

  private _handleStateChanged = (event: HassStateChangedEvent): void => {
    const entityId = event.data?.entity_id;
    if (!entityId || !this._config) return;

    if (entityId === this._configSensorEntityId) {
      this._queueRealtimeRefresh(true, true);
      return;
    }

    if (this._calendarEntityIds.has(entityId) || this._isAuroraFilterEntity(entityId)) {
      this._queueRealtimeRefresh(true, false);
      return;
    }

    if (this._config.show_weather && entityId === this._weatherEntity) {
      this._queueRealtimeRefresh(false, true);
    }
  };

  private _queueRealtimeRefresh(
    events: boolean,
    weather: boolean,
    delay = 350
  ): void {
    this._pendingEventsRefresh ||= events;
    this._pendingWeatherRefresh ||= weather;
    this._clearRealtimeRefreshTimer();
    this._realtimeRefreshTimer = window.setTimeout(() => {
      this._realtimeRefreshTimer = undefined;
      const refreshEvents = this._pendingEventsRefresh;
      const refreshWeather = this._pendingWeatherRefresh;
      this._pendingEventsRefresh = false;
      this._pendingWeatherRefresh = false;

      if (refreshEvents) {
        this._lastFetchKey = "";
        void this._fetchEvents();
      }
      if (refreshWeather) {
        this._lastWeatherFetchKey = "";
        void this._fetchWeather();
      }
    }, delay);
  }

  private _clearRealtimeRefreshTimer(): void {
    if (!this._realtimeRefreshTimer) return;
    window.clearTimeout(this._realtimeRefreshTimer);
    this._realtimeRefreshTimer = undefined;
  }

  private _clearDialogCloseTimer(): void {
    if (!this._dialogCloseTimer) return;
    window.clearTimeout(this._dialogCloseTimer);
    this._dialogCloseTimer = undefined;
  }

  private _closeDialogWithTransition(kind: DialogKind, afterClose: () => void): void {
    if (this._closingDialog) return;
    this._clearDialogCloseTimer();
    this._closingDialog = kind;
    this._dialogCloseTimer = window.setTimeout(() => {
      this._dialogCloseTimer = undefined;
      afterClose();
      this._closingDialog = null;
    }, 170);
  }

  private get _configSensorEntityId(): string {
    return `sensor.${this._config.integration}_events`;
  }

  private get _calendarEntityIds(): Set<string> {
    return new Set(this._calendars.map((calendar) => calendar.entity_id));
  }

  private _isAuroraFilterEntity(entityId: string): boolean {
    return entityId.startsWith(`switch.${this._config.integration}_filter_`);
  }

  private async _fetchWeather(): Promise<void> {
    if (!this._config.show_weather || !this._weatherEntity) {
      this._weatherByDate = {};
      return;
    }
    this._weatherByDate = await fetchDailyWeather(this.hass, this._weatherEntity);
  }

  private _daysInRange(start: Date, end: Date): Date[] {
    const days: Date[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }

  private get _configAttrs(): Record<string, unknown> {
    const id = `sensor.${this._config.integration}_events`;
    return (this.hass?.states[id]?.attributes ?? {}) as Record<string, unknown>;
  }

  private get _persons(): PersonInfo[] {
    return (this._configAttrs.persons as PersonInfo[] | undefined) ?? [];
  }

  private get _filters(): Record<string, boolean> {
    return (
      (this._configAttrs.filters as Record<string, boolean> | undefined) ?? {}
    );
  }

  private get _timeGridEvents(): CalendarEvent[] {
    return this._filteredEvents.map((event) => ({
      ...event,
      canDragEdit: !event.all_day && !event.recurrenceId && this._canUpdateEvent(event),
    }));
  }

  // ------------------------------------------------------------------
  // User actions (all local — no HA service calls for navigation)
  // ------------------------------------------------------------------

  private _navigate(dir: number): void {
    this._offset += dir;
  }

  private _resetToToday(): void {
    this._offset = 0;
  }

  private _selectView(mode: ViewMode): void {
    this._viewMode = mode;
    this._offset = 0;
    this._viewMenuOpen = false;
    persistView(this._storageKey, mode);
  }

  private _toggleFilter(person: string): void {
    this.hass.callService("aurora_calendar", "toggle_filter", { person });
  }

  private _handleWeekEmptyClick(): void {
    this._navigate(1);
  }

  private _toggleFilterMenu(): void {
    this._filterMenuOpen = !this._filterMenuOpen;
    this._viewMenuOpen = false;
    this._jumpMenuOpen = false;
  }

  private _toggleViewMenu(): void {
    this._viewMenuOpen = !this._viewMenuOpen;
    this._filterMenuOpen = false;
    this._jumpMenuOpen = false;
  }

  private _toggleJumpMenu(): void {
    this._jumpMenuOpen = !this._jumpMenuOpen;
    this._filterMenuOpen = false;
    this._viewMenuOpen = false;
  }

  private _jumpMonthValue(): string {
    const today = localToday();
    const ref = new Date(today.getFullYear(), today.getMonth() + this._offset, 1);
    return `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, "0")}`;
  }

  private _jumpDateValue(start: Date): string {
    const active = this._viewMode === "Today" || this._viewMode === "Next 7 Days"
      ? start
      : localToday();
    return this._dateInputValue(active);
  }

  private _handleJumpMonth(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;
    const [year, month] = value.split("-").map(Number);
    if (!year || !month) return;

    const today = localToday();
    this._offset = (year - today.getFullYear()) * 12 + (month - 1 - today.getMonth());
    this._jumpMenuOpen = false;
  }

  private _handleJumpDate(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;
    const selected = new Date(`${value}T00:00:00`);
    if (Number.isNaN(selected.getTime())) return;

    const today = localToday();
    if (this._viewMode === "Today") {
      this._offset = this._dayDiff(today, selected);
    } else if (this._viewMode === "Next 7 Days") {
      this._offset = Math.trunc(this._dayDiff(today, selected) / 7);
    } else if (this._viewMode === "Week") {
      const currentStart = getDateRange("Week", 0, this._config.week_start)[0];
      const selectedStart = this._startOfWeek(selected);
      this._offset = Math.trunc(this._dayDiff(currentStart, selectedStart) / 7);
    } else if (this._viewMode === "Biweek") {
      const currentStart = getDateRange("Biweek", 0, this._config.week_start)[0];
      const selectedStart = this._startOfWeek(selected);
      this._offset = Math.trunc(this._dayDiff(currentStart, selectedStart) / 14);
    }
    this._jumpMenuOpen = false;
  }

  private _handleJumpInputClick(event: Event): void {
    event.stopPropagation();
  }

  private _handleEventOpen(event: CustomEvent<{ event: CalendarEvent }>): void {
    this._clearDialogCloseTimer();
    this._closingDialog = null;
    this._eventActionError = "";
    this._deleteConfirmOpen = false;
    this._editDialogOpen = false;
    this._editDraft = null;
    this._selectedEvent = event.detail.event;
  }

  private _closeEventDialog(): void {
    if (this._deletingEvent) return;
    this._closeDialogWithTransition("event", () => {
      this._eventActionError = "";
      this._deleteConfirmOpen = false;
      this._editDialogOpen = false;
      this._editDraft = null;
      this._selectedEvent = null;
    });
  }

  private _supportsCalendarFeature(entityId: string, feature: number): boolean {
    const raw = this.hass?.states[entityId]?.attributes?.supported_features;
    const features = typeof raw === "number" ? raw : Number(raw);
    return Number.isFinite(features) && (features & feature) === feature;
  }

  private _defaultCreateDate(): Date {
    const [start, end] = getDateRange(this._viewMode, this._offset, this._config.week_start);
    const today = localToday();
    if (today >= start && today <= end) return today;
    if (this._viewMode === "Month") {
      return new Date(today.getFullYear(), today.getMonth() + this._offset, 1);
    }
    return start;
  }

  private _defaultCreateTimes(baseDate: Date): [string, string] {
    const today = localToday();
    if (this._sameLocalDay(baseDate, today)) {
      const now = new Date();
      const startHour = Math.min(22, Math.max(8, now.getHours() + 1));
      return [`${String(startHour).padStart(2, "0")}:00`, `${String(startHour + 1).padStart(2, "0")}:00`];
    }
    return ["09:00", "10:00"];
  }

  private _sameLocalDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  private _openCreateDialog(): void {
    this._clearDialogCloseTimer();
    this._closingDialog = null;
    const calendar = this._writableCalendars[0] || this._calendars[0];
    const baseDate = this._defaultCreateDate();
    const [startTime, endTime] = this._defaultCreateTimes(baseDate);
    const date = this._dateInputValue(baseDate);

    this._createDraft = {
      calendarEntity: calendar?.entity_id || "",
      title: "",
      allDay: false,
      startDate: date,
      endDate: date,
      startTime,
      endTime,
      location: "",
      description: "",
    };
    this._eventActionError = "";
    this._createDialogOpen = true;
    this._filterMenuOpen = false;
    this._viewMenuOpen = false;
    this._jumpMenuOpen = false;
  }

  private _closeCreateDialog(): void {
    if (this._savingEvent) return;
    this._closeDialogWithTransition("create", () => {
      this._eventActionError = "";
      this._createCalendarMenuOpen = false;
      this._createDialogOpen = false;
      this._createDraft = null;
    });
  }

  private _addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  private _addDaysToDateInput(value: string, days: number): string {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return this._dateInputValue(this._addDays(date, days));
  }

  private _normalizeAllDayDraft(draft: CreateEventDraft): CreateEventDraft {
    if (!draft.allDay || !draft.startDate) return draft;
    if (!draft.endDate || draft.endDate < draft.startDate) {
      return { ...draft, endDate: draft.startDate };
    }
    return draft;
  }

  private _updateDraft(
    draft: CreateEventDraft,
    field: keyof CreateEventDraft,
    value: string | boolean
  ): CreateEventDraft {
    const next = { ...draft, [field]: value };
    return this._normalizeAllDayDraft(next);
  }

  private _updateCreateDraft(field: keyof CreateEventDraft, value: string | boolean): void {
    if (!this._createDraft) return;
    this._eventActionError = "";
    this._createDraft = this._updateDraft(this._createDraft, field, value);
  }

  private _updateEditDraft(field: keyof CreateEventDraft, value: string | boolean): void {
    if (!this._editDraft) return;
    this._eventActionError = "";
    this._editDraft = this._updateDraft(this._editDraft, field, value);
  }

  private _eventActionErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === "object" && error && "message" in error) {
      return String((error as { message?: unknown }).message || "Calendar action failed");
    }
    return "Calendar action failed";
  }

  private _toggleCreateCalendarMenu(): void {
    this._createCalendarMenuOpen = !this._createCalendarMenuOpen;
  }

  private _selectCreateCalendar(entityId: string): void {
    this._updateCreateDraft("calendarEntity", entityId);
    this._createCalendarMenuOpen = false;
  }

  private async _handleCreateSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const draft = this._createDraft;
    if (!draft || this._savingEvent) return;

    const summary = draft.title.trim();
    if (!summary || !draft.calendarEntity) return;

    const data: Record<string, unknown> = { summary };
    const description = draft.description.trim();
    const location = draft.location.trim();
    if (description) data.description = description;
    if (location) data.location = location;

    if (draft.allDay) {
      if (!draft.startDate || !draft.endDate || draft.endDate < draft.startDate) {
        this._eventActionError = "End date must be on or after start date.";
        return;
      }
      data.start_date = draft.startDate;
      data.end_date = this._addDaysToDateInput(draft.endDate, 1);
    } else {
      const startDateTime = `${draft.startDate} ${draft.startTime}:00`;
      const endDateTime = `${draft.endDate} ${draft.endTime}:00`;
      if (!draft.startDate || !draft.endDate || !draft.startTime || !draft.endTime || endDateTime <= startDateTime) {
        this._eventActionError = "End time must be after start time.";
        return;
      }
      data.start_date_time = startDateTime;
      data.end_date_time = endDateTime;
    }

    this._savingEvent = true;
    this._eventActionError = "";
    try {
      await this.hass.callService("calendar", "create_event", data, {
        entity_id: draft.calendarEntity,
      });
      this._createDialogOpen = false;
      this._createDraft = null;
      this._lastFetchKey = "";
      await this._fetchEvents();
    } catch (error) {
      this._eventActionError = this._eventActionErrorMessage(error);
    } finally {
      this._savingEvent = false;
    }
  }

  private _canDeleteEvent(event: CalendarEvent): boolean {
    return Boolean(event.uid) &&
      this._supportsCalendarFeature(event.calendarEntity, CALENDAR_FEATURE_DELETE_EVENT);
  }

  private _canUpdateEvent(event: CalendarEvent): boolean {
    return Boolean(event.uid) &&
      this._supportsCalendarFeature(event.calendarEntity, CALENDAR_FEATURE_UPDATE_EVENT);
  }

  private _openEditDialog(): void {
    const event = this._selectedEvent;
    if (!event) return;
    if (!this._canUpdateEvent(event)) {
      this._eventActionError = "This calendar event cannot be edited from Aurora.";
      return;
    }

    const start = this._eventDate(event.start, event.all_day);
    const end = this._eventDate(event.end, event.all_day);
    const endDateInput = event.all_day
      ? this._addDaysToDateInput(this._dateInputValue(end), -1)
      : this._dateInputValue(end);
    this._editDraft = this._normalizeAllDayDraft({
      calendarEntity: event.calendarEntity,
      title: event.title,
      allDay: event.all_day,
      startDate: this._dateInputValue(start),
      endDate: endDateInput,
      startTime: this._timeInputValue(start),
      endTime: this._timeInputValue(end),
      location: event.location || "",
      description: event.description || "",
    });
    this._eventActionError = "";
    this._deleteConfirmOpen = false;
    this._clearDialogCloseTimer();
    this._closingDialog = null;
    this._editDialogOpen = true;
  }

  private _closeEditDialog(): void {
    if (this._savingEvent) return;
    this._closeDialogWithTransition("edit", () => {
      this._eventActionError = "";
      this._editDialogOpen = false;
      this._editDraft = null;
    });
  }

  private _openDeleteConfirm(locale: string): void {
    const event = this._selectedEvent;
    if (!event) return;
    if (!this._canDeleteEvent(event)) {
      this._eventActionError = t(locale, "deleteEventUnavailable");
      return;
    }
    this._eventActionError = "";
    this._deleteConfirmOpen = true;
  }

  private _cancelDeleteConfirm(): void {
    if (this._deletingEvent) return;
    this._deleteConfirmOpen = false;
  }

  private async _deleteSelectedEvent(locale: string): Promise<void> {
    const event = this._selectedEvent;
    if (!event || this._deletingEvent) return;
    if (!this._canDeleteEvent(event) || !event.uid) {
      this._eventActionError = t(locale, "deleteEventUnavailable");
      return;
    }

    const data: Record<string, unknown> = { uid: event.uid };
    if (event.recurrenceId) {
      data.recurrence_id = event.recurrenceId;
    }

    this._deletingEvent = true;
    this._eventActionError = "";
    try {
      await this.hass.callWS({
        type: "calendar/event/delete",
        entity_id: event.calendarEntity,
        ...data,
      });
      this._deleteConfirmOpen = false;
      this._selectedEvent = null;
      this._lastFetchKey = "";
      await this._fetchEvents();
    } catch (error) {
      this._eventActionError = this._eventActionErrorMessage(error);
    } finally {
      this._deletingEvent = false;
    }
  }

  private async _handleEditSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const selected = this._selectedEvent;
    const draft = this._editDraft;
    if (!selected || !draft || !selected.uid || this._savingEvent) return;

    const eventPayload = this._eventPayloadFromDraft(draft, true);
    if (!eventPayload) return;
    eventPayload.description = draft.description.trim();
    eventPayload.location = draft.location.trim();

    const data: Record<string, unknown> = {
      type: "calendar/event/update",
      entity_id: selected.calendarEntity,
      uid: selected.uid,
      event: eventPayload,
    };
    if (selected.recurrenceId) {
      data.recurrence_id = selected.recurrenceId;
    }

    this._savingEvent = true;
    this._eventActionError = "";
    try {
      await this.hass.callWS(data);
      this._editDialogOpen = false;
      this._editDraft = null;
      this._selectedEvent = null;
      this._lastFetchKey = "";
      await this._fetchEvents();
    } catch (error) {
      this._eventActionError = this._eventActionErrorMessage(error);
    } finally {
      this._savingEvent = false;
    }
  }

  private async _handleEventMove(event: CustomEvent<{
    event: CalendarEvent;
    start: string;
    end: string;
  }>): Promise<void> {
    const calendarEvent = event.detail.event;
    if (!calendarEvent.uid || !this._canUpdateEvent(calendarEvent)) return;

    const payload: Record<string, unknown> = {
      summary: calendarEvent.title,
      dtstart: event.detail.start,
      dtend: event.detail.end,
      description: calendarEvent.description || "",
      location: calendarEvent.location || "",
    };

    const data: Record<string, unknown> = {
      type: "calendar/event/update",
      entity_id: calendarEvent.calendarEntity,
      uid: calendarEvent.uid,
      event: payload,
    };

    this._loading = true;
    try {
      await this.hass.callWS(data);
      this._lastFetchKey = "";
      await this._fetchEvents();
    } catch (error) {
      console.error("Aurora Calendar: failed to move event", error);
    } finally {
      this._loading = false;
    }
  }

  private _startOfWeek(date: Date): Date {
    const startDay = this._config.week_start === "monday" ? 1 : 0;
    const d = new Date(date);
    const diff = (d.getDay() - startDay + 7) % 7;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private _dayDiff(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / 86_400_000);
  }

  private _dateInputValue(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  private _timeInputValue(date: Date): string {
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  private _eventPayloadFromDraft(
    draft: CreateEventDraft,
    useIsoSeparator = false
  ): Record<string, unknown> | null {
    const summary = draft.title.trim();
    if (!summary || !draft.calendarEntity) return null;

    const payload: Record<string, unknown> = { summary };
    const description = draft.description.trim();
    const location = draft.location.trim();
    if (description) payload.description = description;
    if (location) payload.location = location;

    if (draft.allDay) {
      if (!draft.startDate || !draft.endDate || draft.endDate < draft.startDate) {
        this._eventActionError = "End date must be on or after start date.";
        return null;
      }
      payload.dtstart = draft.startDate;
      payload.dtend = this._addDaysToDateInput(draft.endDate, 1);
      return payload;
    }

    const separator = useIsoSeparator ? "T" : " ";
    const startDateTime = `${draft.startDate}${separator}${draft.startTime}:00`;
    const endDateTime = `${draft.endDate}${separator}${draft.endTime}:00`;
    if (!draft.startDate || !draft.endDate || !draft.startTime || !draft.endTime || endDateTime <= startDateTime) {
      this._eventActionError = "End time must be after start time.";
      return null;
    }
    payload.dtstart = startDateTime;
    payload.dtend = endDateTime;
    return payload;
  }

  private _eventDateLabel(event: CalendarEvent, locale: string): string {
    const start = this._eventDate(event.start, event.all_day);
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(start);
  }

  private _eventTimeLabel(event: CalendarEvent, locale: string): string {
    if (event.all_day) return t(locale, "allDayLabel");
    const start = this._eventDate(event.start, false);
    const end = this._eventDate(event.end, false);
    const formatter = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${formatter.format(start)} - ${formatter.format(end)}`;
  }

  private _eventDate(value: string, allDay: boolean): Date {
    return new Date(allDay && !value.includes("T") ? `${value}T00:00:00` : value);
  }

  private _renderEventDialog(locale: string) {
    const event = this._selectedEvent;
    if (!event) return nothing;
    const textColor = this._contrastText(event.color);
    const canDelete = this._canDeleteEvent(event);
    const canUpdate = this._canUpdateEvent(event);

    return html`
      <div class="event-dialog-backdrop ${this._closingDialog === "event" ? "closing" : ""}" @click=${this._closeEventDialog}>
        <section
          class="event-dialog create-dialog themed-dialog"
          style="--event-color: ${event.color}; --event-text-color: ${textColor};"
          role="dialog"
          aria-modal="true"
          aria-label=${event.title}
          @click=${(e: Event) => e.stopPropagation()}
        >
          <header class="create-dialog-header">
            <ha-icon icon="mdi:calendar-text"></ha-icon>
            <h2>${event.title}</h2>
            <button class="create-dialog-close" @click=${this._closeEventDialog} aria-label=${t(locale, "close")}>x</button>
          </header>

          <div class="create-form event-view-form">
            <div class="form-notice event-owner-strip">
              ${this._eventAvatarMarkup(event)}
              <span>${event.calendarName || event.person}</span>
            </div>
            <div class="detail-row">
              <ha-icon icon="mdi:calendar"></ha-icon>
              <div>
                <span class="detail-label">${t(locale, "date")}</span>
                <span class="detail-value">${this._eventDateLabel(event, locale)}</span>
              </div>
            </div>
            <div class="detail-row">
              <ha-icon icon="mdi:clock-outline"></ha-icon>
              <div>
                <span class="detail-label">${t(locale, "time")}</span>
                <span class="detail-value">${this._eventTimeLabel(event, locale)}</span>
              </div>
            </div>
            <div class="detail-row">
              <ha-icon icon="mdi:calendar-account"></ha-icon>
              <div>
                <span class="detail-label">${t(locale, "calendar")}</span>
                <span class="detail-value">${event.calendarName || event.calendarEntity}</span>
              </div>
            </div>
            ${event.location ? html`
              <div class="detail-row">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <div>
                  <span class="detail-label">${t(locale, "location")}</span>
                  <span class="detail-value">${event.location}</span>
                </div>
              </div>
            ` : nothing}
            ${event.description ? html`
              <div class="detail-section">
                <span class="detail-label">${t(locale, "description")}</span>
                <p>${event.description}</p>
              </div>
            ` : nothing}
            ${this._eventActionError ? html`
              <div class="event-action-error">${this._eventActionError}</div>
            ` : nothing}
            ${this._deleteConfirmOpen ? html`
              <div class="delete-confirm-panel">
                <div>
                  <strong>${t(locale, "deleteEventConfirm")}</strong>
                  <span>${event.title}</span>
                </div>
                <div class="event-dialog-actions">
                  <button
                    class="secondary-action"
                    @click=${this._cancelDeleteConfirm}
                    ?disabled=${this._deletingEvent}
                  >
                    ${t(locale, "cancel")}
                  </button>
                  <button
                    class="danger-action"
                    @click=${() => this._deleteSelectedEvent(locale)}
                    ?disabled=${this._deletingEvent}
                  >
                    <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                    <span>${this._deletingEvent ? t(locale, "loading") : t(locale, "deleteEvent")}</span>
                  </button>
                </div>
              </div>
            ` : html`
              <div class="event-dialog-actions">
                <button
                  class="secondary-action"
                  @click=${this._openEditDialog}
                  ?disabled=${this._deletingEvent || !canUpdate}
                  title=${t(locale, "editEvent")}
                >
                  <ha-icon icon="mdi:calendar-edit"></ha-icon>
                  <span>${t(locale, "editEvent")}</span>
                </button>
                <button
                  class="danger-action"
                  @click=${() => this._openDeleteConfirm(locale)}
                  ?disabled=${this._deletingEvent || !canDelete}
                  title=${canDelete ? t(locale, "deleteEvent") : t(locale, "deleteEventUnavailable")}
                >
                  <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                  <span>${t(locale, "deleteEvent")}</span>
                </button>
              </div>
            `}
          </div>
        </section>
      </div>
    `;
  }

  private _renderEditDialog(locale: string) {
    const selected = this._selectedEvent;
    if (!this._editDialogOpen || !this._editDraft || !selected) return nothing;
    const draft = this._editDraft;

    return html`
      <div class="event-dialog-backdrop ${this._closingDialog === "edit" ? "closing" : ""}" @click=${this._closeEditDialog}>
        <section
          class="event-dialog create-dialog themed-dialog"
          style="--event-color: ${selected.color}; --event-text-color: ${this._contrastText(selected.color)};"
          role="dialog"
          aria-modal="true"
          aria-label=${t(locale, "editEvent")}
          @click=${(e: Event) => e.stopPropagation()}
        >
          <header class="create-dialog-header">
            <ha-icon icon="mdi:calendar-edit"></ha-icon>
            <h2>${t(locale, "editEvent")}</h2>
            <button class="create-dialog-close" @click=${this._closeEditDialog} aria-label=${t(locale, "close")}>x</button>
          </header>

          <form class="create-form" @submit=${this._handleEditSubmit}>
            <div class="form-notice event-owner-strip">
              ${this._eventAvatarMarkup(selected)}
              <span>${selected.calendarName || selected.calendarEntity}</span>
            </div>

            <label>
              <span>${t(locale, "title")}</span>
              <input
                type="text"
                .value=${draft.title}
                required
                @input=${(event: Event) => this._updateEditDraft("title", (event.target as HTMLInputElement).value)}
              />
            </label>

            <label class="check-row">
              <input
                type="checkbox"
                .checked=${draft.allDay}
                @change=${(event: Event) => this._updateEditDraft("allDay", (event.target as HTMLInputElement).checked)}
              />
              <span>${t(locale, "allDayLabel")}</span>
            </label>

            ${draft.allDay ? html`
              <div class="form-grid">
                <label>
                  <span>${t(locale, "start")}</span>
                  <input
                    type="date"
                    .value=${draft.startDate}
                    required
                    @input=${(event: Event) => this._updateEditDraft("startDate", (event.target as HTMLInputElement).value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "end")}</span>
                  <input
                    type="date"
                    .value=${draft.endDate}
                    required
                    @input=${(event: Event) => this._updateEditDraft("endDate", (event.target as HTMLInputElement).value)}
                  />
                </label>
              </div>
            ` : html`
              <div class="form-grid date-time-grid">
                <label>
                  <span>${t(locale, "start")}</span>
                  <input
                    type="date"
                    .value=${draft.startDate}
                    required
                    @input=${(event: Event) => this._updateEditDraft("startDate", (event.target as HTMLInputElement).value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "end")}</span>
                  <input
                    type="date"
                    .value=${draft.endDate}
                    required
                    @input=${(event: Event) => this._updateEditDraft("endDate", (event.target as HTMLInputElement).value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "start")}</span>
                  <input
                    type="time"
                    .value=${draft.startTime}
                    required
                    @input=${(event: Event) => this._updateEditDraft("startTime", (event.target as HTMLInputElement).value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "end")}</span>
                  <input
                    type="time"
                    .value=${draft.endTime}
                    required
                    @input=${(event: Event) => this._updateEditDraft("endTime", (event.target as HTMLInputElement).value)}
                  />
                </label>
              </div>
            `}

            <label>
              <span>${t(locale, "location")}</span>
              <input
                type="text"
                .value=${draft.location}
                @input=${(event: Event) => this._updateEditDraft("location", (event.target as HTMLInputElement).value)}
              />
            </label>

            <label>
              <span>${t(locale, "description")}</span>
              <textarea
                .value=${draft.description}
                @input=${(event: Event) => this._updateEditDraft("description", (event.target as HTMLTextAreaElement).value)}
              ></textarea>
            </label>

            ${this._eventActionError ? html`
              <div class="event-action-error">${this._eventActionError}</div>
            ` : nothing}

            <div class="create-form-actions">
              <button type="button" class="secondary-action" @click=${this._closeEditDialog}>
                ${t(locale, "cancel")}
              </button>
              <button type="submit" class="primary-action" ?disabled=${this._savingEvent}>
                <ha-icon icon="mdi:content-save-outline"></ha-icon>
                <span>${this._savingEvent ? t(locale, "loading") : t(locale, "updateEvent")}</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    `;
  }

  private _renderCreateDialog(locale: string) {
    if (!this._createDialogOpen || !this._createDraft) return nothing;
    const draft = this._createDraft;
    const writableCalendars = this._writableCalendars;
    const canCreate = writableCalendars.length > 0;

    return html`
      <div class="event-dialog-backdrop ${this._closingDialog === "create" ? "closing" : ""}" @click=${this._closeCreateDialog}>
        <section
          class="event-dialog create-dialog themed-dialog"
          style="--event-color: ${this._draftColor(draft)}; --event-text-color: ${this._contrastText(this._draftColor(draft))};"
          role="dialog"
          aria-modal="true"
          aria-label=${t(locale, "createEvent")}
          @click=${(e: Event) => e.stopPropagation()}
        >
          <header class="create-dialog-header">
            <ha-icon icon="mdi:calendar-plus"></ha-icon>
            <h2>${t(locale, "createEvent")}</h2>
            <button class="create-dialog-close" @click=${this._closeCreateDialog} aria-label=${t(locale, "close")}>x</button>
          </header>

          <form class="create-form" @submit=${this._handleCreateSubmit}>
            ${canCreate ? html`
              <div class="create-calendar-picker">
                <span class="form-field-label">${t(locale, "calendar")}</span>
                <button
                  type="button"
                  class="create-calendar-trigger ${this._createCalendarMenuOpen ? "open" : ""}"
                  @click=${this._toggleCreateCalendarMenu}
                  aria-label=${t(locale, "calendar")}
                  aria-expanded=${this._createCalendarMenuOpen}
                >
                  ${(() => {
                    const selected = this._calendarByEntity(draft.calendarEntity) || writableCalendars[0];
                    return html`
                      <span class="option-avatar" style="--person-color: ${selected?.color || "var(--primary-color)"}">
                        ${selected?.avatar
                          ? html`<img src="${selected.avatar}" alt="${selected.person}" />`
                          : html`${(selected?.person || "?").charAt(0).toUpperCase()}`}
                      </span>
                      <span class="option-name">${selected?.person || selected?.entity_id || t(locale, "calendar")}</span>
                      <span class="chevron">⌄</span>
                    `;
                  })()}
                </button>
                ${this._createCalendarMenuOpen ? html`
                  <div class="create-calendar-menu" role="menu">
                    ${writableCalendars.map((calendar) => html`
                      <button
                        type="button"
                        class="filter-option ${calendar.entity_id === draft.calendarEntity ? "active" : ""}"
                        style="--person-color: ${calendar.color}"
                        @click=${() => this._selectCreateCalendar(calendar.entity_id)}
                        role="menuitemradio"
                        aria-checked=${calendar.entity_id === draft.calendarEntity}
                      >
                        <span class="option-avatar">
                          ${calendar.avatar
                            ? html`<img src="${calendar.avatar}" alt="${calendar.person}" />`
                            : html`${(calendar.person || calendar.entity_id).charAt(0).toUpperCase()}`}
                        </span>
                        <span class="option-name">${calendar.person || calendar.entity_id}</span>
                        <span class="option-check">${calendar.entity_id === draft.calendarEntity ? "✓" : ""}</span>
                      </button>
                    `)}
                  </div>
                ` : nothing}
              </div>
            ` : html`
              <div class="form-notice">${t(locale, "noWritableCalendars")}</div>
            `}

            <label>
              <span>${t(locale, "title")}</span>
              <input
                type="text"
                .value=${draft.title}
                required
                ?disabled=${!canCreate}
                @input=${(event: Event) => this._updateCreateDraft("title", (event.target as HTMLInputElement).value)}
              />
            </label>

            <label class="check-row">
              <input
                type="checkbox"
                .checked=${draft.allDay}
                ?disabled=${!canCreate}
                @change=${(event: Event) => this._updateCreateDraft("allDay", (event.target as HTMLInputElement).checked)}
              />
              <span>${t(locale, "allDayLabel")}</span>
            </label>

            ${draft.allDay ? html`
              <div class="form-grid">
                <label>
                  <span>${t(locale, "start")}</span>
                  <input
                    type="date"
                    .value=${draft.startDate}
                    required
                    ?disabled=${!canCreate}
                    @input=${(event: Event) => this._updateCreateDraft("startDate", (event.target as HTMLInputElement).value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "end")}</span>
                  <input
                    type="date"
                    .value=${draft.endDate}
                    required
                    ?disabled=${!canCreate}
                    @input=${(event: Event) => this._updateCreateDraft("endDate", (event.target as HTMLInputElement).value)}
                  />
                </label>
              </div>
            ` : html`
              <div class="form-grid date-time-grid">
                <label>
                  <span>${t(locale, "start")}</span>
                  <input
                    type="date"
                    .value=${draft.startDate}
                    required
                    ?disabled=${!canCreate}
                    @input=${(event: Event) => this._updateCreateDraft("startDate", (event.target as HTMLInputElement).value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "end")}</span>
                  <input
                    type="date"
                    .value=${draft.endDate}
                    required
                    ?disabled=${!canCreate}
                    @input=${(event: Event) => this._updateCreateDraft("endDate", (event.target as HTMLInputElement).value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "start")}</span>
                  <input
                    type="time"
                    .value=${draft.startTime}
                    required
                    ?disabled=${!canCreate}
                    @input=${(event: Event) => this._updateCreateDraft("startTime", (event.target as HTMLInputElement).value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "end")}</span>
                  <input
                    type="time"
                    .value=${draft.endTime}
                    required
                    ?disabled=${!canCreate}
                    @input=${(event: Event) => this._updateCreateDraft("endTime", (event.target as HTMLInputElement).value)}
                  />
                </label>
              </div>
            `}

            <label>
              <span>${t(locale, "location")}</span>
              <input
                type="text"
                .value=${draft.location}
                ?disabled=${!canCreate}
                @input=${(event: Event) => this._updateCreateDraft("location", (event.target as HTMLInputElement).value)}
              />
            </label>

            <label>
              <span>${t(locale, "description")}</span>
              <textarea
                .value=${draft.description}
                ?disabled=${!canCreate}
                @input=${(event: Event) => this._updateCreateDraft("description", (event.target as HTMLTextAreaElement).value)}
              ></textarea>
            </label>

            ${this._eventActionError ? html`
              <div class="event-action-error">${this._eventActionError}</div>
            ` : nothing}

            <div class="create-form-actions">
              <button type="button" class="secondary-action" @click=${this._closeCreateDialog}>
                ${t(locale, "cancel")}
              </button>
              <button type="submit" class="primary-action" ?disabled=${!canCreate || this._savingEvent}>
                <ha-icon icon="mdi:content-save-outline"></ha-icon>
                <span>${this._savingEvent ? t(locale, "loading") : t(locale, "save")}</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    `;
  }

  private _contrastText(hex: string): string {
    const c = hex.replace("#", "");
    if (c.length !== 6) return "#fff";
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#111827" : "#fff";
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  render() {
    if (!this._config || !this.hass) return html``;

    const locale = localeFromHass(this.hass);
    const [start, end] = getDateRange(this._viewMode, this._offset, this._config.week_start);
    const title = getViewTitle(this._viewMode, this._offset, start, end, locale);
    const persons = this._persons;
    const filters = this._filters;
    const activePersons = persons.filter((p) => filters[p.person] !== false);
    const filterStack = activePersons.length ? activePersons.slice(0, 2) : [];
    const hiddenFilterCount = Math.max(0, activePersons.length - filterStack.length);
    const configured = persons.length > 0;
    const days = this._daysInRange(start, end);
    const weatherByDate = this._config.show_weather ? this._weatherByDate : {};
    const eventCountsByPerson: Record<string, number> = {};
    for (const e of this._events) {
      eventCountsByPerson[e.person] = (eventCountsByPerson[e.person] || 0) + 1;
    }

    // Reference month for the month grid (start may be prior-month padding)
    const today = localToday();
    const refDate = new Date(today.getFullYear(), today.getMonth() + this._offset, 1);
    const surfaceClasses = [
      "aurora-card",
      `height-${this._config.height_mode || "auto"}`,
      this._config.glass_background ? "glass" : "",
      this._backgroundImageSource ? "has-background-image" : "",
    ].filter(Boolean).join(" ");
    const shellClasses = `height-${this._config.height_mode || "auto"}`;

    return html`
      <ha-card class=${shellClasses}>
        <div class=${surfaceClasses} style=${this._appearanceStyle()}>

          <div class="top-toolbar">
            <div class="filter-control-wrap">
              <button
                class="filter-trigger ${this._filterMenuOpen ? "open" : ""}"
                @click=${this._toggleFilterMenu}
                aria-label=${t(locale, "calendarFilters")}
                aria-expanded=${this._filterMenuOpen}
              >
                <span class="avatar-stack">
                  ${filterStack.map((p) => html`
                    <span class="stack-avatar" style="--person-color: ${p.color}">
                      ${p.avatar
                        ? html`<img src="${p.avatar}" alt="${p.person}" />`
                        : html`${p.person[0].toUpperCase()}`}
                    </span>
                  `)}
                  ${hiddenFilterCount > 0 || activePersons.length === 0 ? html`
                    <span class="stack-avatar stack-more">${activePersons.length === 0 ? "0" : `+${hiddenFilterCount}`}</span>
                  ` : nothing}
                </span>
                <span class="filter-label">${t(locale, "filters")}</span>
                <span class="chevron">⌄</span>
              </button>

              ${this._filterMenuOpen ? html`
                <div class="filter-menu" role="menu">
                  <div class="menu-heading">${t(locale, "showCalendars")}</div>
                  ${persons.map((p) => {
                    const active = filters[p.person] !== false;
                    return html`
                      <button
                        class="filter-option ${active ? "active" : "inactive"}"
                        style="--person-color: ${p.color}"
                        @click=${() => this._toggleFilter(p.person)}
                        role="menuitemcheckbox"
                        aria-checked=${active}
                      >
                        <span class="option-avatar">
                          ${p.avatar
                            ? html`<img src="${p.avatar}" alt="${p.person}" />`
                            : html`${p.person[0].toUpperCase()}`}
                        </span>
                        <span class="option-name">${p.person}</span>
                        <span class="option-count">${eventCountsByPerson[p.person] || 0}</span>
                        <span class="option-check">${active ? "✓" : ""}</span>
                      </button>
                    `;
                  })}
                </div>
              ` : nothing}
            </div>

            <span class="view-title">${title}</span>

            <div class="toolbar-actions">
              <div class="view-control-wrap">
                <button
                  class="view-trigger ${this._viewMenuOpen ? "open" : ""}"
                  @click=${this._toggleViewMenu}
                  aria-label=${t(locale, "calendarView")}
                  aria-expanded=${this._viewMenuOpen}
                >
                  <span>${viewModeLabel(locale, this._viewMode)}</span>
                  <span class="chevron">⌄</span>
                </button>
                ${this._viewMenuOpen ? html`
                  <div class="view-menu" role="menu">
                    ${VIEW_MODES.map((mode) => html`
                      <button
                        class="view-option ${this._viewMode === mode ? "active" : ""}"
                        @click=${() => this._selectView(mode)}
                        role="menuitemradio"
                        aria-checked=${this._viewMode === mode}
                      >
                        <ha-icon icon=${VIEW_ICONS[mode]}></ha-icon>
                        <span>${viewModeLabel(locale, mode)}</span>
                      </button>
                    `)}
                  </div>
                ` : nothing}
              </div>

              <div class="jump-control-wrap">
                <button
                  class="jump-trigger ${this._jumpMenuOpen ? "open" : ""}"
                  @click=${this._toggleJumpMenu}
                  aria-label=${t(locale, "jumpTo")}
                  aria-expanded=${this._jumpMenuOpen}
                >
                  <ha-icon icon="mdi:calendar-search"></ha-icon>
                  <span>${t(locale, "jumpTo")}</span>
                </button>
                ${this._jumpMenuOpen ? html`
                  <div class="jump-menu">
                    <label class="jump-field">
                      <span>${this._viewMode === "Month" ? viewModeLabel(locale, "Month") : t(locale, "jumpTo")}</span>
                      ${this._viewMode === "Month" ? html`
                        <input
                          type="month"
                          .value=${this._jumpMonthValue()}
                          @click=${this._handleJumpInputClick}
                          @change=${this._handleJumpMonth}
                        />
                      ` : html`
                        <input
                          type="date"
                          .value=${this._jumpDateValue(start)}
                          @click=${this._handleJumpInputClick}
                          @change=${this._handleJumpDate}
                        />
                      `}
                    </label>
                  </div>
                ` : nothing}
              </div>

              <div class="nav-controls" aria-label=${t(locale, "calendarNavigation")}>
                <button class="nav-btn" @click=${() => this._navigate(-1)} aria-label=${t(locale, "previous")}>
                  &#8249;
                </button>
                <button class="today-btn" @click=${this._resetToToday}>${t(locale, "today")}</button>
                <button class="nav-btn" @click=${() => this._navigate(1)} aria-label=${t(locale, "next")}>
                  &#8250;
                </button>
              </div>
            </div>
          </div>
          <!-- Calendar grid -->
          <div class="calendar-area">
            ${this._loading ? html`<div class="loading-badge">${t(locale, "loading")}</div>` : nothing}
            ${configured
              ? this._viewMode === "Month"
                ? html`
                    <aurora-calendar-month
                      .events=${this._filteredEvents}
                      .start=${start}
                      .end=${end}
                      .currentMonth=${refDate.getMonth()}
                      .currentYear=${refDate.getFullYear()}
                      .config=${this._config}
                      .dimOtherMonths=${true}
                      .weekStart=${this._config.week_start}
                      .weatherByDate=${weatherByDate}
                      .weatherEntity=${this._weatherEntity}
                      .locale=${locale}
                      .persons=${persons}
                      @aurora-event-open=${this._handleEventOpen}
                    ></aurora-calendar-month>
                  `
                : this._viewMode === "Biweek"
                  ? html`
                    <aurora-calendar-month
                      .events=${this._filteredEvents}
                      .start=${start}
                      .end=${end}
                      .currentMonth=${start.getMonth()}
                      .currentYear=${start.getFullYear()}
                      .config=${this._config}
                      .dimOtherMonths=${false}
                      .weekStart=${this._config.week_start}
                      .weatherByDate=${weatherByDate}
                      .weatherEntity=${this._weatherEntity}
                      .locale=${locale}
                      .persons=${persons}
                      @aurora-event-open=${this._handleEventOpen}
                    ></aurora-calendar-month>
                  `
                  : this._viewMode === "Week"
                    ? html`
                    <aurora-calendar-week-box
                      .events=${this._filteredEvents}
                      .days=${days}
                      .config=${this._config}
                      .weatherByDate=${weatherByDate}
                      .weatherEntity=${this._weatherEntity}
                      .locale=${locale}
                      .persons=${persons}
                      @week-empty-click=${this._handleWeekEmptyClick}
                      @aurora-event-open=${this._handleEventOpen}
                    ></aurora-calendar-week-box>
                  `
                  : html`
                    <aurora-calendar-time-grid
                      .events=${this._timeGridEvents}
                      .days=${days}
                      .config=${this._config}
                      .viewMode=${this._viewMode}
                      .weatherByDate=${weatherByDate}
                      .weatherEntity=${this._weatherEntity}
                      .locale=${locale}
                      .autoScrollToNow=${this._viewMode === "Today" || this._viewMode === "Next 7 Days"}
                      .persons=${persons}
                      @aurora-event-open=${this._handleEventOpen}
                      @aurora-event-move=${this._handleEventMove}
                    ></aurora-calendar-time-grid>
                  `
              : html`
                  <div class="unconfigured">
                    <p>${t(locale, "unconfigured")}</p>
                  </div>
                `}
          </div>
          <button
            class="create-trigger floating-create-trigger"
            @click=${this._openCreateDialog}
            aria-label=${t(locale, "addEvent")}
            title=${t(locale, "addEvent")}
            ?disabled=${!configured}
          >
            <ha-icon icon="mdi:calendar-plus"></ha-icon>
          </button>
          ${this._renderEventDialog(locale)}
          ${this._renderEditDialog(locale)}
          ${this._renderCreateDialog(locale)}

        </div>
      </ha-card>
    `;
  }

  private _appearanceStyle(): string {
    return [
      `--aurora-card-opacity: ${this._clamp(this._config.card_opacity, 0, 100)}%`,
      `--aurora-background-image: ${this._backgroundImageCss(this._backgroundImageSource)}`,
      `--aurora-background-opacity: ${this._clamp(this._config.background_image_opacity, 0, 100) / 100}`,
      `--aurora-background-blur: ${this._clamp(this._config.background_blur, 0, 20)}px`,
    ].join(";");
  }

  private get _backgroundImageSource(): string {
    return this._resolvedBackgroundImage || this._config.background_image || "";
  }

  private _resolveBackgroundMediaIfNeeded(): void {
    const media = this._config.background_media;
    const key = media ? `${media.media_content_id}|${media.media_content_type}` : "";
    if (key === this._backgroundMediaKey) return;

    this._backgroundMediaKey = key;
    this._resolvedBackgroundImage = "";
    const requestId = ++this._backgroundMediaRequestId;
    if (!media || !this.hass) return;

    void this.hass
      .callWS<{ url?: string }>({
        type: "media_source/resolve_media",
        media_content_id: media.media_content_id,
      })
      .then((result) => {
        if (requestId !== this._backgroundMediaRequestId) return;
        const url = typeof result.url === "string" ? result.url : "";
        this._resolvedBackgroundImage = url.startsWith("/") && this.hass.hassUrl
          ? this.hass.hassUrl(url)
          : url;
      })
      .catch((err) => {
        console.warn("Aurora Calendar: failed to resolve background media", err);
      });
  }

  private _backgroundImageCss(value: string): string {
    const image = String(value || "").trim();
    if (!image) return "none";
    return `url("${image.replace(/["\\\n\r]/g, "")}")`;
  }

  private _clamp(value: number | undefined, min: number, max: number): number {
    if (typeof value !== "number" || Number.isNaN(value)) return max;
    return Math.min(max, Math.max(min, value));
  }

  private _safeCssHeight(value: string | undefined): string {
    const height = String(value || "").trim();
    if (!height) return CONFIG_DEFAULTS.fixed_height;
    return CSS.supports("height", height) ? height : CONFIG_DEFAULTS.fixed_height;
  }

  // ------------------------------------------------------------------
  // Styles
  // ------------------------------------------------------------------

  static styles = css`
    :host {
      --aurora-radius: 10px;
      --aurora-gap: 8px;
      --aurora-grid-height: 500px;
      display: block;
    }

    ha-card {
      overflow: hidden;
      background: transparent;
    }

    ha-card.height-ha {
      height: 100%;
    }

    .aurora-card {
      position: relative;
      isolation: isolate;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 16px;
      box-sizing: border-box;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .aurora-card.height-ha {
      height: 100%;
      min-height: 0;
    }

    .aurora-card.height-natural {
      overflow: visible;
    }

    .aurora-card::before,
    .aurora-card::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    .aurora-card::before {
      background-image: var(--aurora-background-image);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: var(--aurora-background-opacity);
      filter: blur(var(--aurora-background-blur));
      transform: scale(1.04);
    }

    .aurora-card::after {
      background: color-mix(
        in srgb,
        var(--card-background-color, #fff) var(--aurora-card-opacity),
        transparent
      );
    }

    .aurora-card.glass::after {
      background:
        radial-gradient(circle at 8% 0%, color-mix(in srgb, var(--primary-color) 9%, transparent), transparent 38%),
        color-mix(in srgb, var(--card-background-color, #fff) var(--aurora-card-opacity), transparent);
      -webkit-backdrop-filter: blur(16px) saturate(1.08);
      backdrop-filter: blur(16px) saturate(1.08);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }

    /* ---- Top toolbar ---- */
    .top-toolbar {
      position: relative;
      z-index: 30;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      grid-template-areas: "filters title actions";
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      flex-shrink: 0;
      min-height: 40px;
    }

    .filter-control-wrap,
    .view-control-wrap,
    .jump-control-wrap {
      position: relative;
      min-width: 0;
    }

    .filter-control-wrap {
      grid-area: filters;
      justify-self: start;
    }

    .filter-trigger,
    .view-trigger,
    .jump-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      border-radius: 999px;
      border: 2px solid var(--divider-color, #ccc);
      background: color-mix(in srgb, var(--card-background-color, transparent) 88%, var(--primary-color) 12%);
      cursor: pointer;
      font-size: 0.88rem;
      font-weight: 800;
      color: var(--primary-text-color);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      transition: border-color 0.15s, background 0.15s, transform 0.15s;
    }

    .filter-trigger {
      gap: 10px;
      padding: 0 14px 0 7px;
      justify-self: start;
    }

    .view-trigger {
      gap: 10px;
      min-width: 142px;
      padding: 0 16px;
    }

    .filter-trigger:hover,
    .filter-trigger.open,
    .view-trigger:hover,
    .view-trigger.open,
    .jump-trigger:hover,
    .jump-trigger.open {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 16%, transparent);
    }

    .filter-trigger:active,
    .view-trigger:active,
    .jump-trigger:active {
      transform: scale(0.98);
    }

    .jump-trigger {
      gap: 8px;
      min-width: 116px;
      padding: 0 16px;
    }

    .jump-trigger ha-icon {
      width: 20px;
      height: 20px;
      color: var(--primary-color);
    }

    .avatar-stack {
      display: inline-flex;
      align-items: center;
      min-width: 60px;
      padding-left: 4px;
    }

    .stack-avatar {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -7px;
      border-radius: 50%;
      border: 2px solid var(--card-background-color, #111);
      background: var(--person-color, var(--primary-color));
      font-weight: 700;
      font-size: 0.72rem;
      color: #fff;
      overflow: hidden;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .stack-avatar:first-child {
      margin-left: 0;
    }

    .stack-avatar img,
    .option-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .stack-more {
      background: #e5e7eb;
      color: #1f2937;
      border-color: var(--card-background-color, #111);
    }

    .filter-label,
    .chevron {
      white-space: nowrap;
    }

    .chevron {
      color: var(--secondary-text-color);
      font-size: 1rem;
      line-height: 1;
      transform: translateY(-1px);
    }

    .filter-menu,
    .view-menu,
    .jump-menu {
      position: absolute;
      top: calc(100% + 10px);
      min-width: 220px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 18px;
      background: color-mix(in srgb, var(--card-background-color, #111) 96%, var(--primary-color) 4%);
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.32);
      padding: 10px;
      z-index: 40;
    }

    .filter-menu {
      left: 0;
    }

    .view-menu {
      right: 0;
      min-width: 420px;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 0;
      padding: 0;
      overflow: hidden;
    }

    .jump-menu {
      right: 0;
      width: 250px;
      padding: 14px;
    }

    .jump-field {
      display: flex;
      flex-direction: column;
      gap: 9px;
      color: var(--secondary-text-color);
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .jump-field input {
      min-height: 46px;
      border: 2px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 14px;
      background: color-mix(in srgb, var(--card-background-color, transparent) 90%, var(--primary-color) 10%);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 1rem;
      font-weight: 800;
      padding: 0 12px;
      outline: none;
      color-scheme: light dark;
    }

    .jump-field input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 20%, transparent);
    }

    .menu-heading {
      padding: 4px 8px 9px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }

    .filter-option,
    .view-option {
      width: 100%;
      min-height: 42px;
      display: flex;
      align-items: center;
      gap: 10px;
      border: none;
      border-radius: 12px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
      text-align: left;
    }

    .filter-option {
      padding: 5px 8px 5px 5px;
    }

    .view-option {
      min-height: 76px;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
      padding: 9px 10px;
      border-radius: 0;
      border-right: 1px solid color-mix(in srgb, var(--divider-color) 68%, transparent);
      font-size: 0.7rem;
      font-weight: 800;
      text-align: center;
    }

    .filter-option:hover,
    .filter-option.active,
    .view-option:hover,
    .view-option.active {
      background: color-mix(in srgb, var(--primary-color) 14%, transparent);
    }

    .view-option:last-child {
      border-right: none;
    }

    .view-option ha-icon {
      width: 24px;
      height: 24px;
      color: var(--secondary-text-color);
    }

    .view-option.active {
      color: var(--primary-color);
    }

    .view-option.active ha-icon {
      color: var(--primary-color);
    }

    .filter-option.inactive {
      opacity: 0.58;
    }

    .option-avatar {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--person-color, var(--primary-color));
      color: #fff;
      font-size: 0.76rem;
      font-weight: 800;
      overflow: hidden;
      flex-shrink: 0;
    }

    .option-name {
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 700;
    }

    .option-count {
      min-width: 22px;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.08);
      color: var(--primary-text-color);
      font-size: 0.78rem;
      font-weight: 700;
      text-align: center;
      opacity: 0.8;
    }

    .filter-option.inactive .option-count {
      opacity: 0.45;
    }

    .option-check {
      width: 20px;
      color: var(--primary-color);
      font-weight: 900;
      text-align: center;
    }

    .nav-btn {
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--card-background-color, transparent) 88%, var(--primary-color) 12%);
      border: 2px solid var(--divider-color, #ccc);
      border-radius: 999px;
      font-size: 2rem;
      line-height: 1;
      cursor: pointer;
      color: var(--primary-text-color);
      padding: 0 0 3px;
      opacity: 0.86;
      transition: border-color 0.15s, background 0.15s, opacity 0.15s, transform 0.15s;
    }
    .nav-btn:hover {
      opacity: 1;
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
    .nav-btn:active {
      transform: scale(0.96);
    }

    .create-trigger {
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-color);
      border: 2px solid color-mix(in srgb, var(--primary-color) 76%, var(--divider-color));
      border-radius: 999px;
      color: var(--text-primary-color, #fff);
      cursor: pointer;
      padding: 0;
      transition: filter 0.15s, transform 0.15s, opacity 0.15s;
    }

    .create-trigger ha-icon {
      width: 22px;
      height: 22px;
    }

    .create-trigger:hover {
      filter: brightness(1.06);
    }

    .create-trigger:active {
      transform: scale(0.96);
    }

    .create-trigger:disabled {
      cursor: default;
      opacity: 0.45;
      filter: grayscale(0.2);
    }

    .floating-create-trigger {
      position: absolute;
      right: 28px;
      bottom: 28px;
      z-index: 25;
      width: 56px;
      height: 56px;
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
    }

    .floating-create-trigger ha-icon {
      width: 26px;
      height: 26px;
    }

    .nav-controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .toolbar-actions {
      grid-area: actions;
      display: flex;
      align-items: center;
      justify-self: end;
      gap: 8px;
      min-width: 0;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .view-title {
      grid-area: title;
      font-size: 1.42rem;
      font-weight: 800;
      color: var(--primary-text-color);
      justify-self: center;
      text-align: center;
      white-space: nowrap;
      letter-spacing: -0.01em;
    }

    .today-btn {
      min-height: 42px;
      background: color-mix(in srgb, var(--card-background-color, transparent) 88%, var(--primary-color) 12%);
      border: 2px solid var(--divider-color, #ccc);
      border-radius: 999px;
      padding: 0 16px;
      cursor: pointer;
      font-size: 0.86rem;
      font-weight: 600;
      color: var(--primary-text-color);
      transition: border-color 0.15s, background 0.15s, color 0.15s, transform 0.15s;
    }
    .today-btn:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
    .today-btn:active {
      transform: scale(0.97);
    }

    .filter-trigger:focus-visible,
    .view-trigger:focus-visible,
    .filter-option:focus-visible,
    .view-option:focus-visible,
    .nav-btn:focus-visible,
    .create-trigger:focus-visible,
    .today-btn:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    /* ---- Calendar area ---- */
    .calendar-area {
      position: relative;
      z-index: 1;
      min-height: 0;
      overflow: hidden;
      height: var(--aurora-grid-height);
      padding: 0 0 1px;
      box-sizing: border-box;
    }

    .aurora-card.height-ha .calendar-area {
      flex: 1 1 auto;
      height: auto;
    }

    .aurora-card.height-natural .calendar-area {
      height: auto;
      min-height: 360px;
      overflow: visible;
    }

    .aurora-card.height-natural aurora-calendar-month,
    .aurora-card.height-natural aurora-calendar-week-box,
    .aurora-card.height-natural aurora-calendar-time-grid {
      min-height: 360px;
    }

    .loading-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      z-index: 20;
      pointer-events: none;
    }

    .unconfigured {
      height: var(--aurora-grid-height);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed var(--divider-color, #ccc);
      border-radius: var(--aurora-radius);
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      text-align: center;
      padding: 24px;
      box-sizing: border-box;
    }
    .unconfigured p {
      margin: 0;
      line-height: 1.6;
    }

    .event-dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(0, 0, 0, 0.42);
      backdrop-filter: blur(5px);
      box-sizing: border-box;
      animation: aurora-backdrop-in 0.18s ease-out both;
    }

    .event-dialog-backdrop.closing {
      animation: aurora-backdrop-out 0.16s ease-in both;
    }

    .event-dialog {
      width: min(520px, 100%);
      max-height: min(720px, calc(100vh - 48px));
      overflow: hidden;
      border-radius: 24px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
      border: 1px solid color-mix(in srgb, var(--event-color) 28%, var(--divider-color));
      animation: aurora-dialog-in 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }

    .event-dialog-backdrop.closing .event-dialog {
      animation: aurora-dialog-out 0.16s ease-in both;
    }

    @keyframes aurora-backdrop-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes aurora-backdrop-out {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    @keyframes aurora-dialog-in {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.985);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes aurora-dialog-out {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(8px) scale(0.985);
      }
    }

    .event-dialog-header {
      position: relative;
      padding: 24px 64px 22px 24px;
      background:
        radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.32), transparent 28%),
        linear-gradient(135deg, var(--event-color), color-mix(in srgb, var(--event-color) 72%, #000 28%));
      color: var(--event-text-color);
    }

    .event-dialog-kicker {
      font-size: 0.76rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.82;
      margin-bottom: 8px;
    }

    .event-dialog-header h2 {
      margin: 0;
      font-size: clamp(1.4rem, 3vw, 2rem);
      line-height: 1.05;
      letter-spacing: -0.03em;
    }

    .event-dialog-person {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 14px;
      font-weight: 800;
      opacity: 0.94;
    }

    .event-dialog-avatar {
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--person-color, rgba(255, 255, 255, 0.22));
      border: 1.5px solid rgba(255, 255, 255, 0.5);
      font-size: 0.75rem;
      font-weight: 900;
      overflow: hidden;
      flex-shrink: 0;
    }

    .event-dialog-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }

    .event-dialog-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 42px;
      height: 42px;
      border: 0;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
      color: inherit;
      cursor: pointer;
      font-size: 1.8rem;
      line-height: 1;
    }

    .event-dialog-close:hover {
      background: rgba(255, 255, 255, 0.28);
    }

    .event-dialog-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 22px 24px 24px;
      overflow-y: auto;
      max-height: calc(min(720px, 100vh - 48px) - 150px);
    }

    .detail-row {
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr);
      gap: 12px;
      align-items: start;
      padding: 12px;
      border-radius: 16px;
      background: color-mix(in srgb, var(--event-color) 8%, transparent);
    }

    .detail-row ha-icon {
      color: var(--event-color);
      margin-top: 2px;
    }

    .detail-label {
      display: block;
      color: var(--secondary-text-color);
      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .detail-value {
      display: block;
      font-size: 1rem;
      font-weight: 750;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }

    .detail-section {
      padding: 14px;
      border-radius: 16px;
      background: color-mix(in srgb, var(--secondary-background-color, #f5f5f5) 88%, var(--event-color) 12%);
    }

    .detail-section p {
      margin: 0;
      white-space: pre-wrap;
      line-height: 1.45;
      overflow-wrap: anywhere;
    }

    .event-action-error {
      padding: 10px 12px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
      color: var(--error-color, #db4437);
      font-size: 0.86rem;
      font-weight: 700;
      line-height: 1.35;
    }

    .event-dialog-actions,
    .create-form-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 4px;
    }

    .delete-confirm-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 14px;
      border: 2px solid color-mix(in srgb, var(--error-color, #db4437) 34%, transparent);
      border-radius: 16px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, var(--card-background-color, #fff));
    }

    .delete-confirm-panel > div:first-child {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .delete-confirm-panel strong {
      color: var(--primary-text-color);
      font-size: 1rem;
      line-height: 1.25;
    }

    .delete-confirm-panel span {
      color: var(--secondary-text-color);
      font-size: 0.88rem;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }

    .danger-action,
    .primary-action,
    .secondary-action {
      min-height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 999px;
      border: 2px solid transparent;
      padding: 0 16px;
      cursor: pointer;
      font: inherit;
      font-size: 0.88rem;
      font-weight: 800;
      transition: background 0.15s, border-color 0.15s, opacity 0.15s, transform 0.15s;
    }

    .danger-action {
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
      border-color: color-mix(in srgb, var(--error-color, #db4437) 34%, transparent);
      color: var(--error-color, #db4437);
    }

    .primary-action {
      background: var(--event-color, var(--primary-color));
      border-color: color-mix(in srgb, var(--event-color, var(--primary-color)) 74%, var(--divider-color));
      color: var(--text-primary-color, #fff);
    }

    .secondary-action {
      background: color-mix(in srgb, var(--card-background-color, transparent) 88%, var(--event-color, var(--primary-color)) 12%);
      border-color: var(--divider-color, #ccc);
      color: var(--primary-text-color);
    }

    .danger-action:hover,
    .primary-action:hover,
    .secondary-action:hover {
      transform: translateY(-1px);
    }

    .danger-action:disabled,
    .primary-action:disabled,
    .secondary-action:disabled {
      cursor: default;
      opacity: 0.48;
      transform: none;
    }

    .danger-action ha-icon,
    .primary-action ha-icon,
    .secondary-action ha-icon {
      width: 18px;
      height: 18px;
    }

    .create-dialog {
      border-color: color-mix(in srgb, var(--event-color, var(--primary-color)) 28%, var(--divider-color));
    }

    .create-dialog-header {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 62px 18px 22px;
      border-bottom: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      background: color-mix(in srgb, var(--event-color, var(--primary-color)) 14%, var(--card-background-color, #fff));
    }

    .create-dialog-header ha-icon {
      width: 30px;
      height: 30px;
      color: var(--event-color, var(--primary-color));
    }

    .create-dialog-header h2 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 850;
      line-height: 1.1;
      color: var(--primary-text-color);
    }

    .create-dialog-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 40px;
      height: 40px;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 1.35rem;
      line-height: 1;
    }

    .create-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 20px 22px 22px;
      max-height: calc(min(720px, 100vh - 48px) - 76px);
      overflow-y: auto;
      box-sizing: border-box;
    }

    .create-calendar-picker {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 7px;
      min-width: 0;
    }

    .form-field-label {
      color: var(--secondary-text-color);
      font-size: 0.74rem;
      font-weight: 900;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .create-calendar-trigger {
      min-height: 48px;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 12px 7px 8px;
      border: 2px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 14px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 92%, var(--event-color, var(--primary-color)) 8%);
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
      text-align: left;
      box-sizing: border-box;
    }

    .create-calendar-trigger:hover,
    .create-calendar-trigger.open {
      border-color: var(--event-color, var(--primary-color));
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--event-color, var(--primary-color)) 14%, transparent);
    }

    .create-calendar-menu {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      z-index: 5;
      display: flex;
      flex-direction: column;
      gap: 2px;
      max-height: 260px;
      overflow-y: auto;
      padding: 8px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 16px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 96%, var(--event-color, var(--primary-color)) 4%);
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.28);
    }

    .create-form label {
      display: flex;
      flex-direction: column;
      gap: 7px;
      min-width: 0;
    }

    .create-form label > span {
      color: var(--secondary-text-color);
      font-size: 0.74rem;
      font-weight: 900;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .create-form input,
    .create-form select,
    .create-form textarea {
      width: 100%;
      min-height: 42px;
      border: 2px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 12px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 92%, var(--primary-color) 8%);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 0.95rem;
      padding: 8px 10px;
      outline: none;
      box-sizing: border-box;
      color-scheme: light dark;
    }

    .create-form textarea {
      min-height: 84px;
      resize: vertical;
    }

    .create-form input:focus,
    .create-form select:focus,
    .create-form textarea:focus {
      border-color: var(--event-color, var(--primary-color));
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--event-color, var(--primary-color)) 18%, transparent);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .date-time-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .check-row {
      flex-direction: row !important;
      align-items: center;
      gap: 10px !important;
      width: fit-content;
      cursor: pointer;
    }

    .check-row input {
      width: 20px;
      min-height: 20px;
      height: 20px;
      accent-color: var(--primary-color);
    }

    .check-row span {
      color: var(--primary-text-color) !important;
      font-size: 0.9rem !important;
      letter-spacing: 0 !important;
      text-transform: none !important;
    }

    .form-notice {
      padding: 12px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--event-color, var(--warning-color, #f4b400)) 16%, transparent);
      color: var(--primary-text-color);
      font-size: 0.88rem;
      font-weight: 700;
      line-height: 1.35;
    }

    .event-owner-strip {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--primary-text-color);
    }

    aurora-calendar-month,
    aurora-calendar-week-box,
    aurora-calendar-time-grid {
      display: block;
      height: 100%;
    }

    @media (max-width: 900px) {
      .top-toolbar {
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-areas:
          "filters actions"
          "title title";
        row-gap: 10px;
      }

      .view-title {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    @media (max-width: 620px) {
      .top-toolbar {
        grid-template-columns: 1fr;
        grid-template-areas:
          "title"
          "filters"
          "actions";
      }

      .filter-control-wrap,
      .toolbar-actions,
      .view-title {
        justify-self: center;
      }

      .toolbar-actions {
        justify-content: center;
      }

      .filter-menu {
        left: 50%;
        transform: translateX(-50%);
      }

      .view-menu,
      .jump-menu {
        right: 50%;
        transform: translateX(50%);
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 430px) {
      .toolbar-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
      }

      .view-control-wrap,
      .jump-control-wrap,
      .nav-controls {
        justify-self: center;
      }

      .nav-controls {
        grid-column: 1 / -1;
      }
    }
  `;
}

// ------------------------------------------------------------------
// Visual card editor — uses native HA elements so themes and upgrades
// are handled by HA automatically (ha-switch, ha-select, ha-textfield)
// ------------------------------------------------------------------

@customElement("aurora-calendar-card-editor")
export class AuroraCalendarCardEditor extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config!: AuroraCalendarConfig;

  setConfig(config: AuroraCalendarConfig): void {
    const integration = config.integration || "aurora_calendar";
    this._config = { ...CONFIG_DEFAULTS, ...config, integration };
  }

  private _set(field: keyof AuroraCalendarConfig, value: unknown): void {
    if (!this._config) return;
    const config = { ...this._config, [field]: value };
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config },
      bubbles: true,
      composed: true,
    }));
  }

  private _setBackgroundMedia(event: Event): void {
    const detail = (event as CustomEvent<{ value?: unknown }>).detail;
    const value = detail?.value;

    if (
      value &&
      typeof value === "object" &&
      "media_content_id" in value &&
      "media_content_type" in value
    ) {
      const media = value as Partial<AuroraBackgroundMedia>;
      if (
        typeof media.media_content_id === "string" &&
        typeof media.media_content_type === "string"
      ) {
        this._set("background_media", {
          media_content_id: media.media_content_id,
          media_content_type: media.media_content_type,
        });
        return;
      }
    }

    this._set("background_media", null);
  }

  private _setBoundedNumber(
    field: keyof AuroraCalendarConfig,
    event: Event,
    min: number,
    max: number
  ): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (!Number.isFinite(value)) return;
    this._set(field, Math.min(max, Math.max(min, Math.round(value))));
  }

  private _renderNumberSlider(
    label: string,
    field: keyof AuroraCalendarConfig,
    min: number,
    max: number,
    suffix = ""
  ) {
    const value = Math.min(max, Math.max(min, Number(this._config[field]) || 0));
    return html`
      <label class="slider-control">
        <span class="slider-header">
          <span>${label}</span>
          <output>${value}${suffix}</output>
        </span>
        <input
          type="range"
          min=${String(min)}
          max=${String(max)}
          .value=${String(value)}
          @input=${(e: Event) => this._setBoundedNumber(field, e, min, max)}
        />
      </label>
    `;
  }

  render() {
    if (!this._config) return html``;
    const locale = localeFromHass(this.hass);

    return html`
      <!-- General -->
      <ha-expansion-panel outlined .expanded=${true}>
        <div slot="header" class="panel-header">
          <ha-icon icon="mdi:cog"></ha-icon>
          ${t(locale, "general")}
        </div>

        <div class="panel-content">
          <label class="selector-control">
            <span>${t(locale, "weekStartsOn")}</span>
            <ha-selector
              .hass=${this.hass}
              .selector=${{
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "sunday", label: t(locale, "sunday") },
                    { value: "monday", label: t(locale, "monday") },
                  ],
                },
              }}
              .value=${this._config.week_start}
              @value-changed=${(e: CustomEvent<{ value?: string }>) => {
                const value = e.detail?.value;
                if (value === "sunday" || value === "monday") {
                  this._set("week_start", value as WeekStart);
                }
              }}
            ></ha-selector>
          </label>
        </div>
      </ha-expansion-panel>

      <!-- Appearance -->
      <ha-expansion-panel outlined .expanded=${true}>
        <div slot="header" class="panel-header">
          <ha-icon icon="mdi:palette-outline"></ha-icon>
          ${t(locale, "appearance")}
        </div>

        <div class="panel-content">
          <section class="editor-section">
            <h3>${t(locale, "heightMode")}</h3>

            <label class="selector-control">
              <span>${t(locale, "heightMode")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{
                  select: {
                    mode: "dropdown",
                    options: [
                      { value: "auto", label: t(locale, "heightAuto") },
                      { value: "ha", label: t(locale, "heightHomeAssistant") },
                      { value: "fixed", label: t(locale, "heightFixed") },
                      { value: "natural", label: t(locale, "heightNatural") },
                    ],
                  },
                }}
                .value=${this._config.height_mode}
                @value-changed=${(e: CustomEvent<{ value?: string }>) => {
                  const value = e.detail?.value;
                  if (value === "auto" || value === "ha" || value === "fixed" || value === "natural") {
                    this._set("height_mode", value as HeightMode);
                  }
                }}
              ></ha-selector>
            </label>

            ${this._config.height_mode === "fixed"
              ? html`
                  <ha-textfield
                    label=${t(locale, "fixedHeight")}
                    .value=${this._config.fixed_height}
                    helper=${t(locale, "fixedHeightHelper")}
                    @change=${(e: Event) => this._set("fixed_height", (e.target as HTMLInputElement).value.trim())}
                  ></ha-textfield>
                `
              : nothing}
          </section>

          <section class="editor-section">
            <h3>${t(locale, "visualBehavior")}</h3>

            <ha-settings-row>
              <span slot="heading">${t(locale, "dimPastEvents")}</span>
              <span slot="description">${t(locale, "dimPastEventsDesc")}</span>
              <ha-switch
                .checked=${this._config.dim_past_events}
                @change=${(e: Event) => this._set("dim_past_events", (e.target as HTMLInputElement).checked)}
              ></ha-switch>
            </ha-settings-row>

            <ha-settings-row>
              <span slot="heading">${t(locale, "calendarGridLines")}</span>
              <span slot="description">${t(locale, "calendarGridLinesDesc")}</span>
              <ha-switch
                .checked=${this._config.show_calendar_grid_lines}
                @change=${(e: Event) => this._set("show_calendar_grid_lines", (e.target as HTMLInputElement).checked)}
              ></ha-switch>
            </ha-settings-row>

            <ha-settings-row>
              <span slot="heading">${t(locale, "keepAllDayEventsVisible")}</span>
              <span slot="description">${t(locale, "keepAllDayEventsVisibleDesc")}</span>
              <ha-switch
                .checked=${this._config.keep_all_day_events_visible}
                @change=${(e: Event) => this._set("keep_all_day_events_visible", (e.target as HTMLInputElement).checked)}
              ></ha-switch>
            </ha-settings-row>
          </section>

          <section class="editor-section">
            <h3>${t(locale, "eventDisplay")}</h3>

            <ha-settings-row>
              <span slot="heading">${t(locale, "showEventTimes")}</span>
              <span slot="description">${t(locale, "showEventTimesDesc")}</span>
              <ha-switch
                .checked=${this._config.show_event_time}
                @change=${(e: Event) => this._set("show_event_time", (e.target as HTMLInputElement).checked)}
              ></ha-switch>
            </ha-settings-row>

            <label class="selector-control">
              <span>${t(locale, "timeFormat")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{
                  select: {
                    mode: "dropdown",
                    options: [
                      { value: "12h", label: t(locale, "twelveHour") },
                      { value: "24h", label: t(locale, "twentyFourHour") },
                    ],
                  },
                }}
                .value=${this._config.time_format}
                @value-changed=${(e: CustomEvent<{ value?: string }>) => {
                  const value = e.detail?.value;
                  if (value === "12h" || value === "24h") {
                    this._set("time_format", value as TimeFormat);
                  }
                }}
              ></ha-selector>
            </label>

            <div class="event-typography">
              <label class="selector-control">
                <span>${t(locale, "eventFontSize")}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{
                    select: {
                      mode: "dropdown",
                      options: [
                        { value: "12", label: t(locale, "small") },
                        { value: "14", label: t(locale, "medium") },
                        { value: "16", label: t(locale, "large") },
                        { value: "18", label: t(locale, "extraLarge") },
                      ],
                    },
                  }}
                  .value=${String(this._config.event_font_size)}
                  @value-changed=${(e: CustomEvent<{ value?: string }>) => {
                    const value = Number(e.detail?.value);
                    if (Number.isInteger(value) && value >= 11 && value <= 24) {
                      this._set("event_font_size", value);
                    }
                  }}
                ></ha-selector>
              </label>

              <label class="selector-control">
                <span>${t(locale, "eventFont")}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{
                    select: {
                      mode: "dropdown",
                      options: [
                        { value: "inherit", label: t(locale, "default") },
                        { value: '"Nunito", "Segoe UI", sans-serif', label: t(locale, "friendlyRounded") },
                        { value: '"Aptos", "Segoe UI", sans-serif', label: t(locale, "cleanDashboard") },
                        { value: '"Georgia", serif', label: t(locale, "serif") },
                      ],
                    },
                  }}
                  .value=${this._config.event_font_family}
                  @value-changed=${(e: CustomEvent<{ value?: string }>) => {
                    if (typeof e.detail?.value === "string") {
                      this._set("event_font_family", e.detail.value);
                    }
                  }}
                ></ha-selector>
              </label>
            </div>
          </section>

          <section class="editor-section">
            <h3>${t(locale, "scheduleWindow")}</h3>

            <div class="time-window">
              <label class="selector-control">
                <span>${t(locale, "visibleStartHour")}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{
                    select: {
                      mode: "dropdown",
                      options: Array.from({ length: 24 }, (_, hour) => ({
                        value: String(hour),
                        label: `${String(hour).padStart(2, "0")}:00`,
                      })),
                    },
                  }}
                  .value=${String(this._config.visible_start_hour)}
                  @value-changed=${(e: CustomEvent<{ value?: string }>) => {
                    const value = Number(e.detail?.value);
                    if (Number.isInteger(value) && value >= 0 && value <= 23) {
                      this._set("visible_start_hour", value);
                    }
                  }}
                ></ha-selector>
              </label>

              <label class="selector-control">
                <span>${t(locale, "visibleEndHour")}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{
                    select: {
                      mode: "dropdown",
                      options: Array.from({ length: 24 }, (_, index) => ({
                        value: String(index + 1),
                        label: `${String(index + 1).padStart(2, "0")}:00`,
                      })),
                    },
                  }}
                  .value=${String(this._config.visible_end_hour)}
                  @value-changed=${(e: CustomEvent<{ value?: string }>) => {
                    const value = Number(e.detail?.value);
                    if (Number.isInteger(value) && value >= 1 && value <= 24) {
                      this._set("visible_end_hour", value);
                    }
                  }}
                ></ha-selector>
                <small class="helper-text">${t(locale, "visibleEndHourHelper")}</small>
              </label>
            </div>
          </section>

          <section class="editor-section">
            <h3>${t(locale, "background")}</h3>

            <ha-settings-row>
              <span slot="heading">${t(locale, "glassBackground")}</span>
              <span slot="description">${t(locale, "glassBackgroundDesc")}</span>
              <ha-switch
                .checked=${this._config.glass_background}
                @change=${(e: Event) => this._set("glass_background", (e.target as HTMLInputElement).checked)}
              ></ha-switch>
            </ha-settings-row>

            <div class="media-picker">
              <div class="media-picker-heading">
                <div>
                  <span>${t(locale, "backgroundMedia")}</span>
                  <small>${t(locale, "backgroundMediaHelper")}</small>
                </div>
                ${this._config.background_media
                  ? html`
                      <button type="button" class="text-button" @click=${() => this._set("background_media", null)}>
                        ${t(locale, "removeBackgroundImage")}
                      </button>
                    `
                  : nothing}
              </div>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ media: { accept: ["image/*"] } }}
                .value=${this._config.background_media || undefined}
                @value-changed=${this._setBackgroundMedia}
              ></ha-selector>
            </div>

            <ha-textfield
              label=${t(locale, "backgroundImage")}
              .value=${this._config.background_image}
              helper=${t(locale, "backgroundImageHelper")}
              @change=${(e: Event) => this._set("background_image", (e.target as HTMLInputElement).value.trim())}
            ></ha-textfield>

            <div class="background-controls">
              ${this._renderNumberSlider(t(locale, "cardOpacity"), "card_opacity", 0, 100, "%")}
              ${this._renderNumberSlider(t(locale, "backgroundImageOpacity"), "background_image_opacity", 0, 100, "%")}
              ${this._renderNumberSlider(t(locale, "backgroundBlur"), "background_blur", 0, 20, "px")}
            </div>
          </section>
        </div>
      </ha-expansion-panel>

      <!-- Features -->
      <ha-expansion-panel outlined .expanded=${true}>
        <div slot="header" class="panel-header">
          <ha-icon icon="mdi:lightning-bolt"></ha-icon>
          ${t(locale, "features")}
        </div>

        <div class="panel-content">
          <ha-settings-row>
            <span slot="heading">${t(locale, "weatherForecast")}</span>
            <span slot="description">${t(locale, "weatherForecastDesc")}</span>
            <ha-switch
              .checked=${this._config.show_weather}
              @change=${(e: Event) => this._set("show_weather", (e.target as HTMLInputElement).checked)}
            ></ha-switch>
          </ha-settings-row>

          <label class="selector-control">
            <span>${t(locale, "weatherIconStyle")}</span>
            <ha-selector
              .hass=${this.hass}
              .selector=${{
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "static", label: t(locale, "static") },
                    { value: "animated", label: t(locale, "animated") },
                  ],
                },
              }}
              .value=${this._config.weather_icon_style}
              @value-changed=${(e: CustomEvent<{ value?: string }>) => {
                const value = e.detail?.value;
                if (value === "static" || value === "animated") {
                  this._set("weather_icon_style", value as WeatherIconStyle);
                }
              }}
            ></ha-selector>
          </label>
        </div>
      </ha-expansion-panel>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0 8px;
    }

    ha-textfield {
      width: 100%;
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .panel-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 16px 16px;
    }

    ha-select {
      width: 100%;
    }

    ha-selector {
      display: block;
      width: 100%;
    }

    .editor-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 18px;
      background: color-mix(in srgb, var(--secondary-background-color, #f5f5f5) 58%, transparent);
    }

    .editor-section h3 {
      margin: 0;
      color: var(--primary-text-color);
      font-size: 0.95rem;
      font-weight: 800;
      letter-spacing: 0.01em;
    }

    .media-picker {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 72%, transparent);
    }

    .media-picker-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .media-picker-heading div {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .media-picker-heading span {
      color: var(--primary-text-color);
      font-size: 0.9rem;
      font-weight: 700;
    }

    .media-picker-heading small {
      color: var(--secondary-text-color);
      font-size: 0.78rem;
      line-height: 1.35;
    }

    .selector-control {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .selector-control > span {
      color: var(--secondary-text-color);
      font-size: 0.78rem;
      font-weight: 600;
      padding: 0 2px;
    }

    .text-button {
      border: 0;
      background: transparent;
      color: var(--primary-color);
      cursor: pointer;
      font: inherit;
      font-size: 0.82rem;
      font-weight: 700;
      white-space: nowrap;
    }

    .slider-control {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--secondary-background-color, #f5f5f5) 76%, transparent);
    }

    .slider-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      color: var(--primary-text-color);
      font-size: 0.9rem;
      font-weight: 600;
    }

    .slider-header output {
      min-width: 48px;
      padding: 3px 8px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      color: var(--primary-color);
      font-size: 0.82rem;
      font-weight: 800;
      text-align: center;
    }

    .slider-control input[type="range"] {
      width: 100%;
      accent-color: var(--primary-color);
      cursor: pointer;
    }

    .time-window,
    .event-typography,
    .background-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
    }

    @media (max-width: 640px) {
      .time-window,
      .event-typography,
      .background-controls {
        grid-template-columns: 1fr;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "aurora-calendar-card": AuroraCalendarCard;
    "aurora-calendar-card-editor": AuroraCalendarCardEditor;
  }
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description?: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "aurora-calendar-card",
  name: "Aurora Calendar",
  description:
    "Family calendar with month/week/today views, weather overlay, and per-person filters.",
  preview: true,
  documentationURL: "https://github.com/davidlop28/ha-aurora-calendar",
});
