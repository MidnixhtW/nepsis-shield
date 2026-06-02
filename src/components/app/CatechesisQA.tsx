import { useMemo, useState } from "react";
import { ExternalLink, Filter, HelpCircle, Search, SearchX } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category =
  | "All"
  | "Prayer"
  | "Worship"
  | "Sacraments"
  | "Scripture"
  | "Daily life"
  | "Saints & icons"
  | "Parish life"
  | "Liturgical arts"
  | "Liturgical year"
  | "Church history"
  | "Other Christians"
  | "Priesthood & monasticism"
  | "Death & funerals";

type QA = {
  category: Exclude<Category, "All">;
  q: string;
  a: string;
  sourceLabel: string;
  sourceUrl: string;
};

const QA_ITEMS: QA[] = [
  // --- Worship / Liturgy ---
  {
    category: "Worship",
    q: "What is the Divine Liturgy?",
    a: [
      "The Divine Liturgy is the Church's central act of worship, where the faithful gather to hear the Scriptures, offer thanksgiving, and receive Holy Communion.",
      "In practice, it's not something you 'watch'; it's something you participate in with attention: prayer, singing, listening, offering your life to God, and (when blessed and prepared) receiving the Eucharist.",
      "Use this app's Readings tab to follow the lections, then bring that attention into the Liturgy on Sunday (and feast days).",
    ].join("\n\n"),
    sourceLabel: "OCA – The Divine Liturgy (Q&A)",
    sourceUrl: "https://www.oca.org/questions/divineliturgy/the-divine-liturgy",
  },
  {
    category: "Worship",
    q: "Why is it important to participate in the entire Divine Liturgy?",
    a: [
      "The Liturgy is a single, unified act of the Church, not separate 'pieces' to drop into.",
      "Arriving early and staying through the dismissal trains attention, keeps the service from becoming a private 'drive-through,' and helps the community pray as one Body.",
      "If you're building consistency: aim for the whole service, even when you can't receive Communion.",
    ].join("\n\n"),
    sourceLabel: "OCA – Participation in the entire Divine Liturgy (Q&A)",
    sourceUrl:
      "https://www.oca.org/questions/divineliturgy/participation-in-the-entire-divine-liturgy",
  },
  {
    category: "Worship",
    q: "Why make the sign of the Cross?",
    a: [
      "It is a brief bodily prayer that confesses the Holy Trinity and proclaims Christ's saving Cross.",
      "The gesture trains the mind and body to remember God, not just the intellect.",
    ].join("\n\n"),
    sourceLabel: "OCA – Sign of the Cross (The Orthodox Faith)",
    sourceUrl:
      "https://www.oca.org/orthodoxy/the-orthodox-faith/worship/the-church-building/sign-of-the-cross",
  },
  {
    category: "Worship",
    q: "Why do Orthodox cross right-to-left?",
    a: [
      "The OCA Q&A notes that Eastern Christians traditionally cross right-to-left, while the West commonly goes left-to-right today.",
      "Historically, the West once crossed the same way as the East; the exact reason for later reversal is not firmly established.",
    ].join("\n\n"),
    sourceLabel: "OCA – Sign of the Cross Direction (Q&A)",
    sourceUrl: "https://www.oca.org/questions/teaching/sign-of-the-cross-direction",
  },

  // --- Sacraments / Confession / Communion ---
  {
    category: "Sacraments",
    q: "What are the sacraments in Orthodoxy?",
    a: [
      "Orthodox Christians speak of 'mysteries' (sacraments) as the Church's life in Christ, God's grace working through visible actions.",
      "The OCA's Q&A gives an overview that includes Baptism and Chrismation (entry into the Church), Eucharist (center), Confession (healing), Marriage and Priesthood (service), and Holy Unction (healing).",
      "A helpful way to use this app: keep the daily rhythm (prayer and Scripture) so Sunday worship and the sacraments are lived, not just studied.",
    ].join("\n\n"),
    sourceLabel: "OCA – The Sacraments (Q&A)",
    sourceUrl: "https://www.oca.org/questions/sevensacraments/the-sacraments",
  },
  {
    category: "Sacraments",
    q: "What is Chrismation?",
    a: [
      "Chrismation is the sealing of the gift of the Holy Spirit, often described as a person's 'personal Pentecost.'",
      "It is normally joined to Baptism (especially for infants), and it completes initiation into the Church's sacramental life.",
    ].join("\n\n"),
    sourceLabel: "OCA – Seven Sacraments (Q&A)",
    sourceUrl: "https://www.oca.org/questions/sevensacraments/seven-sacraments",
  },
  {
    category: "Sacraments",
    q: "How are people usually received into the OCA from other Christian groups?",
    a: [
      "Reception depends on the person's background, and the Church applies pastoral discernment.",
      "The OCA Q&A discusses recognition of Trinitarian baptism and common reception by Chrismation (along with confession and Eucharist), rather than a one-size-fits-all approach.",
      "Always handle this with your priest (not internet checklists).",
    ].join("\n\n"),
    sourceLabel: "OCA – Questions on the Sacraments (Q&A)",
    sourceUrl: "https://www.oca.org/questions/sevensacraments/questions-on-the-sacraments",
  },
  {
    category: "Sacraments",
    q: "How should I think about preparing for Communion?",
    a: [
      "Preparation is not only a personal feeling; it's a Church practice: prayer, fasting, repentance, and obedience to your priest's guidance.",
      "The OCA's Communion questions emphasize pastoral preparation and avoiding rigid, universal rules that ignore a person's actual situation.",
    ].join("\n\n"),
    sourceLabel: "OCA – Communion Questions (Q&A)",
    sourceUrl: "https://www.oca.org/questions/divineliturgy/communion-questions",
  },
  {
    category: "Sacraments",
    q: "How often should I receive Holy Communion?",
    a: [
      "There isn't a single number for everyone. The OCA Q&A addresses frequency together with preparation (prayer, fasting, repentance, confession) and the guidance of your priest.",
      "A good 'app rule' is: focus on preparing well and participating fully. Frequency follows with pastoral direction.",
    ].join("\n\n"),
    sourceLabel: "OCA – Frequency of Communion (Q&A)",
    sourceUrl: "https://www.oca.org/questions/divineliturgy/frequency-of-communion",
  },
  {
    category: "Sacraments",
    q: "Why confess in the presence of a priest?",
    a: [
      "Orthodox Christians confess to God, in the presence of a priest, for healing and reconciliation.",
      "The priest is a witness for the Church and a pastor who can guide and support repentance; absolution is a sacramental act of the Church.",
    ].join("\n\n"),
    sourceLabel: "OCA – Confessing in the Presence of a Priest (Q&A)",
    sourceUrl:
      "https://www.oca.org/questions/sacramentconfession/confessing-in-the-presence-of-a-priest",
  },
  {
    category: "Sacraments",
    q: "Do I need 'proof of confession'?",
    a: [
      "The OCA Q&A addresses 'proof of confession' in the context of pastoral care and the relationship between a father-confessor and a parish priest.",
      "In general, don't treat confession as a bureaucratic transaction; treat it as a healing practice under guidance.",
    ].join("\n\n"),
    sourceLabel: "OCA – Proof of Confession (Q&A)",
    sourceUrl: "https://www.oca.org/questions/sacramentconfession/proof-of-confession",
  },
  {
    category: "Sacraments",
    q: "How are baptismal names chosen?",
    a: [
      "The OCA Q&A explains the practice of choosing baptismal (Christian) names, commonly connected to saints and the Church's calendar.",
      "A practical approach: choose a name you can pray with, a saint you can actually learn from and ask for intercession.",
    ].join("\n\n"),
    sourceLabel: "OCA – Baptismal Names (Q&A)",
    sourceUrl: "https://www.oca.org/questions/sevensacraments/baptismal-names",
  },
  {
    category: "Sacraments",
    q: "Where can I find many questions about marriage in the OCA?",
    a: [
      "The OCA has a dedicated Q&A index for the Sacrament of Marriage.",
      "Use it when you need specifics (non-Orthodox spouse, divorce/remarriage, wedding rite, etc.), since these situations often require pastoral guidance.",
    ].join("\n\n"),
    sourceLabel: "OCA – The Sacrament of Marriage (Q&A index)",
    sourceUrl: "https://www.oca.org/questions/sacramentmarriage",
  },

  // --- Saints, Theotokos, Icons ---
  {
    category: "Saints & icons",
    q: "Why do Orthodox Christians venerate icons?",
    a: [
      "Because the Word truly became flesh: the Incarnation makes depicting Christ possible and meaningful.",
      "Icons are 'windows' that help us pray and remember the Kingdom. Honor shown to an icon goes to the person depicted (the prototype), not to wood and paint.",
      "Veneration is not worship. Worship belongs to God alone.",
    ].join("\n\n"),
    sourceLabel: "OCA – Icons (The Orthodox Faith)",
    sourceUrl:
      "https://www.oca.org/orthodoxy/the-orthodox-faith/worship/the-church-building/icons",
  },
  {
    category: "Saints & icons",
    q: "Why ask saints to pray for us?",
    a: [
      "The saints are alive in Christ and remain members of His one Body.",
      "Asking for their intercession is like asking a faithful friend to pray, but with the confidence that the saint is already glorified in Christ.",
      "This does not replace prayer to God; it supports it.",
    ].join("\n\n"),
    sourceLabel: "OCA – Mary / Prayer / Death (Q&A)",
    sourceUrl: "https://www.oca.org/questions/teaching/mary-prayer-death",
  },
  {
    category: "Saints & icons",
    q: "What does the OCA say about kissing icons / a common spoon?",
    a: [
      "The OCA Q&A discusses practical concerns about kissing icons and receiving from the common chalice and spoon.",
      "Because situations differ (health, local guidance, pastoral direction), treat this as a pastoral question rather than a social-media debate.",
    ].join("\n\n"),
    sourceLabel: "OCA – Common Chalice & Spoon / Kissing Icons (Q&A)",
    sourceUrl:
      "https://www.oca.org/questions/divineliturgy/common-chalice-spoon-kissing-icons",
  },
  {
    category: "Saints & icons",
    q: "How does the OCA describe the Theotokos (Mary)?",
    a: [
      "The OCA provides multiple Q&As and articles on the Theotokos.",
      "A useful way to keep things clear: Orthodox honor (veneration) is distinct from worship, and devotion to the Theotokos always leads us to Christ.",
    ].join("\n\n"),
    sourceLabel: "OCA – Sinlessness of Mary (Q&A)",
    sourceUrl: "https://www.oca.org/questions/saints/sinlessness-of-mary",
  },
  {
    category: "Saints & icons",
    q: "How does the OCA explain the sinlessness of Mary?",
    a: [
      "The OCA Q&A addresses how Orthodoxy understands Mary's holiness.",
      "If you're comparing Orthodox and Roman Catholic ideas (e.g., Immaculate Conception), use the OCA page to keep distinctions clear.",
    ].join("\n\n"),
    sourceLabel: "OCA – Sinlessness of Mary (Q&A)",
    sourceUrl: "https://www.oca.org/questions/saints/sinlessness-of-mary",
  },

  // --- Daily life / habits ---
  {
    category: "Daily life",
    q: "Why do Orthodox Christians fast?",
    a: [
      "Fasting is a spiritual discipline that supports repentance, prayer, and mercy.",
      "It is meant to train freedom from passions and dependency on comfort, not to 'earn' salvation.",
      "Fasting without mercy and repentance becomes empty; fasting with humility becomes medicine.",
    ].join("\n\n"),
    sourceLabel: "OCA – Orthodox Fasting (Q&A)",
    sourceUrl: "https://www.oca.org/questions/dailylife/orthodox-fasting",
  },
  {
    category: "Daily life",
    q: "What's the point of Lenten fasting?",
    a: [
      "Great Lent prepares the faithful for Pascha through repentance and a more focused way of life.",
      "The OCA Q&A discusses the traditional abstentions and also the need for pastoral adjustments when needed.",
    ].join("\n\n"),
    sourceLabel: "OCA – Lenten Fasting (Q&A)",
    sourceUrl: "https://www.oca.org/questions/dailylife/lenten-fasting",
  },
  {
    category: "Daily life",
    q: "What is Holy Tradition (and how is it different from customs)?",
    a: [
      "Holy Tradition is the living faith and life of the Church handed down from the apostles.",
      "Customs vary by time and place; Holy Tradition concerns the faith, worship, and sacramental life of the Church.",
      "When in doubt: learn your parish's practice and ask your priest.",
    ].join("\n\n"),
    sourceLabel: "OCA – Holy Tradition vs. Customs (Q&A)",
    sourceUrl: "https://www.oca.org/questions/dailylife/holy-tradition-vs.-customs",
  },
  {
    category: "Daily life",
    q: "What does the OCA say about the Rosary?",
    a: [
      "The OCA Q&A notes that the Roman Catholic Rosary is not an Orthodox devotion in its present form.",
      "Orthodox Christians commonly use the Jesus Prayer and a prayer rope as a simple practice of repeating prayer with attention.",
    ].join("\n\n"),
    sourceLabel: "OCA – The Rosary (Q&A)",
    sourceUrl: "https://www.oca.org/questions/romancatholicism/the-rosary",
  },

  // --- Scripture ---
  {
    category: "Scripture",
    q: "How should Orthodox Christians read the Bible?",
    a: [
      "The OCA describes the Bible as 'the book of the Church', received, read, and interpreted within the Church's worship and teaching.",
      "A good habit is to start with the daily readings and the Gospels, and to ask your priest when you're stuck.",
    ].join("\n\n"),
    sourceLabel: "OCA – Bible (Q&A)",
    sourceUrl: "https://www.oca.org/questions/scripture/bible",
  },
  {
    category: "Scripture",
    q: "Should Orthodox Christians study the Bible outside of church services?",
    a: [
      "Yes. Personal and group study can be deeply helpful when it remains connected to the Church's faith.",

      "The OCA Q&A encourages Scripture study and points readers toward responsible approaches (not speculative interpretations).",
    ].join("\n\n"),
    sourceLabel: "OCA – Study of the Bible (Q&A)",
    sourceUrl: "https://www.oca.org/questions/scripture/study-of-the-bible",
  },
  {
    category: "Scripture",
    q: "What is the Orthodox canon of Scripture?",
    a: [
      "The OCA Q&A discusses the canon of Scripture and the Orthodox Old Testament canon (including books sometimes called 'Apocrypha' or 'Deuterocanonical').",
      "If you want a practical habit: focus on the daily lections and Psalms, then deepen with guidance.",
    ].join("\n\n"),
    sourceLabel: "OCA – Canon of Scripture (Q&A)",
    sourceUrl: "https://www.oca.org/questions/scripture/canon-of-scripture",
  },

  // --- Parish life ---
  {
    category: "Parish life",
    q: "How should I handle local 'rules' and customs in a parish?",
    a: [
      "The OCA emphasizes that parishes have local customs (how people venerate, when confession is offered, how people line up, etc.).",
      "Don't weaponize internet checklists; learn the local practice with humility.",
      "When you're confused, ask the priest directly, quietly and respectfully.",

    ].join("\n\n"),
    sourceLabel: "OCA – Rules & Customs (Q&A)",
    sourceUrl: "https://www.oca.org/questions/parishlife/rules-customs",
  },
  {
    category: "Parish life",
    q: "What does the OCA say about tithing?",
    a: [
      "The OCA Q&A discusses tithing and stewardship in a pastoral way.",
      "The goal is not guilt. It's offering first-fruits to support the Church's worship, mission, and care for people.",

      "A simple practice: choose a percentage you can keep consistently, then grow in generosity over time.",
    ].join("\n\n"),
    sourceLabel: "OCA – Tithing (Q&A)",
    sourceUrl: "https://www.oca.org/questions/parishlife/tithing",
  },
  {
    category: "Parish life",
    q: "Why don't Orthodox churches use musical instruments in worship?",
    a: [
      "The OCA Q&A explains the Orthodox tradition of worshiping with the human voice (chant/singing) rather than instruments.",
      "The point is not 'music is bad,' but that Orthodox liturgy developed as a sung prayer of the gathered Church.",
    ].join("\n\n"),
    sourceLabel: "OCA – Musical Instruments (Q&A)",
    sourceUrl: "https://www.oca.org/questions/parishlife/musical-instruments",
  },
  {
    category: "Parish life",
    q: "Why do some parishes use 'thee/thou' language?",
    a: [
      "The OCA Q&A discusses why certain English translations use 'thee/thou' for God and notes that different translations are used across parishes.",
      "A healthy approach: don't fight a culture war over language. Learn to pray with the text your parish uses.",

    ].join("\n\n"),
    sourceLabel: "OCA – Archaic English (Q&A)",
    sourceUrl: "https://www.oca.org/questions/parishlife/archaic-english",
  },
  {
    category: "Parish life",
    q: "Why beeswax candles?",
    a: [
      "The OCA Q&A explains that beeswax is traditional and practical (cleaner burning, less odor/soot), while also noting there isn't a strict canonical requirement for '100% white beeswax.'",
      "In practice: follow your parish's candle practice and focus on prayer, not policing materials.",
    ].join("\n\n"),
    sourceLabel: "OCA – Beeswax Candles (Q&A)",
    sourceUrl: "https://www.oca.org/questions/parishlife/beeswax-candles",
  },
  {
    category: "Parish life",
    q: "How do I balance 'service' with prayer?",
    a: [
      "The OCA Q&A addresses the temptation to replace prayer with busyness.",
      "A rule of thumb: prayer is not 'less productive service'. It's the root of all Christian service.",

      "If your church work makes you resentful or dry, simplify and return to prayer.",
    ].join("\n\n"),
    sourceLabel: "OCA – Balancing Service with Prayer (Q&A)",
    sourceUrl: "https://www.oca.org/questions/parishlife/balancing-service-with-prayer",
  },

  // --- Liturgical arts ---
  {
    category: "Liturgical arts",
    q: "What is the iconostasis / Royal Doors?",
    a: [
      "The iconostasis is the screen of icons that both reveals and protects the holy altar, teaching the faith visually.",
      "The Royal Doors (Holy Doors) mark the central entrance; practices about when they are opened/closed can vary by tradition.",
      "If you're new: don't stress the details. Learn the meaning and follow your parish's practice.",

    ].join("\n\n"),
    sourceLabel: "OCA – Royal Doors (Q&A)",
    sourceUrl: "https://www.oca.org/questions/liturgicalservices/royal-doors",
  },
  {
    category: "Liturgical arts",
    q: "How does architecture express Orthodox theology?",
    a: [
      "The OCA Q&A explains how church architecture is not decorative. It's theological.",

      "Items like the sanctuary, iconostasis, and arrangement of icons exist to form prayer and proclaim the Kingdom.",
    ].join("\n\n"),
    sourceLabel: "OCA – Church Architecture & Orthodox Theology (Q&A)",
    sourceUrl: "https://www.oca.org/questions/liturgicarts/church-architecture-orthodox-theology",
  },
  {
    category: "Liturgical arts",
    q: "Why so much symbolism in worship?",
    a: [
      "The OCA Q&A addresses how Orthodox worship uses visible, embodied symbols (incense, icons, vestments) to proclaim the faith.",
      "Symbols are not 'fake'; they are ways the Church teaches and prays with the whole person.",
    ].join("\n\n"),
    sourceLabel: "OCA – Function in Worship / Symbolism / Meaning (Q&A)",
    sourceUrl:
      "https://www.oca.org/questions/divineliturgy/function-in-worship-symbolism-meaning",
  },
  {
    category: "Liturgical arts",
    q: "Where can I browse more liturgical-arts questions?",
    a: [
      "The OCA has a Liturgical Arts Q&A index covering icons, crosses, architecture, and other items.",
      "Use it when you want details beyond a short summary.",
    ].join("\n\n"),
    sourceLabel: "OCA – Orthodoxy and Liturgical Arts (Q&A index)",
    sourceUrl: "https://www.oca.org/questions/liturgicarts",
  },

  // --- Liturgical year ---
  {
    category: "Liturgical year",
    q: "How should I think about Pascha ('Easter') in Orthodoxy?",
    a: [
      "Pascha is the Feast of Feasts: the celebration of Christ's Resurrection.",
      "The OCA addresses questions about the word 'Easter' and reminds readers to focus on the Christian meaning of the feast.",
      "A practical habit: treat Great Lent + Holy Week + Pascha as one journey, not separate events.",
    ].join("\n\n"),
    sourceLabel: "OCA – Is 'Easter' a pagan feast? (Q&A)",
    sourceUrl: "https://www.oca.org/questions/liturgicalyear/is-easter-a-pagan-feast",
  },
  {
    category: "Liturgical year",
    q: "How do I find Pascha and the movable feasts for a year?",
    a: [
      "The OCA publishes the Lenten and Paschal cycle dates.",
      "Use it to plan confession, fasting effort, and travel.",
    ].join("\n\n"),
    sourceLabel: "OCA – Lenten and Paschal Cycle",
    sourceUrl: "https://www.oca.org/fs/paschal-cycle",
  },
  {
    category: "Liturgical year",
    q: "Where can I browse other liturgical-year questions?",
    a: [
      "The OCA has a Liturgical Year Q&A index covering feasts and common practices.",
      "It's useful when you're learning why we do things in Holy Week and feast-day services.",
    ].join("\n\n"),
    sourceLabel: "OCA – The Liturgical Year (Q&A index)",
    sourceUrl: "https://www.oca.org/questions/liturgicalyear",
  },
  {
    category: "Liturgical year",
    q: "What are some Holy Friday customs about the tomb/shroud?",
    a: [
      "The OCA Q&A discusses customs of Great and Holy Friday.",
      "If you're new: follow the parish, learn slowly, and keep the focus on repentance and love.",
    ].join("\n\n"),
    sourceLabel: "OCA – Customs of Great and Holy Friday (Q&A)",
    sourceUrl: "https://www.oca.org/questions/liturgicalyear/customs-of-great-and-holy-friday",
  },

  // --- Church history ---
  {
    category: "Church history",
    q: "Which is the original Church?",
    a: [
      "The OCA Q&A 'The Original Christian Church' addresses the question historically and ecclesiologically.",
      "A helpful framing: Orthodoxy understands itself as the continuation of the one, apostolic Church from Pentecost, faithful to apostolic teaching and worship.",
      "Use this kind of reading for humility and clarity, not for triumphalism.",
    ].join("\n\n"),
    sourceLabel: "OCA – The Original Christian Church (Q&A)",
    sourceUrl: "https://www.oca.org/questions/history/the-original-christian-church",
  },
  {
    category: "Church history",
    q: "What does 'upon this rock I will build my church' mean?",
    a: [
      "The OCA Q&A presents the Orthodox interpretation of Matthew 16:18.",
      "It emphasizes the confession of faith in Christ and Christ Himself as the true foundation.",
    ].join("\n\n"),
    sourceLabel: "OCA – On this Rock I will build my church (Q&A)",
    sourceUrl: "https://www.oca.org/questions/history/on-this-rock-i-will-build-my-church",
  },
  {
    category: "Church history",
    q: "What is the 'branch theory' and how does Orthodoxy view it?",
    a: [
      "The OCA Q&A addresses 'branch theory' (the idea that the Church exists as multiple equal branches).",
      "Orthodoxy typically rejects this as inadequate, because the Church is one and visible, not a federation of separate bodies.",

    ].join("\n\n"),
    sourceLabel: "OCA – Orthodox Christianity and the Branch Theory (Q&A)",
    sourceUrl:
      "https://www.oca.org/questions/history/orthodox-christianity-and-the-branch-theory",
  },

  // --- Other Christians / other confessions ---
  {
    category: "Other Christians",
    q: "What about other Christians? Can they be saved?",
    a: [
      "We hold to the truth that the Orthodox Church is the Church of Christ.",
      "We also trust the mercy of God and avoid pretending we can read hearts or judge the final state of anyone.",
      "If you're asking this because you have family or friends, talk with your priest. He can help you keep both truth and love.",
    ].join("\n\n"),
    sourceLabel: "OCA – What about other Christians…? (Q&A)",
    sourceUrl: "https://www.oca.org/questions/teaching/what-about-other-christians",
  },
  {
    category: "Other Christians",
    q: "May Orthodox receive Communion in Roman Catholic churches?",
    a: [
      "The OCA Q&A states that Orthodox Christians are not permitted to receive Communion in non-Orthodox communities, because Eucharistic communion expresses a unity that does not yet exist.",
      "This isn't a judgment of personal holiness; it's an ecclesial reality.",
    ].join("\n\n"),
    sourceLabel: "OCA – Communion in Roman Catholic Church (Q&A)",
    sourceUrl: "https://www.oca.org/questions/romancatholicism/communion-in-roman-catholic-church",
  },
  {
    category: "Other Christians",
    q: "Orthodox worship vs. contemporary worship. What's the difference?",
    a: [
      "This can be a charged topic. A simple starting point is this: Orthodox worship is received, not invented.",
      "We pray with the Church across time, centered on Scripture, the sacraments, and the life of the parish.",
      "If you're visiting for the first time, come in peace. Stand where you can, follow along as you are able, and ask questions after.",
    ].join("\n\n"),
    sourceLabel: "OCA – Orthodox Worship vs. Contemporary Worship (Q&A)",
    sourceUrl: "https://www.oca.org/questions/teaching/orthodox-worship-vs-contemporary-worship",
  },
  {
    category: "Other Christians",
    q: "How does the OCA address credibility / historical legitimacy of Orthodoxy?",
    a: [
      "The OCA Q&A 'Credibility of the Orthodox Church' addresses historical and spiritual questions from someone coming from an evangelical background.",
      "It's helpful if you're sorting out whether Orthodoxy is 'just another denomination' or the continuation of apostolic Christianity.",
    ].join("\n\n"),
    sourceLabel: "OCA – Credibility of the Orthodox Church (Q&A)",
    sourceUrl:
      "https://www.oca.org/questions/otherconfessions/credibility-of-the-orthodox-church",
  },
  {
    category: "Other Christians",
    q: "Are Orthodox Christians 'Bible-believing'?",
    a: [
      "The OCA Q&A answers this by clarifying that Orthodoxy deeply affirms Holy Scripture.",
      "The key distinction is that Scripture is received and interpreted within the Church's life and Holy Tradition, not in isolation.",
    ].join("\n\n"),
    sourceLabel: "OCA – Are Orthodox Christians 'Bible believing'? (Q&A)",
    sourceUrl:
      "https://www.oca.org/questions/otherconfessions/are-orthodox-christians-bible-believing",
  },

  // --- Priesthood / monasticism ---
  {
    category: "Priesthood & monasticism",
    q: "How does someone become a priest?",
    a: [
      "The OCA provides practical guidance on discernment, parish involvement, mentoring, and seminary.",
      "The point is not a 'career track,' but a tested vocation under the Church's blessing.",
    ].join("\n\n"),
    sourceLabel: "OCA – Procedure to Become a Priest (Q&A)",
    sourceUrl:
      "https://www.oca.org/questions/priesthoodmonasticism/procedure-to-become-a-priest",
  },
  {
    category: "Priesthood & monasticism",
    q: "What requirements lead toward priesthood?",
    a: [
      "The OCA Q&A emphasizes prayer, participation in services, tested character, and mentoring relationships.",
      "It also encourages contacting seminaries and speaking honestly with one's pastor and bishop.",
    ].join("\n\n"),
    sourceLabel: "OCA – Requirements That Lead to Priesthood (Q&A)",
    sourceUrl:
      "https://www.oca.org/questions/priesthoodmonasticism/requirements-that-lead-to-priesthood",
  },
  {
    category: "Priesthood & monasticism",
    q: "Where can I browse more on priesthood and monastic life?",
    a: [
      "The OCA has a Priesthood / Monasticism Q&A index.",
      "Use it to explore questions about vocation, ordination, and monastic life.",
    ].join("\n\n"),
    sourceLabel: "OCA – Priesthood / Monasticism (Q&A index)",
    sourceUrl: "https://www.oca.org/questions/priesthoodmonasticism",
  },

  // --- Death & funerals ---
  {
    category: "Death & funerals",
    q: "What does the OCA say about cremation?",
    a: [
      "The OCA Q&A explains that the Church normally prefers burial, connected to the Christian hope of resurrection.",
      "It also notes there have been rare circumstances where cremation happened by necessity or economia.",
      "For a real-life decision, this should be handled pastorally with your priest.",
    ].join("\n\n"),
    sourceLabel: "OCA – Cremation (Q&A)",
    sourceUrl: "https://www.oca.org/questions/deathfunerals/cremation",
  },
  {
    category: "Death & funerals",
    q: "Where can I find guidance on memorials and prayers for the departed?",
    a: [
      "The OCA has a Death / Funerals Q&A index which includes memorial practices and services.",
      "When you're dealing with a real situation, speak with the priest in your parish.",
    ].join("\n\n"),
    sourceLabel: "OCA – Death / Funerals (Q&A index)",
    sourceUrl: "https://www.oca.org/questions/deathfunerals",
  },
];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function categoryOrder(c: Exclude<Category, "All">) {
  const order: Array<Exclude<Category, "All">> = [
    "Daily life",
    "Prayer",
    "Worship",
    "Sacraments",
    "Scripture",
    "Saints & icons",
    "Parish life",
    "Liturgical year",
    "Liturgical arts",
    "Church history",
    "Other Christians",
    "Priesthood & monasticism",
    "Death & funerals",
  ];
  return order.indexOf(c) === -1 ? 999 : order.indexOf(c);
}

export function CatechesisQA() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");

  const categories = useMemo(() => {
    const set = new Set<Exclude<Category, "All">>();
    for (const item of QA_ITEMS) set.add(item.category);
    return Array.from(set).sort((a, b) => categoryOrder(a) - categoryOrder(b));
  }, []);

  const countsByCategory = useMemo(() => {
    const counts = new Map<Category, number>();
    counts.set("All", QA_ITEMS.length);
    for (const c of categories) counts.set(c, 0);
    for (const item of QA_ITEMS) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
    return counts;
  }, [categories]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return QA_ITEMS.filter((item) => {
      const categoryOk = category === "All" ? true : item.category === category;
      if (!categoryOk) return false;
      if (!q) return true;
      const hay = `${item.q}\n${item.a}\n${item.sourceLabel}\n${item.sourceUrl}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    const map = new Map<Exclude<Category, "All">, QA[]>();
    for (const c of categories) map.set(c, []);
    for (const item of filtered) map.get(item.category)?.push(item);
    return map;
  }, [filtered, categories]);

  function selectCategory(value: string) {
    if (value === "All") {
      setCategory("All");
      return;
    }

    if (categories.includes(value as Exclude<Category, "All">)) {
      setCategory(value as Exclude<Category, "All">);
    }
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Catechesis (Q&A)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Short summaries + direct OCA sources.
            </p>
          </div>
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="grid gap-2">
            <Label htmlFor="qa-search" className="text-xs font-semibold tracking-wide text-muted-foreground">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="qa-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: confession, icons, fasting, Bible…"
                className="h-11 rounded-2xl pl-10"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="qa-category" className="text-xs font-semibold tracking-wide text-muted-foreground">
              Category
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={category} onValueChange={selectCategory}>
                <SelectTrigger id="qa-category" className="h-11 rounded-2xl">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="max-h-[60vh]">
                  <SelectItem value="All">
                    All ({countsByCategory.get("All") ?? 0})
                  </SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c} ({countsByCategory.get(c) ?? 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-2xl border-border/60"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span>.
          </p>
          <Button asChild variant="outline" className="btn-wrap rounded-2xl border-border/60">
            <a href="https://www.oca.org/questions" target="_blank" rel="noopener noreferrer">
              Full OCA Q&A index <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </Card>

      {!filtered.length ? (
        <EmptyState
          icon={<SearchX className="h-5 w-5" />}
          title="No matching questions"
          description="Try a broader search term, choose All categories, or open the full OCA Q&A index."
          action={
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-border/60"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : category === "All" ? (
        <div className="grid gap-4">
          {categories.map((c) => {
            const items = grouped.get(c) ?? [];
            if (!items.length) return null;

            return (
              <Card key={c} className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight">{c}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {items.length} question{items.length === 1 ? "" : "s"}
                  </p>
                </div>

                <Separator className="my-4" />

                <Accordion type="multiple" className="w-full">
                  {items.map((item, idx) => (
                    <AccordionItem
                      key={`${c}:${item.q}:${idx}`}
                      value={`${c}:${idx}`}
                      className="border-none"
                    >
                      <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
                        <span className="pr-3">{item.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-3">
                        <div className="grid gap-3">
                          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                            {item.a}
                          </p>

                          <div className="grid gap-2">
                            <Button
                              asChild
                              variant="outline"
                              className="btn-wrap rounded-2xl border-border/60"
                            >
                              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                                {item.sourceLabel} <ExternalLink className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                            <div className="break-words text-xs text-muted-foreground">
                              Source: "{item.sourceUrl}"
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div>
            <h3 className="text-base font-semibold tracking-tight">{category}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} question{filtered.length === 1 ? "" : "s"}
            </p>
          </div>

          <Separator className="my-4" />

          <Accordion type="multiple" className="w-full">
            {filtered.map((item, idx) => (
              <AccordionItem
                key={`${item.category}:${item.q}:${idx}`}
                value={`qa-${idx}`}
                className="border-none"
              >
                <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
                  <span className="pr-3">{item.q}</span>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="grid gap-3">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                      {item.a}
                    </p>

                    <div className="grid gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="btn-wrap rounded-2xl border-border/60"
                      >
                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                          {item.sourceLabel} <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                      <div className="break-words text-xs text-muted-foreground">
                        Source: "{item.sourceUrl}"
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-4 break-words text-xs text-muted-foreground">
            Full OCA Q&A index: "https://www.oca.org/questions"
          </p>
        </Card>
      )}
    </div>
  );
}