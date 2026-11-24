// The Western Rite Mass, part by part, as Western Rite Orthodox parishes celebrate it (the Liturgy of St. Tikhon or the
// Liturgy of St. Gregory). Written for this app; parishes differ in details, so the guide follows the common shape.

export type MassPart = { title: string; body: string };
export type MassSection = { title: string; parts: MassPart[] };

export const WESTERN_MASS: MassSection[] = [
  {
    title: "Preparation",
    parts: [
      { title: "Asperges", body: "On Sundays the priest sprinkles the people with holy water while Psalm 51 is sung: \"Thou shalt sprinkle me with hyssop.\" It recalls our baptism." },
      { title: "Prayers at the foot of the altar", body: "The priest and servers say Psalm 43 and a confession of sins before going up to the altar." },
      { title: "Introit", body: "An entrance chant from the Psalms that changes with the day and sets its theme." },
      { title: "Kyrie", body: "\"Lord, have mercy. Christ, have mercy. Lord, have mercy.\" The same cry as the Byzantine litanies, kept in Greek in many parishes." },
      { title: "Gloria", body: "\"Glory be to God on high.\" The hymn of the angels at Bethlehem, left out in Advent and Lent." },
      { title: "Collect", body: "The prayer of the day, which gathers the prayers of the people into one." },
    ],
  },
  {
    title: "The Word",
    parts: [
      { title: "Epistle", body: "A reading from the Apostles, read toward the people." },
      { title: "Gradual and Alleluia", body: "Psalm verses sung between the readings. In Lent the Alleluia gives way to the Tract." },
      { title: "Gospel", body: "Read with candles and incense. All stand." },
      { title: "Sermon", body: "The priest preaches on the readings." },
      { title: "Creed", body: "The Nicene Creed, as the Council of Constantinople gave it, without the Filioque." },
    ],
  },
  {
    title: "The Offering",
    parts: [
      { title: "Offertory", body: "The bread and wine are brought to the altar and offered to God." },
      { title: "Sursum corda", body: "\"Lift up your hearts.\" \"We lift them up unto the Lord.\" The same call that opens the Anaphora in the East." },
      { title: "Sanctus", body: "\"Holy, holy, holy, Lord God of hosts.\" The hymn of the Seraphim, with \"Blessed is he that cometh.\"" },
      { title: "The Canon", body: "The great prayer of offering. It includes the words of Christ at the Last Supper and, as the Orthodox Church requires, the Epiclesis, the prayer that the Holy Spirit change the gifts into the Body and Blood of Christ." },
    ],
  },
  {
    title: "Communion",
    parts: [
      { title: "The Lord's Prayer", body: "Said or sung by all before Communion." },
      { title: "Agnus Dei", body: "\"O Lamb of God, that takest away the sins of the world, have mercy upon us.\"" },
      { title: "Communion", body: "Orthodox Christians who have prepared with prayer, fasting and confession come forward. Others may come for a blessing if the parish does so." },
      { title: "Postcommunion", body: "A prayer of thanksgiving that changes with the day." },
      { title: "Dismissal and blessing", body: "\"Ite, missa est.\" \"Go, the Mass is ended.\" The priest blesses the people." },
      { title: "Last Gospel", body: "In many parishes the priest reads John 1:1 to 14, \"In the beginning was the Word.\"" },
    ],
  },
];
