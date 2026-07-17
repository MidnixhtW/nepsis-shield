export interface FastRule {
  season: string;
  allowed: string;
  description: string;
  themeColor: "violet" | "amber" | "emerald" | "stone";
}

export function getLiturgicalStatus(date: Date = new Date()): FastRule {
  const day = date.getDay();
  const month = date.getMonth();
  const dateNum = date.getDate();

  if (month === 5 && dateNum >= 16) {
    return {
      season: "Apostles' Fast",
      allowed: "Fish, Wine & Oil Allowed",
      description: "A period of preparation for the Feast of SS. Peter & Paul.",
      themeColor: "violet",
    };
  }

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
