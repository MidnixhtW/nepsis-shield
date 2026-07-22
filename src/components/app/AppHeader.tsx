import { type ReactNode, useRef } from "react";
import { format } from "date-fns";
import {
  Crosshair,
  Download,
  HelpCircle,
  Info,
  Menu,

  Plus,
  Settings as SettingsIcon,
  Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ByzantineDivider } from "@/components/app/ByzantineOrnament";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { CenserIcon, ChurchDomeIcon, GospelBookIcon, SaintHaloIcon, VigilLampIcon } from "@/components/app/OrthodoxMotifs";
import { START_TUTORIAL_EVENT } from "@/components/app/QuickStartDialog";

import { unlockPhilokaliaGuide } from "@/lib/philokaliaUnlock";
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

function MenuLinks() {
  return (
    <div className="grid gap-3 pb-3">
      <MenuLink to="/today" icon={<Plus className="h-4 w-4" />} label="New Chat" description="Start fresh from Today" />
      <ByzantineDivider className="px-3 py-1" />

      <MenuSection title="Daily rhythm">
        <div className="grid grid-cols-2 gap-1">
          <MenuLink to="/today" icon={<VigilLampIcon className="h-4 w-4" />} label="Today" />
          <MenuLink to="/pray" icon={<CenserIcon className="h-4 w-4" />} label="Pray" />
          <MenuLink to="/read" icon={<GospelBookIcon className="h-4 w-4" />} label="Read" />
          <MenuLink to="/learn" icon={<ChurchDomeIcon className="h-4 w-4" />} label="Learn" />
        </div>
      </MenuSection>

      <MenuSection title="Library">
        <MenuLink to="/field-manual" icon={<Crosshair className="h-4 w-4" />} label="Life & Service Guide" description="Daily life, pressure, prayer, and recovery" />
        <MenuLink to="/saints" icon={<SaintHaloIcon className="h-4 w-4" />} label="Saints" description="Patrons and intercession" />
      </MenuSection>

      <MenuSection title="More">
        <MenuLink to="/settings" icon={<SettingsIcon className="h-4 w-4" />} label="Settings" description="Accessibility and role" />
        <MenuLink to="/download" icon={<Download className="h-4 w-4" />} label="Install / Share" description="Web app, APK, QR, and copy" />
        <MenuLink to="/about" icon={<Info className="h-4 w-4" />} label="Sources & Trust" description="Purpose, sources, and safety note" />
        <MenuLink to="/privacy" icon={<Shield className="h-4 w-4" />} label="Privacy" description="Local data controls" />
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
              <span className="block truncate font-medium leading-tight text-foreground">Help</span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">Replay onboarding</span>
            </span>
          </button>
        </SheetClose>
        <p className="px-2.5 py-2 text-xs leading-relaxed text-muted-foreground">
          Need help or want to send feedback? Use the Help button in the bottom-left corner.
        </p>
      </MenuSection>

      <p className="border-t border-border/45 pt-3 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Version 265
      </p>
    </div>
  );
}

export function AppHeader() {
  const navigate = useNavigate();
  const secretTaps = useRef<number[]>([]);

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
      <Link to="/today" className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="premium-icon-mark h-10 w-10 group-hover:scale-[1.03]">
          <OrthodoxCrossIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-serif text-sm font-semibold tracking-wide text-foreground sm:text-base">Nepsis Shield</p>
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground max-[340px]:hidden sm:text-[11px]">
            Today · {format(new Date(), "EEE, MMM d")}
          </p>
        </div>
      </Link>

      <Sheet>

        <SheetTrigger asChild>
          <Button aria-label="Open menu" size="icon" variant="ghost" className="ml-auto h-10 w-10 rounded-lg border border-border bg-card/65 text-foreground shadow-sm hover:bg-muted hover:text-primary">
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
    </header>
  );
}
