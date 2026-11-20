import { useState, type RefObject } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shareCard } from "@/lib/shareCard";
import { showError, showSuccess } from "@/utils/toast";

const MAX = 360;

/** The text selected inside `container`, or "" when the selection is elsewhere or empty. */
function selectedWithin(container: HTMLElement | null) {
  const selection = window.getSelection();
  if (!container || !selection || selection.isCollapsed || !selection.rangeCount) return "";
  const range = selection.getRangeAt(0);
  if (!container.contains(range.commonAncestorContainer)) return "";
  return selection.toString().replace(/\s+/g, " ").trim();
}

// Share a line: select the words in a reading, then tap Share to make an image of them with the reference.
export function ShareSelectionButton({
  container,
  attribution,
  eyebrow,
}: {
  container: RefObject<HTMLElement | null>;
  attribution: string;
  eyebrow: string;
}) {
  const [busy, setBusy] = useState(false);

  async function share() {
    const text = selectedWithin(container.current);
    if (!text) {
      showSuccess("Select the words you want to share, then tap Share.");
      return;
    }
    setBusy(true);
    try {
      const clipped = text.length > MAX ? `${text.slice(0, MAX).replace(/\s+\S*$/, "")}…` : text;
      const result = await shareCard({ eyebrow, text: clipped, attribution }, "verse.png");
      if (result === "saved") showSuccess("Image saved. Send it to a friend or post it.");
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") showError("Couldn't make the image. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    // Keep the selection: a press on the button must not clear it before the click reads it.
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="rounded-full"
      disabled={busy}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => void share()}
    >
      <Share2 aria-hidden className="mr-1.5 h-4 w-4" /> {busy ? "Making image…" : "Share"}
    </Button>
  );
}
