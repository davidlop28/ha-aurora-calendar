import { describe, expect, it } from "vitest";
import "../../src/calendar-week-box";
import { CONFIG_DEFAULTS } from "../../src/types";

function mountWeek(dayClickable: boolean) {
  const days = Array.from({ length: 7 }, (_, i) => new Date(2026, 5, 1 + i)); // Jun 1..7 2026
  const el = document.createElement("aurora-calendar-week-box") as any;
  el.config = { type: "x", integration: "aurora_calendar", ...CONFIG_DEFAULTS };
  el.days = days;
  el.events = [];
  el.weatherByDate = {};
  el.persons = [];
  el.locale = "en";
  el.dayClickable = dayClickable;
  document.body.appendChild(el);
  return el;
}

describe("calendar-week-box day click", () => {
  it("dispatches aurora-day-select with the clicked date when clickable", async () => {
    const el = mountWeek(true);
    await el.updateComplete;
    let detail: { date: Date } | null = null;
    el.addEventListener("aurora-day-select", (e: CustomEvent) => (detail = e.detail));

    const buttons = el.shadowRoot.querySelectorAll("button.date-num");
    expect(buttons.length).toBe(7);
    buttons[2].click(); // Jun 3 2026

    expect(detail).not.toBeNull();
    expect((detail as any).date.getDate()).toBe(3);
    expect((detail as any).date.getMonth()).toBe(5);
  });

  it("renders plain date numbers and dispatches nothing when not clickable", async () => {
    const el = mountWeek(false);
    await el.updateComplete;
    let fired = false;
    el.addEventListener("aurora-day-select", () => (fired = true));

    expect(el.shadowRoot.querySelectorAll("button.date-num").length).toBe(0);
    expect(el.shadowRoot.querySelectorAll(".date-num").length).toBe(7);
    el.shadowRoot.querySelector(".date-num").dispatchEvent(new Event("click", { bubbles: true }));
    expect(fired).toBe(false);
  });
});
