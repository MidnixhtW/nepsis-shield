import { Link } from "react-router";
import { LOOK_AROUND_STATE } from "@/lib/appEvents";
import { ExternalLink, Shield, Info, BookText, BadgeCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/app/PageContainer";
import { PremiumPageHeader } from "@/components/app/PremiumPageHeader";
import { APK_CHANNEL, APK_DOWNLOAD_URL } from "@/lib/apkDownload";
import { CURRENT_VERSION } from "@/lib/releaseInfo";
import { CONTACT_URL } from "@/lib/publicSite";

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
            <Button asChild variant="outline" className="premium-action"><Link to="/today" state={LOOK_AROUND_STATE}>Back to app</Link></Button>
            <Button asChild variant="outline" className="premium-action"><Link to="/privacy"><Shield className="mr-2 h-4 w-4" /> Privacy</Link></Button>
            <Button asChild className="premium-action"><Link to="/download"><Smartphone className="mr-2 h-4 w-4" /> Install the app</Link></Button>
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
                The prayers and calendar follow the Orthodox Church. Every Christian is welcome to pray with it. Eastern Catholics (Byzantine, Melkite, Ruthenian, Ukrainian) pray these same prayers, but your calendar and some commemorations may differ, so follow your parish. In Settings you can choose Melkite or Byzantine Catholic to get your own parish finder. For Western Rite Orthodox parishes the app includes the Rosary and the Angelus, which Catholics can pray too.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                It is meant to help you take one faithful next step. It does not replace your priest, chaplain, clinician, therapist, emergency services, or the life of the Church.
              </p>

            </div>
            <Shield className="h-5 w-5 shrink-0 text-primary" />
          </div>
        </Card>

        <Card id="get-the-app" className="rounded-3xl border-border/60 bg-card p-5 shadow-sm scroll-mt-24">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Get the app</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Add Nepsis Shield to your home screen from your browser. It opens like any other app, works offline once loaded, and
                updates itself. Nothing to sideload, no account.
              </p>
            </div>
            <BadgeCheck className="h-5 w-5 shrink-0 text-muted-foreground" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button asChild className="rounded-2xl">
              <Link to="/download"><Smartphone className="mr-2 h-4 w-4" /> Install on your phone</Link>
            </Button>
            <a href={APK_DOWNLOAD_URL} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
              {APK_CHANNEL === "release" ? "Or download the signed Android app" : "Or download the Android public beta"}
            </a>
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

            <p className="text-sm leading-relaxed text-muted-foreground">

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
              <p className="mt-1 text-sm text-muted-foreground">
                Nepsis Shield is built as an Orthodox watchfulness and prayer companion for daily life, family and work stress, first response, public safety, and service under pressure.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Free, with no ads, purchases or accounts. Questions, corrections and privacy requests:{" "}
                <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline underline-offset-2">
                  the project's GitHub page<span className="sr-only"> (opens in a new tab)</span>
                </a>
                . See the <Link to="/privacy-policy" className="font-semibold text-foreground underline underline-offset-2">Privacy Policy</Link>,{" "}
                <Link to="/terms" className="font-semibold text-foreground underline underline-offset-2">Terms of Use</Link> and{" "}
                <Link to="/cookies" className="font-semibold text-foreground underline underline-offset-2">Cookie Policy</Link>.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3 rounded-2xl border-border/60">
                <Link to="/release-notes">What's new in version {CURRENT_VERSION}</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">

              <p className="font-semibold">Orthodox Church in America (OCA)</p>
              <p className="mt-1 text-sm text-muted-foreground">
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
              <p className="mt-1 text-sm text-muted-foreground">
                The Church calendar: saints, fasts, tones and the day's readings, for both New and Old Calendar.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3 rounded-2xl border-border/60">
                <a href="https://orthocal.info" target="_blank" rel="noopener noreferrer">
                  Visit orthocal.info <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="font-semibold">Bible text sources</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Long-standing public Bible libraries that supply the Scripture text for each reading.
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

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="font-semibold">Icons and Scripture</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The icons on Today are public-domain works from Wikimedia Commons, kept on this site; each one links to its Commons page. New King
                James Version® copyright © 1982 by Thomas Nelson. Brenton's Septuagint, the KJV, the WEB and the Douay-Rheims are in the public
                domain. Prayers are credited where they appear.
              </p>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              The next two weeks of the calendar are kept on your phone, so Today still opens with no signal. If a source is briefly
              unreachable, the app says so and links you straight to that source.
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

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            If you may harm yourself or someone else, seek immediate help from emergency services, a trusted leader, chaplain, clinician, or crisis line. Provided "as-is" without warranties. Use at your own discretion.
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}