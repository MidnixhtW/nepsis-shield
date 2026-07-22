import { Link } from "react-router-dom";
import { BadgeCheck, CalendarDays, ListChecks } from "lucide-react";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageContainer } from "@/components/app/PageContainer";
import { PremiumPageHeader } from "@/components/app/PremiumPageHeader";
import { RELEASE_NOTES } from "@/lib/releaseInfo";

export default function ReleaseNotes() {

  return (
    <PageContainer>
      <PremiumPageHeader
        eyebrow="Release log"
        title="Release notes"
        description="Version history for Nepsis Shield and the Android APK track."
        icon={<OrthodoxCrossIcon className="h-6 w-6" />}
        actions={
          <>
            <Button asChild variant="outline" className="premium-action"><Link to="/today">Back to app</Link></Button>
            <Button asChild className="rounded-2xl"><Link to="/download">Download APK</Link></Button>
          </>
        }
      />

      <div className="premium-card-stack mt-5">

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
    </PageContainer>
  );
}
