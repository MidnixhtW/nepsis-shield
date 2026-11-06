import { Link } from "react-router";
import { ExternalLink, Shield, Info, BookText, BadgeCheck } from "lucide-react";
import { ApkDownloadButton } from "@/components/app/ApkDownloadButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/app/PageContainer";
import { PremiumPageHeader } from "@/components/app/PremiumPageHeader";
import { APK_ARTIFACTS_URL, APK_CHANNEL, APK_CHANNEL_LABEL, APK_DOWNLOAD_IS_DIRECT } from "@/lib/apkDownload";
import { CURRENT_VERSION } from "@/lib/releaseInfo";

export default function About() {

  return (
    <PageContainer>
      <PremiumPageHeader
        eyebrow="About"
        title="Sources, trust, and purpose"
        description="An Orthodox prayer companion for keeping watch: what it is, where its texts come from, and who made it."
        icon={<Info className="h-5 w-5" />}
        actions={
          <>
            <Button asChild variant="outline" className="premium-action"><Link to="/today">Back to app</Link></Button>
            <Button asChild variant="outline" className="premium-action"><Link to="/privacy"><Shield className="mr-2 h-4 w-4" /> Privacy</Link></Button>
            <ApkDownloadButton className="rounded-2xl" />
          </>
        }
      />

      <div className="premium-card-stack mt-5">

        <Card className="rounded-3xl border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">What Nepsis Shield is</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Nepsis Shield is an Orthodox prayer companion for keeping watch. <em>Nepsis</em> is the Church's word for watchfulness: staying awake to God and guarding the heart. Everyone keeps watch over something, whether a family, a household, their own heart, or a post. The app gives daily prayer, Scripture, the saints and the fasts to all of them, under the protection of St Michael the Archangel.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Some people keep watch over others for a living: military, police, fire, EMS, dispatch, corrections and chaplains. For them the app adds the Life &amp; Service Guide, the warrior saints and the Canon for the Fallen. Choose a service role in Settings to see that support first.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The prayers and calendar follow the Orthodox Church. Every Christian is welcome to pray with it. Eastern Catholics (Byzantine, Melkite, Ruthenian, Ukrainian) pray these same prayers, but your calendar and some commemorations may differ, so follow your parish. For Western Rite Orthodox parishes the app includes the Rosary and the Angelus, which Catholics can pray too.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                It is meant to help you take one faithful next step. It does not replace your priest, chaplain, clinician, therapist, emergency services, or the life of the Church.
              </p>

            </div>
            <Shield className="h-5 w-5 shrink-0 text-primary" />
          </div>
        </Card>

        <Card id="apk-download" className="rounded-3xl border-border/60 bg-card p-5 shadow-sm scroll-mt-24">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Android APK download</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {APK_CHANNEL === "release"
                  ? "Install the signed Android app directly."
                  : "Install the Android testing build directly. A signed release is on its way."}
              </p>
            </div>
            <BadgeCheck className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                Android
              </Badge>
              <Badge className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {APK_CHANNEL_LABEL}
              </Badge>
            </div>

            <p className="text-sm leading-relaxed text-foreground/90">
              {APK_DOWNLOAD_IS_DIRECT
                ? "Tap the button below to download the latest configured APK."
                : "The APK button is ready. Once the automated Android build publishes an APK URL, it can be connected as the direct download target."}
            </p>

            <div className="flex flex-wrap gap-2">
              <ApkDownloadButton className="rounded-2xl" />
              {APK_ARTIFACTS_URL ? (
                <Button asChild variant="outline" className="rounded-2xl border-border/60">
                  <a href={APK_ARTIFACTS_URL} target="_blank" rel="noopener noreferrer">
                    Open build artifacts <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : null}
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Android may ask you to allow installation from your browser or file manager. Only install APKs from builds you trust.
            </p>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Non-affiliation</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Clear statement to avoid confusion.
              </p>
            </div>
            <Info className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                Not official
              </Badge>
              <Badge className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                OCA sources
              </Badge>
            </div>

            <p className="text-sm leading-relaxed text-foreground/90">
              Nepsis Shield is an independent tool for Orthodox watchfulness and prayer, made for <span className="font-semibold">Christians of every tradition</span>: everyday people, families, military, first responders, public safety, medical teams, chaplains, security, dispatchers, and others who keep watch or carry responsibility for others. It is shaped by Orthodox prayer, Scripture, fasting, and the life of the Church. It is <span className="font-semibold">not an official app</span> of the Orthodox Church in America (OCA) and is <span className="font-semibold">not endorsed by or affiliated with</span> the OCA.

            </p>

            <p className="text-xs leading-relaxed text-muted-foreground">

              "Orthodox Church in America" and "OCA" are trademarks of their respective owners. Names and links are used for identification of Orthodox sources only.
            </p>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Sources & credits</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Where the app gets public information.
              </p>
            </div>
            <BookText className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3 text-sm">
            <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4">
              <p className="font-semibold">Created by Empathik</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Nepsis Shield is built as an Orthodox watchfulness and prayer companion for daily life, family and work stress, first response, public safety, and service under pressure.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3 rounded-2xl border-border/60">
                <Link to="/release-notes">What's new in version {CURRENT_VERSION}</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">

              <p className="font-semibold">Orthodox Church in America (OCA)</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Used primarily for links to prayers, articles, and daily reading pages.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline" className="rounded-2xl border-border/60">
                  <a href="https://www.oca.org" target="_blank" rel="noopener noreferrer">
                    Visit OCA.org <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" className="rounded-2xl border-border/60">
                  <a href="https://www.oca.org/readings" target="_blank" rel="noopener noreferrer">
                    Daily readings index <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="font-semibold">orthocal.info</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Calendar/fasting/saints/readings metadata (requested from your browser).
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3 rounded-2xl border-border/60">
                <a href="https://orthocal.info" target="_blank" rel="noopener noreferrer">
                  Visit orthocal.info <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="font-semibold">Bible text sources</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Public endpoints used for Bible text queries (requested from your browser).
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline" className="rounded-2xl border-border/60">
                  <a href="https://bible-api.com" target="_blank" rel="noopener noreferrer">
                    bible-api.com <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" className="rounded-2xl border-border/60">
                  <a href="https://bolls.life" target="_blank" rel="noopener noreferrer">
                    bolls.life <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Content and availability are controlled by the upstream sources. If a source changes or is unavailable, parts of the app may show errors or incomplete data.
            </p>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Pastoral & safety note</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Helpful expectations.
              </p>
            </div>
            <BadgeCheck className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <p className="text-sm leading-relaxed text-foreground/90">
            This app is a devotional aid (prayer, Scripture reading, life-and-service prompts, and personal notes). It is not a substitute for pastoral care, emergency care, mental health care, or sacramental life. For spiritual guidance, confession preparation, and questions of doctrine or practice, please consult your priest/spiritual father. If you are not Orthodox, speak with your pastor or chaplain.

          </p>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            If you may harm yourself or someone else, seek immediate help from emergency services, a trusted leader, chaplain, clinician, or crisis line. Provided "as-is" without warranties. Use at your own discretion.
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}