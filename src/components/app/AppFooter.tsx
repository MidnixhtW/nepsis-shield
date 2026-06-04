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
    <Card className="mt-4 rounded-3xl border-border/60 bg-card/70 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight">A quiet devotional aid</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Under the patronage of St Michael the Archangel. Orthodox-rooted public resources for prayer and Scripture.
          </p>
        </div>

        <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="outline" size="sm" className="w-full justify-start rounded-2xl border-primary/25 bg-background shadow-sm hover:bg-primary/10">
            <Link to="/download">
              <Download className="mr-2 h-4 w-4 text-primary" /> Install App
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start rounded-2xl border-primary/25 bg-background shadow-sm hover:bg-primary/10">
            <Link to="/field-manual">
              <Crosshair className="mr-2 h-4 w-4 text-primary" /> Field Manual
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start rounded-2xl border-primary/25 bg-background shadow-sm hover:bg-primary/10">
            <Link to="/about">
              <Info className="mr-2 h-4 w-4 text-primary" /> About
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start rounded-2xl border-primary/25 bg-background shadow-sm hover:bg-primary/10">
            <Link to="/privacy">
              <Shield className="mr-2 h-4 w-4 text-primary" /> Privacy
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
