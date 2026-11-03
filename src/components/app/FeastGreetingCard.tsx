import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { feastGreeting } from "@/lib/feastGreetings";
import type { ChurchCalendar } from "@/lib/fastingSeasons";
import { PUBLIC_SITE_URL } from "@/lib/publicSite";
import { showError, showSuccess } from "@/utils/toast";

// The feast's greeting on Today, with a button to send it to someone.
export function FeastGreetingCard({ today, calendar }: { today: Date; calendar: ChurchCalendar }) {
  const greeting = feastGreeting(today, calendar);
  if (!greeting) return null;

  async function share() {
    const text = `${greeting!.greeting} ${greeting!.response}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: greeting!.feast, text: `${text}\n\nSent with Nepsis Shield`, url: `${PUBLIC_SITE_URL}/today` });
        return;
      }
      await navigator.clipboard.writeText(text);
      showSuccess("Greeting copied. Paste it anywhere to share.");
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") showError("Couldn't share right now.");
    }
  }

  return (
    <Card className="candlelight-card rounded-[1.5rem] border p-5 text-center" role="region" aria-label="Feast greeting">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{greeting.feast}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{greeting.greeting}</p>
      <p className="scripture-text mt-1 text-lg text-muted-foreground">{greeting.response}</p>
      <Button type="button" variant="outline" size="sm" className="mt-4 rounded-full" onClick={() => void share()}>
        <Share2 className="mr-2 h-4 w-4" /> Send the greeting
      </Button>
    </Card>
  );
}
