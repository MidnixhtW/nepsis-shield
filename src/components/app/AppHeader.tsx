import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";

export function AppHeader() {
  const today = new Date();

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
            <OrthodoxCrossIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              {format(today, "MMM d, yyyy")}
            </p>
            <h1 className="text-lg font-semibold tracking-tight">Ortho Companion</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="hidden rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
            OCA sources
          </Badge>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-2xl border-border/60 bg-background/60"
          >
            <a href="https://www.oca.org" target="_blank" rel="noreferrer">
              OCA <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden rounded-3xl border-border/60 bg-card">
        <AspectRatio ratio={16 / 6}>
          <img
            alt="Icon of Christ"
            src="https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Pantocrator_mosaic_from_Hagia_Sophia_2744_x_2900_pixels_3.1_MB.jpg"
            className="h-full w-full object-cover object-[50%_22%]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-background/35" />
          <div className="absolute inset-0 p-5 sm:p-6">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              Prayer • Fasting • Scripture
            </p>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-foreground/90">
              A daily Orthodox companion with direct links to the Orthodox Church in America.
            </p>
          </div>
        </AspectRatio>
      </Card>
    </div>
  );
}