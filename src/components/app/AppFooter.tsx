import { Link } from "react-router-dom";
import { ExternalLink, Info, Shield, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function AppFooter() {
  return (
    <Card className="mt-6 rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              Not official
            </Badge>
            <Badge className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              OCA sources
            </Badge>
          </div>

          <p className="mt-2 text-sm font-semibold tracking-tight">
            Independent project — not affiliated with the Orthodox Church in America (OCA)
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            This app links to public resources (including OCA.org) for convenience. "Orthodox Church in America" and "OCA" are trademarks of their respective owners and are used here only to identify sources.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
            <Link to="/about">
              <Info className="mr-2 h-4 w-4" /> About & attribution
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
            <Link to="/privacy">
              <Shield className="mr-2 h-4 w-4" /> Privacy
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-2xl border-border/60"
          >
            <a href="mailto:feedback@example.com?subject=Ortho%20Companion%20feedback">
              <Mail className="mr-2 h-4 w-4" /> Feedback
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
            <a href="https://www.oca.org" target="_blank" rel="noopener noreferrer">
              OCA.org <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        <p className="leading-relaxed">
          <span className="font-semibold text-foreground">Sources used:</span> OCA.org links, orthocal.info (calendar data), bible-api.com and bolls.life (public Bible text sources).
        </p>
        <p className="leading-relaxed">
          <span className="font-semibold text-foreground">Pastoral note:</span> This is a devotional aid and not a substitute for pastoral guidance.
        </p>
      </div>
    </Card>
  );
}