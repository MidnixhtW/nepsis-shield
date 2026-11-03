// Date logic for the fasting-season journeys; runs in Node, no browser page needed.
import { expect, test } from "@playwright/test";
import {
  currentSeason,
  isoDate,
  journeyDay,
  nextSeason,
  orthodoxPascha,
  seasonsForYear,
} from "../src/lib/fastingSeasons";

const d = (iso: string) => {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(y, m - 1, day);
};

test("Orthodox Pascha matches published dates", () => {
  const known: Record<number, string> = {
    2024: "2024-05-05",
    2025: "2025-04-20",
    2026: "2026-04-12",
    2027: "2027-05-02",
    2028: "2028-04-16",
    2030: "2030-04-28",
  };
  for (const [year, iso] of Object.entries(known)) {
    expect(isoDate(orthodoxPascha(Number(year))), year).toBe(iso);
  }
});

test("Great Lent and Holy Week fall where they should in 2026", () => {
  const lent = seasonsForYear(2026, "gregorian").find((s) => s.id === "great-lent")!;
  expect(isoDate(lent.start)).toBe("2026-02-23"); // Clean Monday
  expect(lent.length).toBe(40);
  expect(journeyDay(lent, 6, "gregorian").title).toBe("Sunday of Orthodoxy");
  expect(journeyDay(lent, 34, "gregorian").title).toBe("Sunday of St. Mary of Egypt");
  // Weekend days must not offer the Prayer of St. Ephraim.
  expect(journeyDay(lent, 6, "gregorian").prayer?.source).not.toBe("Prayer of St. Ephraim the Syrian");
  expect(journeyDay(lent, 1, "gregorian").prayer?.source).toBe("Prayer of St. Ephraim the Syrian");

  const holyWeek = currentSeason(d("2026-04-10"), "gregorian")!;
  expect(holyWeek.season.id).toBe("holy-week");
  expect(journeyDay(holyWeek.season, holyWeek.index, "gregorian").title).toBe("Great and Holy Friday");
});

test("Annunciation is recognised inside Lent on both calendars", () => {
  // 2026: Lent runs Feb 23 - Apr 3, so March 25 (New Calendar) is in Lent.
  const nc = currentSeason(d("2026-03-25"), "gregorian")!;
  expect(journeyDay(nc.season, nc.index, "gregorian").title).toBe("The Annunciation");
  // Old Calendar keeps March 25 on civil April 7, which is Great Tuesday in 2026.
  const oc = currentSeason(d("2026-04-07"), "julian")!;
  expect(oc.season.id).toBe("holy-week");
  expect(journeyDay(oc.season, oc.index, "julian").title).toBe("The Annunciation");
});

test("Paschal season keeps its feasts in order", () => {
  const paschal = seasonsForYear(2026, "gregorian").find((s) => s.id === "paschal")!;
  expect(paschal.length).toBe(50);
  expect(journeyDay(paschal, 0, "gregorian").title).toContain("Pascha");
  expect(journeyDay(paschal, 39, "gregorian").title).toBe("The Ascension");
  expect(journeyDay(paschal, 49, "gregorian").title).toBe("Pentecost");
  // After the Leave-taking (day 38) the Paschal troparion is no longer offered.
  expect(journeyDay(paschal, 40, "gregorian").prayer?.source).not.toBe("Paschal troparion");
});

test("Fixed fasts shift 13 days on the Old Calendar", () => {
  const nc = seasonsForYear(2026, "gregorian").find((s) => s.id === "nativity-fast")!;
  const oc = seasonsForYear(2026, "julian").find((s) => s.id === "nativity-fast")!;
  expect([isoDate(nc.start), isoDate(nc.end), nc.length]).toEqual(["2026-11-15", "2026-12-24", 40]);
  expect([isoDate(oc.start), isoDate(oc.end)]).toEqual(["2026-11-28", "2027-01-06"]);

  const dormition = seasonsForYear(2026, "julian").find((s) => s.id === "dormition-fast")!;
  expect(isoDate(dormition.start)).toBe("2026-08-14");
  expect(journeyDay(dormition, 5, "julian").title).toBe("The Transfiguration");
});

test("Nativity Fast days land on the right feasts", () => {
  const nc = seasonsForYear(2026, "gregorian").find((s) => s.id === "nativity-fast")!;
  const titleOn = (iso: string) => {
    const found = currentSeason(d(iso), "gregorian")!;
    return journeyDay(found.season, found.index, "gregorian").title;
  };
  expect(titleOn("2026-11-21")).toBe("Entrance of the Theotokos into the Temple");
  expect(titleOn("2026-12-06")).toBe("St. Nicholas of Myra");
  expect(titleOn("2026-12-13")).toBe("Sunday of the Forefathers");
  expect(titleOn("2026-12-20")).toBe("Sunday before Nativity");
  expect(titleOn("2026-12-24")).toBe("Nativity Eve");
  expect(nc.key).toBe("nativity-fast-2026-11-15");
});

test("Apostles' Fast disappears when Pascha is late", () => {
  // Pascha 2024 was May 5: All Saints fell on June 30, after June 28, so no fast on the New Calendar.
  expect(seasonsForYear(2024, "gregorian").some((s) => s.id === "apostles-fast")).toBe(false);
  expect(seasonsForYear(2024, "julian").some((s) => s.id === "apostles-fast")).toBe(true);
});

test("Before a season, the next one is found with its countdown", () => {
  expect(currentSeason(d("2026-11-02"), "gregorian")).toBeNull();
  const upcoming = nextSeason(d("2026-11-02"), "gregorian")!;
  expect(upcoming.season.id).toBe("nativity-fast");
  expect(upcoming.daysUntil).toBe(13);
});

test("Every day of every season has content", () => {
  for (const calendar of ["gregorian", "julian"] as const) {
    for (const year of [2025, 2026, 2027]) {
      for (const season of seasonsForYear(year, calendar)) {
        for (let index = 0; index < season.length; index++) {
          const day = journeyDay(season, index, calendar);
          expect(day.title, `${season.key} day ${index}`).toBeTruthy();
          expect(day.theme.length).toBeGreaterThan(10);
          expect(day.practice.length).toBeGreaterThan(10);
        }
      }
    }
  }
});
