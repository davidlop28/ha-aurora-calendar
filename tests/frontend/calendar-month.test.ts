import { describe, expect, it } from "vitest";
import "../../src/calendar-month";
import { CONFIG_DEFAULTS } from "../../src/types";

function mountMonth(dayClickable: boolean) {
  const el = document.createElement("aurora-calendar-month") as any;
  el.config = { type: "x", integration: "aurora_calendar", ...CONFIG_DEFAULTS };
  el.start = new Date(2026, 5, 1);   // Mon Jun 1 2026
  el.end = new Date(2026, 5, 7);     // Sun Jun 7 2026
  el.currentMonth = 5;
  el.currentYear = 2026;
  el.events = [];
  el.weatherByDate = {};
  el.persons = [];
  el.locale = "en";
  el.dayClickable = dayClickable;
  document.body.appendChild(el);
  return el;
}

describe("calendar-month day click", () => {
  it("dispatches aurora-day-select with the clicked date when clickable", async () => {
    const el = mountMonth(true);
    await el.updateComplete;
    let detail: { date: Date } | null = null;
    el.addEventListener("aurora-day-select", (e: CustomEvent) => (detail = e.detail));

    const buttons = el.shadowRoot.querySelectorAll("button.day-num");
    expect(buttons.length).toBe(7);
    buttons[2].click(); // 3rd cell = Jun 3 2026

    expect(detail).not.toBeNull();
    expect((detail as any).date.getFullYear()).toBe(2026);
    expect((detail as any).date.getMonth()).toBe(5);
    expect((detail as any).date.getDate()).toBe(3);
  });

  it("renders plain day numbers and dispatches nothing when not clickable", async () => {
    const el = mountMonth(false);
    await el.updateComplete;
    let fired = false;
    el.addEventListener("aurora-day-select", () => (fired = true));

    expect(el.shadowRoot.querySelectorAll("button.day-num").length).toBe(0);
    expect(el.shadowRoot.querySelectorAll(".day-num").length).toBe(7);
    el.shadowRoot.querySelector(".day-num").dispatchEvent(new Event("click", { bubbles: true }));
    expect(fired).toBe(false);
  });
});
