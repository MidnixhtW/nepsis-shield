import { useState } from "react";
import { BookOpen, Hand, MoonStar, Shield, Sun, Utensils, Sparkles, ExternalLink } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PrayerRule } from "@/components/app/PrayerRule";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function PrayerBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed">
        {lines.map((l, idx) => (
          <p key={idx}>{l}</p>
        ))}
      </div>
    </div>
  );
}

function LinkRow({
  label,
  href,
  note,
}: {
  label: string;
  href: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        {note ? <p className="mt-0.5 text-xs text-muted-foreground">{note}</p> : null}
      </div>
      <Button
        asChild
        variant="outline"
        className="mt-2 w-fit shrink-0 rounded-2xl border-border/60 sm:mt-0"
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          Open
        </a>
      </Button>
    </div>
  );
}

const trisagion = [
  "Holy God, Holy Mighty, Holy Immortal, have mercy on us. (3x)",
  "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
  "O Most Holy Trinity, have mercy on us; Lord, cleanse us from our sins; Master, pardon our transgressions; Holy One, visit and heal our infirmities for Thy Name's sake.",
  "Lord, have mercy. (3x)",
  "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
  "Our Father, Who art in heaven, hallowed be Thy Name. Thy kingdom come. Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.",
];

const morningTrinity = [
  "TO THE HOLY TRINITY:",
  "Having arisen from sleep, we fall down before Thee, O Blessed One, and sing to Thee, O Mighty One, the angelic hymn: Holy! Holy! Holy! art Thou, O God; through the Theotokos, have mercy on us.",
  "Glory to the Father, and to the Son, and to the Holy Spirit.",
  "Do Thou, O Lord, Who hast raised me from my bed and from sleep, enlighten my mind and heart, and open my lips that I may praise Thee, O Holy Trinity: Holy! Holy! Holy! art Thou, O God; through the Theotokos, have mercy on us.",
  "Now and ever and unto ages of ages. Amen.",
  "The Judge will come suddenly and the acts of every man will be revealed; but with fear we cry in the middle of the night: Holy! Holy! Holy! art Thou, O God; through the Theotokos, have mercy on us.",
];

const morningFather = [
  "TO THE FATHER:",
  "O Lord Almighty, God of hosts and of all flesh, dwelling in the highest, caring for the humble, searching the reins and the heart, and clearly discerning the hidden things of men - O unoriginate and ever-existing Light, with whom there is no variation or shadow due to change, do Thou, O immortal King, accept our prayers which we offer to Thee at this present time from our soiled lips, trusting in the multitude of Thy bounties - forgive us our transgressions which we have committed knowingly or unknowingly, whether in word or deed or thought; cleanse us from all stain of body and soul. Grant us to pass through all the night of this present life with vigilant heart and sober thought, awaiting the coming of the radiant and manifest Day of Thy only-begotten Son, our Lord and God and Savior Jesus Christ, on which the judgment of all men shall come with glory, when to each man shall be given the reward of his deeds. May we not fall and become lazy, but instead have courage that, being roused to action, we may be found ready to enter into the joy and the divine bride-chamber of His glory, where the voice of those who feast is unceasing, and the gladness of those who behold the goodness of Thy countenance is unending. For Thou art the True light Who enlightenest and sanctifiest all things, and all creation sings Thy praise forever. Amen.",
];

const morningTheotokos = [
  "TO THE THEOTOKOS:",
  "I sing the praises of your grace, O Lady, entreating you to enrich my mind with grace! Teach me to walk uprightly, in the way of Christ's commandments. Strengthen my vigilance in song and prayer, which drive away the despair of sleep. Free me by your entreaties, O Bride of God, who am bound by sinful garments. Protect me in the night and in the day, delivering me from the enemies who contend against me. Give life to me who have been deadened by passion, you that gave birth to the life-giving God. Enlighten my blinded soul, you that gave birth to the never-ending light. O wonderful Palace of the Master, make me a house of the Divine Spirit. You that gave birth to the Physician, make well the passions of my soul. Lead me who am bestormed by life to the ways of repentance. Deliver me from the eternal flames. Do not show me to be the joy of demons because of my many sins.",
  "Establish me anew who have been made senseless by transgressions, O Blameless One. Show me a stranger to every torment, and entreat the Master of All. Enable me to attain to the gladness of Heaven together with all the saints. O most Holy Virgin, hear the voice of your unprofitable servant. Grant me a stream of tears, O Most Pure One, to wash away the defilement of my soul. I bring to you the groaning of my heart unceasingly; beseech the Master to listen. Accept my prayerful service and bear it to the compassionate God! You that are higher than the angels, make me to be above the gloominess of the world. O light-bearing Cloud of Heaven, establish spiritual grace in me. Although stained by sin, I raise my hands and open my lips in praise of you! Deliver me from soul-corrupting wounds, entreating Christ fervently. To Him honor and worship are due, now and ever and unto ages of ages. Amen.",
];

const morningAngel = [
  "TO THE GUARDIAN ANGEL:",
  "O Holy Angel, keeping guard over my wretched soul and my passionate life, do not forsake me, a sinner, nor depart from me because of my incontinence. Do not give the evil enemy room to overcome me by force of this mortal body. Strengthen my weak and feeble hand, and set me on the way of salvation. Yea, O Holy Angel of God, guardian and protector of my wretched soul and body, forgive me everything by which I have offended you all the days of my life, and even what I have done this past night; protect me during this day, and guard me from every temptation of the enemy, that I may not anger God by any sin. Pray to the Lord for me, that He may confirm me in His fear and prove me a worthy servant of His goodness. Amen.",
];

const morningPatron = [
  "TO ONE'S PATRON SAINT:",
  "Pray to God for me, O Saint _____________ well-pleasing to God. I fervently entreat you who are the sure help and intercessor for my soul.",
];

const eveningIntro = [
  "Have mercy on us, O Lord, have mercy on us; for laying aside all excuse, we sinners offer to Thee, as to our Master, this supplication: Have mercy on us.",
  "Glory to the Father, and to the Son, and to the Holy Spirit.",
  "O Lord, have mercy on us, for in Thee have we put our trust. Do not be angry with us, nor remember our iniquities, but look down on us even now, since Thou art compassionate, and deliver us from our enemies. For Thou art our God, and we are Thy people; we are all the work of Thy hands, and we call on Thy name.",
  "Now and ever and unto ages of ages. Amen.",
  "O blessed Theotokos, open the doors of compassion to us whose hope is in you, that we may not perish but be delivered from adversity through you, who are the salvation of the Christian people.",
];

const eveningFather = [
  "TO THE FATHER:",
  "O Eternal God, King of every creature, Who hast enabled me to attain to this hour, forgive me the sins which I have committed this day by thought, word and deed. Cleanse my humble soul, O Lord, from every defilement of flesh and spirit. Grant me, O Lord, to pass through the sleep of this night in peace, that I may rise from my humble bed and please Thy most Holy Name all the days of my life, vanquishing the enemies both fleshly and bodiless that contend against me. Deliver me from vain thoughts that defile me, O Lord, and from evil desires. For Thine is the Kingdom, and the power, and the glory: of the Father, and of the Son, and of the Holy Spirit, now and ever and unto ages of ages. Amen.",
];

const eveningChrist = [
  "TO JESUS CHRIST:",
  "O Almighty Word of the Father, Jesus Christ, Who art Thyself perfect: Because of Thy great mercy, do not ever depart from me, Thy servant, but always abide in me. O Jesus, Good Shepherd of Thy sheep, let me not fall into the disobedience of the serpent, nor leave me to the will of Satan, for the seeds of corruption are in me. O Lord God adorable, O Holy King Jesus, guard me while I sleep with the unfading light, Thy Holy Spirit, through Whom Thou didst sanctify Thy disciples. Grant even to me, Thy unworthy servant, O Lord, Thy salvation upon my bed. Enlighten my mind with the light of the understanding of Thy Gospel; my soul with love of Thy Cross; my heart with the purity of Thy word; my body with Thy passionless passion; preserve my thought in Thy humility, and raise me at the time proper for Thy glorification. For Thou art most glorified with Thy Father, Who is without beginning, and Thy Most Holy Spirit, unto the ages. Amen.",
];

const eveningSpirit = [
  "TO THE HOLY SPIRIT:",
  "O Lord, Heavenly King, Comforter, the Spirit of Truth, be compassionate and have mercy on me, Thy sinful servant. Remit and forgive me, the unworthy one, all the things which I have sinned as a man, both voluntary and involuntary, in knowledge and in ignorance: from my youth, from learning of evil, and from emptiness or despair. If I swore with Thy name, or stained it in my reasoning; or dishonored someone; or cursed someone with my anger; or saddened him; or if I have become angry over something; or lied; or slept unfittingly; or if a poor man came to me and I despised him; or if I saddened my brother; or frustrated or judged someone; or became puffed up and proud; or if while standing in prayer my mind was moved by the evil of this world; or contemplated suicide; or over ate and over drank, or laughed without reason; or thought of evil; or if I saw another's good and was bound by it in my heart; or spoke in an unseemly manner; or laughed at my brother's sin; forgive me, for my sins are countless in number. If I have forsaken prayer, or done anything evil - I do not remember, for I have committed even more! Have mercy on me, O Master my Creator, Thine unworthy and unprofitable servant. Forgive, remit, and loose my sins, for Thou art gracious and lovest mankind; that I may rest in peace and sleep, though a prodigal, sinful and wretched, so that I may adore and praise and glorify Thy most honorable Name, together with the Father and His only-begotten Son, now and ever and unto ages of ages. Amen.",
];

const eveningTheotokos = [
  "TO THE VIRGIN THEOTOKOS:",
  "Rejoice! O Virgin Theotokos! Mary, full of Grace, the Lord is with you. Blessed are you among women, and blessed is the fruit of your womb, for you have borne the Savior of our souls!",
  "O victorious leader of triumphant host! We, your servants, delivered from evil, sing our grateful thanks to you, O Theotokos! As you possess invincible might set us free from every calamity so that we may sing: Rejoice! O unwedded Bride!",
];

const nightPrayer = [
  "BEFORE SLEEP:",
  "O Lord Jesus Christ our God, as Thou art good and lovest mankind, forgive me all the sins I have committed today in word, deed, and thought.",
  "Grant me peaceful and undisturbed sleep. Send Thy guardian angel to protect and keep me from all evil. Into Thy hands I commend my soul and body. Amen.",
  "Beneath your compassion we take refuge, O Theotokos. Despise not our petitions in time of trouble, but deliver us from dangers, only Pure One, only Blessed One.",
];

const theotokosShort = [
  "MOST HOLY THEOTOKOS:",
  "Most Holy Theotokos, save us.",
  "Beneath your compassion we take refuge, O Theotokos. Despise not our petitions in time of trouble, but deliver us from dangers, only Pure One, only Blessed One.",
  "It is truly meet to bless you, O Theotokos, ever-blessed and most pure, and the Mother of our God. More honorable than the Cherubim, and beyond compare more glorious than the Seraphim, without corruption you gave birth to God the Word. True Theotokos, we magnify you.",
];

const stMichaelInvocation = [
  "HOLY ARCHANGEL MICHAEL:",
  "Holy Archangel Michael, commander of the bodiless hosts, defend us and pray to God for us.",
  "Guard us from fear, anger, pride, and every temptation that darkens the heart.",
  "By your prayers, may Christ our God grant us courage with humility, strength with mercy, and watchfulness in every duty. Amen.",
];

const stMichaelBeforeWatch = [
  "BEFORE WATCH OR DUTY:",
  "Holy Archangel Michael, stand with those who keep watch tonight: soldiers, sailors, airmen, guardians, first responders, and all who bear responsibility for others.",
  "Ask the Lord to make us alert without anxiety, firm without cruelty, and ready to protect life with sober judgment.",
  "Keep our minds attentive, our hands restrained, and our hearts turned toward Christ. Amen.",
];

const stMichaelProtection = [
  "FOR PROTECTION WITHOUT HATRED:",
  "Holy Archangel Michael, defender of the faithful, pray that God would protect us from danger seen and unseen.",
  "Do not let fear become hatred in us, nor courage become pride. Teach us to resist evil while remembering that every person is made in the image of God.",
  "May the Lord cover the innocent, strengthen the weary, heal the wounded, and bring all things under His mercy. Amen.",
];

type SaintPrayer = {
  id: string;
  title: string;
  subtitle?: string;
  category:
    | "north_america"
    | "teachers"
    | "modern"
    | "martyrs"
    | "monastics"
    | "women"
    | "angels"
    | "other";
  lines: string[];
  ocaTroparionUrl?: string;
};

const SAINT_PRAYERS: SaintPrayer[] = [
  {
    id: "michael",
    title: "Archangel Michael",
    subtitle: "Bodiless powers",
    category: "angels",
    lines: ["Holy Archangel Michael, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2021/09/06/102517-commemoration-of-the-miracle-of-the-archangel-michael-at-colossa",
  },
  {
    id: "john_forerunner",
    title: "St. John the Forerunner",
    subtitle: "Prophet and Baptist",
    category: "other",
    lines: ["Holy Prophet and Forerunner John, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2022/01/07/100109-synaxis-of-the-holy-glorious-prophet-forerunner-and-baptist-john",
  },
  {
    id: "nicholas",
    title: "St. Nicholas",
    subtitle: "Wonderworker of Myra",
    category: "other",
    lines: ["Holy Hierarch Nicholas, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2021/12/06/103484-saint-nicholas-the-wonderworker-archbishop-of-myra-in-lycia",
  },
  {
    id: "george",
    title: "St. George",
    subtitle: "Great Martyr",
    category: "martyrs",
    lines: ["Holy Great Martyr George, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2020/07/03/205460-saint-george-the-god-bearer",
  },
  {
    id: "demetrios_thessaloniki",
    title: "St. Demetrios",
    subtitle: "Myrrh-gusher of Thessaloniki",
    category: "martyrs",
    lines: ["Holy Great Martyr Demetrios, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2022/10/26/103059-holy-glorious-demetrios-the-myrrh-gusher-of-thessaloniki",
  },
  {
    id: "katherine",
    title: "St. Katherine (Catherine)",
    subtitle: "Great Martyr of Alexandria",
    category: "women",
    lines: ["Holy Great Martyr Katherine, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2018/11/24/103382-great-martyr-katherine-of-alexandria",
  },
  {
    id: "mary_magdalene",
    title: "St. Mary Magdalene",
    subtitle: "Equal-to-the-Apostles",
    category: "women",
    lines: ["Holy Myrrhbearer Mary Magdalene, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2023/07/22/102070-myrrhbearer-and-equal-of-the-apostles-mary-magdalene",
  },
  {
    id: "xenia",
    title: "Blessed Xenia",
    subtitle: "of St. Petersburg",
    category: "women",
    lines: ["Blessed Xenia, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2020/01/24/100297-blessed-xenia-of-st-petersburg",
  },
  {
    id: "elizabeth_new_martyr",
    title: "New Martyr Elizabeth",
    subtitle: "Grand Duchess",
    category: "women",
    lines: ["Holy New Martyr Elizabeth, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2022/07/18/101915-grand-duchess-elizabeth",
  },

  // Teachers / Hierarchs
  {
    id: "basil",
    title: "St. Basil the Great",
    subtitle: "Archbishop of Caesarea",
    category: "teachers",
    lines: ["Holy Hierarch Basil, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/1003/01/01/100003-saint-basil-the-great-archbishop-of-caesarea-in-cappadocia",
  },
  {
    id: "gregory_theologian",
    title: "St. Gregory the Theologian",
    subtitle: "Archbishop of Constantinople",
    category: "teachers",
    lines: ["Holy Hierarch Gregory, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/20112021/01/25/100298-saint-gregory-the-theologian-archbishop-of-constantinople",
  },
  {
    id: "john_chrysostom",
    title: "St. John Chrysostom",
    subtitle: "Golden-mouthed",
    category: "teachers",
    lines: ["Holy Hierarch John Chrysostom, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2019/11/13/103292-saint-john-chrysostom-archbishop-of-constantinople",
  },
  {
    id: "three_hierarchs",
    title: "Three Holy Hierarchs",
    subtitle: "Basil, Gregory, John",
    category: "teachers",
    lines: ["Holy Hierarchs Basil, Gregory, and John, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2025/01/30/100350-synaxis-of-the-ecumenical-teachers-and-hierarchs-basil-the-great",
  },
  {
    id: "nectarios",
    title: "St. Nectarios",
    subtitle: "of Aegina",
    category: "modern",
    lines: ["Holy Hierarch Nectarios, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2020/11/09/103251-saint-nectarius-kephalas-metropolitan-of-pentapolis",
  },

  // Monastics / modern saints
  {
    id: "seraphim",
    title: "St. Seraphim of Sarov",
    subtitle: "Venerable Wonderworker",
    category: "monastics",
    lines: ["Venerable Father Seraphim, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2025/01/02/100008-repose-of-venerable-seraphim-wonderworker-of-sarov",
  },
  {
    id: "silouan",
    title: "St. Silouan",
    subtitle: "of Mount Athos",
    category: "monastics",
    lines: ["Venerable Father Silouan, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2025/09/24/102722-venerable-silouan-of-mount-athos",
  },
  {
    id: "paisios_athos",
    title: "St. Paisios",
    subtitle: "of the Holy Mountain",
    category: "modern",
    lines: ["Venerable Father Paisios, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2023/07/12/100401-venerable-paisios-of-the-holy-mountain",
  },
  {
    id: "ephraim",
    title: "St. Ephraim",
    subtitle: "the Syrian",
    category: "teachers",
    lines: ["Venerable Father Ephraim, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2026/01/28/100328-venerable-ephraim-the-syrian",
  },
  {
    id: "mary_of_egypt",
    title: "St. Mary of Egypt",
    subtitle: "Model of repentance",
    category: "women",
    lines: ["Venerable Mother Mary of Egypt, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2025/04/01/100963-venerable-mary-of-egypt",
  },
  {
    id: "john_kronstadt",
    title: "St. John of Kronstadt",
    subtitle: "Righteous pastor",
    category: "modern",
    lines: ["Righteous Father John of Kronstadt, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2025/12/20/103598-repose-of-saint-john-of-kronstadt",
  },
  {
    id: "luke_crimea",
    title: "St. Luke",
    subtitle: "Archbishop of Simferopol",
    category: "modern",
    lines: ["Holy Hierarch Luke, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2020/06/11/100476-saint-luke-archbishop-of-simferopol",
  },

  // North America
  {
    id: "herman",
    title: "St. Herman of Alaska",
    subtitle: "Wonderworker of All America",
    category: "north_america",
    lines: ["Venerable Father Herman, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2016/12/13/103530-repose-of-venerable-herman-of-alaska-wonderworker-of-all-america",
  },
  {
    id: "innocent_alaska",
    title: "St. Innocent",
    subtitle: "Enlightener of Alaska",
    category: "north_america",
    lines: ["Holy Hierarch Innocent, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2016/03/31/100954-repose-of-saint-innocent-metropolitan-of-moscow-enlightener-of-t",
  },
  {
    id: "alexis_toth",
    title: "St. Alexis Toth",
    subtitle: "Defender of Orthodoxy in America",
    category: "north_america",
    lines: ["Righteous Father Alexis, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2025/05/07/101300-repose-of-saint-alexis-toth-confessor-and-defender-of-orthodoxy",
  },
  {
    id: "raphael_brooklyn",
    title: "St. Raphael of Brooklyn",
    subtitle: "Bishop and shepherd",
    category: "north_america",
    lines: ["Holy Hierarch Raphael, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/4465/02/27/100610-repose-of-saint-raphael-bishop-of-brooklyn",
  },
  {
    id: "juvenal",
    title: "Martyr Juvenal",
    subtitle: "of Alaska",
    category: "north_america",
    lines: ["Holy Martyr Juvenal, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2025/09/24/102714-martyr-juvenal-of-alaska",
  },

  // Other
  {
    id: "demetrios_rostov",
    title: "St. Demetrius",
    subtitle: "Metropolitan of Rostov",
    category: "teachers",
    lines: ["Holy Hierarch Demetrius of Rostov, pray to God for us."],
    ocaTroparionUrl:
      "https://www.oca.org/saints/troparia/2025/10/28/103088-saint-demetrius-dimitri-metropolitan-of-rostov",
  },
];

const SAINT_FILTERS: Array<{ id: string; label: string; cats: SaintPrayer["category"][] }> = [
  {
    id: "all",
    label: "All",
    cats: [
      "north_america",
      "teachers",
      "modern",
      "martyrs",
      "monastics",
      "women",
      "angels",
      "other",
    ],
  },
  { id: "north", label: "North America", cats: ["north_america"] },
  { id: "teachers", label: "Teachers", cats: ["teachers"] },
  { id: "modern", label: "Modern", cats: ["modern"] },
  { id: "martyrs", label: "Martyrs", cats: ["martyrs"] },
  { id: "monastic", label: "Monastics", cats: ["monastics"] },
  { id: "women", label: "Women", cats: ["women"] },
  { id: "angels", label: "Angels", cats: ["angels"] },
];

const stMichael = [
  "HOLY ARCHANGEL MICHAEL:",
  "Holy Archangel Michael, pray to God for us.",
];

const stNicholas = [
  "SAINT NICHOLAS:",
  "Holy Hierarch Nicholas, pray to God for us.",
];

const stJohnForerunner = [
  "SAINT JOHN THE FORERUNNER:",
  "Holy Prophet and Forerunner John, pray to God for us.",
];

const stGeorge = [
  "SAINT GEORGE:",
  "Holy Great Martyr George, pray to God for us.",
];

const stMaryOfEgypt = [
  "SAINT MARY OF EGYPT:",
  "Venerable Mother Mary of Egypt, pray to God for us.",
];

const jesus = ["Lord Jesus Christ, Son of God, have mercy on me, a sinner."];

const sharedPrayerBasics = [
  "THE LORD'S PRAYER:",
  "Our Father, Who art in heaven, hallowed be Thy Name. Thy kingdom come. Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.",
  "JESUS PRAYER: Lord Jesus Christ, Son of God, have mercy on me, a sinner",
  jesus[0],
  "BEFORE READING THE HOLY SCRIPTURE:",
  "Illumine our hearts, O Master Who lovest mankind, with the pure light of Thy divine knowledge. Open the eyes of our mind to the understanding of Thy gospel teachings. Implant also in us the fear of Thy blessed commandments, that trampling down all carnal desires, we may enter upon a spiritual manner of living, both thinking and doing such things as are well-pleasing unto Thee. For Thou art the illumination of our souls and bodies, O Christ our God, and unto Thee we ascribe glory, together with Thy Father, Who is from everlasting, and Thine all-holy, good, and life-creating Spirit, now and ever and unto ages of ages. Amen.",
];

const repentancePrayer = [
  "Lord Jesus Christ, Son of the living God, I have sinned in thought, word, deed, and neglect. Do not let shame drive me from You. Give me true repentance, courage to confess what must be confessed, and a humble heart that seeks mercy rather than excuses. Amen.",
];

const griefPrayer = [
  "O Christ our God, Who wept at the tomb of Lazarus, be near to me in sorrow. Receive my tears, strengthen my hope in Your Resurrection, and grant rest, comfort, and peace to all who suffer and all who have departed this life in faith and hope. Amen.",
];

const thanksgivingPrayer = [
  "Glory to You, O God, for every mercy seen and unseen: for breath, daily bread, forgiveness, friends, family, the Church, and the hope of the Resurrection. Teach me to receive every gift with gratitude and to share it with love. Amen.",
];

const mercyPrayer = [
  "Lord, make me attentive today. Show me the person I am tempted to ignore, the apology I am tempted to delay, and the act of mercy I am tempted to postpone. Help me love not in words only, but in deed and truth. Amen.",
];

// From: https://www.oca.org/orthodoxy/prayers/before-and-after-meals
const beforeMeals = [
  "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
  "Our Father, Who art in Heaven, hallowed be Thy name. Thy Kingdom come. Thy will be done, on earth as it is in Heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.",
  "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
  "Lord, have mercy. (3x)",
  "O Christ our God, bless the food, drink, and fellowship of Thy servants, for Thou art holy always, now and ever and unto ages of ages. Amen.",
];

// From: https://www.oca.org/orthodoxy/prayers/before-and-after-meals
const afterMeals = [
  "We give thanks to Thee, O Christ our God, that Thou hast satisfied us with Thy earthly blessings; deprive us not also of Thy Heavenly Kingdom.",
  "As Thou didst come to Thy disciples and didst grant them peace; so come to us and save us, O Savior.",
  "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
  "Lord, have mercy. (3x)",
  "Blessed is God, Who has fed and nourished us with His bountiful gifts by His grace and compassion always, now and ever and unto ages of ages. Amen.",
];

const ocaOccasions = [
  {
    label: "Prayers for Various Occasions (index)",
    href: "https://www.oca.org/orthodoxy/prayers",
    note: "OCA's official prayer collection (daily + special occasions).",
  },
  {
    label: "OCA PDF: Prayers for Morning, Day & Night",
    href: "https://www.oca.org/files/PDF/Music/Daily/morning-evening-prayers.pdf",
    note: "Printable OCA PDF of daily prayers.",
  },
  {
    label: "Before & after any Work",
    href: "https://www.oca.org/orthodoxy/prayers/before-and-after-any-work",
  },
  {
    label: "Before reading the Holy Scripture",
    href: "https://www.oca.org/orthodoxy/prayers/before-reading-the-holy-scripture",
  },
  {
    label: "Prayer for Travel",
    href: "https://www.oca.org/orthodoxy/prayers/prayer-for-travel",
  },
  {
    label: "For the Sick",
    href: "https://www.oca.org/orthodoxy/prayers/for-the-sick",
  },
  {
    label: "For the Departed",
    href: "https://www.oca.org/orthodoxy/prayers/for-the-departed",
  },
  {
    label: "OCA PDF: Prayers for the sick",
    href: "https://www.oca.org/files/PDF/AboutOrthChrist/prayers/sick.pdf",
    note: "Printable PDF (OCA).",
  },
  {
    label: "OCA PDF: Prayers for the departed",
    href: "https://www.oca.org/files/PDF/AboutOrthChrist/prayers/departed.pdf",
    note: "Printable PDF (OCA).",
  },
  {
    label: "OCA PDF: Before/after any work",
    href: "https://www.oca.org/files/PDF/AboutOrthChrist/prayers/work.pdf",
    note: "Printable PDF (OCA).",
  },
];

const prayerSources = [
  {
    group: "Greek Orthodox Archdiocese of America (GOARCH)",
    items: [
      {
        label: "Personal & Devotional Prayers",
        href: "https://www.goarch.org/chapel/prayers",
        note: "In communion with OCA.",
      },
      {
        label: "Prayers for the Sick",
        href: "https://www.goarch.org/-/prayers-for-the-sick",
      },
      {
        label: "Prayers Before Sleep",
        href: "https://www.goarch.org/-/prayers-before-sleep",
      },
      {
        label: "Communion of the Sick",
        href: "https://www.goarch.org/-/communion-of-the-sick",
      },
      {
        label: "Blessing of Vehicles of Travel",
        href: "https://www.goarch.org/-/prayer-at-the-blessing-of-vehicles-of-travel",
      },
    ],
  },
  {
    group: "Antiochian Orthodox Christian Archdiocese (North America)",
    items: [
      {
        label: "Prayers (index)",
        href: "https://www.antiochian.org/prayers",
        note: "In communion with OCA.",
      },
      {
        label: "Morning Prayers",
        href: "https://www.antiochian.org/morning-prayers",
      },
      {
        label: "Morning Prayers (PDF)",
        href: "https://antiochianprodsa.blob.core.windows.net/websiteattachments/Morning%20Prayers.pdf",
        note: "Printable PDF.",
      },
      {
        label: "Liturgical resources",
        href: "https://www.antiochian.org/liturgicalresources",
      },
    ],
  },
  {
    group: "Ukrainian Orthodox Church of the USA (UOC-USA)",
    items: [
      {
        label: "Prayers for Orthodox Christians",
        href: "https://www.uocofusa.org/sr_prayers",
        note: "In communion with OCA.",
      },
    ],
  },
  {
    group: "Russian Orthodox Church Outside of Russia (ROCOR)",
    items: [
      {
        label: "Eastern American Diocese: Liturgical Resources",
        href: "https://eadiocese.org/litresource",
        note: "Canonical ROCOR resources (in communion with OCA).",
      },
      {
        label: "ROCOR Synod (official site)",
        href: "https://www.synod.com/synod/indexeng.htm",
      },
    ],
  },
  {
    group: "Serbian Orthodox Church (archived prayerbook pages)",
    items: [
      {
        label: "Prayer Book (English, archived)",
        href: "http://arhiva.spc.rs/eng/prayer_book.html",
        note: "Older archived content; useful as a reference.",
      },
      {
        label: "Molitvenik (Serbian, archived)",
        href: "http://arhiva.spc.rs/sr/molitvenik.html",
        note: "Serbian-language prayerbook (archived).",
      },
    ],
  },
  {
    group: "Assembly of Canonical Orthodox Bishops (US) – Liturgical Texts",
    items: [
      {
        label: "Liturgical Texts (official)",
        href: "https://www.assemblyofbishops.org/resources-and-publications/liturgical-texts",
        note: "Pan-Orthodox resources in the US.",
      },
    ],
  },
] as const;

export function PrayerBook({ showRule = true }: { showRule?: boolean }) {
  const [saintFilter, setSaintFilter] = useState<string>("all");
  const allowedCats =
    SAINT_FILTERS.find((f) => f.id === saintFilter)?.cats ??
    SAINT_FILTERS[0].cats;
  const filteredSaints = SAINT_PRAYERS.filter((p) => allowedCats.includes(p.category));

  return (
    <div className="grid gap-4">
      {showRule ? <PrayerRule /> : null}

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Prayers</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Daily prayers in-app, plus official links for many occasions.
            </p>
          </div>
          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Everyday
          </Badge>
        </div>

        <Separator className="my-4" />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="shared" className="border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Shared Christian basics
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    How to use this section
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    The Lord's Prayer, Jesus Prayer, and Scripture prayer here use standard Orthodox wording. The short repentance, grief, thanksgiving, and mercy prayers below are original devotional aids, not replacements for parish prayer books or services.
                  </p>
                </div>
                <PrayerBlock title="Common starting prayers" lines={sharedPrayerBasics} />
                <PrayerBlock title="Repentance" lines={repentancePrayer} />
                <PrayerBlock title="Grief and hope" lines={griefPrayer} />
                <PrayerBlock title="Thanksgiving" lines={thanksgivingPrayer} />
                <PrayerBlock title="Mercy today" lines={mercyPrayer} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="st-michael" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-primary/25 bg-primary/10 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> St. Michael the Archangel
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-primary/25 bg-background/50 p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    Patron of Nepsis Shield
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    These short prayers ask St. Michael's intercession and are written as devotional aids for watchfulness, duty, protection, and mercy. For full hymn texts, use the official Orthodox links below.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                      <a
                        href="https://www.oca.org/saints/troparia/2021/11/08/103244-synaxis-of-the-archangel-michael-and-the-other-bodiless-powers"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Synaxis hymn texts (OCA)
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                      <a
                        href="https://www.oca.org/saints/lives/2021/11/08/103244-synaxis-of-the-archangel-michael-and-the-other-bodiless-powers"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Life & feast note (OCA)
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <PrayerBlock title="Invocation" lines={stMichaelInvocation} />
                <PrayerBlock title="Before watch or duty" lines={stMichaelBeforeWatch} />
                <PrayerBlock title="Protection without hatred" lines={stMichaelProtection} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="morning" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <Sun className="h-4 w-4 text-primary" /> Morning
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <PrayerBlock title="Morning Prayers" lines={morningTrinity} />
                <PrayerBlock title="To the Father" lines={morningFather} />
                <PrayerBlock title="To the Theotokos" lines={morningTheotokos} />
                <PrayerBlock title="To the Guardian Angel" lines={morningAngel} />
                <PrayerBlock title="To one's Patron Saint" lines={morningPatron} />

                <Button
                  asChild
                  variant="outline"
                  className="btn-wrap rounded-2xl border-border/60"
                >
                  <a
                    href="https://www.oca.org/orthodoxy/prayers/morning-prayers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Full Morning Prayers (OCA)
                  </a>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="evening" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <MoonStar className="h-4 w-4 text-primary" /> Evening
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <PrayerBlock title="Evening Prayers" lines={eveningIntro} />
                <PrayerBlock title="To the Father" lines={eveningFather} />
                <PrayerBlock title="To Jesus Christ" lines={eveningChrist} />
                <PrayerBlock title="To the Holy Spirit" lines={eveningSpirit} />
                <PrayerBlock title="To the Virgin Theotokos" lines={eveningTheotokos} />

                <Button
                  asChild
                  variant="outline"
                  className="btn-wrap rounded-2xl border-border/60"
                >
                  <a
                    href="https://www.oca.org/orthodoxy/prayers/evening-prayers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Full Evening Prayers (OCA)
                  </a>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="night" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <MoonStar className="h-4 w-4 text-primary" /> Night / before sleep
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <PrayerBlock title="Before sleep" lines={nightPrayer} />
                <Button
                  asChild
                  variant="outline"
                  className="btn-wrap rounded-2xl border-border/60"
                >
                  <a
                    href="https://www.goarch.org/-/prayers-before-sleep"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    More prayers before sleep (GOARCH)
                  </a>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="occasions" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <Hand className="h-4 w-4 text-primary" /> OCA: Occasions
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    Official sources (OCA)
                  </p>
                  <div className="mt-3 grid gap-2">
                    {ocaOccasions.map((x) => (
                      <LinkRow key={x.href} label={x.label} href={x.href} note={x.note} />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="communion" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <Hand className="h-4 w-4 text-primary" /> More sources
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                {prayerSources.map((group) => (
                  <div
                    key={group.group}
                    className="rounded-2xl border border-border/60 bg-muted/20 p-4"
                  >
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                      {group.group}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {group.items.map((x) => (
                        <LinkRow key={x.href} label={x.label} href={x.href} note={x.note} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="meals" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary" /> Meals
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <PrayerBlock title="Before meals" lines={beforeMeals} />
                <PrayerBlock title="After meals" lines={afterMeals} />

                <Button
                  asChild
                  variant="outline"
                  className="btn-wrap rounded-2xl border-border/60"
                >
                  <a
                    href="https://www.oca.org/orthodoxy/prayers/before-and-after-meals"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source: Before & After Meals (OCA)
                  </a>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="saints" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Saints & intercessions
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    How to use this
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    These are Orthodox invocations and quick prayers you can say any time. For full hymn texts (troparia/kontakia) and lives, open the official OCA links.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                      <a
                        href="https://www.oca.org/saints/troparia"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Troparia & Kontakia (OCA)
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                      <a
                        href="https://www.oca.org/saints/lives"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lives of the Saints (OCA)
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                <PrayerBlock title="Short prayers to the Theotokos" lines={theotokosShort} />

                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    Browse
                  </p>
                  <ToggleGroup
                    type="single"
                    value={saintFilter}
                    onValueChange={(v) => v && setSaintFilter(v)}
                    className="mt-2 flex flex-wrap justify-start gap-2"
                  >
                    {SAINT_FILTERS.map((f) => (
                      <ToggleGroupItem
                        key={f.id}
                        value={f.id}
                        className="h-9 rounded-2xl border border-border/60 px-3 text-xs font-semibold data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10"
                      >
                        {f.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Showing {filteredSaints.length}.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredSaints.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-border/60 bg-muted/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-tight">
                            {p.title}
                          </p>
                          {p.subtitle ? (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {p.subtitle}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-3 space-y-2 text-sm leading-relaxed">
                        {p.lines.map((l, idx) => (
                          <p key={idx}>{l}</p>
                        ))}
                      </div>

                      {p.ocaTroparionUrl ? (
                        <Button
                          asChild
                          variant="outline"
                          className="mt-3 w-fit rounded-2xl border-border/60"
                        >
                          <a
                            href={p.ocaTroparionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Troparion & Kontakion (OCA)
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    Tip
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    For your patron saint, you can also use the "To one's Patron Saint" prayer in the Morning section and simply say the saint's name.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}