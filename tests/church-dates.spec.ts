// Memorial, name-day, and feast-greeting dates; runs in Node, no browser page needed.
import { expect, test } from "@playwright/test";
import { isoDate } from "../src/lib/fastingSeasons";
import { feastGreeting } from "../src/lib/feastGreetings";
import { memorialsFor, soulSaturdays } from "../src/lib/memorials";
import { nameDayStatus, nextNameDay } from "../src/lib/nameDay";

const d = (iso: string) => {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(y, m - 1, day);
};

test("memorials count the day of repose as the first day", () => {
  const list = memorialsFor("Helen", "2026-11-02", d("2026-11-02"), 400).map((m) => `${m.label} ${isoDate(m.date)}`);
  expect(list).toEqual(["3rd day 2026-11-04", "9th day 2026-11-10", "40th day 2026-12-11", "1 year 2027-11-02"]);
});

test("memorials ignore missing or invalid repose dates", () => {
  expect(memorialsFor("Helen", undefined, d("2026-11-02"), 30)).toEqual([]);
  expect(memorialsFor("Helen", "not-a-date", d("2026-11-02"), 30)).toEqual([]);
});

test("Saturdays of Souls move with Pascha", () => {
  // Pascha 2027 is May 2: Meatfare Saturday is March 6, and the Saturday before Pentecost is June 19.
  const dates = soulSaturdays(d("2027-01-01"), 365).map((m) => isoDate(m.date));
  expect(dates).toEqual(["2027-03-06", "2027-03-27", "2027-04-03", "2027-04-10", "2027-06-19"]);
});

test("name days follow the chosen calendar", () => {
  const nicholas = { name: "St. Nicholas", month: 12, day: 6 };
  expect(nameDayStatus(nicholas, d("2026-12-06"), "gregorian")).toBe("today");
  expect(nameDayStatus(nicholas, d("2026-12-05"), "gregorian")).toBe("eve");
  expect(nameDayStatus(nicholas, d("2026-12-06"), "julian")).toBeNull();
  expect(nameDayStatus(nicholas, d("2026-12-19"), "julian")).toBe("today");
  expect(isoDate(nextNameDay(nicholas, d("2026-12-07"), "gregorian"))).toBe("2027-12-06");
  // Old Calendar St. Basil (January 1) falls on civil January 14.
  expect(isoDate(nextNameDay({ name: "St. Basil", month: 1, day: 1 }, d("2026-12-20"), "julian"))).toBe("2027-01-14");
});

test("feast greetings appear on the right days", () => {
  expect(feastGreeting(d("2026-12-25"), "gregorian")?.greeting).toBe("Christ is born!");
  expect(feastGreeting(d("2026-12-25"), "julian")).toBeNull();
  expect(feastGreeting(d("2027-01-07"), "julian")?.feast).toBe("The Nativity of Christ");
  expect(feastGreeting(d("2027-01-06"), "gregorian")?.greeting).toBe("Christ is baptized!");
  expect(feastGreeting(d("2027-05-02"), "gregorian")?.feast).toBe("Pascha");
  expect(feastGreeting(d("2027-06-09"), "gregorian")?.greeting).toBe("Christ is risen!"); // the Leave-taking
  expect(feastGreeting(d("2027-06-10"), "gregorian")?.feast).toBe("The Ascension");
  expect(feastGreeting(d("2026-11-03"), "gregorian")).toBeNull();
});

test("a saying of the Fathers changes each day and cycles through all of them", async () => {
  const { SAYINGS, sayingForDay } = await import("../src/content/fathersSayings");
  const seen = new Set<string>();
  for (let i = 0; i < SAYINGS.length; i++) seen.add(sayingForDay(new Date(2027, 0, 1 + i)).text);
  expect(seen.size).toBe(SAYINGS.length);
  expect(sayingForDay(new Date(2026, 10, 3)).text).not.toBe(sayingForDay(new Date(2026, 10, 4)).text);
});

test("the home-screen widget gets two weeks of days", async () => {
  const { buildWidgetDays } = await import("../src/lib/widgetSnapshot");
  const days = buildWidgetDays(d("2026-11-20"), "gregorian", "Fish, wine and oil are allowed");
  expect(days).toHaveLength(14);
  expect(days[0]).toMatchObject({ date: "2026-11-20", headline: "Nativity Fast · Day 6 of 40", detail: "Fish, wine and oil are allowed" });
  expect(days[1].detail).toBe("");
  const christmas = buildWidgetDays(d("2026-12-25"), "gregorian")[0];
  expect(christmas.headline).toBe("Christ is born! Glorify Him!");
  expect(buildWidgetDays(d("2026-11-10"), "gregorian")[0].headline).toBe("Nativity Fast begins in 5 days");
});

test("the Church Year theme follows the season", async () => {
  const { liturgicalSeason } = await import("../src/lib/liturgicalSeason");
  const day = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12);
  expect(liturgicalSeason(day(2026, 11, 9), "gregorian")).toBe("ordinary");
  expect(liturgicalSeason(day(2026, 11, 21), "gregorian")).toBe("theotokos");
  expect(liturgicalSeason(day(2026, 11, 30), "gregorian")).toBe("nativity-fast");
  expect(liturgicalSeason(day(2026, 12, 25), "gregorian")).toBe("nativity");
  expect(liturgicalSeason(day(2027, 3, 15), "gregorian")).toBe("lent");
  expect(liturgicalSeason(day(2027, 3, 25), "gregorian")).toBe("theotokos");
  expect(liturgicalSeason(day(2027, 5, 2), "gregorian")).toBe("pascha");
  expect(liturgicalSeason(day(2027, 6, 20), "gregorian")).toBe("pentecost");
  expect(liturgicalSeason(day(2027, 1, 7), "julian")).toBe("nativity");
});
