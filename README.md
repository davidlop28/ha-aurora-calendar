# Aurora Calendar

![Aurora Calendar](https://raw.githubusercontent.com/davidlop28/ha-aurora-calendar/main/assets/banner.png)

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-davidlop28-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/davidlop28)

A feature-rich family calendar for Home Assistant — bundled as a single integration that ships its own Lovelace card. Displays Month, Week, Biweek, Today, and Next 7 Days views with per-person color coding, weather integration, background customization, and a built-in visual editor.

---

## Features

- **Multiple views** — Month, Week, Biweek, Today, Next 7 Days
- **Per-person calendar colors** — automatically derived from your calendar entities or manually overridden
- **Weather overlay** — daily forecast icons and temperatures in the Month view
- **Background customization** — static image, HA media, or glass effect
- **Visual editor** — configure everything from the Lovelace UI without editing YAML
- **Time grid** — configurable visible hour range in week views
- **Localization** — adapts to your HA locale (10 languages bundled)

---

## Requirements

- Home Assistant **2024.1** or later
- One or more calendar entities already configured in HA (Google Calendar, Local Calendar, CalDAV, etc.)

---

## Installation

### Via HACS (recommended)

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=davidlop28&repository=ha-aurora-calendar&category=integration)

1. Click the badge above (or open **HACS** → **Integrations** → **Explore & Download Repositories** and search **Aurora Calendar**)
2. Download the integration
3. Restart Home Assistant
4. Go to **Settings → Devices & Services → Add Integration**, search **Aurora Calendar**, and follow the setup flow

The card is bundled with the integration and registers itself automatically — no separate Lovelace resource setup is required.

### Manual

1. Download the latest release zip
2. Copy `custom_components/aurora_calendar/` into your HA `config/custom_components/` folder
3. Restart Home Assistant
4. Add the integration via **Settings → Devices & Services**

---

## Configuration

Add the card to any dashboard. The easiest way is to use the built-in **visual editor** — click **Add Card**, search for **Aurora Calendar**, and configure it from there.

### Minimal YAML

```yaml
type: custom:aurora-calendar-card
integration: aurora_calendar
```

### Full YAML reference

```yaml
type: custom:aurora-calendar-card
integration: aurora_calendar        # Required — your integration ID

# General
week_start: sunday                  # sunday | monday

# Layout
height_mode: auto                   # auto | ha | fixed | natural
fixed_height: "640px"               # Only used when height_mode is "fixed"

# Event display
dim_past_events: true
show_event_time: true
time_format: 12h                    # 12h | 24h
keep_all_day_events_visible: false
show_calendar_grid_lines: true
event_font_size: 14                 # px
event_font_family: inherit          # Any CSS font family

# Time grid (week / biweek / today views)
visible_start_hour: 6               # 0–23
visible_end_hour: 22                # 0–23

# Background
glass_background: false
card_opacity: 100                   # 0–100
background_image: ""                # URL to a static image
background_image_opacity: 35        # 0–100
background_blur: 0                  # 0–20 px
background_media:                   # Stream from HA media (optional)
  media_content_id: media-source://media_source/local/my-photo.jpg
  media_content_type: image/jpeg

# Weather
show_weather: true
weather_icon_style: static          # static | animated
```

### Configuration options

| Option | Type | Default | Description |
|---|---|---|---|
| `integration` | string | **required** | Your Aurora Calendar integration ID |
| `week_start` | `sunday` \| `monday` | `sunday` | First day of the week |
| `height_mode` | `auto` \| `ha` \| `fixed` \| `natural` | `auto` | How card height is determined |
| `fixed_height` | string | `640px` | Card height when `height_mode` is `fixed` |
| `dim_past_events` | boolean | `true` | Visually dim events that have already passed |
| `show_event_time` | boolean | `true` | Show start time on event chips |
| `time_format` | `12h` \| `24h` | `12h` | Clock format for event times |
| `keep_all_day_events_visible` | boolean | `false` | Always show all-day events even when scrolled |
| `show_calendar_grid_lines` | boolean | `true` | Show hour lines in week/day views |
| `event_font_size` | number | `14` | Event chip font size in px |
| `event_font_family` | string | `inherit` | Event chip font family |
| `visible_start_hour` | number | `6` | First visible hour in time-grid views (0–23) |
| `visible_end_hour` | number | `22` | Last visible hour in time-grid views (0–23) |
| `glass_background` | boolean | `false` | Enable frosted-glass card background |
| `card_opacity` | number | `100` | Overall card opacity (0–100) |
| `background_image` | string | `""` | URL for a static background image |
| `background_image_opacity` | number | `35` | Background image opacity (0–100) |
| `background_blur` | number | `0` | Background image blur in px (0–20) |
| `background_media` | object | `null` | HA media source for background image |
| `show_weather` | boolean | `true` | Show weather forecast in Month view |
| `weather_icon_style` | `static` \| `animated` | `static` | Weather icon style |

---

## Development

```bash
# Install dependencies
npm install

# Build once
npm run build

# Watch for changes
npm run dev
```

The compiled output goes to `custom_components/aurora_calendar/aurora-calendar-card.js` and is auto-served by the integration when installed.

---

## Support

If Aurora Calendar makes your home a little brighter, you can support its development:

<a href="https://buymeacoffee.com/davidlop28" target="_blank">
  <img src="https://raw.githubusercontent.com/davidlop28/ha-aurora-calendar/main/assets/bmc-qr.png" alt="Buy Me A Coffee" width="180">
</a>

[buymeacoffee.com/davidlop28](https://buymeacoffee.com/davidlop28)

---

## License

[MIT](LICENSE)
