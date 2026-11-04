import { type ReactNode, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import {
  ArrowRight,
  Crosshair,
  Download,
  HelpCircle,
  Info,
  LifeBuoy,
  Menu,
  Search,
  Settings as SettingsIcon,
  Shield,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GroundMeNow } from "@/components/app/GroundMeNow";
import { NeedHelpNow } from "@/components/app/NeedHelpNow";
import { ProtectionPsalm } from "@/components/app/ProtectionPsalm";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { CenserIcon, SaintHaloIcon, VigilLampIcon } from "@/components/app/OrthodoxMotifs";
import { START_TUTORIAL_EVENT } from "@/components/app/QuickStartDialog";
import { ThemeToggle } from "@/components/app/ThemeToggle";

import { unlockPhilokaliaGuide } from "@/lib/philokaliaUnlock";
import { prayerHourName, useNow, usesTwentyFourHourTime } from "@/lib/prayerHours";
import { OPEN_HELP_EVENT, OPEN_MENU_EVENT } from "@/lib/appEvents";
import { searchDestinations } from "@/lib/destinations";
import { CURRENT_VERSION } from "@/lib/releaseInfo";
import { useResponderMode } from "@/lib/responderMode";
import { showSuccess } from "@/utils/toast";

function startTutorial() {

  window.dispatchEvent(new Event(START_TUTORIAL_EVENT));
}

function MenuLink({
  to,
  icon,
  label,
  description,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  description?: string;
}) {
  return (
    <SheetClose asChild>
      <Link
        to={to}
        className="group flex min-w-0 items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm hover:border-border hover:bg-muted/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[hsl(var(--icon-gold)/0.35)] bg-secondary/35 text-primary group-hover:border-[hsl(var(--icon-gold)/0.62)]">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold leading-tight text-foreground">{label}</span>
          {description ? <span className="mt-1 block truncate text-xs text-muted-foreground">{description}</span> : null}
        </span>
      </Link>

    </SheetClose>
  );
}

function MenuSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border/35 pt-4 first:border-t-0 first:pt-0">
      <h3 className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h3>
      <div className="grid gap-1">{children}</div>
    </section>
  );
}

// The menu: a "Go to" search across every part of the app, then a few places that are not in the tab bar.
function MenuLinks() {
  const [query, setQuery] = useState("");
  const results = searchDestinations(query);

  return (
    <div className="grid gap-3 pb-3">
      <div className="relative px-1">
        <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Go to... Compline, Creed, groups"
          aria-label="Go to a part of the app"
          className="h-11 rounded-xl pl-9"
        />
      </div>

      {query.trim() ? (
        <MenuSection title={results.length ? `Found ${results.length}` : "Nothing found"}>
          {results.length ? (
            results.slice(0, 12).map((destination) => (
              <MenuLink key={destination.to} to={destination.to} icon={<ArrowRight className="h-4 w-4" />} label={destination.label} description={destination.area} />
            ))
          ) : (
            <p className="px-3 text-xs leading-relaxed text-muted-foreground">Try another word, such as prayer, fast, saints or Bible.</p>
          )}
        </MenuSection>
      ) : (
        <>
          <MenuSection title="Pray with the Church">
            <MenuLink to="/pray?tab=services" icon={<CenserIcon className="h-4 w-4" />} label="Services" description="Compline, the Hours, the Akathist, Panikhida" />
            <MenuLink to="/pray?tab=groups" icon={<Users className="h-4 w-4" />} label="Prayer groups" description="Pray for each other, privately" />
            <MenuLink to="/pray?tab=family" icon={<VigilLampIcon className="h-4 w-4" />} label="Family prayer" description="Evening prayer and saint stories for children" />
          </MenuSection>

          <MenuSection title="Library">
            <MenuLink to="/saints" icon={<SaintHaloIcon className="h-4 w-4" />} label="Saints" description="Patrons and intercession" />
            <MenuLink to="/field-manual" icon={<Crosshair className="h-4 w-4" />} label="Life & Service Guide" description="Daily life, pressure, prayer, and recovery" />
          </MenuSection>

          <MenuSection title="App">
            <MenuLink to="/settings" icon={<SettingsIcon className="h-4 w-4" />} label="Settings" description="Reminders, calendar, name day, text size" />
            <MenuLink to="/privacy" icon={<Shield className="h-4 w-4" />} label="Privacy and backup" description="Your data stays on this device" />
            <MenuLink to="/download" icon={<Download className="h-4 w-4" />} label="Install / Share" description="Android app, home screen, QR code" />
            <MenuLink to="/about" icon={<Info className="h-4 w-4" />} label="About" description="Purpose, sources, and what's new" />
          </MenuSection>

          <MenuSection title="Appearance">
            <div className="px-1">
              <ThemeToggle variant="row" />
            </div>
          </MenuSection>

          <MenuSection title="Help">
            <SheetClose asChild>
              <button
                type="button"
                className="group flex min-w-0 items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={startTutorial}
              >
                <span className="shrink-0 text-muted-foreground group-hover:text-primary">
                  <HelpCircle className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium leading-tight text-foreground">Take the tour again</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">Replay first-time setup</span>
                </span>
              </button>
            </SheetClose>
          </MenuSection>
        </>
      )}

      <p className="border-t border-border/45 pt-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Version {CURRENT_VERSION}
      </p>
    </div>
  );
}

// Always-visible entry to the "Need help now?" choices, so nobody has to scroll Today to find them.
function HelpNowButton() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_HELP_EVENT, show);
    return () => window.removeEventListener(OPEN_HELP_EVENT, show);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label="Need help now"
          className="h-10 gap-1.5 rounded-md border border-accent/45 bg-card/75 px-2.5 text-foreground shadow-sm backdrop-blur hover:border-accent/70 hover:bg-accent/10 hover:text-accent sm:px-3"
        >
          <LifeBuoy className="h-[18px] w-[18px] text-accent" />
          <span className="text-sm font-bold">Help</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex h-dvh w-[min(26rem,100vw)] flex-col gap-0 overflow-hidden border-l-border bg-background p-0">
        {/* The card below shows the same heading, so the panel title is for screen readers only. */}
        <SheetHeader className="sr-only">
          <SheetTitle>Need help now?</SheetTitle>
          <SheetDescription>Choose what is happening. One small step, then the next.</SheetDescription>
        </SheetHeader>
        <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto p-3 pt-[max(3.25rem,env(safe-area-inset-top))] sm:p-4 sm:pt-14">
          <NeedHelpNow onChoose={() => setOpen(false)} />
          <Accordion type="single" collapsible className="rounded-3xl border bg-card px-5">
            <AccordionItem value="ground">
              <AccordionTrigger className="text-left">Ground me now · guided reset</AccordionTrigger>
              <AccordionContent><GroundMeNow /></AccordionContent>
            </AccordionItem>
            <AccordionItem value="psalm" className="border-0">
              <AccordionTrigger className="text-left">Psalm 90 · prayer of protection</AccordionTrigger>
              <AccordionContent><ProtectionPsalm /></AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function AppHeader() {
  const navigate = useNavigate();
  const secretTaps = useRef<number[]>([]);
  const now = useNow();
  const [role] = useResponderMode();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const show = () => setMenuOpen(true);
    window.addEventListener(OPEN_MENU_EVENT, show);
    return () => window.removeEventListener(OPEN_MENU_EVENT, show);
  }, []);
  const hourName = prayerHourName(now);
  // Service roles read the clock as 0600; everyone else sees the date with the hour of prayer.
  const clockLine = usesTwentyFourHourTime(role)
    ? `${format(now, "HHmm")} · ${hourName} · ${format(now, "MMM d")}`
    : `${format(now, "EEE, MMM d")} · ${hourName}`;

  function handleSecretTap() {
    const now = Date.now();
    secretTaps.current = [...secretTaps.current.filter((tap) => now - tap < 5000), now];

    if (secretTaps.current.length >= 7) {
      secretTaps.current = [];
      unlockPhilokaliaGuide();
      showSuccess("Philokalia Guide unlocked.");
      navigate("/philokalia");
    }
  }

  return (
    <header className="flex min-w-0 items-center justify-between gap-3">
      <Link to="/today" className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="premium-icon-mark h-10 w-10 transition-transform group-hover:scale-[1.04]">
          <OrthodoxCrossIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-serif text-[15px] font-semibold tracking-[-0.02em] text-foreground sm:text-base">Nepsis Shield</p>
          <p
            className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground tabular-nums max-[340px]:hidden sm:text-[11px]"
            title={`The hour of prayer: ${hourName}`}
          >
            {clockLine}
          </p>
        </div>
      </Link>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <HelpNowButton />
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button aria-label="Open menu" size="icon" variant="ghost" className="h-10 w-10 rounded-md border border-primary/30 bg-card/75 text-foreground shadow-sm backdrop-blur hover:border-primary/55 hover:bg-primary/10 hover:text-primary">
              <Menu className="h-[18px] w-[18px]" />

              <span className="sr-only">Open menu</span>
            </Button>

          </SheetTrigger>

        <SheetContent side="right" className="flex h-dvh w-[min(23rem,94vw)] flex-col gap-0 overflow-hidden border-l-border bg-background p-0 backdrop-blur-xl">
          <SheetHeader className="orthodox-drawer-header shrink-0 border-b border-border px-5 pb-5 pt-7 text-left">
            <SheetTitle>

              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-lg text-left text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={handleSecretTap}
              >
                <span className="premium-icon-mark h-9 w-9"><OrthodoxCrossIcon className="h-4 w-4" /></span>
                <span>Nepsis Shield</span>
              </button>
            </SheetTitle>
            <SheetDescription className="max-w-[17rem] text-xs leading-relaxed">
              Prayer, Scripture, the saints, and a quiet Orthodox rhythm for every day.
            </SheetDescription>
          </SheetHeader>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
              <MenuLinks />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
