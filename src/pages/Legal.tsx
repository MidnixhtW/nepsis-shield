import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/app/PageContainer";
import { PremiumPageHeader } from "@/components/app/PremiumPageHeader";
import { CONTACT_URL, OPERATOR_NAME, POLICIES_UPDATED, PUBLIC_SITE_URL } from "@/lib/publicSite";

export type LegalDoc = "privacy" | "terms" | "cookies";

type Section = { heading: string; body: ReactNode };

const DOCS: Record<LegalDoc, { path: string; title: string; intro: string }> = {
  privacy: {
    path: "/privacy-policy",
    title: "Privacy Policy",
    intro: "What the app keeps, what leaves your device, who sees it, and how to remove it.",
  },
  terms: {
    path: "/terms",
    title: "Terms of Use",
    intro: "The rules for using Nepsis Shield, the website and the Android app.",
  },
  cookies: {
    path: "/cookies",
    title: "Cookie Policy",
    intro: "Nepsis Shield uses no cookies. This page explains what it stores on your device instead.",
  },
};

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline underline-offset-2">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function L({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="font-semibold text-foreground underline underline-offset-2">
      {children}
    </Link>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="grid list-disc gap-1.5 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

const contact = (
  <>
    Ask at <A href={CONTACT_URL}>the project's GitHub page</A>. Those posts are public, so do not put private details in them: say you need a
    private reply and we will arrange one.
  </>
);

const PRIVACY: Section[] = [
  {
    heading: "Who we are",
    body: (
      <p>
        Nepsis Shield ("the app", "we") is a free prayer app made by {OPERATOR_NAME}, an independent developer. It runs as a website at{" "}
        {PUBLIC_SITE_URL.replace("https://", "")} and as an Android app. It is not an official app of any Church. This policy covers both.
      </p>
    ),
  },
  {
    heading: "The short version",
    body: (
      <List
        items={[
          "There are no accounts. We never ask for your email, phone number, address or location.",
          "Your prayers, notes, progress and settings stay on your device. We cannot see them.",
          "Only two optional features send anything you choose to our server: prayer groups, and adding yourself to the count of people keeping a fast.",
          "We do not sell your information, share it for advertising, show ads, or use tracking cookies.",
        ]}
      />
    ),
  },
  {
    heading: "What stays on your device",
    body: (
      <>
        <p>
          Settings, your prayer rule, counts, reflections and confession notes, reading progress, favorites, prayers you are learning, and the days
          and recordings saved for offline use are kept in your browser's or phone's storage. They never leave the device unless you export them.
          Encrypted backups are locked with a passphrase only you know; we cannot open them.
        </p>
        <p>
          You can delete all of it by clearing the site's data in your browser or the app's data in Android settings, or by uninstalling the app.
          The <L to="/cookies">Cookie Policy</L> lists what is stored and why.
        </p>
      </>
    ),
  },
  {
    heading: "What leaves your device, and who receives it",
    body: (
      <>
        <p>
          <span className="font-semibold text-foreground">Services that send us Church and Bible text.</span> To show the day's calendar,
          readings and Scripture, your device asks these public services directly: <A href="https://orthocal.info">orthocal.info</A> (calendar,
          saints, fasting and readings), <A href="https://bible-api.com">bible-api.com</A> and <A href="https://bolls.life">bolls.life</A> (Bible
          text). The Download page asks <A href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement">GitHub</A>{" "}
          for the newest Android build. Like any website, they receive your IP address, your browser type, and what was asked for (a date or a
          passage). Nothing you write is sent to them. Requests carry no referrer, and copies are kept on your device so the same thing is not
          asked twice. Their own privacy policies apply.
        </p>
        <p>
          <span className="font-semibold text-foreground">Prayer groups (only if you use them).</span> When you create or join a group, you agree to
          this before anything is sent. Our server keeps the group's name; the first name you choose, but only next to a request you add or on
          the day you mark that you prayed; the text of your requests; and a random number that lets the group recognize your requests. Anyone with
          the group's link can read all of it. Requests are deleted after 30 days, daily prayer marks after 3 days, and a group left unused for 90
          days is deleted with everything in it. You can remove your own requests at any time, and the group's creator can remove any request or
          close the group, which deletes it at once.
        </p>
        <p>
          <span className="font-semibold text-foreground">Keeping a fast together (only if you tap "I'm keeping it").</span> The app sends which
          fast it is and a random number made on your device, tied to nothing about you. Only the total is ever shown. The numbers are deleted
          about four months later.
        </p>
        <p>
          <span className="font-semibold text-foreground">Our hosting.</span> The website and the server above run on{" "}
          <A href="https://vercel.com/legal/privacy-policy">Vercel</A>, and group and fast data are stored with{" "}
          <A href="https://upstash.com/trust/privacy.pdf">Upstash</A>. Both process data for us and may do so in the United States. To stop abuse,
          the server counts requests from each IP address for one minute and then forgets them, and Vercel may keep short-lived technical logs.
        </p>
        <p>
          <span className="font-semibold text-foreground">Visit counts on the website.</span> {PUBLIC_SITE_URL.replace("https://www.", "")} counts
          page visits with <A href="https://vercel.com/docs/analytics/privacy-policy">Vercel Web Analytics</A> so we know which parts are used. It
          records the page's path (never the part after "?" or "#", where group links live), the site you came from, your browser, operating
          system, device type and country. It uses no cookies and does not follow you to other sites. If your browser sends Do Not Track or
          Global Privacy Control, the visit is not counted at all. The Android app does not count visits.
        </p>
        <p>
          <span className="font-semibold text-foreground">Read-aloud.</span> Recorded voices are files from our own site. If you choose your
          device's voice, your phone or browser reads the prayer text with its own speech engine, which on some systems is provided online by its
          maker (such as Google or Apple). Only the text being read is involved.
        </p>
        <p>
          If you ask a question by voice where the app offers a speak button, your browser or phone turns your speech into text with its own
          service, which may also be online. We never receive the recording. Reminders are scheduled on your device. The app does not use your
          location, contacts or camera.
        </p>
      </>
    ),
  },
  {
    heading: "Religious information",
    body: (
      <p>
        Using a Christian prayer app, and especially sharing prayer requests, can show your faith. Some laws, such as the EU and UK GDPR, treat that
        as sensitive. That is why prayer groups ask for your clear agreement first, and why nothing else you do in the app is sent to us. Only share
        requests about other people with their permission, and use first names.
      </p>
    ),
  },
  {
    heading: "Why we may use it (for people in the EU, UK and similar places)",
    body: (
      <List
        items={[
          "Prayer groups and the fast count: your consent, which you can withdraw by removing your requests or no longer using the feature.",
          "Keeping the service safe (rate limits) and counting website visits: our legitimate interest in running a small free service, kept to the minimum described above.",
        ]}
      />
    ),
  },
  {
    heading: "Your choices and rights",
    body: (
      <>
        <p>
          Most of your information never reaches us, so you control it directly on your device. For group data, remove your requests yourself or
          ask the group's creator. Depending on where you live, you may have the right to ask what we hold about you, to correct or delete it, to
          object to its use, and to complain to your data protection authority. We do not sell or share personal information as California law
          defines those terms, and we make no decisions about you by automated means.
        </p>
        <p>To ask anything or use these rights: {contact}</p>
      </>
    ),
  },
  {
    heading: "Children",
    body: (
      <p>
        The app is meant for people 13 and older. The family prayer section is for parents to use with their children. Children under 13 must not
        create or join prayer groups. If you believe a child under 13 has shared information in a group, tell us and we will delete it.
      </p>
    ),
  },
  {
    heading: "Security",
    body: (
      <p>
        Connections use HTTPS, group links are long random codes, the creator's key is stored only as a one-way hash, and backups can be encrypted
        on your device. No system is perfectly secure, so treat a group link like a house key and share it only with people you trust.
      </p>
    ),
  },
  {
    heading: "Changes to this policy",
    body: (
      <p>
        If this policy changes, the date at the top changes too, and a meaningful change is noted in the app's{" "}
        <L to="/release-notes">release notes</L>. We will not start using information you already gave in a new way without asking.
      </p>
    ),
  },
];

const TERMS: Section[] = [
  {
    heading: "Agreement",
    body: (
      <p>
        These terms apply when you use Nepsis Shield, made by {OPERATOR_NAME}, on the website or the Android app. By using it you agree to them. If
        you do not agree, please do not use the app. You must be at least 13 years old.
      </p>
    ),
  },
  {
    heading: "Free to use, no payments, no refunds needed",
    body: (
      <p>
        The app is free. It has no purchases, subscriptions, donations or ads, so there is nothing to refund. If paid features are ever added, these
        terms will be updated with a refund policy before anything is charged.
      </p>
    ),
  },
  {
    heading: "What the app is and is not",
    body: (
      <>
        <p>
          Nepsis Shield is a devotional aid: prayers, Scripture, the Church calendar, and prompts for daily life and service. It does not replace
          your priest or pastor, the sacraments, or medical, mental health, legal or emergency care. Calendar, fasting and reading information
          comes from outside sources and may contain mistakes; follow your parish and your priest where they differ.
        </p>
        <p>
          It is an independent project and is not an official app of, or endorsed by, the Orthodox Church in America or any other Church body.
        </p>
        <p className="font-semibold text-foreground">
          If you or someone else is in danger, call your local emergency number (911 in the U.S.). In the U.S., you can call or text 988 to reach
          the Suicide & Crisis Lifeline; veterans and service members can press 1.
        </p>
      </>
    ),
  },
  {
    heading: "Prayer groups",
    body: (
      <>
        <p>Prayer groups are private only in the sense that a link is needed to join. When you post in one:</p>
        <List
          items={[
            "Share only what you have the right to share. Ask before naming someone else, and leave out details they would not want known, such as health information.",
            "Do not post anything unlawful, hateful, harassing, sexual, threatening or misleading, or anyone's contact or financial details.",
            "Do not use groups to advertise, collect money, or recruit.",
            "You keep ownership of what you write. You allow us to store it and show it to the group until it is deleted as the Privacy Policy describes.",
          ]}
        />
        <p>
          The group's creator can remove any request or close the group. We may remove content or close a group that breaks these terms when we
          learn of it. To report a problem, use the contact below and include the group's name, but not its link if you can avoid it.
        </p>
      </>
    ),
  },
  {
    heading: "Fair use of the service",
    body: (
      <p>
        Do not try to break, overload or get around the limits of the app or its server, read groups you were not invited to, or copy content from
        it in bulk.
      </p>
    ),
  },
  {
    heading: "Texts, images and credits",
    body: (
      <>
        <p>
          The app's design, code and original writing belong to {OPERATOR_NAME}. Prayers and liturgical texts are credited where they appear and on
          the <L to="/about">About</L> page. The icons are public-domain works from Wikimedia Commons, each linked to its source. Bible text is
          shown from public services; the New King James Version is copyright © 1982 by Thomas Nelson, and other translations belong to their
          owners. Links to outside sites are for convenience; we do not control them.
        </p>
        <p>If you believe something in the app uses your work without permission, tell us and we will look at it promptly.</p>
      </>
    ),
  },
  {
    heading: "No warranty, and limits on liability",
    body: (
      <p>
        The app is provided free and "as is", without warranties of any kind. It may change, pause or stop, and outside services it relies on may
        be unavailable. To the extent the law allows, {OPERATOR_NAME} is not liable for any indirect or consequential loss, or for loss of data
        kept on your device, arising from your use of the app. Nothing in these terms limits rights you have by law that cannot be limited.
      </p>
    ),
  },
  {
    heading: "Changes and ending",
    body: (
      <p>
        We may update these terms; the date at the top shows the latest version, and continuing to use the app after a change means you accept
        it. You can stop using the app at any time by deleting it and its data.
      </p>
    ),
  },
  {
    heading: "Contact",
    body: <p>{contact}</p>,
  },
];

const COOKIES: Section[] = [
  {
    heading: "No cookies",
    body: (
      <p>
        Nepsis Shield does not set cookies, and no outside service sets cookies through it. Fonts and icons are served from our own site, and
        website visit counts use no cookies. The app has no advertising or cross-site tracking of any kind.
      </p>
    ),
  },
  {
    heading: "What the app stores on your device instead",
    body: (
      <>
        <p>To work offline and remember your choices, the app uses your browser's or phone's own storage:</p>
        <List
          items={[
            <>
              <span className="font-semibold text-foreground">Local storage:</span> settings, your prayer rule, progress, favorites, notes,
              prayers you are learning, and the prayer groups you belong to. It stays until you delete it.
            </>,
            <>
              <span className="font-semibold text-foreground">Session storage:</span> short-lived copies of calendar and Bible text, so the same
              thing is not downloaded twice. It is cleared when you close the tab.
            </>,
            <>
              <span className="font-semibold text-foreground">IndexedDB:</span> the next two weeks of the Church calendar, so Today works without a
              signal.
            </>,
            <>
              <span className="font-semibold text-foreground">Cache storage:</span> the app's own files, and any recordings you save for offline
              listening.
            </>,
          ]}
        />
        <p>None of this is sent to us or used to track you. It only does what you asked the app to do.</p>
      </>
    ),
  },
  {
    heading: "Do you need to agree to anything?",
    body: (
      <p>
        No. Laws such as the EU ePrivacy rules require consent for cookies and similar storage that are not needed for the service you asked for,
        such as advertising or tracking. Everything above is needed for the features you use, so the app shows no cookie banner. If that ever
        changes, we will ask first.
      </p>
    ),
  },
  {
    heading: "How to clear it",
    body: (
      <p>
        Clear the site's data in your browser's settings, or clear the app's storage or uninstall it on Android. This deletes your notes and
        progress too, so make an encrypted backup on the <L to="/privacy#backup">Your data</L> page first if you want to keep them.
      </p>
    ),
  },
  {
    heading: "Questions",
    body: <p>{contact}</p>,
  },
];

const CONTENT: Record<LegalDoc, Section[]> = { privacy: PRIVACY, terms: TERMS, cookies: COOKIES };

/** The Privacy Policy, Terms of Use and Cookie Policy, in plain words. */
export default function Legal({ doc }: { doc: LegalDoc }) {
  const meta = DOCS[doc];
  return (
    <PageContainer width="compact">
      <PremiumPageHeader
        eyebrow={`Last updated ${POLICIES_UPDATED}`}
        title={meta.title}
        description={meta.intro}
        icon={<FileText className="h-5 w-5" />}
        actions={
          <Button asChild variant="outline" className="premium-action">
            <Link to="/today">Back to app</Link>
          </Button>
        }
      />
      <nav aria-label="Policies" className="mx-1 mt-4 flex flex-wrap gap-2">
        {(Object.keys(DOCS) as LegalDoc[]).map((key) => (
          <NavLink
            key={key}
            to={DOCS[key].path}
            className={({ isActive }) =>
              `rounded-full border px-3.5 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive ? "border-accent/60 bg-accent/10 text-foreground" : "border-border/60 text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {DOCS[key].title}
          </NavLink>
        ))}
      </nav>
      <Card className="mt-5 rounded-3xl border-border/60 bg-card p-5 shadow-sm sm:p-7">
        <div className="grid gap-7">
          {CONTENT[doc].map((section) => (
            <section key={section.heading} className="grid gap-2.5 text-sm leading-relaxed text-muted-foreground">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{section.heading}</h2>
              {section.body}
            </section>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}
