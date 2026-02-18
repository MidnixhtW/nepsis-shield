import { Link } from "react-router-dom";
import { BookOpenCheck, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PROGRAMS } from "@/lib/programs/catalog";
import { getProgramProgress } from "@/lib/programs/progress";

export default function Programs() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Programs</p>
          <h1 className="text-2xl font-semibold tracking-tight">Guided prayer & habits</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Orthodox-focused, small daily sessions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <Link to="/today">Back to app</Link>
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {PROGRAMS.map((p) => {
          const prog = getProgramProgress(p.id);
          const done = prog.completedSessionIds.length;
          const total = p.sessions.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <Card key={p.id} className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">{p.title}</h2>
                    <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {p.minutesPerDay} min/day
                    </Badge>
                    <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {p.level === "starter" ? "Starter" : "Growth"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                </div>

                <Button asChild className="rounded-2xl">
                  <Link to={`/programs/${p.id}`}>
                    Open <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <p className="text-sm leading-relaxed text-foreground/90">{p.description}</p>

                <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <BookOpenCheck className="h-4 w-4 text-primary" />
                    {done}/{total} completed
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{pct}%</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="outline" className="rounded-2xl border-border/60">
                  <Link to={`/programs/${p.id}`}>
                    <Sparkles className="mr-2 h-4 w-4" /> Continue
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
