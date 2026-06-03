import { describe, expect, it } from "vitest";
import { CONFIG_DEFAULTS } from "../../src/types";
import { viewModeLabel, t } from "../../src/localize";

describe("config defaults", () => {
  it("enables tap_day_opens_day_view by default", () => {
    expect(CONFIG_DEFAULTS.tap_day_opens_day_view).toBe(true);
  });
});

describe("Day label rename", () => {
  it("renders 'Day' for the Today view in English", () => {
    expect(viewModeLabel("en", "Today")).toBe("Day");
  });

  it("renders the localized 'Day' label", () => {
    expect(viewModeLabel("es", "Today")).toBe("Día");
    expect(viewModeLabel("de", "Today")).toBe("Tag");
    expect(viewModeLabel("fr", "Today")).toBe("Jour");
  });

  it("exposes the new tap-day strings", () => {
    expect(t("en", "tapDayAria")).toBe("Open day view");
    expect(t("en", "tapDayOpensDayView")).toBe("Tap day to open day view");
    expect(t("en", "tapDayOpensDayViewDesc")).not.toBe("tapDayOpensDayViewDesc");
  });
});
