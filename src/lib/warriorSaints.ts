// Saints who were soldiers or protectors, so Today can mark them for those who serve.
// Patterns follow Orthocal's wording (e.g. "Greatmartyr Theodore Tyro") and avoid bare first names,
// since many saints share names (Theodore the Studite, John the Merciful) without being soldiers.
// Kept free of app imports so it can be tested directly.

const patterns: RegExp[] = [
  /archangel michael|michael the archangel/i,
  /(great\s*-?\s*martyr|victory\s*-?\s*bearer)[^|]*\bgeorge\b/i,
  /great\s*-?\s*martyr\s+demetrius|demetrius (of thessalonica|the myrrh)/i,
  /theodore (the )?(tyro|recruit)/i,
  /theodore (the )?(stratelates|general)/i,
  /\bmartyrs?\s+menas\b/i,
  /sergius and bacchus/i,
  /great\s*-?\s*martyr\s+procopius/i,
  /great\s*-?\s*martyr\s+eustathius|eustathius placidas/i,
  /great\s*-?\s*martyr\s+artemius/i,
  /(great\s*-?\s*)?martyr\s+mercurius/i,
  /forty martyrs|40 martyrs/i,
  /longinus the centurion/i,
  /cornelius the centurion/i,
  /andrew (stratelates|the general)/i,
  /\bmartyr varus\b/i,
  /martin,? (bishop )?of tours/i,
  /john the (warrior|soldier)/i,
  /alexander nevsky/i,
  /donskoy/i,
  /ushakov/i,
];

export function isWarriorSaint(commemoration: string) {
  return patterns.some((pattern) => pattern.test(commemoration));
}
