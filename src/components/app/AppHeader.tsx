import { format } from "date-fns";
import { ExternalLink, Menu, Shield, Info, Sparkles, Settings as SettingsIcon } from "lucide-react";
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
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { ThemeToggle } from "@/components/app/ThemeToggle";

export function AppHeader() {
  const today = new Date();

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
            <OrthodoxCrossIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              {format(today, "MMM d, yyyy")}
            </p>
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
              Ortho Companion
            </h1>
            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
              Independent project.{" "}
              <Link to="/about" className="underline underline-offset-4">
                About
              </Link>
            </p>
          </div>
        </div>

        {/* Mobile: compact menu */}
        <div className="flex items-center gap-2 sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 rounded-2xl border-border/60 bg-background/60"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[20rem] rounded-l-3xl">
              <SheetHeader className="text-left">
                <SheetTitle>Ortho Companion</SheetTitle>
                <SheetDescription>
                  Simple daily resources with links to OCA.org.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-5 grid gap-2">
                <ThemeToggle variant="row" />

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

        {/* Desktop: inline actions */}
        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggle />

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-2xl border-border/60 bg-background/60"
          >
            <Link to="/settings">
              <SettingsIcon className="mr-2 h-4 w-4" /> Settings
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-2xl border-border/60 bg-background/60"
          >
            <Link to="/saints">
              <Sparkles className="mr-2 h-4 w-4" /> Saints
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-2xl border-border/60 bg-background/60"
          >
            <Link to="/about">About</Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-2xl border-border/60 bg-background/60"
          >
            <Link to="/privacy">
              <Shield className="mr-2 h-4 w-4" /> Privacy
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-2xl border-border/60 bg-background/60"
          >
            <a href="https://www.oca.org" target="_blank" rel="noopener noreferrer">
              OCA <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <Card className="group overflow-hidden rounded-3xl border-border/60 bg-card">
        <div className="relative aspect-[16/8] sm:aspect-[16/5]">
          <img
            alt="Icon of Christ"
            src="https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Pantocrator_mosaic_from_Hagia_Sophia_2744_x_2900_pixels_3.1_MB.jpg"
            className="h-full w-full object-cover object-[50%_22%] transition-transform duration-500 group-hover:scale-[1.01]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-background/35" />
          <div className="absolute inset-0 p-4 sm:p-6">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                Prayer • Fasting • Scripture
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                Calm daily essentials with direct sources.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}