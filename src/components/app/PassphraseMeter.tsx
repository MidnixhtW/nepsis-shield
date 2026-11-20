import { passphraseStrength } from "@/lib/passphraseStrength";
import { cn } from "@/lib/utils";

export function PassphraseMeter({
  passphrase,
  className,
  compact,
}: {
  passphrase: string;
  className?: string;
  compact?: boolean;
}) {
  const s = passphraseStrength(passphrase);

  const bars = [0, 1, 2, 3].map((i) => {
    const on = s.score >= i + 1;
    const color =
      s.score <= 1
        ? "bg-cinnabar/[0.14]"
        : s.score === 2
          ? "bg-secondary/[0.58]"
          : s.score === 3
            ? "bg-accent/[0.14]"
            : "bg-success/[0.14]";

    return (
      <div
        key={i}
        className={cn(
          "h-1.5 flex-1 rounded-full bg-muted",
          on && color,
        )}
      />
    );
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 gap-1.5">{bars}</div>
        <span className="text-xs font-semibold text-muted-foreground">
          {passphrase ? s.label : ""}
        </span>
      </div>

      {!compact && passphrase ? (
        <div className="text-xs text-muted-foreground">
          {s.hints.length ? s.hints.join(" ") : "Looks good."}
        </div>
      ) : null}
    </div>
  );
}
