import { Link } from "react-router-dom";
import { Crosshair, Download, HeartHandshake, Info, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const utilityLinks = [
  { label: "Install", to: "/download", icon: <Download className="h-4 w-4" /> },
  { label: "Field Manual", to: "/field-manual", icon: <Crosshair className="h-4 w-4" /> },
  { label: "About", to: "/about", icon: <Info className="h-4 w-4" /> },
  { label: "Privacy", to: "/privacy", icon: <Shield className="h-4 w-4" /> },
];

export function AppFooter() {
  return (
    <Card className="mt-4 overflow-hidden rounded-3xl border-border/60 bg-card/70 p-4 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight">A quiet devotional aid</p>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            Under the patronage of St Michael the Archangel, for military, law enforcement, fire rescue, EMS, dispatch, corrections, chaplains, families, and the wider service-and-protection community.
          </p>
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-primary/15 bg-primary/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              Pastoral note: this app supports prayer and learning, but it does not replace a parish priest, chaplain, counselor, or trusted spiritual guide.
            </p>
          </div>
        </div>

        <nav aria-label="Footer utility links" className="flex flex-wrap gap-2 xl:justify-end">
          {utilityLinks.map((link) => (
            <Button
              key={link.to}
              asChild
              variant="outline"
              size="sm"
              className="rounded-2xl border-border/60 bg-background/70 shadow-sm hover:border-primary/30 hover:bg-primary/10"
            >
              <Link to={link.to}>
                <span className="mr-2 text-primary">{link.icon}</span>
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      <div className="mt-3 border-t border-border/60 pt-3 text-xs leading-relaxed text-muted-foreground">
        Sources include OCA.org links, orthocal.info, bible-api.com, and bolls.life. Always verify pastoral or liturgical questions with your local clergy.
      </div>
    </Card>
  );
}
