// The traditional greetings exchanged on the great feasts, for the days they are used.
// Kept free of app imports so it can be tested directly.
import { churchDate, daysBetween, orthodoxPascha, type ChurchCalendar } from "./fastingSeasons";

export type FeastGreeting = { feast: string; greeting: string; response: string };

const PASCHA: Omit<FeastGreeting, "feast"> = { greeting: "Christ is risen!", response: "Indeed He is risen!" };

export function feastGreeting(day: Date, calendar: ChurchCalendar): FeastGreeting | null {
  const fromPascha = daysBetween(orthodoxPascha(day.getFullYear()), day);
  // The Paschal greeting is used from Pascha through the Leave-taking (day 38).
  if (fromPascha === 0) return { feast: "Pascha", ...PASCHA };
  if (fromPascha > 0 && fromPascha <= 38) return { feast: "Paschal season", ...PASCHA };
  if (fromPascha === 39) return { feast: "The Ascension", greeting: "Christ is ascended!", response: "From earth to heaven!" };

  const church = churchDate(day, calendar);
  const month = church.getMonth() + 1;
  const date = church.getDate();
  if (month === 12 && date >= 25) {
    return { feast: date === 25 ? "The Nativity of Christ" : "Nativity season", greeting: "Christ is born!", response: "Glorify Him!" };
  }
  if (month === 1 && date >= 6 && date <= 14) {
    return { feast: date === 6 ? "Theophany" : "Theophany season", greeting: "Christ is baptized!", response: "In the river Jordan!" };
  }
  return null;
}
