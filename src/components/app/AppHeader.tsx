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
  Plus,
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
    <section className="border-t border-border/45 pt-3 first:border-t-0 first:pt-0">
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
      <MenuLink to="/today" icon={<Plus className="h-4 w-4" />} label="New Chat" description="Start fresh from Today" />

      <MenuSection title="Apps">
        <div className="grid grid-cols-2 gap-1">
          <MenuLink to="/today" icon={<Home className="h-4 w-4" />} label="Today" />
          <MenuLink to="/pray" icon={<Hand className="h-4 w-4" />} label="Pray" />
          <MenuLink to="/read" icon={<BookOpen className="h-4 w-4" />} label="Read" />
          <MenuLink to="/learn" icon={<Map className="h-4 w-4" />} label="Guide" />
        </div>
      </MenuSection>

      <MenuSection title="Library">
        <MenuLink to="/field-manual" icon={<Crosshair className="h-4 w-4" />} label="Life & Service Guide" description="Daily life, pressure, prayer, and recovery" />
        <MenuLink to="/saints" icon={<Sparkles className="h-4 w-4" />} label="Saints" description="Patrons and intercession" />
      </MenuSection>

      <MenuSection title="More">
        <MenuLink to="/settings" icon={<SettingsIcon className="h-4 w-4" />} label="Settings" description="Accessibility and role" />
        <MenuLink to="/download" icon={<Download className="h-4 w-4" />} label="Install / Share" description="Web app, APK, QR, and copy" />
        <MenuLink to="/about" icon={<Info className="h-4 w-4" />} label="Sources & Trust" description="Purpose, sources, and safety note" />
        <MenuLink to="/privacy" icon={<Shield className="h-4 w-4" />} label="Privacy" description="Local data controls" />
        <div className="px-0.5 py-1">
          <ThemeToggle variant="row" />
        </div>
      </MenuSection>

      <MenuSection title="Help">
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
    <header className="flex min-w-0 items-center justify-between gap-2 sm:gap-3">
      <Link to="/today" className="group flex min-w-0 items-center gap-2.5 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary via-amber-400 to-rose-400 text-primary-foreground shadow-[0_8px_24px_hsl(var(--primary)/0.24)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 sm:h-10 sm:w-10">
          <OrthodoxCrossIcon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm font-bold tracking-[-0.02em] sm:text-base">Nepsis Shield</h1>
            <span className="hidden rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-primary md:inline-flex">Daily</span>
          </div>
          <p className="truncate text-[11px] font-medium text-muted-foreground max-[359px]:hidden sm:text-xs">
            Stay rooted · {format(new Date(), "EEE, MMM d")}
          </p>

        </div>
      </Link>

      <div className="hidden shrink-0 items-center gap-1 sm:flex">
        <ThemeToggle />
        <Button asChild size="sm" variant="ghost" className="rounded-full px-3">
          <Link to="/settings">Settings</Link>
        </Button>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button aria-label="Toggle Menu" size="icon" variant="ghost" className="h-9 w-9 rounded-xl sm:h-10 sm:w-10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex h-dvh w-[min(21rem,92vw)] flex-col gap-0 overflow-hidden p-0">
          <SheetHeader className="shrink-0 border-b border-border/45 px-4 pb-3 pt-5 text-left">
            <SheetTitle>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={handleSecretTap}
              >
                <OrthodoxCrossIcon className="h-5 w-5 text-primary" /> Toggle Menu
              </button>
            </SheetTitle>
            <SheetDescription className="text-xs leading-relaxed">
              Apps, Settings, Library, Hub, Help, and New Chat.
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
