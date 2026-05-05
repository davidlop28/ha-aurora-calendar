import type { HomeAssistant, WeatherByDate, WeatherDay, WeatherIconStyle } from "./types.js";
import { dateKey } from "./utils.js";

interface HassWeatherForecast {
  datetime: string;
  condition?: string;
  temperature?: number;
  templow?: number;
}

interface WeatherForecastResponse {
  response?: Record<string, { forecast?: HassWeatherForecast[] }>;
}

export async function fetchDailyWeather(
  hass: HomeAssistant,
  weatherEntity: string
): Promise<WeatherByDate> {
  if (!weatherEntity) return {};

  const state = hass.states[weatherEntity];
  const temperatureUnit = String(state?.attributes.temperature_unit ?? "");

  try {
    const result = await hass.callWS<WeatherForecastResponse>({
      type: "call_service",
      domain: "weather",
      service: "get_forecasts",
      service_data: { type: "daily" },
      target: { entity_id: weatherEntity },
      return_response: true,
    });
    const forecast = result.response?.[weatherEntity]?.forecast ?? [];
    return forecast.reduce<WeatherByDate>((acc, item) => {
      const day = normalizeForecast(item, temperatureUnit);
      if (!day) return acc;
      acc[dateKey(new Date(item.datetime))] = day;
      return acc;
    }, {});
  } catch {
    return {};
  }
}

function normalizeForecast(
  forecast: HassWeatherForecast,
  temperatureUnit: string
): WeatherDay | null {
  if (!forecast.datetime || !forecast.condition) return null;
  return {
    condition: forecast.condition,
    temperature: forecast.temperature,
    templow: forecast.templow,
    temperatureUnit,
  };
}

export function weatherIcon(condition: string): string {
  switch (condition) {
    case "clear-night":
      return "mdi:weather-night";
    case "cloudy":
      return "mdi:weather-cloudy";
    case "fog":
      return "mdi:weather-fog";
    case "hail":
      return "mdi:weather-hail";
    case "lightning":
      return "mdi:weather-lightning";
    case "lightning-rainy":
      return "mdi:weather-lightning-rainy";
    case "partlycloudy":
      return "mdi:weather-partly-cloudy";
    case "pouring":
      return "mdi:weather-pouring";
    case "rainy":
      return "mdi:weather-rainy";
    case "snowy":
      return "mdi:weather-snowy";
    case "snowy-rainy":
      return "mdi:weather-snowy-rainy";
    case "sunny":
      return "mdi:weather-sunny";
    case "windy":
      return "mdi:weather-windy";
    case "windy-variant":
      return "mdi:weather-windy-variant";
    case "exceptional":
      return "mdi:alert-circle-outline";
    default:
      return "mdi:weather-cloudy";
  }
}

export function weatherSvgUrl(condition: string, style: WeatherIconStyle = "static"): string {
  const icon = weatherSvgName(condition);
  return `/aurora_calendar_static/weather-icons/${style}/${icon}.svg`;
}

function weatherSvgName(condition: string): string {
  switch (condition) {
    case "clear-night":
      return "clear-night";
    case "cloudy":
      return "cloudy";
    case "fog":
      return "fog";
    case "hail":
      return "hail";
    case "lightning":
      return "thunderstorms";
    case "lightning-rainy":
      return "scattered-thunderstorms";
    case "partlycloudy":
      return "cloudy-2-day";
    case "pouring":
      return "rainy-3";
    case "rainy":
      return "rainy-2";
    case "snowy":
      return "snowy-2";
    case "snowy-rainy":
      return "rain-and-snow-mix";
    case "sunny":
      return "clear-day";
    case "windy":
    case "windy-variant":
      return "wind";
    case "exceptional":
      return "severe-thunderstorm";
    default:
      return "cloudy";
  }
}

export function weatherTempLabel(day: WeatherDay): string {
  const high = formatTemp(day.temperature, day.temperatureUnit);
  const low = formatTemp(day.templow, day.temperatureUnit);
  if (high !== "" && low !== "") return `${high}/${low}`;
  if (high !== "") return high;
  if (low !== "") return low;
  return "";
}

export function weatherTempParts(day: WeatherDay): { high: string; low: string } {
  return {
    high: formatTemp(day.temperature, day.temperatureUnit),
    low: formatTemp(day.templow, day.temperatureUnit),
  };
}

function formatTemp(value: number | undefined, unit: string): string {
  if (typeof value !== "number") return "";
  return `${Math.round(value)}${normalizeTempUnit(unit)}`;
}

function normalizeTempUnit(unit: string): string {
  if (!unit) return "";
  if (unit === "C" || unit === "F") return `°${unit}`;
  return unit;
}
