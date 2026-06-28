import { type ReactNode, useRef } from "react";
import { format } from "date-fns";
import {
  BookOpen,
  Crosshair,
  Download,
  Hand,
  HelpCircle,
  Home,
  Info,
  Map,
  Menu,
  Settings as SettingsIcon,
  Shield,
  Sparkles,
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
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { ThemeToggle } from "@/components/app/ThemeToggle";
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
        className="group flex min-w-0 items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium leading-tight text-foreground">{label}</span>
          {description ? <span className="mt-0.5 block truncate text-xs text-muted-foreground">{description}</span> : null}
        </span>
      </Link>
    </SheetClose>
  );
}

function MenuSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border/60 pt-3 first:border-t-0 first:pt-0">
      <h3 className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h3>
      <div className="grid gap-0.5">{children}</div>
    </section>
  );
}

function MenuLinks() {
  return (
    <div className="grid gap-3 pb-3">
      <SheetClose asChild>
        <Link
          to="/download"
          className="group flex min-w-0 items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-3 text-left transition-colors hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="shrink-0 text-primary">
            <Download className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold tracking-tight text-foreground">Install / share</span>
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">QR, web app, APK</span>
          </span>
        </Link>
      </SheetClose>

      <MenuSection title="Core">
        <div className="grid grid-cols-2 gap-1">
          <MenuLink to="/today" icon={<Home className="h-4 w-4" />} label="Today" />
          <MenuLink to="/pray" icon={<Hand className="h-4 w-4" />} label="Prayer" />
          <MenuLink to="/read" icon={<BookOpen className="h-4 w-4" />} label="Read" />
          <MenuLink to="/learn" icon={<Map className="h-4 w-4" />} label="Tools" />
        </div>
      </MenuSection>

      <MenuSection title="Library">
        <MenuLink to="/field-manual" icon={<Crosshair className="h-4 w-4" />} label="Field Manual" description="Role briefs and prayers" />
        <MenuLink to="/saints" icon={<Sparkles className="h-4 w-4" />} label="Saints" description="Daily intercession" />
        <MenuLink to="/about" icon={<Info className="h-4 w-4" />} label="About" description="Purpose and sources" />
      </MenuSection>

      <MenuSection title="Settings">
        <div className="px-0.5 py-1">
          <ThemeToggle variant="row" />
        </div>
        <SheetClose asChild>
          <button
            type="button"
            className="group flex min-w-0 items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={startTutorial}
          >
            <span className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary">
              <HelpCircle className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium leading-tight text-foreground">Tutorial</span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">Replay onboarding</span>
            </span>
          </button>
        </SheetClose>
        <MenuLink to="/settings" icon={<SettingsIcon className="h-4 w-4" />} label="Settings" description="Accessibility and role" />
        <MenuLink to="/privacy" icon={<Shield className="h-4 w-4" />} label="Privacy" description="Local data controls" />
      </MenuSection>

      <p className="border-t border-border/60 pt-3 text-xs leading-relaxed text-muted-foreground">
        Need help or want to send feedback? Use the Help button in the bottom-left corner.
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
    <header className="flex items-center justify-between gap-3">
      <Link to="/today" className="flex min-w-0 items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-border/70 bg-card text-primary shadow-sm">
          <OrthodoxCrossIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight">Nepsis Shield</h1>
          <p className="truncate text-xs text-muted-foreground">
            Orthodox field companion · {format(new Date(), "EEE, MMM d")}
          </p>
        </div>
      </Link>

      <div className="hidden items-center gap-1 sm:flex">
        <ThemeToggle />
        <Button type="button" size="sm" variant="ghost" className="rounded-2xl" onClick={startTutorial}>
          Tutorial
        </Button>
        <Button asChild size="sm" variant="ghost" className="rounded-2xl">
          <Link to="/settings">Settings</Link>
        </Button>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="h-10 w-10 rounded-2xl">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex h-dvh w-[min(22rem,92vw)] flex-col gap-0 overflow-hidden p-0">
          <SheetHeader className="shrink-0 border-b border-border/60 px-4 pb-3 pt-5 text-left">
            <SheetTitle>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={handleSecretTap}
              >
                <OrthodoxCrossIcon className="h-5 w-5 text-primary" /> Menu
              </button>
            </SheetTitle>
            <SheetDescription className="text-xs leading-relaxed">
              Prayer, reading, tools, install, and settings.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <MenuLinks />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
