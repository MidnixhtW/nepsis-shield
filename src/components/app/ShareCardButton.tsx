import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shareCard, type ShareCardInput } from "@/lib/shareCard";
import { showError, showSuccess } from "@/utils/toast";

// "Share" makes a story-sized image of this card and opens the share sheet (or saves the image).
export function ShareCardButton({ card, fileName, label = "Share" }: { card: ShareCardInput; fileName: string; label?: string }) {
  const [busy, setBusy] = useState(false);

  async function share() {
    setBusy(true);
    try {
      const result = await shareCard(card, fileName);
      if (result === "saved") showSuccess("Image saved. Post it to your story or send it to a friend.");
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") showError("Couldn't make the image. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" className="rounded-full" disabled={busy} onClick={() => void share()}>
      <Share2 className="mr-1.5 h-4 w-4" /> {busy ? "Making image…" : label}
    </Button>
  );
}
