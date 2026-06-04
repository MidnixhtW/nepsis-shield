import { Link } from "react-router-dom";
import { Crosshair, ExternalLink, Info, Shield } from "lucide-react";
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
    <Card className="mt-4 rounded-3xl border-border/60 bg-card/70 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight">A quiet devotional aid</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Orthodox-rooted public resources for prayer and Scripture. Not a substitute for pastoral care.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="ghost" size="sm" className="rounded-2xl">
            <Link to="/field-manual">
              <Crosshair className="mr-2 h-4 w-4" /> Field Manual
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="rounded-2xl">
            <Link to="/about">
              <Info className="mr-2 h-4 w-4" /> About
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="rounded-2xl">
            <Link to="/privacy">
              <Shield className="mr-2 h-4 w-4" /> Privacy
            </Link>
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="mt-2">
        <AccordionItem value="details" className="border-none">
          <AccordionTrigger className="rounded-xl py-2 text-xs font-semibold text-muted-foreground hover:no-underline">
            Sources & app install
          </AccordionTrigger>
          <AccordionContent className="pb-2 text-xs leading-relaxed text-muted-foreground">
            <p>
              Sources include OCA.org links, orthocal.info, bible-api.com, and bolls.life.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                <Link to="/download">App install</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                <a href="https://www.oca.org" target="_blank" rel="noopener noreferrer">
                  OCA.org <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
