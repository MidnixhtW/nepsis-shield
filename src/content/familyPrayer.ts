// Family prayer: a short evening prayer for parents and children, prayers children can learn,
// saint stories told for children, and notes for parents.
// Prayer texts marked ST_TIKHON are from Orthodox Daily Prayers (St. Tikhon's Seminary Press, 1982),
// released through Project Gutenberg; the blessing is Numbers 6:24-26 (KJV). The saint stories and
// the notes are written for this app.

export const ST_TIKHON = "Orthodox Daily Prayers (St. Tikhon's Seminary Press, 1982)";

export type FamilyStep = { title: string; who: string; say?: string; note?: string };

export const EVENING_PRAYER: FamilyStep[] = [
  {
    title: "Gather at the icons",
    who: "Everyone",
    note: "Light the lamp or a candle. Let a child do it, with help if needed. Stand together and make the sign of the Cross.",
    say: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
  },
  {
    title: "Begin",
    who: "A parent, then everyone",
    say: "Glory to Thee, our God, glory to Thee!\n\nHoly God! Holy Mighty! Holy Immortal! Have mercy on us! (3 times)",
  },
  {
    title: "The Lord's Prayer",
    who: "Everyone together",
    say: "Our Father Who art in Heaven, hallowed be Thy name. Thy Kingdom come. Thy will be done, on earth as it is in Heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.",
  },
  {
    title: "Give thanks",
    who: "Each person",
    note: "Each person names one thing from today to thank God for. Little ones can whisper it to a parent.",
    say: "Glory to Thee, O God!",
  },
  {
    title: "Pray for each other",
    who: "A parent, with names from everyone",
    note: "Say the names of the people you love; let the children add theirs. You can also pray for anyone who is sick or sad.",
    say: "Save, Lord, and have mercy on my parents, my children, my brothers and sisters and all my relatives, those who are close to my family, and my friends. Grant them Thy worldly and heavenly good things.",
  },
  {
    title: "Ask the Theotokos and the angels",
    who: "Everyone",
    say: "Most Holy Theotokos, save us!\n\nHoly Guardian Angel, pray to God for me!",
  },
  {
    title: "The blessing",
    who: "Each parent, for each child",
    note: "Make the sign of the Cross over your child as you say it, and kiss them good night.",
    say: "The Lord bless thee, and keep thee: the Lord make his face shine upon thee, and be gracious unto thee: the Lord lift up his countenance upon thee, and give thee peace.",
  },
];

export const CHILD_PRAYERS: { text: string; when: string; source?: string }[] = [
  { text: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.", when: "With the sign of the Cross, when we wake, before we eat, and before we sleep." },
  { text: "Glory to Thee, O God, glory to Thee!", when: "When something good happens." },
  { text: "Lord, have mercy.", when: "When we are sorry, or when someone needs help." },
  { text: "Lord Jesus Christ, Son of God, have mercy on me.", when: "The Jesus Prayer. Any time at all: when we are scared, waiting, or falling asleep." },
  { text: "Most Holy Theotokos, save us!", when: "To ask the Mother of God to pray for us." },
  { text: "Holy Guardian Angel, pray to God for me!", when: "At bedtime, and when we feel alone." },
  { text: "Holy (your saint's name), pray to God for me!", when: "To the saint whose name we carry." },
  {
    text: "O Christ God, bless the food and drink of Thy servants, for Thou art holy, always, now and ever and unto ages of ages. Amen.",
    when: "Before meals.",
    source: ST_TIKHON,
  },
  {
    text: "Angel of Christ, my holy guardian, the protector of my soul and body: forgive me for all the sins I have committed this day. Deliver me from all the evil of my militant Enemy, that I may not anger my God by any sin. Pray for me, your sinful and unworthy servant, that you may show me worthy of the goodness and mercy of the All-Holy Trinity, the Mother of my Lord Jesus Christ and all the Saints. Amen.",
    when: "The longer prayer to the Guardian Angel, for older children at bedtime.",
    source: ST_TIKHON,
  },
];

export type SaintStory = { saint: string; day: string; title: string; story: string[]; lesson: string };

export const SAINT_STORIES: SaintStory[] = [
  {
    saint: "St. Nicholas of Myra",
    day: "December 6",
    title: "The gold in the night",
    story: [
      "Long ago, in a city called Patara, there lived a man who had lost all his money. He had three daughters, and he was so poor that he did not know how they would ever be able to marry and have homes of their own.",
      "Young Nicholas heard about the family. He wanted to help, but he did not want anyone to thank him or praise him. So one night he crept to their house and tossed a bag of gold through the window. Later he did it again, and then a third time.",
      "The third time, the father stayed awake and caught him. Nicholas asked him to tell no one. Nicholas grew up to be a bishop who loved the poor, and the Church remembers him as a wonder-worker.",
    ],
    lesson: "When we do something good, we can do it quietly, for God, without needing anyone to notice.",
  },
  {
    saint: "St. Gerasimos of the Jordan",
    day: "March 4",
    title: "The monk and the lion",
    story: [
      "Near the river Jordan lived a monk named Gerasimos. One day a lion came limping toward him, roaring in pain. Instead of running away, Gerasimos looked at its paw and found a sharp thorn stuck deep inside.",
      "Gently he pulled the thorn out, cleaned the wound and bandaged it. The lion would not leave him. From then on it lived at the monastery, as tame as a lamb, and helped by guarding the donkey that carried the monks' water.",
      "When Gerasimos died, the lion lay down on his grave and would not be comforted. Icons of St. Gerasimos often show the lion at his feet.",
    ],
    lesson: "Kindness can make even a fierce heart gentle.",
  },
  {
    saint: "St. Seraphim of Sarov",
    day: "January 2",
    title: "The bear in the forest",
    story: [
      "St. Seraphim lived alone in a small hut in the forest in Russia, where he prayed all day and all night. The animals were not afraid of him. A big brown bear used to come to his hut, and Seraphim would feed it bread from his own hands.",
      "Seraphim greeted everyone who visited him, every day of the year, with the same words: \"My joy, Christ is risen!\" He called each person \"my joy\", because he saw God's image in them.",
      "He taught: \"Acquire a peaceful spirit, and thousands around you will be saved.\"",
    ],
    lesson: "A heart full of God's peace makes others peaceful, even a wild bear.",
  },
  {
    saint: "St. Herman of Alaska",
    day: "December 13",
    title: "The monk who loved the orphans",
    story: [
      "More than two hundred years ago, a monk named Herman sailed from Russia to Alaska. He lived on a small, cold island called Spruce Island, and made a garden there, and a school.",
      "Herman cared for children who had no parents. He fed them, taught them, and loved them like a grandfather. When sickness came and many people died, he stayed and nursed the sick.",
      "He used to ask people to make this promise with him: \"From this day, from this hour, from this very minute, let us strive to love God above all and fulfill His holy will.\" In 1970 he became the first saint glorified in America.",
    ],
    lesson: "We can choose, right now, to love God above everything.",
  },
  {
    saint: "St. Spyridon of Trimythous",
    day: "December 12",
    title: "The shepherd and the brick",
    story: [
      "Spyridon was a shepherd on the island of Cyprus who was so humble and kind that the people asked him to become their bishop. Even as a bishop, he kept wearing his simple shepherd's clothes.",
      "When the bishops of the whole world met at Nicaea to say what Christians believe about God, a clever man argued that the Son was not truly God. Spyridon was not a man of fancy words. Instead he picked up a clay brick.",
      "As he made the sign of the Cross, the Church remembers, fire went up from the brick, water ran down, and only clay was left in his hand: one brick, and three things in it. In this way he showed that God is one, and yet three: Father, Son and Holy Spirit.",
    ],
    lesson: "Simple faith can teach what clever words cannot.",
  },
  {
    saint: "St. Juliana of Lazarevo",
    day: "January 2",
    title: "The mother who fed the hungry",
    story: [
      "Juliana was a wife and mother in Russia, with a big family and a busy house. She prayed every day while she worked, and she never let a poor person leave her door hungry.",
      "When a terrible famine came and there was very little food, Juliana gave away almost everything she had. When even the bread ran out, she taught her family to make bread from goosefoot, a wild plant, and they shared it with others.",
      "People said her bread tasted sweet. She shows that a mother at home, cooking and caring for her family, can become a saint.",
    ],
    lesson: "Being holy happens in ordinary days: at home, at work, in the kitchen.",
  },
];

export const PARENT_NOTES: string[] = [
  "Keep it short. Five minutes every evening is better than forty minutes once a month.",
  "Pray at the same time and the same place each day, so it becomes part of the day, like brushing teeth.",
  "Set up an icon corner at a child's height, with a lamp or candle. Let children light it, and kiss the icons.",
  "Let children lead a part: lighting the lamp, saying the Lord's Prayer, or naming the people to pray for.",
  "Sing what you can. Children remember hymns long after they forget words.",
  "Read the saint of the day together, or one of the stories here, and ask your child what they noticed.",
  "Bring your children to Liturgy and to Holy Communion often. Ask your priest how to prepare them.",
  "Children learn most from seeing their parents pray. Let them see you pray on your own, too.",
];
