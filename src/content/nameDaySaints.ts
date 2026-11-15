// Saints people are most often named for, with the feast kept as their name day (Church calendar dates;
// the app shifts them for the Old Calendar). `also` holds other forms of the name people search by.
export type NameDaySaint = { name: string; month: number; day: number; also?: string[] };

export const nameDaySaints: NameDaySaint[] = [
  { name: "St. Basil the Great", month: 1, day: 1, also: ["Vasili", "Vasilios"] },
  { name: "St. Seraphim of Sarov", month: 1, day: 2 },
  { name: "St. John the Baptist (Synaxis)", month: 1, day: 7, also: ["Forerunner", "Ivan", "Juan", "Giovanni", "Jack"] },
  { name: "St. Theodosius the Great", month: 1, day: 11 },
  { name: "St. Tatiana of Rome", month: 1, day: 12, also: ["Tanya"] },
  { name: "St. Nina, Enlightener of Georgia", month: 1, day: 14, also: ["Nino"] },
  { name: "St. Sava of Serbia", month: 1, day: 14, also: ["Sabbas", "Savva"] },
  { name: "St. Anthony the Great", month: 1, day: 17, also: ["Antonios", "Tony"] },
  { name: "St. Athanasius the Great", month: 1, day: 18, also: ["Athanasios", "Thanasi"] },
  { name: "St. Maximus the Confessor", month: 1, day: 21, also: ["Max", "Maxim"] },
  { name: "Apostle Timothy", month: 1, day: 22, also: ["Tim"] },
  { name: "St. Xenia of St. Petersburg", month: 1, day: 24, also: ["Ksenia", "Xena"] },
  { name: "St. Gregory the Theologian", month: 1, day: 25, also: ["Greg", "Grigori", "Gregorios"] },
  { name: "St. Ephraim the Syrian", month: 1, day: 28, also: ["Ephrem"] },
  { name: "St. Isaac the Syrian", month: 1, day: 28 },
  { name: "St. Simeon the God-Receiver", month: 2, day: 3, also: ["Simon", "Symeon"] },
  { name: "St. Theodora the Empress", month: 2, day: 11, also: ["Dora"] },
  { name: "Great Martyr Theodore the Recruit", month: 2, day: 17, also: ["Ted", "Fyodor", "Teddy"] },
  { name: "Hieromartyr Polycarp of Smyrna", month: 2, day: 23 },
  { name: "Martyr Photini, the Samaritan Woman", month: 2, day: 26, also: ["Svetlana", "Photine"] },
  { name: "St. Raphael of Brooklyn", month: 2, day: 27 },
  { name: "St. Alexis, Man of God", month: 3, day: 17, also: ["Alexei", "Alex"] },
  { name: "St. Patrick of Ireland", month: 3, day: 17, also: ["Pat"] },
  { name: "Archangel Gabriel (Synaxis)", month: 3, day: 26, also: ["Gabe", "Gavriil", "Gabriella", "Gabrielle"] },
  { name: "St. Innocent of Alaska", month: 3, day: 31 },
  { name: "St. Mary of Egypt", month: 4, day: 1 },
  { name: "Great Martyr George", month: 4, day: 23, also: ["Georgios", "Yuri", "Jorge", "Georgia"] },
  { name: "Apostle and Evangelist Mark", month: 4, day: 25, also: ["Markos"] },
  { name: "Apostle James, son of Zebedee", month: 4, day: 30, also: ["Jacob", "Iakovos"] },
  { name: "Great Martyr Irene", month: 5, day: 5, also: ["Irini", "Irina"] },
  { name: "St. Job the Long-suffering", month: 5, day: 6 },
  { name: "Martyr Christopher", month: 5, day: 9, also: ["Chris"] },
  { name: "Apostle Simon the Zealot", month: 5, day: 10 },
  { name: "Sts. Cyril and Methodius", month: 5, day: 11, also: ["Kyrill", "Methodios"] },
  { name: "Sts. Constantine and Helen", month: 5, day: 21, also: ["Constantine", "Helen", "Helena", "Elena", "Eleni", "Costa", "Konstantin", "Ellen"] },
  { name: "Martyr Justin the Philosopher", month: 6, day: 1 },
  { name: "Apostles Bartholomew and Barnabas", month: 6, day: 11, also: ["Bartholomew", "Barnabas", "Bart"] },
  { name: "Apostle Jude, Brother of the Lord", month: 6, day: 19, also: ["Judas Thaddeus"] },
  { name: "Nativity of St. John the Baptist", month: 6, day: 24, also: ["John"] },
  { name: "Apostles Peter and Paul", month: 6, day: 29, also: ["Peter", "Paul", "Petros", "Pavlos", "Pyotr", "Pete"] },
  { name: "St. John of Shanghai and San Francisco", month: 7, day: 2, also: ["John Maximovitch"] },
  { name: "Great Martyr Kyriaki", month: 7, day: 7, also: ["Dominica", "Kiki"] },
  { name: "St. Olga, Equal-to-the-Apostles", month: 7, day: 11 },
  { name: "St. Paisios of Mount Athos", month: 7, day: 12 },
  { name: "St. Vladimir, Enlightener of Rus'", month: 7, day: 15 },
  { name: "Great Martyr Marina", month: 7, day: 17, also: ["Margaret"] },
  { name: "Prophet Elijah", month: 7, day: 20, also: ["Elias", "Ilias", "Ilya", "Eli"] },
  { name: "St. Mary Magdalene", month: 7, day: 22, also: ["Magdalena", "Madeline"] },
  { name: "Great Martyr Christina", month: 7, day: 24, also: ["Christine", "Kristina"] },
  { name: "Dormition of St. Anna", month: 7, day: 25, also: ["Anna", "Anne", "Hannah", "Ann"] },
  { name: "Martyr Paraskevi of Rome", month: 7, day: 26, also: ["Paraskeva", "Petka", "Voula", "Viv"] },
  { name: "Great Martyr Panteleimon", month: 7, day: 27 },
  { name: "Apostle Matthias", month: 8, day: 9 },
  { name: "Dormition of the Theotokos", month: 8, day: 15, also: ["Mary", "Maria", "Panagiota", "Marie", "Miriam", "Despina"] },
  { name: "Apostle Titus", month: 8, day: 25 },
  { name: "Martyrs Adrian and Natalia", month: 8, day: 26, also: ["Natalia", "Natalie", "Adrian", "Natasha"] },
  { name: "St. Moses the Black", month: 8, day: 28 },
  { name: "Righteous Zechariah and Elizabeth", month: 9, day: 5, also: ["Zachary", "Zach", "Elizabeth", "Elisabeth", "Liz", "Beth"] },
  { name: "Righteous Joachim and Anna", month: 9, day: 9, also: ["Joachim"] },
  { name: "Great Martyr Nikita", month: 9, day: 15, also: ["Niketas"] },
  { name: "Great Martyr Euphemia", month: 9, day: 16, also: ["Effie"] },
  { name: "Martyrs Sophia, Faith, Hope and Love", month: 9, day: 17, also: ["Sophia", "Sofia", "Faith", "Hope", "Love", "Vera", "Nadia", "Nadezhda", "Lyubov", "Pistis", "Elpida", "Agape"] },
  { name: "Great Martyr Eustathius", month: 9, day: 20, also: ["Eustace", "Stathis"] },
  { name: "St. Silouan the Athonite", month: 9, day: 24 },
  { name: "St. Sergius of Radonezh", month: 9, day: 25, also: ["Sergei", "Sergio", "Serge"] },
  { name: "Apostle John the Theologian", month: 9, day: 26, also: ["John", "Ioannis", "Ivan", "Juan", "Jonathan"] },
  { name: "Apostle Thomas", month: 10, day: 6, also: ["Tom", "Thomas"] },
  { name: "Righteous Abraham", month: 10, day: 9, also: ["Abe"] },
  { name: "Apostle and Evangelist Luke", month: 10, day: 18, also: ["Lukas", "Luka"] },
  { name: "Apostle James, Brother of the Lord", month: 10, day: 23, also: ["Jacob", "Iakovos", "Jim", "Jamie"] },
  { name: "Great Martyr Demetrios", month: 10, day: 26, also: ["Dimitri", "Dmitri", "Jimmy", "Demetra", "Dimitra"] },
  { name: "Synaxis of the Archangels", month: 11, day: 8, also: ["Michael", "Gabriel", "Raphael", "Mike", "Mikhail", "Michelle", "Angela", "Angelo", "Stamatios"] },
  { name: "St. Nectarios of Aegina", month: 11, day: 9, also: ["Nektarios"] },
  { name: "St. John Chrysostom", month: 11, day: 13 },
  { name: "Apostle Philip", month: 11, day: 14, also: ["Phil", "Filip"] },
  { name: "St. Gregory Palamas", month: 11, day: 14 },
  { name: "Apostle and Evangelist Matthew", month: 11, day: 16, also: ["Matt", "Matthaios"] },
  { name: "St. Alexander Nevsky", month: 11, day: 23, also: ["Alex", "Alexandra", "Sasha"] },
  { name: "Great Martyr Catherine", month: 11, day: 25, also: ["Katherine", "Kathryn", "Ekaterina", "Katerina", "Kate", "Katie"] },
  { name: "Apostle Andrew the First-Called", month: 11, day: 30, also: ["Andreas", "Andrei", "Andy", "Andrea"] },
  { name: "St. Porphyrios of Kavsokalyvia", month: 12, day: 2 },
  { name: "Great Martyr Barbara", month: 12, day: 4 },
  { name: "St. Nicholas the Wonderworker", month: 12, day: 6, also: ["Nick", "Nikolai", "Nikolaos", "Nicole", "Colin", "Klaus"] },
  { name: "St. Spyridon the Wonderworker", month: 12, day: 12, also: ["Spiro", "Spyros"] },
  { name: "St. Herman of Alaska", month: 12, day: 13 },
  { name: "Prophet Daniel", month: 12, day: 17, also: ["Dan", "Danny", "Daniela"] },
  { name: "Hieromartyr Ignatius of Antioch", month: 12, day: 20 },
  { name: "St. John of Kronstadt", month: 12, day: 20 },
  { name: "Great Martyr Anastasia", month: 12, day: 22, also: ["Stacy", "Nastya"] },
  { name: "Protomartyr Stephen", month: 12, day: 27, also: ["Steven", "Stefan", "Stephanie", "Steve", "Stavros"] },
];

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z ]+/g, " ").trim();
}

/** Saints whose name, or a common form of it, starts with a word in the query. Best matches first. */
export function searchNameDaySaints(query: string, extra: NameDaySaint[] = [], limit = 6): NameDaySaint[] {
  const q = normalize(query).replace(/^(st|saint) /, "");
  if (q.length < 2) return [];
  const scored = [...nameDaySaints, ...extra]
    .map((saint) => {
      const names = [saint.name, ...(saint.also ?? [])].map(normalize);
      const words = names.flatMap((name) => name.split(" "));
      const score = names.some((name) => name === q) ? 3 : words.some((word) => word === q) ? 2 : words.some((word) => word.startsWith(q)) ? 1 : names.some((name) => name.includes(q)) ? 0.5 : 0;
      return { saint, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.saint.month - b.saint.month || a.saint.day - b.saint.day);
  return scored.slice(0, limit).map((item) => item.saint);
}
