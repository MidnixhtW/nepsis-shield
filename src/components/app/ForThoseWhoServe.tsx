import { Link } from "react-router";
import { ChevronRight, Crosshair, Flame, Shield, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SaintHaloIcon } from "@/components/app/OrthodoxMotifs";

// Learn > For those who serve: the support the app adds for people who keep watch over others for a living.
const links = [
  { to: "/field-manual", label: "Life & Service Guide", hint: "Stress, grief, duty and travel, role by role", icon: Crosshair },
  { to: "/saints", label: "Saints", hint: "Warrior saints and patrons of those who serve", icon: SaintHaloIcon },
  { to: "/pray?tab=services&service=fallen-warriors", label: "Canon for the Fallen in Battle", hint: "The Church's prayer for those who gave their lives", icon: Flame },
  { to: "/settings#role", label: "Choose your service role", hint: "Show this support first across the app", icon: SlidersHorizontal },
];

export function ForThoseWhoServe() {
  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">For those who keep watch over others</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Every Christian keeps watch over something. Some do it for a living: military, police, fire, EMS, dispatch, corrections and chaplains. St Michael the Archangel, the app's patron, stands with them. These pages add prayer and steady guidance for that work.
          </p>
        </div>
        <Shield className="h-5 w-5 shrink-0 text-primary" />
      </div>
      <Separator className="my-4" />
      <ul className="grid gap-2">
        {links.map(({ to, label, hint, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="tap flex items-center gap-3 rounded-2xl border border-border/60 bg-background/50 px-4 py-3 hover:bg-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-xs text-muted-foreground">{hint}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
