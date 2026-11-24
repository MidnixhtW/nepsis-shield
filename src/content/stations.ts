// The Way of the Cross: fourteen stations, as kept in Western Rite Orthodox parishes and by Catholics. The versicle and
// response are the traditional ones (public domain). Each meditation is a short line of the app's own, drawn from the
// Scripture named; five stations come from holy tradition rather than the Gospels, and say so.

export const STATIONS_VERSICLE = "We adore thee, O Christ, and we bless thee.";
export const STATIONS_RESPONSE = "Because by thy holy Cross thou hast redeemed the world.";
export const STATIONS_CLOSE = "Lord Jesus Christ, Son of God, have mercy on me, a sinner.";

export type Station = { title: string; source: string; meditation: string };

export const STATIONS: Station[] = [
  { title: "Jesus is condemned to death", source: "Luke 23:13-25", meditation: "The innocent One stands silent before Pilate. Teach me to bear unjust judgment without hatred." },
  { title: "Jesus takes up His Cross", source: "John 19:16-17", meditation: "He takes the wood willingly. Help me take up the cross of this day without complaint." },
  { title: "Jesus falls the first time", source: "Holy tradition", meditation: "The Creator lies in the dust under our burden. When I fall, let me rise again with Thee." },
  { title: "Jesus meets His Mother", source: "Holy tradition; Luke 2:35", meditation: "A sword pierces her soul, as Simeon foretold. Through her prayers, keep me near Thy Cross." },
  { title: "Simon of Cyrene helps carry the Cross", source: "Mark 15:21", meditation: "A stranger is pressed into service and shares the load. Make me ready to carry another's burden." },
  { title: "A woman wipes the face of Jesus", source: "Holy tradition", meditation: "One act of mercy in the crowd. Let me not pass by the suffering face of Christ in my neighbor." },
  { title: "Jesus falls the second time", source: "Holy tradition", meditation: "Weakness again, and still He goes on. Give me patience with my own repeated falls." },
  { title: "Jesus speaks to the women of Jerusalem", source: "Luke 23:27-31", meditation: "Even on the road to death He thinks of others. Turn my tears to true repentance." },
  { title: "Jesus falls the third time", source: "Holy tradition", meditation: "The last of His strength is spent for us. When I have nothing left, be my strength." },
  { title: "Jesus is stripped of His garments", source: "John 19:23-24", meditation: "They divide His clothing and cast lots. Strip from me pride and every false covering." },
  { title: "Jesus is nailed to the Cross", source: "Luke 23:33-34", meditation: "Father, forgive them. Give me a heart that forgives those who wound me." },
  { title: "Jesus dies on the Cross", source: "John 19:28-30", meditation: "It is finished. By Thy death Thou hast trampled down death. Remember me in Thy kingdom." },
  { title: "Jesus is taken down from the Cross", source: "John 19:38", meditation: "Joseph asks boldly for the body of the Lord. Give me courage to stand with Thee openly." },
  { title: "Jesus is laid in the tomb", source: "John 19:39-42", meditation: "The Life of all rests in the grave and awaits the third day. Keep my hope fixed on the Resurrection." },
];
