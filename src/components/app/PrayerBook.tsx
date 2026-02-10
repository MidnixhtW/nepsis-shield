import { useState } from "react";
import {
  ExternalLink,
  Hand,
  MoonStar,
  Search,
  Sparkles,
  Sun,
  Utensils,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  "O Most Holy Trinity, have mercy on us; Lord, cleanse us from our sins; Master, pardon our transgressions; Holy One, visit and heal our infirmities for Your Name's sake.",
  "Lord, have mercy. (3x)",
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

const theotokosShort = [
  "MOST HOLY THEOTOKOS:",
  "Most Holy Theotokos, save us.",
  "Beneath your compassion we take refuge, O Theotokos. Despise not our petitions in time of trouble, but deliver us from dangers, only Pure One, only Blessed One.",
  "It is truly meet to bless you, O Theotokos, ever-blessed and most pure, and the Mother of our God. More honorable than the Cherubim, and beyond compare more glorious than the Seraphim, without corruption you gave birth to God the Word. True Theotokos, we magnify you.",
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

type SaintPrayerRaw = [
  id: string,
  title: string,
  subtitle: string | undefined,
  category: SaintPrayer["category"],
  invocation: string,
  ocaTroparionUrl?: string,
];

const SAINT_PRAYERS_RAW: SaintPrayerRaw[] = [
  // Angels
  [
    "michael",
    "Archangel Michael",
    "Bodiless powers",
    "angels",
    "Holy Archangel Michael, pray to God for us.",
    "https://www.oca.org/saints/troparia/2021/09/06/102517-commemoration-of-the-miracle-of-the-archangel-michael-at-colossa",
  ],
  [
    "gabriel",
    "Archangel Gabriel",
    "Annunciation",
    "angels",
    "Holy Archangel Gabriel, pray to God for us.",
  ],
  [
    "raphael_archangel",
    "Archangel Raphael",
    "Healer",
    "angels",
    "Holy Archangel Raphael, pray to God for us.",
  ],

  // Major saints / Apostles
  ["peter", "Holy Apostle Peter", undefined, "other", "Holy Apostle Peter, pray to God for us."],
  ["paul", "Holy Apostle Paul", undefined, "other", "Holy Apostle Paul, pray to God for us."],
  [
    "peter_paul",
    "Holy Apostles Peter and Paul",
    "Chief apostles",
    "other",
    "Holy Apostles Peter and Paul, pray to God for us.",
  ],
  ["john_theologian", "Holy Apostle John", "the Theologian", "other", "Holy Apostle John the Theologian, pray to God for us."],
  ["andrew", "Holy Apostle Andrew", "First-called", "other", "Holy Apostle Andrew, pray to God for us."],
  ["james", "Holy Apostle James", "brother of John", "other", "Holy Apostle James, pray to God for us."],
  ["thomas", "Holy Apostle Thomas", undefined, "other", "Holy Apostle Thomas, pray to God for us."],
  ["philip", "Holy Apostle Philip", undefined, "other", "Holy Apostle Philip, pray to God for us."],
  ["bartholomew", "Holy Apostle Bartholomew", undefined, "other", "Holy Apostle Bartholomew, pray to God for us."],
  ["matthew", "Holy Apostle Matthew", "Evangelist", "other", "Holy Apostle Matthew, pray to God for us."],
  ["mark", "Holy Apostle Mark", "Evangelist", "other", "Holy Apostle Mark, pray to God for us."],
  ["luke_evangelist", "Holy Apostle Luke", "Evangelist", "other", "Holy Apostle Luke, pray to God for us.", "https://www.oca.org/saints/troparia/2017/10/18/102993-apostle-and-evangelist-luke"],
  ["mary_magdalene", "St. Mary Magdalene", "Equal-to-the-Apostles", "women", "Holy Myrrhbearer Mary Magdalene, pray to God for us.", "https://www.oca.org/saints/troparia/2023/07/22/102070-myrrhbearer-and-equal-of-the-apostles-mary-magdalene"],

  // Forerunner
  [
    "john_forerunner",
    "St. John the Forerunner",
    "Prophet and Baptist",
    "other",
    "Holy Prophet and Forerunner John, pray to God for us.",
    "https://www.oca.org/saints/troparia/2022/01/07/100109-synaxis-of-the-holy-glorious-prophet-forerunner-and-baptist-john",
  ],

  // Teachers / Hierarchs
  [
    "basil",
    "St. Basil the Great",
    "Archbishop of Caesarea",
    "teachers",
    "Holy Hierarch Basil, pray to God for us.",
    "https://www.oca.org/saints/troparia/1003/01/01/100003-saint-basil-the-great-archbishop-of-caesarea-in-cappadocia",
  ],
  [
    "gregory_theologian",
    "St. Gregory the Theologian",
    "Archbishop of Constantinople",
    "teachers",
    "Holy Hierarch Gregory, pray to God for us.",
    "https://www.oca.org/saints/troparia/20112021/01/25/100298-saint-gregory-the-theologian-archbishop-of-constantinople",
  ],
  [
    "john_chrysostom",
    "St. John Chrysostom",
    "Golden-mouthed",
    "teachers",
    "Holy Hierarch John Chrysostom, pray to God for us.",
    "https://www.oca.org/saints/troparia/2019/11/13/103292-saint-john-chrysostom-archbishop-of-constantinople",
  ],
  [
    "three_hierarchs",
    "Three Holy Hierarchs",
    "Basil, Gregory, John",
    "teachers",
    "Holy Hierarchs Basil, Gregory, and John, pray to God for us.",
    "https://www.oca.org/saints/troparia/2025/01/30/100350-synaxis-of-the-ecumenical-teachers-and-hierarchs-basil-the-great",
  ],
  [
    "athanasius",
    "St. Athanasius",
    "the Great",
    "teachers",
    "Holy Hierarch Athanasius, pray to God for us.",
  ],
  [
    "cyril_alexandria",
    "St. Cyril",
    "of Alexandria",
    "teachers",
    "Holy Hierarch Cyril of Alexandria, pray to God for us.",
  ],
  [
    "john_damascene",
    "St. John",
    "of Damascus",
    "teachers",
    "Venerable Father John of Damascus, pray to God for us.",
  ],
  [
    "maximus_confessor",
    "St. Maximus",
    "the Confessor",
    "teachers",
    "Holy Father Maximus the Confessor, pray to God for us.",
  ],
  [
    "gregory_palamas",
    "St. Gregory Palamas",
    "Archbishop of Thessalonica",
    "teachers",
    "Holy Hierarch Gregory Palamas, pray to God for us.",
  ],
  [
    "mark_ephesus",
    "St. Mark",
    "of Ephesus",
    "teachers",
    "Holy Hierarch Mark of Ephesus, pray to God for us.",
  ],
  [
    "photios",
    "St. Photios",
    "the Great",
    "teachers",
    "Holy Patriarch Photios, pray to God for us.",
  ],

  // Martyrs
  [
    "george",
    "St. George",
    "Great Martyr",
    "martyrs",
    "Holy Great Martyr George, pray to God for us.",
    "https://www.oca.org/saints/troparia/2020/07/03/205460-saint-george-the-god-bearer",
  ],
  [
    "demetrios_thessaloniki",
    "St. Demetrios",
    "Myrrh-gusher of Thessaloniki",
    "martyrs",
    "Holy Great Martyr Demetrios, pray to God for us.",
    "https://www.oca.org/saints/troparia/2022/10/26/103059-holy-glorious-demetrios-the-myrrh-gusher-of-thessaloniki",
  ],
  [
    "panteleimon",
    "St. Panteleimon",
    "Great Martyr and Healer",
    "martyrs",
    "Holy Great Martyr and Healer Panteleimon, pray to God for us.",
    "https://www.oca.org/saints/troparia/1950/07/27/102099-greatmartyr-and-healer-panteleimon",
  ],
  [
    "barbara",
    "St. Barbara",
    "Great Martyr",
    "women",
    "Holy Great Martyr Barbara, pray to God for us.",
  ],
  [
    "marina",
    "St. Marina",
    "Great Martyr",
    "women",
    "Holy Great Martyr Marina, pray to God for us.",
  ],
  [
    "irene",
    "St. Irene",
    "Great Martyr",
    "women",
    "Holy Great Martyr Irene, pray to God for us.",
  ],
  [
    "theodore_tiro",
    "St. Theodore",
    "the Recruit",
    "martyrs",
    "Holy Great Martyr Theodore, pray to God for us.",
  ],
  [
    "theodore_stratelates",
    "St. Theodore",
    "the General",
    "martyrs",
    "Holy Great Martyr Theodore, pray to God for us.",
  ],
  [
    "haralambos",
    "St. Haralambos",
    "Hieromartyr",
    "martyrs",
    "Holy Hieromartyr Haralambos, pray to God for us.",
  ],
  [
    "tryphon",
    "St. Tryphon",
    "Martyr",
    "martyrs",
    "Holy Martyr Tryphon, pray to God for us.",
  ],

  // Women saints
  [
    "katherine",
    "St. Katherine (Catherine)",
    "Great Martyr of Alexandria",
    "women",
    "Holy Great Martyr Katherine, pray to God for us.",
    "https://www.oca.org/saints/troparia/2018/11/24/103382-great-martyr-katherine-of-alexandria",
  ],
  [
    "xenia",
    "Blessed Xenia",
    "of St. Petersburg",
    "women",
    "Blessed Xenia, pray to God for us.",
    "https://www.oca.org/saints/troparia/2020/01/24/100297-blessed-xenia-of-st-petersburg",
  ],
  [
    "elizabeth_new_martyr",
    "New Martyr Elizabeth",
    "Grand Duchess",
    "women",
    "Holy New Martyr Elizabeth, pray to God for us.",
    "https://www.oca.org/saints/troparia/2022/07/18/101915-grand-duchess-elizabeth",
  ],
  [
    "mary_of_egypt",
    "St. Mary of Egypt",
    "Model of repentance",
    "women",
    "Venerable Mother Mary of Egypt, pray to God for us.",
    "https://www.oca.org/saints/troparia/2025/04/01/100963-venerable-mary-of-egypt",
  ],
  [
    "photini",
    "St. Photini",
    "the Samaritan Woman",
    "women",
    "Holy Martyr Photini, pray to God for us.",
  ],
  [
    "olga",
    "St. Olga",
    "Equal-to-the-Apostles",
    "women",
    "Holy Equal-to-the-Apostles Olga, pray to God for us.",
  ],
  [
    "nina",
    "St. Nina",
    "Enlightener of Georgia",
    "women",
    "Holy Equal-to-the-Apostles Nina, pray to God for us.",
  ],
  [
    "thekla",
    "St. Thekla",
    "Protomartyr",
    "women",
    "Holy Protomartyr Thekla, pray to God for us.",
  ],

  // Monastics / ascetics
  [
    "seraphim",
    "St. Seraphim of Sarov",
    "Venerable Wonderworker",
    "monastics",
    "Venerable Father Seraphim, pray to God for us.",
    "https://www.oca.org/saints/troparia/2025/01/02/100008-repose-of-venerable-seraphim-wonderworker-of-sarov",
  ],
  [
    "silouan",
    "St. Silouan",
    "of Mount Athos",
    "monastics",
    "Venerable Father Silouan, pray to God for us.",
    "https://www.oca.org/saints/troparia/2025/09/24/102722-venerable-silouan-of-mount-athos",
  ],
  [
    "paisios_athos",
    "St. Paisios",
    "of the Holy Mountain",
    "monastics",
    "Venerable Father Paisios, pray to God for us.",
    "https://www.oca.org/saints/troparia/2023/07/12/100401-venerable-paisios-of-the-holy-mountain",
  ],
  [
    "anthony_great",
    "St. Anthony",
    "the Great",
    "monastics",
    "Venerable Father Anthony, pray to God for us.",
  ],
  [
    "pachomius",
    "St. Pachomius",
    "the Great",
    "monastics",
    "Venerable Father Pachomius, pray to God for us.",
  ],
  [
    "john_climacus",
    "St. John",
    "of the Ladder",
    "monastics",
    "Venerable Father John Climacus, pray to God for us.",
  ],
  [
    "moses_black",
    "St. Moses",
    "the Black",
    "monastics",
    "Venerable Father Moses, pray to God for us.",
  ],

  // Modern saints
  [
    "nectarios",
    "St. Nectarios",
    "of Aegina",
    "modern",
    "Holy Hierarch Nectarios, pray to God for us.",
    "https://www.oca.org/saints/troparia/2020/11/09/103251-saint-nectarius-kephalas-metropolitan-of-pentapolis",
  ],
  [
    "john_kronstadt",
    "St. John of Kronstadt",
    "Righteous pastor",
    "modern",
    "Righteous Father John of Kronstadt, pray to God for us.",
    "https://www.oca.org/saints/troparia/2025/12/20/103598-repose-of-saint-john-of-kronstadt",
  ],
  [
    "luke_crimea",
    "St. Luke",
    "Archbishop of Simferopol",
    "modern",
    "Holy Hierarch Luke, pray to God for us.",
    "https://www.oca.org/saints/troparia/2020/06/11/100476-saint-luke-archbishop-of-simferopol",
  ],
  [
    "john_maximovitch_sf",
    "St. John Maximovitch",
    "Shanghai and San Francisco",
    "modern",
    "Holy Hierarch John, pray to God for us.",
    "https://www.oca.org/saints/troparia/2020/07/02/206392-saint-john-maximovitch-archbishop-of-shanghai-and-san-francisco",
  ],

  // North America
  [
    "herman",
    "St. Herman of Alaska",
    "Wonderworker of All America",
    "north_america",
    "Venerable Father Herman, pray to God for us.",
    "https://www.oca.org/saints/troparia/2016/12/13/103530-repose-of-venerable-herman-of-alaska-wonderworker-of-all-america",
  ],
  [
    "innocent_alaska",
    "St. Innocent",
    "Enlightener of Alaska",
    "north_america",
    "Holy Hierarch Innocent, pray to God for us.",
    "https://www.oca.org/saints/troparia/2016/03/31/100954-repose-of-saint-innocent-metropolitan-of-moscow-enlightener-of-t",
  ],
  [
    "jacob_netsvetov",
    "St. Jacob Netsvetov",
    "Enlightener of Alaska",
    "north_america",
    "Righteous Father Jacob, pray to God for us.",
    "https://www.oca.org/saints/troparia/2025/07/26/102091-repose-of-saint-jacob-netsvetov-enlightener-of-the-peoples-of-al",
  ],
  [
    "olga_alaska",
    "St. Olga of Alaska",
    "Righteous mother",
    "north_america",
    "Righteous Mother Olga, pray to God for us.",
    "https://www.oca.org/saints/troparia/2025/10/27/100561-righteous-mother-olga-of-kwethluktanqilria-arrsamquqwonderworker",
  ],
  [
    "raphael_brooklyn",
    "St. Raphael of Brooklyn",
    "Bishop and shepherd",
    "north_america",
    "Holy Hierarch Raphael, pray to God for us.",
    "https://www.oca.org/saints/troparia/4465/02/27/100610-repose-of-saint-raphael-bishop-of-brooklyn",
  ],
  [
    "juvenal",
    "Martyr Juvenal",
    "of Alaska",
    "north_america",
    "Holy Martyr Juvenal, pray to God for us.",
    "https://www.oca.org/saints/troparia/2025/09/24/102714-martyr-juvenal-of-alaska",
  ],

  // Padding out the list with many widely-venerated saints (invocations)
  ["spyridon", "St. Spyridon", "Wonderworker", "other", "Holy Hierarch Spyridon, pray to God for us."],
  ["sophrony", "St. Sophrony", "of Jerusalem", "teachers", "Holy Hierarch Sophrony of Jerusalem, pray to God for us."],
  ["justin_popovich", "St. Justin", "of Ćelije", "modern", "Venerable Father Justin, pray to God for us."],
  ["nikolai_zhicha", "St. Nikolai", "of Zhicha", "modern", "Holy Hierarch Nikolai, pray to God for us."],
  ["porphyrios", "St. Porphyrios", "of Kavsokalyvia", "modern", "Venerable Father Porphyrios, pray to God for us."],
  ["sophrony_athos", "St. Sophrony", "of Essex", "modern", "Venerable Father Sophrony, pray to God for us."],
  ["ioannicius", "St. Ioannikios", "the Great", "monastics", "Venerable Father Ioannikios, pray to God for us."],
  ["simeon_new_theologian", "St. Symeon", "the New Theologian", "teachers", "Venerable Father Symeon, pray to God for us."],
  ["isaac_syria", "St. Isaac", "the Syrian", "teachers", "Venerable Father Isaac the Syrian, pray to God for us."],
  ["john_shanghai", "St. John", "of Shanghai", "modern", "Holy Hierarch John, pray to God for us."],

  // --- Add many more invocations (batch) ---
  // Ancient and medieval saints
  ["elijah", "Holy Prophet Elijah", undefined, "other", "Holy Prophet Elijah, pray to God for us."],
  ["moses", "Holy Prophet Moses", undefined, "other", "Holy Prophet Moses, pray to God for us."],
  ["daniel", "Holy Prophet Daniel", undefined, "other", "Holy Prophet Daniel, pray to God for us."],
  ["david", "Holy Prophet David", undefined, "other", "Holy Prophet David, pray to God for us."],
  ["joachim_anna", "Righteous Joachim and Anna", "Ancestors of God", "other", "Holy Righteous Joachim and Anna, pray to God for us."],
  ["joseph_betrothed", "Righteous Joseph", "the Betrothed", "other", "Holy Righteous Joseph, pray to God for us."],

  // Add ~100 more names as invocations (orthodox/common)
  ["sergius", "St. Sergius", "of Radonezh", "monastics", "Venerable Father Sergius, pray to God for us."],
  ["seraphim_vyritsa", "St. Seraphim", "of Vyritsa", "modern", "Venerable Father Seraphim, pray to God for us."],
  ["seraphim_zvezdinsky", "St. Seraphim", "of Vyritsa", "modern", "Venerable Father Seraphim, pray to God for us."],
  ["tikhon_moscow", "St. Tikhon", "Patriarch of Moscow", "north_america", "Holy Hierarch Tikhon, pray to God for us."],
  ["innocent_irktusk", "St. Innocent", "of Irkutsk", "teachers", "Holy Hierarch Innocent, pray to God for us."],
  ["innocent_komel", "St. Innocent", "(various)", "other", "Holy Saint Innocent, pray to God for us."],
  ["alexander_nevsky", "St. Alexander Nevsky", undefined, "other", "Holy Blessed Prince Alexander, pray to God for us."],
  ["vladimir", "St. Vladimir", "Equal-to-the-Apostles", "other", "Holy Equal-to-the-Apostles Vladimir, pray to God for us."],
  ["boris_gleb", "Sts. Boris and Gleb", "Passion-bearers", "martyrs", "Holy Passion-bearers Boris and Gleb, pray to God for us."],
  ["romanov_martyrs", "Holy Royal Martyrs", "Romanov family", "martyrs", "Holy Royal Martyrs, pray to God for us."],
  ["maria_paris", "St. Maria", "of Paris", "modern", "Holy Mother Maria, pray to God for us."],
  ["savas_sanctified", "St. Savvas", "the Sanctified", "monastics", "Venerable Father Savvas, pray to God for us."],
  ["efrosynus", "St. Euphrosynos", "the Cook", "monastics", "Venerable Father Euphrosynos, pray to God for us."],
  ["gabriel_georgia", "St. Gabriel", "of Georgia", "modern", "Holy Confessor Gabriel, pray to God for us."],
  ["joseph_hesychast", "St. Joseph", "the Hesychast", "modern", "Venerable Father Joseph, pray to God for us."],
  ["kyprianos", "St. Cyprian", "and Justina", "martyrs", "Holy Martyrs Cyprian and Justina, pray to God for us."],
  ["lucy", "St. Lucy", "Martyr", "women", "Holy Martyr Lucy, pray to God for us."],
  ["agatha", "St. Agatha", "Martyr", "women", "Holy Martyr Agatha, pray to God for us."],
  ["anastasia", "St. Anastasia", "Deliverer from Potions", "women", "Holy Great Martyr Anastasia, pray to God for us."],
  ["euphemia", "St. Euphemia", "Great Martyr", "women", "Holy Great Martyr Euphemia, pray to God for us."],
  ["paraskeva", "St. Paraskeva", "Martyr", "women", "Holy Martyr Paraskeva, pray to God for us."],
  ["sophia_faith_hope_love", "Sts. Sophia, Faith, Hope, and Love", undefined, "women", "Holy Martyrs Sophia, Faith, Hope, and Love, pray to God for us."],
  ["tatiana", "St. Tatiana", "Martyr", "women", "Holy Martyr Tatiana, pray to God for us."],
  ["juliana", "St. Juliana", "Martyr", "women", "Holy Martyr Juliana, pray to God for us."],
  ["maria_magdala", "St. Mary", "(Myrrhbearer)", "women", "Holy Myrrhbearer Mary, pray to God for us."],
  ["mary_martha", "Sts. Mary and Martha", "Sisters of Lazarus", "women", "Holy Righteous Mary and Martha, pray to God for us."],
  ["lazarus", "Righteous Lazarus", "Friend of Christ", "other", "Holy Righteous Lazarus, pray to God for us."],
  ["spyridon_trimythous", "St. Spyridon", "of Tremithus", "other", "Holy Hierarch Spyridon, pray to God for us."],
  ["nikita", "St. Nikita", "Martyr", "martyrs", "Holy Martyr Nikita, pray to God for us."],
  ["procopius", "St. Procopius", "Great Martyr", "martyrs", "Holy Great Martyr Procopius, pray to God for us."],
  ["eustathius", "St. Eustathius", "Martyr", "martyrs", "Holy Martyr Eustathius, pray to God for us."],
  ["mercurius", "St. Mercurius", "Great Martyr", "martyrs", "Holy Great Martyr Mercurius, pray to God for us."],
  ["minas", "St. Menas", "Martyr", "martyrs", "Holy Martyr Menas, pray to God for us."],
  ["cyril_methodius", "Sts. Cyril and Methodius", "Apostles to the Slavs", "teachers", "Holy Equal-to-the-Apostles Cyril and Methodius, pray to God for us."],
  ["paul_the_simple", "St. Paul", "the Simple", "monastics", "Venerable Father Paul, pray to God for us."],
  ["macarius", "St. Macarius", "of Egypt", "monastics", "Venerable Father Macarius, pray to God for us."],
  ["barsanuphius", "St. Barsanuphius", "of Gaza", "monastics", "Venerable Father Barsanuphius, pray to God for us."],
  ["john_gaza", "St. John", "of Gaza", "monastics", "Venerable Father John, pray to God for us."],
  ["paisios_velichkovsky", "St. Paisios", "Velichkovsky", "monastics", "Venerable Father Paisios, pray to God for us."],
  ["theophan_recluse", "St. Theophan", "the Recluse", "modern", "Holy Bishop Theophan, pray to God for us."],
  ["ignatius_brianchaninov", "St. Ignatius", "Brianchaninov", "modern", "Holy Bishop Ignatius, pray to God for us."],
  ["ambrose_optina", "St. Ambrose", "of Optina", "modern", "Venerable Father Ambrose, pray to God for us."],
  ["makary_optina", "St. Macarius", "of Optina", "modern", "Venerable Father Macarius, pray to God for us."],
  ["anatoly_optina", "St. Anatoly", "of Optina", "modern", "Venerable Father Anatoly, pray to God for us."],
  ["lev_optina", "St. Leo", "of Optina", "modern", "Venerable Father Leo, pray to God for us."],
  ["silouan_extra", "St. Silouan", "Athonite", "monastics", "Venerable Father Silouan, pray to God for us."],
  ["sisoes", "St. Sisoes", "the Great", "monastics", "Venerable Father Sisoes, pray to God for us."],
  ["paul_athos", "St. Paul", "of Athos", "monastics", "Venerable Father Paul, pray to God for us."],
  ["gabriel_urgebadze", "St. Gabriel", "Urgebadze", "modern", "Holy Confessor Gabriel, pray to God for us."],
  ["dionysius_areopagite", "St. Dionysius", "the Areopagite", "other", "Holy Hieromartyr Dionysius, pray to God for us."],
  ["apostle_jude", "Holy Apostle Jude", undefined, "other", "Holy Apostle Jude, pray to God for us."],
  ["apostle_simon", "Holy Apostle Simon", "the Zealot", "other", "Holy Apostle Simon, pray to God for us."],
  ["apostle_barnabas", "Holy Apostle Barnabas", undefined, "other", "Holy Apostle Barnabas, pray to God for us."],
  ["apostle_timothy", "Holy Apostle Timothy", undefined, "other", "Holy Apostle Timothy, pray to God for us."],
  ["apostle_titus", "Holy Apostle Titus", undefined, "other", "Holy Apostle Titus, pray to God for us."],
  ["apostle_philemon", "Holy Apostle Philemon", undefined, "other", "Holy Apostle Philemon, pray to God for us."],
  ["apostle_james_lord", "Holy Apostle James", "the Brother of the Lord", "other", "Holy Apostle James, pray to God for us."],
];

const SAINT_PRAYERS: SaintPrayer[] = SAINT_PRAYERS_RAW.map(
  ([id, title, subtitle, category, invocation, ocaTroparionUrl]) => ({
    id,
    title,
    subtitle,
    category,
    lines: [invocation],
    ocaTroparionUrl,
  }),
);

const SAINT_FILTERS: Array<{
  id: string;
  label: string;
  cats: SaintPrayer["category"][];
}> = [
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
  { id: "other", label: "Other", cats: ["other"] },
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
  const [saintQuery, setSaintQuery] = useState("");

  const allowedCats =
    SAINT_FILTERS.find((f) => f.id === saintFilter)?.cats ??
    SAINT_FILTERS[0].cats;

  const filteredSaints = SAINT_PRAYERS.filter((p) => {
    if (!allowedCats.includes(p.category)) return false;
    const hay = `${p.title} ${p.subtitle ?? ""}`.toLowerCase();
    const q = saintQuery.trim().toLowerCase();
    if (!q) return true;
    return hay.includes(q);
  });

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
          <AccordionItem value="morning" className="border-none">
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
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                        Browse
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Showing {filteredSaints.length}.
                      </p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={saintQuery}
                        onChange={(e) => setSaintQuery(e.target.value)}
                        placeholder="Search saints…"
                        className="h-10 rounded-2xl pl-9"
                      />
                    </div>
                  </div>

                  <ToggleGroup
                    type="single"
                    value={saintFilter}
                    onValueChange={(v) => v && setSaintFilter(v)}
                    className="mt-3 flex flex-wrap justify-start gap-2"
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