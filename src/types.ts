export type ViewMode = "Month" | "Week" | "Biweek" | "Today" | "Next 7 Days";

export type WeekStart = "sunday" | "monday";
export type TimeFormat = "12h" | "24h";
export type WeatherIconStyle = "static" | "animated";
export type HeightMode = "auto" | "ha" | "fixed" | "natural";

export interface AuroraBackgroundMedia {
  media_content_id: string;
  media_content_type: string;
}

export interface AuroraCalendarConfig {
  type: string;
  integration: string;

  // General
  week_start: WeekStart;

  // Appearance
  height_mode: HeightMode;
  fixed_height: string;
  dim_past_events: boolean;
  show_event_time: boolean;
  time_format: TimeFormat;
  visible_start_hour: number;
  visible_end_hour: number;
  event_font_size: number;
  event_font_family: string;
  show_calendar_grid_lines: boolean;
  keep_all_day_events_visible: boolean;
  glass_background: boolean;
  card_opacity: number;
  background_media: AuroraBackgroundMedia | null;
  background_image: string;
  background_image_opacity: number;
  background_blur: number;

  // Features
  show_weather: boolean;
  weather_icon_style: WeatherIconStyle;
}

export const CONFIG_DEFAULTS: Omit<AuroraCalendarConfig, "type" | "integration"> = {
  week_start: "sunday",
  height_mode: "auto",
  fixed_height: "640px",
  dim_past_events: true,
  show_event_time: true,
  time_format: "12h",
  visible_start_hour: 6,
  visible_end_hour: 22,
  event_font_size: 14,
  event_font_family: "inherit",
  show_calendar_grid_lines: true,
  keep_all_day_events_visible: false,
  glass_background: false,
  card_opacity: 100,
  background_media: null,
  background_image: "",
  background_image_opacity: 35,
  background_blur: 0,
  show_weather: true,
  weather_icon_style: "static",
};

export interface CalendarInfo {
  entity_id: string;
  person: string;
  color: string;
  color_mode?: "override" | "source";
  override_color?: string;
  source_color?: string;
  effective_color?: string;
  avatar: string;
  person_entity_id?: string;
}

export interface PersonInfo {
  person: string;
  slug: string;
  color: string;
  avatar: string;
  person_entity_id?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;   // ISO datetime or date string
  end: string;
  all_day: boolean;
  person: string;
  color: string;
  description?: string;
  location?: string;
  calendarEntity: string;
  calendarName?: string;
  uid?: string;
  recurrenceId?: string;
  canDragEdit?: boolean;
}

export interface WeatherDay {
  condition: string;
  temperature?: number;
  templow?: number;
  temperatureUnit: string;
}

export type WeatherByDate = Record<string, WeatherDay>;

// Minimal HA types needed by the card
export interface HassEntityState {
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  locale?: {
    language?: string;
  };
  states: Record<string, HassEntityState>;
  connection?: HassConnection;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>
  ): Promise<void>;
  callApi<T>(method: string, path: string): Promise<T>;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  hassUrl?(path: string): string;
}

export type HassUnsubscribe = () => void;

export interface HassConnection {
  subscribeEvents<T>(
    callback: (event: T) => void,
    eventType?: string
  ): Promise<HassUnsubscribe>;
}

export interface HassStateChangedEvent {
  data?: {
    entity_id?: string;
    old_state?: HassEntityState | null;
    new_state?: HassEntityState | null;
  };
}

// Raw shape returned by HA's calendar REST endpoint
export interface HassCalendarEventRaw {
  summary: string;
  uid?: string;
  recurrence_id?: string;
  recurrenceId?: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string };
  end:   { dateTime?: string; date?: string };
}
