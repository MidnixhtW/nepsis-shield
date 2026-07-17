export interface FastRule {
  season: string;
  allowed: string;
  description: string;
  themeColor: "violet" | "amber" | "emerald" | "stone";
}

export function getLiturgicalStatus(date: Date = new Date()): FastRule {
  const day = date.getDay(); // 0: Sunday, 1: Monday, ...
  const month = date.getMonth(); // 0: Jan, 11: Dec
  const dateNum = date.getDate();

  // Apostles' Fast / June-July Approximations
  if (month === 5 && dateNum >= 16) {
    return {
      season: "Apostles' Fast",
      allowed: "Fish, Wine & Oil Allowed",
      description: "A period of preparation for the Feast of SS. Peter & Paul.",
      themeColor: "violet",
    };
  }

  // Dormition Fast (August 1 - 14)
  if (month === 7 && dateNum >= 1 && dateNum <= 14) {
    if (day === 6 || day === 0) {
      return {
        season: "Dormition Fast (Weekend)",
        allowed: "Wine & Oil Allowed",
        description: "A weekend relaxation during the fast for the Mother of God.",
        themeColor: "violet",
      };
    }
    return {
      season: "Dormition Fast",
      allowed: "Strict Fast",
      description: "No meat, dairy, fish, wine, or oil.",
      themeColor: "violet",
    };
  }

  // Wednesday & Friday Fasts
  if (day === 3 || day === 5) {
    return {
      season: day === 3 ? "Wednesday Fast" : "Friday Fast",
      allowed: "Strict Fast",
      description:
        day === 3
          ? "Remembrance of the betrayal of Christ."
          : "Remembrance of the saving Passion of Christ.",
      themeColor: "stone",
    };
  }

  return {
    season: "Ordinary Time",
    allowed: "Fast-Free Day",
    description: "Glory be to God for all things! All foods allowed.",
    themeColor: "amber",
  };
}
