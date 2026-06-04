import { Link } from "react-router-dom";
import { Crosshair, Download, ExternalLink, Info, Shield } from "lucide-react";
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
    <Card className="mt-4 overflow-hidden rounded-3xl border-border/60 bg-card/70 p-4 shadow-sm">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:justify-between">
        <div className="min-w-0 max-w-full">
          <p className="break-words text-sm font-semibold tracking-tight">A quiet devotional aid</p>
          <p className="mt-1 max-w-full break-words text-xs leading-relaxed text-muted-foreground">
            Under the patronage of St Michael the Archangel. Orthodox-rooted public resources for prayer and Scripture.
          </p>
        </div>

        <div className="grid min-w-0 w-full gap-2 sm:grid-cols-2 xl:w-auto xl:grid-cols-4">
          <Button asChild variant="outline" size="sm" className="min-w-0 w-full justify-start rounded-2xl border-primary/25 bg-background shadow-sm hover:bg-primary/10">
            <Link to="/download" className="min-w-0">
              <Download className="mr-2 h-4 w-4 shrink-0 text-primary" /> <span className="truncate">Install App</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="min-w-0 w-full justify-start rounded-2xl border-primary/25 bg-background shadow-sm hover:bg-primary/10">
            <Link to="/field-manual" className="min-w-0">
              <Crosshair className="mr-2 h-4 w-4 shrink-0 text-primary" /> <span className="truncate">Field Manual</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="min-w-0 w-full justify-start rounded-2xl border-primary/25 bg-background shadow-sm hover:bg-primary/10">
            <Link to="/about" className="min-w-0">
              <Info className="mr-2 h-4 w-4 shrink-0 text-primary" /> <span className="truncate">About</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="min-w-0 w-full justify-start rounded-2xl border-primary/25 bg-background shadow-sm hover:bg-primary/10">
            <Link to="/privacy" className="min-w-0">
              <Shield className="mr-2 h-4 w-4 shrink-0 text-primary" /> <span className="truncate">Privacy</span>
            </Link>
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="mt-2">
        <AccordionItem value="details" className="border-none">
          <AccordionTrigger className="rounded-xl py-2 text-xs font-semibold text-muted-foreground hover:no-underline">
            Sources
          </AccordionTrigger>
          <AccordionContent className="pb-2 text-xs leading-relaxed text-muted-foreground">

            <p>
              Sources include OCA.org links, orthocal.info, bible-api.com, and bolls.life.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
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
