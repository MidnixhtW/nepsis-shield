// The road from first curiosity to life in the Church, for people on their way into Orthodoxy.
// Practice differs between parishes and jurisdictions, so every step points back to the priest.

export type JourneyStage = {
  id: string;
  title: string;
  short: string;
  /** What this stage usually looks like. */
  about: string;
  expect: string[];
  /** Small things to do now. Each can be checked off. */
  steps: string[];
};

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "curious",
    title: "Curious",
    short: "Looking into it",
    about: "You have seen something of Orthodoxy (a video, a friend, a book) and want to know more. There is no pressure and no deadline.",
    expect: [
      "You can pray Orthodox prayers now. Morning and evening prayers in this app are a good start.",
      "Videos and posts can start you off, but the Church is a parish, a priest and a community.",
      "Questions are welcome. The faith has been asked hard questions for two thousand years.",
    ],
    steps: [
      "Pray the short morning or evening prayers for a week",
      "Read one Gospel from start to finish (Mark is the shortest)",
      "Find the nearest parish in Learn > Find a parish",
      "Write down the questions you want to ask a priest",
    ],
  },
  {
    id: "visit",
    title: "First visit",
    short: "Going to a service",
    about: "The best way to learn Orthodoxy is to stand in it. Saturday evening Vespers is shorter and quieter; Sunday Divine Liturgy is the main service.",
    expect: [
      "Arrive a few minutes early. Many people light a candle and kiss an icon as they come in. You are free to just watch.",
      "Most Orthodox stand for much of the service. Sit whenever you need to; nobody minds.",
      "Dress modestly, as for something important. In some parishes women cover their heads; follow what you see, and no one will turn you away.",
      "Only Orthodox Christians who have prepared receive Holy Communion. At the end, many parishes offer blessed bread (antidoron) that visitors may take; ask someone nearby.",
      "Stay for coffee hour if there is one, and introduce yourself to the priest. Saying \"this is my first time\" is enough.",
    ],
    steps: [
      "Attend Vespers or the Divine Liturgy",
      "Read Learn > Divine Liturgy beforehand so the service is easier to follow",
      "Introduce yourself to the priest",
      "Go back a second and third time; it takes a few visits to feel at home",
    ],
  },
  {
    id: "inquirer",
    title: "Inquirer",
    short: "Learning with a priest",
    about: "You are attending regularly and talking with the priest about the faith and your life. Many parishes hold inquirers' classes.",
    expect: [
      "The priest will want to know your story: your background, any baptism you have received, and what draws you.",
      "Learning happens mostly by taking part: services, fasting a little, prayer at home, and conversation.",
      "There is no fixed timeline. Some move on in months, others take longer. That is normal.",
    ],
    steps: [
      "Ask the priest to meet and talk about becoming Orthodox",
      "Keep a simple daily rule of prayer (see My rule)",
      "Attend Vespers and the Liturgy most weeks",
      "Read a solid introduction your priest recommends",
      "Try the Wednesday and Friday fast in a small way, as the priest advises",
    ],
  },
  {
    id: "catechumen",
    title: "Catechumen",
    short: "Preparing to be received",
    about: "The priest formally makes you a catechumen with special prayers. You are now part of the parish family, preparing to be received into the Church.",
    expect: [
      "Catechism classes cover the Creed, the sacraments, prayer, fasting and the life of the Church.",
      "You will choose a sponsor (godparent), an Orthodox Christian in good standing who will pray for you and help you, with the priest's blessing.",
      "You will choose a patron saint, often one whose name you will take or already bear.",
      "Before you are received you will usually make a first confession of your whole life. The priest will help you prepare, and it is a sacrament of healing.",
      "Depending on your background and the parish, you will be received by Baptism or by Chrismation. Your priest and bishop decide this.",
    ],
    steps: [
      "Be enrolled as a catechumen by your priest",
      "Ask someone to be your sponsor, with the priest's blessing",
      "Choose your patron saint (set it in Settings)",
      "Learn the Creed by heart (Learn > The Creed)",
      "Prepare for your first confession (Pray > Confession)",
    ],
  },
  {
    id: "received",
    title: "Baptism or Chrismation",
    short: "Received into the Church",
    about: "You are received into the Orthodox Church, and then receive Holy Communion for the first time, often at the same Liturgy.",
    expect: [
      "Your priest will tell you what to bring. Often this is a white garment, a baptismal cross, a candle and a towel, and your sponsor helps.",
      "Baptism is by triple immersion where possible. Chrismation is anointing with holy chrism, the seal of the gift of the Holy Spirit.",
      "Many are received at Pascha or another great feast, but any time the priest chooses is right.",
      "Invite family and friends, even if they are not Orthodox. They are welcome to watch.",
    ],
    steps: [
      "Confirm the date and what to bring with your priest",
      "Invite your family and friends",
      "Spend the evening before in quiet prayer",
      "Receive Holy Communion for the first time",
    ],
  },
  {
    id: "illumined",
    title: "Newly illumined",
    short: "Your first year",
    about: "The newly received are called \"newly illumined.\" The first year has its own joys and its own struggles; both are normal.",
    expect: [
      "The excitement fades for many people after a few months. Keep your rule anyway; faithfulness grows quietly.",
      "Fasting, confession and Communion settle into a rhythm with your priest's guidance.",
      "Stay close to your parish. Help with something: the choir, coffee hour, cleaning, visiting the sick.",
      "Be patient with family and friends who do not understand yet. Let your peace speak more than arguments.",
    ],
    steps: [
      "Keep your daily rule through the whole first year",
      "Go to confession regularly, as your priest advises",
      "Keep the four fasting seasons for the first time",
      "Find a way to serve in your parish",
      "Celebrate your name day",
    ],
  },
];

export type Background = { id: string; label: string; notes: string[] };

// Gentle orientation for people arriving from different starting points. Respectful of where they come from.
export const BACKGROUNDS: Background[] = [
  {
    id: "protestant",
    label: "Coming from a Protestant church",
    notes: [
      "You already love Scripture. The Orthodox read it within the life and worship of the Church, especially through the Liturgy and the Fathers.",
      "Icons, the saints and the Theotokos can feel strange at first. Orthodox honor them and ask their prayers; worship belongs to God alone.",
      "Salvation is understood as a lifelong healing and union with God (theosis), more than a single moment.",
      "Whether your earlier baptism is received is for the priest and bishop to decide. Bring it up early.",
    ],
  },
  {
    id: "catholic",
    label: "Coming from the Catholic Church",
    notes: [
      "Much will feel familiar: the sacraments, the saints, the Mother of God, the early Fathers.",
      "Real differences remain, including the papacy, the filioque in the Creed, and some later doctrines. Your priest can walk through them with you.",
      "Eastern Catholics pray many of the same services. Becoming Orthodox is still a change of Church, so take it slowly and honestly.",
      "Fasting is stricter and the services are longer, but both are meant to be grown into, not mastered on day one.",
    ],
  },
  {
    id: "none",
    label: "Coming with no church background",
    notes: [
      "Nobody expects you to know anything. Watching and asking are exactly right.",
      "Start small: a few minutes of prayer a day matters more than reading everything at once.",
      "The Church is a hospital for sinners, not a club for the finished. Everyone in the room is still learning.",
      "Your questions about God, suffering and meaning are welcome. Bring them to the priest.",
    ],
  },
  {
    id: "online",
    label: "Coming through videos and online debate",
    notes: [
      "Online Orthodoxy can be loud and argumentative. Real parish life is quieter, kinder and slower.",
      "Let your priest, not commentators, be your guide. Listen more than you argue at first.",
      "Humility is the first Orthodox virtue. Converts are often warned against zeal without love.",
      "Spend more time praying than watching content about prayer.",
    ],
  },
];

export const GLOSSARY: Array<[string, string]> = [
  ["Antidoron", "Blessed bread given at the end of the Liturgy; visitors may often take it."],
  ["Catechumen", "Someone formally preparing to enter the Church."],
  ["Chrismation", "Anointing with holy chrism, the seal of the gift of the Holy Spirit."],
  ["Divine Liturgy", "The main Sunday service, where Holy Communion is celebrated."],
  ["Iconostasis", "The wall of icons between the altar and the nave."],
  ["Jesus Prayer", "\"Lord Jesus Christ, Son of God, have mercy on me, a sinner.\""],
  ["Name day", "The feast of the saint whose name you bear, kept like a birthday."],
  ["Pascha", "Easter, the Feast of feasts."],
  ["Prayer rope", "A knotted cord (chotki or komboskini) used to count the Jesus Prayer."],
  ["Prosphora", "Leavened bread baked for the Liturgy."],
  ["Rule of prayer", "Your daily set of prayers, agreed with your priest."],
  ["Sponsor", "Your godparent in the faith, who prays for you and helps you."],
  ["Theosis", "Becoming by grace what God is by nature: union with God."],
  ["Theotokos", "\"God-bearer,\" the Virgin Mary, Mother of God."],
  ["Troparion", "A short hymn for a feast or saint."],
  ["Vespers", "The evening service, often Saturday night; a gentle first visit."],
];
