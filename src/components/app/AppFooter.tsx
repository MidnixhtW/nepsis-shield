import { Link } from "react-router";
import { Crosshair, Download, Info, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const utilityLinks = [
  { label: "Install / share", to: "/download", icon: <Download className="h-4 w-4" /> },
  { label: "Life & service", to: "/field-manual", icon: <Crosshair className="h-4 w-4" /> },
  { label: "About", to: "/about", icon: <Info className="h-4 w-4" /> },
  { label: "Privacy", to: "/privacy", icon: <Shield className="h-4 w-4" /> },
];

// Compact on every page. The pastoral note (this app does not replace your priest) and the sources live on About.
export function AppFooter() {
  return (
    <Card className="mt-4 overflow-hidden rounded-[1.25rem] border-border/55 bg-card/70 p-3 shadow-[0_18px_52px_hsl(232_45%_3%/0.14)] backdrop-blur-xl">
      <div className="flex justify-center">
        <nav aria-label="Footer utility links" className="flex flex-wrap justify-center gap-2">
          {utilityLinks.map((link) => (
            <Button
              key={link.to}
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl border-border/60 bg-background/55 shadow-sm hover:border-primary/30 hover:bg-secondary/35"
            >

              <Link to={link.to}>
                <span className="mr-2 text-primary">{link.icon}</span>
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </Card>
  );
}
