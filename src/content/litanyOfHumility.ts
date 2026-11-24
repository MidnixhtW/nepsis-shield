// The Litany of Humility, attributed to Rafael Cardinal Merry del Val (1865-1930). A Catholic devotion that many
// Orthodox Christians also pray. Public domain. Each line is said with its response.

const DELIVER = "deliver me, O Jesus.";
const GRANT = "Jesus, grant me the grace to desire it.";

const desires = ["esteemed", "loved", "extolled", "honored", "praised", "preferred to others", "consulted", "approved"];
const fears = ["humiliated", "despised", "suffering rebukes", "calumniated", "forgotten", "ridiculed", "wronged", "suspected"];

export const litanyOfHumility: string[] = [
  "O Jesus, meek and humble of heart, hear me.",
  ...desires.map((d) => `From the desire of being ${d}, ${DELIVER}`),
  ...fears.map((f) => `From the fear of ${f === "suffering rebukes" ? f : `being ${f}`}, ${DELIVER}`),
  `That others may be loved more than I, ${GRANT}`,
  `That others may be esteemed more than I, ${GRANT}`,
  `That in the opinion of the world others may increase and I may decrease, ${GRANT}`,
  `That others may be chosen and I set aside, ${GRANT}`,
  `That others may be praised and I unnoticed, ${GRANT}`,
  `That others may be preferred to me in everything, ${GRANT}`,
  `That others may become holier than I, provided that I may become as holy as I should, ${GRANT}`,
];

export const LITANY_OF_HUMILITY_NOTE =
  "A Catholic devotion from the early 1900s, attributed to Cardinal Merry del Val. Many Orthodox Christians pray it too.";
