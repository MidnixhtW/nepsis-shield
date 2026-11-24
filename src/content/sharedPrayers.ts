// Prayers from the undivided Church that Catholics and Orthodox both pray, and Western prayers kept by Western Rite
// Orthodox parishes and by Catholics. Texts are public domain (ancient texts, King James and Prayer Book English).

export type SharedPrayer = { id: string; title: string; origin: string; lines: string[] };

export const SHARED_PRAYERS: SharedPrayer[] = [
  {
    id: "sub-tuum",
    title: "Beneath your compassion",
    origin: "The oldest known prayer to the Theotokos, from about the 3rd century.",
    lines: [
      "Beneath your compassion we take refuge, O Theotokos. Do not despise our petitions in time of trouble, but deliver us from dangers, only pure, only blessed one.",
    ],
  },
  {
    id: "st-ephrem",
    title: "Prayer of St. Ephrem the Syrian",
    origin: "4th century. Prayed in Great Lent by Orthodox and Eastern Catholics.",
    lines: [
      "O Lord and Master of my life, take from me the spirit of sloth, despair, lust of power, and idle talk.",
      "But give rather the spirit of chastity, humility, patience, and love to Thy servant.",
      "Yea, O Lord and King, grant me to see my own transgressions, and not to judge my brother, for blessed art Thou unto ages of ages. Amen.",
    ],
  },
  {
    id: "gladsome-light",
    title: "O Gladsome Light",
    origin: "An evening hymn from about the 3rd century, sung at Vespers East and West.",
    lines: [
      "O gladsome Light of the holy glory of the immortal Father, heavenly, holy, blessed Jesus Christ!",
      "Now that we have come to the setting of the sun and behold the light of evening, we praise God: Father, Son, and Holy Spirit.",
      "For meet it is at all times to worship Thee with voices of praise, O Son of God and Giver of life; therefore all the world glorifies Thee.",
    ],
  },
  {
    id: "te-deum",
    title: "We praise thee, O God (Te Deum)",
    origin: "A Latin hymn of the 4th century, linked by tradition with St. Ambrose and St. Augustine. Prayer Book English, shortened.",
    lines: [
      "We praise thee, O God: we acknowledge thee to be the Lord.",
      "All the earth doth worship thee: the Father everlasting.",
      "To thee all Angels cry aloud: the Heavens, and all the Powers therein.",
      "To thee Cherubin and Seraphin: continually do cry,",
      "Holy, Holy, Holy: Lord God of Sabaoth;",
      "Heaven and earth are full of the Majesty: of thy glory.",
      "The glorious company of the Apostles: praise thee.",
      "The goodly fellowship of the Prophets: praise thee.",
      "The noble army of Martyrs: praise thee.",
      "The holy Church throughout all the world: doth acknowledge thee;",
      "The Father: of an infinite Majesty; thine honourable, true: and only Son; also the Holy Ghost: the Comforter.",
      "Thou art the King of Glory: O Christ. Thou art the everlasting Son: of the Father.",
      "When thou tookest upon thee to deliver man: thou didst not abhor the Virgin's womb.",
      "When thou hadst overcome the sharpness of death: thou didst open the Kingdom of Heaven to all believers.",
      "Thou sittest at the right hand of God: in the Glory of the Father. We believe that thou shalt come: to be our Judge.",
      "We therefore pray thee, help thy servants: whom thou hast redeemed with thy precious blood.",
      "Make them to be numbered with thy Saints: in glory everlasting.",
      "O Lord, in thee have I trusted: let me never be confounded.",
    ],
  },
  {
    id: "gloria",
    title: "Glory to God in the highest (Gloria)",
    origin: "A hymn of the 4th century or earlier: the Great Doxology at Matins in the East, the Gloria at Mass in the West.",
    lines: [
      "Glory be to God on high, and in earth peace, good will towards men.",
      "We praise thee, we bless thee, we worship thee, we glorify thee, we give thanks to thee for thy great glory,",
      "O Lord God, heavenly King, God the Father Almighty.",
      "O Lord, the only-begotten Son Jesu Christ; O Lord God, Lamb of God, Son of the Father,",
      "that takest away the sins of the world, have mercy upon us.",
      "Thou that takest away the sins of the world, receive our prayer.",
      "Thou that sittest at the right hand of God the Father, have mercy upon us.",
      "For thou only art holy; thou only art the Lord;",
      "thou only, O Christ, with the Holy Ghost, art most high in the glory of God the Father. Amen.",
    ],
  },
  {
    id: "magnificat",
    title: "The Song of the Theotokos (Magnificat)",
    origin: "Luke 1:46-55. Sung at Matins in the East and at Vespers in the West.",
    lines: [
      "My soul doth magnify the Lord, and my spirit hath rejoiced in God my Saviour.",
      "For he hath regarded the low estate of his handmaiden: for, behold, from henceforth all generations shall call me blessed.",
      "For he that is mighty hath done to me great things; and holy is his name.",
      "And his mercy is on them that fear him from generation to generation.",
      "He hath shewed strength with his arm; he hath scattered the proud in the imagination of their hearts.",
      "He hath put down the mighty from their seats, and exalted them of low degree.",
      "He hath filled the hungry with good things; and the rich he hath sent empty away.",
      "He hath holpen his servant Israel, in remembrance of his mercy; as he spake to our fathers, to Abraham, and to his seed for ever.",
    ],
  },
  {
    id: "nunc-dimittis",
    title: "Song of Simeon",
    origin: "Luke 2:29-32. Sung at Vespers in the East and at Compline in the West.",
    lines: [
      "Lord, now lettest Thou Thy servant depart in peace, according to Thy word:",
      "for mine eyes have seen Thy salvation, which Thou hast prepared before the face of all people;",
      "a light to lighten the Gentiles, and the glory of Thy people Israel.",
    ],
  },
];

export const WESTERN_PRAYERS: SharedPrayer[] = [
  {
    id: "memorare",
    title: "The Memorare",
    origin: "A Western prayer to the Theotokos from the late Middle Ages, popular with Catholics. Pray it as your parish allows.",
    lines: [
      "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thine intercession was left unaided.",
      "Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother; to thee do I come, before thee I stand, sinful and sorrowful.",
      "O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.",
    ],
  },
  {
    id: "anima-christi",
    title: "Anima Christi (Soul of Christ)",
    origin: "A Western prayer from the 1300s, said after Holy Communion.",
    lines: [
      "Soul of Christ, sanctify me. Body of Christ, save me. Blood of Christ, inebriate me. Water from the side of Christ, wash me.",
      "Passion of Christ, strengthen me. O good Jesus, hear me. Within thy wounds hide me. Suffer me not to be separated from thee.",
      "From the malicious enemy defend me. In the hour of my death call me, and bid me come to thee, that with thy saints I may praise thee for ever and ever. Amen.",
    ],
  },
  {
    id: "angel-of-god",
    title: "Angel of God",
    origin: "A Western prayer to the guardian angel, often the first prayer children learn.",
    lines: [
      "Angel of God, my guardian dear, to whom God's love commits me here,",
      "ever this day be at my side, to light and guard, to rule and guide. Amen.",
    ],
  },
  {
    id: "collect-for-purity",
    title: "Collect for Purity",
    origin: "From the Western Mass before the Schism; said at the start of the Liturgy of St. Tikhon in Western Rite parishes.",
    lines: [
      "Almighty God, unto whom all hearts be open, all desires known, and from whom no secrets are hid: cleanse the thoughts of our hearts by the inspiration of thy Holy Spirit, that we may perfectly love thee, and worthily magnify thy holy Name; through Christ our Lord. Amen.",
    ],
  },
  {
    id: "christ-with-me",
    title: "Christ be with me",
    origin: "From the Breastplate of St. Patrick (5th century), tr. Cecil Frances Alexander, 1889.",
    lines: [
      "Christ be with me, Christ within me, Christ behind me, Christ before me,",
      "Christ beside me, Christ to win me, Christ to comfort and restore me.",
      "Christ beneath me, Christ above me, Christ in quiet, Christ in danger,",
      "Christ in hearts of all that love me, Christ in mouth of friend and stranger.",
    ],
  },
];
