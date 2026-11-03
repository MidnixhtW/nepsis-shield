// Matching runs in Node against wording taken from the Orthocal calendar; no browser page needed.
import { expect, test } from "@playwright/test";
import { isWarriorSaint } from "../src/lib/warriorSaints";

test("warrior saints are recognised in the calendar's wording", () => {
  const warriors = [
    "Holy Greatmartyr, Victorybearer and Wonderworker George",
    "Greatmartyr Demetrius",
    "Synaxis of Archangel Michael and the Bodiless Powers",
    "Miracle of Archangel Michael at Colossae",
    "Greatmartyr Theodore Tyro",
    "Greatmartyr Theodore Stratelates",
    "Holy Forty Martyrs of Sebaste",
    "Rt. Blv. Great Prince Alexander Nevsky",
    "Martyrs Sergius and Bacchus in Syria",
    "Martyrs Menas, Victor and Vincent",
    "Greatmartyr Procopius of Caesarea",
    "Greatmartyr Eustathius and Martyr Theopistes",
    "Greatmartyr Artemius at Antioch",
    "Great Martyr Mercurius (ca. 259)",
    "Martyr Longinus the Centurion",
    "Our Father among the Saints Martin, Bishop of Tours (397)",
    "Rt. Blv. Dimitry Donskoy",
  ];
  for (const name of warriors) expect(isWarriorSaint(name), name).toBe(true);
});

test("saints who only share a name are not marked", () => {
  const others = [
    "Our Righteous Father Theodore the Studite (826)",
    "St John the Merciful, Patriarch of Alexandria",
    "St Procopius, Fool for Christ (1303)",
    "Martyrs Michael and Theodore of Chernigov",
    "Hieromartyr Germogen, Patriarch of Moscow",
    "Venerable George the Chozebite",
    "Synaxis of the Holy Unmercenaries",
  ];
  for (const name of others) expect(isWarriorSaint(name), name).toBe(false);
});
