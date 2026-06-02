import { format } from "date-fns";
import {
  Crosshair,
  ExternalLink,
  Info,
  Menu,
  Radio,
  Settings as SettingsIcon,
  Shield,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ApkDownloadButton } from "@/components/app/ApkDownloadButton";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { ThemeToggle } from "@/components/app/ThemeToggle";

export function AppHeader() {
  const today = new Date();

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30 glow">
            <OrthodoxCrossIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {format(today, "MMM d, yyyy")} • Daily companion
            </p>
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
              Ortho Companion: Field Guide
            </h1>
            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
              A field guide for prayer, Scripture, and Orthodox Christian rhythm.{" "}
              <Link to="/about" className="underline underline-offset-4">
                About
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 rounded-2xl border-border/60 bg-background/60 backdrop-blur"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[20rem] rounded-l-3xl">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2">
                  <OrthodoxCrossIcon className="h-5 w-5 text-primary" /> Ortho Field Guide
                </SheetTitle>
                <SheetDescription>
                  Prayer, Scripture, field manual resources, and Orthodox-rooted guidance for daily watchfulness.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-5 grid gap-2">
                <ThemeToggle variant="row" />

                <ApkDownloadButton
                  variant="default"
                  className="h-11 justify-start rounded-2xl"
                />

                <Button
                  asChild
                  variant="outline"
                  className="h-11 justify-start rounded-2xl border-border/60"
                >
                  <Link to="/settings">
                    <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 justify-start rounded-2xl border-border/60"
                >
                  <Link to="/saints">
                    <Sparkles className="mr-2 h-4 w-4" /> Saints
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 justify-start rounded-2xl border-border/60"
                >
                  <Link to="/field-manual">
                    <Crosshair className="mr-2 h-4 w-4" /> Field Manual
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 justify-start rounded-2xl border-border/60"
                >
                  <Link to="/about">
                    <Info className="mr-2 h-4 w-4" /> About & attribution
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 justify-start rounded-2xl border-border/60"
                >
                  <Link to="/privacy">
                    <Shield className="mr-2 h-4 w-4" /> Privacy
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 justify-start rounded-2xl border-border/60"
                >
                  <a href="https://www.oca.org" target="_blank" rel="noopener noreferrer">
                    Visit OCA.org <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggle />

          <ApkDownloadButton
            size="sm"
            className="rounded-2xl bg-primary text-primary-foreground"
          />

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-2xl border-border/60 bg-background/60 backdrop-blur"
          >
            <Link to="/settings">
              <SettingsIcon className="mr-2 h-4 w-4" /> Settings
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-2xl border-border/60 bg-background/60 backdrop-blur"
          >
            <Link to="/saints">
              <Sparkles className="mr-2 h-4 w-4" /> Saints
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-2xl border-border/60 bg-background/60 backdrop-blur"
          >
            <Link to="/field-manual">
              <Crosshair className="mr-2 h-4 w-4" /> Field
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-2xl border-border/60 bg-background/60 backdrop-blur"
          >
            <Link to="/about">About</Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-2xl border-border/60 bg-background/60 backdrop-blur"
          >
            <Link to="/privacy">
              <Shield className="mr-2 h-4 w-4" /> Privacy
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-2xl border-border/60 bg-background/60 backdrop-blur"
          >
            <a href="https://www.oca.org" target="_blank" rel="noopener noreferrer">
              OCA <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <Card className="group overflow-hidden rounded-3xl border-border/60 bg-card/80 shadow-sm backdrop-blur">
        <div className="relative min-h-[10.5rem] overflow-hidden field-grid">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/55 to-accent/15" />
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-primary/25" />
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full border border-primary/15" />
          <div className="absolute bottom-4 right-5 hidden items-center gap-2 rounded-full border border-border/60 bg-background/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground backdrop-blur sm:flex">
            <Radio className="h-3.5 w-3.5 text-primary" /> Signal steady
          </div>

          <div className="relative p-4 sm:p-6">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Prayer • Scripture • Field Manual • Orthodox tradition
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Keep the watch with Christ through a steady daily rhythm.
              </p>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                A quiet, low-distraction Christian field companion rooted in Orthodox faith: daily readings, fasting guidance, prayer, private reflection, and pastoral reminders to seek a priest, pastor, or chaplain when needed.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                <span className="rounded-full border border-border/60 bg-background/55 px-3 py-1.5">
                  Welcoming to all Christians
                </span>
                <span className="rounded-full border border-border/60 bg-background/55 px-3 py-1.5">
                  Orthodox-rooted rhythm
                </span>
                <span className="rounded-full border border-border/60 bg-background/55 px-3 py-1.5">
                  Priest • pastor • chaplain guidance
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/55 px-3 py-1.5">
                  <OrthodoxCrossIcon className="h-3.5 w-3.5 text-accent" /> Prayerful essentials
                </span>
              </div>
            </div>
          </div>

        </div>
      </Card>
    </div>
  );
}
