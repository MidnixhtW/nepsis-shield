import { useRef } from "react";
import { format } from "date-fns";
import { BookOpen, Crosshair, Download, Hand, HelpCircle, Home, Info, Map, Menu, Settings as SettingsIcon, Shield, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
  Sheet,
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

function MenuLinks() {
  const linkClass = "h-10 justify-start rounded-2xl px-3 text-sm";
  const iconClass = "mr-2 h-4 w-4 shrink-0";

  return (
    <div className="grid gap-3 pb-3">
      <Button asChild className="h-auto justify-start rounded-2xl p-3 text-left shadow-lg shadow-primary/10">
        <Link to="/download" className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary-foreground/15">
            <Download className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">Install / share</span>
            <span className="mt-0.5 block truncate text-xs font-normal opacity-85">APK, web app, QR</span>
          </span>
        </Link>
      </Button>

      <div className="rounded-2xl border border-border/60 bg-muted/20 p-2">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Main
        </p>
        <div className="mt-1 grid grid-cols-2 gap-1">
          <Button asChild variant="ghost" className={linkClass}>
            <Link to="/today">
              <Home className={iconClass} /> Today
            </Link>
          </Button>
          <Button asChild variant="ghost" className={linkClass}>
            <Link to="/pray">
              <Hand className={iconClass} /> Prayer
            </Link>
          </Button>
          <Button asChild variant="ghost" className={linkClass}>
            <Link to="/read">
              <BookOpen className={iconClass} /> Read
            </Link>
          </Button>
          <Button asChild variant="ghost" className={linkClass}>
            <Link to="/learn">
              <Map className={iconClass} /> Tools
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-muted/20 p-2">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          More
        </p>
        <div className="mt-1 grid gap-1">
          <ThemeToggle variant="row" />

          <Button type="button" variant="ghost" className={linkClass} onClick={startTutorial}>
            <HelpCircle className={iconClass} /> Tutorial
          </Button>

          <Button asChild variant="ghost" className={linkClass}>
            <Link to="/settings">
              <SettingsIcon className={iconClass} /> Settings
            </Link>
          </Button>

          <Button asChild variant="ghost" className={linkClass}>
            <Link to="/saints">
              <Sparkles className={iconClass} /> Saints
            </Link>
          </Button>

          <Button asChild variant="ghost" className={linkClass}>
            <Link to="/field-manual">
              <Crosshair className={iconClass} /> Field Manual
            </Link>
          </Button>

          <Button asChild variant="ghost" className={linkClass}>
            <Link to="/privacy">
              <Shield className={iconClass} /> Privacy
            </Link>
          </Button>

          <Button asChild variant="ghost" className={linkClass}>
            <Link to="/about">
              <Info className={iconClass} /> About
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground">
        Need help or want to send feedback? Use the Help button in the bottom-left corner.
      </div>
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
      <Link to="/today" className="flex min-w-0 items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-border bg-muted/40 text-primary">
          <OrthodoxCrossIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight">Nepsis Shield</h1>
          <p className="truncate text-xs text-muted-foreground">
            For those who serve & keep watch · {format(new Date(), "EEE, MMM d")}
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
        <SheetContent side="right" className="flex h-dvh w-[min(22rem,92vw)] flex-col gap-0 overflow-hidden rounded-l-3xl p-0">
          <SheetHeader className="shrink-0 border-b border-border/60 px-4 pb-3 pt-5 text-left">
            <SheetTitle>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={handleSecretTap}
              >
                <OrthodoxCrossIcon className="h-5 w-5 text-primary" /> More
              </button>
            </SheetTitle>
            <SheetDescription className="text-xs leading-relaxed">
              Today is home base. Prayer, Read, and Tools are the main areas.
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
