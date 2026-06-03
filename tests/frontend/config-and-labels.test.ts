import { describe, expect, it } from "vitest";
import { CONFIG_DEFAULTS } from "../../src/types";

describe("config defaults", () => {
  it("enables tap_day_opens_day_view by default", () => {
    expect(CONFIG_DEFAULTS.tap_day_opens_day_view).toBe(true);
  });
});
