import { Link } from "react-router-dom";
import { BadgeCheck, CalendarDays, ListChecks } from "lucide-react";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RELEASE_NOTES } from "@/lib/releaseInfo";

export default function ReleaseNotes() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30 glow">
            <OrthodoxCrossIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Release log
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Release notes</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Version history for Ortho Companion and the Android APK track.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <Link to="/today">Back to app</Link>
          </Button>
          <Button asChild className="rounded-2xl">
            <Link to="/download">Download APK</Link>
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {RELEASE_NOTES.map((release) => (
          <Card key={release.version} className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                    Version {release.version}
                  </Badge>
                  <Badge className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    <CalendarDays className="mr-1 h-3.5 w-3.5" /> {release.date}
                  </Badge>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">{release.title}</h2>
              </div>
              <BadgeCheck className="h-5 w-5 text-muted-foreground" />
            </div>

            <Separator className="my-4" />

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">What changed</p>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                {release.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
