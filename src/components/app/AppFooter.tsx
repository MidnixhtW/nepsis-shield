import { Link } from "react-router-dom";
import { ExternalLink, Info, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AppFooter() {
  return (
    <Card className="mt-6 rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight">Independent Christian companion • not affiliated with OCA</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Built for all Christians with public Orthodox links and resources for convenience.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
            <Link to="/about">
              <Info className="mr-2 h-4 w-4" /> About
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
            <Link to="/privacy">
              <Shield className="mr-2 h-4 w-4" /> Privacy
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
            <a href="https://www.oca.org" target="_blank" rel="noopener noreferrer">
              OCA.org <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="details" className="rounded-2xl border border-border/60 px-3">
          <AccordionTrigger className="rounded-xl py-3 text-sm font-semibold hover:no-underline">
            Sources & pastoral note
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-xs leading-relaxed text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Sources used:</span> OCA.org links, orthocal.info (calendar data), bible-api.com and bolls.life (public Bible text sources).
            </p>
            <p className="mt-2">
              <span className="font-semibold text-foreground">Pastoral note:</span> This is a devotional aid and not a substitute for a chaplain, priest, or pastoral guidance.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
