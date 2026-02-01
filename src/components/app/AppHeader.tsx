import { format } from "date-fns";
import { ExternalLink, Menu, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
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
                  Daily resources sourced from the Orthodox Church in America.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-5 grid gap-2">
                <ThemeToggle variant="row" />

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
                  <a href="https://www.oca.org" target="_blank" rel="noreferrer">
                    Visit OCA.org <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>

                <div className="pt-2">
                  <Badge className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                    OCA sources
                  </Badge>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop: inline actions */}
        <div className="hidden items-center gap-2 sm:flex">
          <Badge className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            OCA sources
          </Badge>

          <ThemeToggle />

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
            <a href="https://www.oca.org" target="_blank" rel="noreferrer">
              OCA <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden rounded-3xl border-border/60 bg-card">
        <div className="relative aspect-[16/10] sm:aspect-[16/6]">
          <img
            alt="Icon of Christ"
            src="https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Pantocrator_mosaic_from_Hagia_Sophia_2744_x_2900_pixels_3.1_MB.jpg"
            className="h-full w-full object-cover object-[50%_22%]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-background/40" />
          <div className="absolute inset-0 p-4 sm:p-6">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              Prayer • Fasting • Scripture
            </p>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-foreground/90">
              A daily Orthodox companion with direct links to the Orthodox Church in America.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}