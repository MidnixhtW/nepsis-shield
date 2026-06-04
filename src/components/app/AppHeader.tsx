import { format } from "date-fns";
import { Crosshair, Download, Info, Menu, Settings as SettingsIcon, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
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

function MenuLinks() {
  return (
    <div className="grid gap-2">
      <ThemeToggle variant="row" />

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
    </div>
  );
}

export function AppHeader() {
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
            <SheetTitle className="flex items-center gap-2">
              <OrthodoxCrossIcon className="h-5 w-5 text-primary" /> More
            </SheetTitle>
            <SheetDescription>
              Settings, saints, app install, privacy, and reference pages.
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
