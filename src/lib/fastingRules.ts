export interface FastingRule {
  allowed: string;
  description: string;
  severity: "none" | "moderate" | "strict";
}

export function getDailyFastingRule(date: Date = new Date()): FastingRule {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const month = date.getMonth(); // 0 = January, 1 = February, ..., 11 = December
  const dayOfMonth = date.getDate();

  // 1. Great Lent & Holy Week (Approximated or placeholder - ideally hooked to Paschal calculator)
  // For standard static dates, we will handle the fixed fasts below:

  // 2. Dormition Fast (August 1 - August 14)
  if (month === 7 && dayOfMonth >= 1 && dayOfMonth <= 14) {
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      return { allowed: "Wine & Oil", description: "Dormition Fast (Weekend Relaxation)", severity: "moderate" };
    }
    if (dayOfMonth === 6) { // Transfiguration (August 6)
      return { allowed: "Fish, Wine & Oil", description: "Feast of the Transfiguration", severity: "moderate" };
    }
    return { allowed: "Strict Fast (No Meat, Dairy, Fish, Wine, or Oil)", description: "Dormition Fast", severity: "strict" };
  }

  // 3. Nativity Fast / Advent (November 15 - December 24)
  if ((month === 10 && dayOfMonth >= 15) || (month === 11 && dayOfMonth <= 24)) {
    // Weekends and Tuesdays/Thursdays often allow Wine & Oil, sometimes Fish
    if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6 || dayOfWeek === 0) {
      return { allowed: "Wine & Oil", description: "Nativity Fast (Relaxation)", severity: "moderate" };
    }
    return { allowed: "Strict Fast (No Meat, Dairy, Fish, Wine, or Oil)", description: "Nativity Fast", severity: "strict" };
  }

  // 4. Standard Weekly Fasts (Wednesdays and Fridays outside fast-free weeks)
  if (dayOfWeek === 3 || dayOfWeek === 5) {
    return {
      allowed: "Strict Fast (No Meat, Dairy, Fish, Wine, or Oil)",
      description: dayOfWeek === 3 ? "Wednesday Weekly Remembrance of Christ's Betrayal" : "Friday Weekly Remembrance of Christ's Crucifixion",
      severity: "strict",
    };
  }

  // 5. Normal Day (No Fast)
  return {
    allowed: "Fast-Free Day",
    description: "All foods allowed. Live with thanksgiving!",
    severity: "none",
  };
}
