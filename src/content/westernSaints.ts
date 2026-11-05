// Saints of the West from before the Schism of 1054: Orthodox saints, honoured East and West.
// Feasts are church dates as kept on the Orthodox calendar (the app turns them into civil dates).

export type WesternSaint = { name: string; month: number; day: number; region: string; line: string; search: string };

export const WESTERN_SAINTS: WesternSaint[] = [
  { name: "Saint Genevieve of Paris", month: 1, day: 3, region: "Gaul", line: "Her prayer and fasting held Paris steady when Attila's army approached.", search: "Genevieve" },
  { name: "Saint Brigid of Kildare", month: 2, day: 1, region: "Ireland", line: "Abbess known for giving away everything, even her father's sword, to the poor.", search: "Brigid" },
  { name: "Saint Scholastica", month: 2, day: 10, region: "Italy", line: "Sister of St Benedict; her prayer brought a storm so they could keep talking of God.", search: "Scholastica" },
  { name: "Saint Leo the Great, Pope of Rome", month: 2, day: 18, region: "Rome", line: "His letter on the two natures of Christ was hailed at the Council of Chalcedon.", search: "Leo Rome" },
  { name: "Saint David of Wales", month: 3, day: 1, region: "Wales", line: "\"Do the little things,\" he told his monks before he died.", search: "David Wales" },
  { name: "Saint Gregory the Dialogist, Pope of Rome", month: 3, day: 12, region: "Rome", line: "Fed the poor of Rome, sent missionaries to England, and gave us the Presanctified Liturgy.", search: "Gregory Dialogist" },
  { name: "Saint Benedict of Nursia", month: 3, day: 14, region: "Italy", line: "Father of Western monks; his Rule teaches prayer and work in a steady rhythm.", search: "Benedict Nursia" },
  { name: "Saint Patrick of Ireland", month: 3, day: 17, region: "Ireland", line: "Taken to Ireland as a slave, he escaped, then went back to bring it the Gospel.", search: "Patrick Ireland" },
  { name: "Saint Edward the Martyr", month: 3, day: 18, region: "England", line: "Young King of England, killed by treachery and honoured as a martyr.", search: "Edward Martyr" },
  { name: "Saint Cuthbert of Lindisfarne", month: 3, day: 20, region: "England", line: "Monk and bishop who prayed through the night standing in the cold North Sea.", search: "Cuthbert" },
  { name: "Saint Augustine of Canterbury", month: 5, day: 26, region: "England", line: "Sent by St Gregory to the English; first Archbishop of Canterbury.", search: "Augustine Canterbury" },
  { name: "Saint Bede the Venerable", month: 5, day: 27, region: "England", line: "Monk and scholar who wrote the history of the English Church.", search: "Bede" },
  { name: "Saint Columba of Iona", month: 6, day: 9, region: "Scotland", line: "Left Ireland as a pilgrim for Christ and founded the monastery of Iona.", search: "Columba Iona" },
  { name: "Saint Alban, Protomartyr of Britain", month: 6, day: 22, region: "Britain", line: "A pagan who hid a hunted priest, became a Christian, and died in the priest's place.", search: "Alban" },
  { name: "Saint Laurence the Archdeacon", month: 8, day: 10, region: "Rome", line: "Asked to hand over the Church's treasure, he brought the poor: \"These are the treasure.\"", search: "Laurence" },
  { name: "Saint Irenaeus of Lyons", month: 8, day: 23, region: "Gaul", line: "Bishop and teacher who defended the faith handed down from the Apostles.", search: "Irenaeus" },
  { name: "Saint Aidan of Lindisfarne", month: 8, day: 31, region: "England", line: "Walked everywhere so he could stop and speak with anyone on the road.", search: "Aidan" },
  { name: "Saint Martin of Tours", month: 11, day: 12, region: "Gaul", line: "A soldier who cut his cloak in half for a freezing beggar, later a bishop.", search: "Martin Tours" },
  { name: "Saint Hilda of Whitby", month: 11, day: 17, region: "England", line: "Abbess whose wisdom was sought by kings and ordinary people alike.", search: "Hilda" },
  { name: "Saint Cecilia of Rome", month: 11, day: 22, region: "Rome", line: "Martyr of Rome, remembered for singing to God in her heart.", search: "Cecilia" },
  { name: "Saint Clement of Rome", month: 11, day: 25, region: "Rome", line: "Bishop of Rome in the time of the Apostles; his letter to Corinth calls for peace.", search: "Clement Rome" },
  { name: "Saint Ambrose of Milan", month: 12, day: 7, region: "Italy", line: "Bishop who stood up to an emperor and baptised St Augustine.", search: "Ambrose Milan" },
];

export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
