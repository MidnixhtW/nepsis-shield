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
  return (
    <div className="grid gap-4">
      <div className="rounded-3xl border border-border/60 bg-muted/20 p-3">
        <p className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Main map
        </p>
        <div className="mt-2 grid gap-1">
          <Button asChild variant="ghost" className="h-11 justify-start rounded-2xl">
            <Link to="/today">
              <Home className="mr-2 h-4 w-4" /> Today dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-11 justify-start rounded-2xl">
            <Link to="/pray">
              <Hand className="mr-2 h-4 w-4" /> Prayer
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-11 justify-start rounded-2xl">
            <Link to="/read">
              <BookOpen className="mr-2 h-4 w-4" /> Read
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-11 justify-start rounded-2xl">
            <Link to="/learn">
              <Map className="mr-2 h-4 w-4" /> Tools
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <ThemeToggle variant="row" />

        <Button type="button" variant="ghost" className="h-11 justify-start rounded-2xl" onClick={startTutorial}>
          <HelpCircle className="mr-2 h-4 w-4" /> Tutorial
        </Button>

        <Button asChild variant="ghost" className="h-11 justify-start rounded-2xl">
          <Link to="/settings">
            <SettingsIcon className="mr-2 h-4 w-4" /> Settings
          </Link>
        </Button>

        <Button asChild variant="ghost" className="h-11 justify-start rounded-2xl">
          <Link to="/saints">
            <Sparkles className="mr-2 h-4 w-4" /> Saints
          </Link>
        </Button>

        <Button asChild variant="ghost" className="h-11 justify-start rounded-2xl">
          <Link to="/field-manual">
            <Crosshair className="mr-2 h-4 w-4" /> Field Manual
          </Link>
        </Button>

        <Button asChild variant="ghost" className="h-11 justify-start rounded-2xl">
          <Link to="/download">
            <Download className="mr-2 h-4 w-4" /> App install
          </Link>
        </Button>

        <Button asChild variant="ghost" className="h-11 justify-start rounded-2xl">
          <Link to="/privacy">
            <Shield className="mr-2 h-4 w-4" /> Privacy
          </Link>
        </Button>

        <Button asChild variant="ghost" className="h-11 justify-start rounded-2xl">
          <Link to="/about">
            <Info className="mr-2 h-4 w-4" /> About
          </Link>
        </Button>

        <div className="rounded-3xl border border-border/60 bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground">
          Need app help or want to send feedback? Use the Help button in the bottom-left corner.
        </div>
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
            Orthodox Watchfulness & Prayer · {format(new Date(), "EEE, MMM d")}
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
        <SheetContent side="right" className="w-[20rem] rounded-l-3xl">
          <SheetHeader className="text-left">
            <SheetTitle>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={handleSecretTap}
              >
                <OrthodoxCrossIcon className="h-5 w-5 text-primary" /> More
              </button>
            </SheetTitle>
            <SheetDescription>
              Today is home base. Prayer, Read, and Tools are the main areas.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-5">
            <MenuLinks />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
