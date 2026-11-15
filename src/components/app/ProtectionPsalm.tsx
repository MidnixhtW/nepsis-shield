import { Link } from "react-router";
import { PSALM_90_VERSES } from "@/content/prayersToLearn";

// Psalm 90 in the Septuagint numbering used by the Orthodox Church (Psalm 91 in most English Bibles),
// the traditional psalm of protection, in the public-domain King James text. Bundled so it works offline.
export function ProtectionPsalm() {
  return (
    <div className="grid gap-3 pb-2">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Prayed by Orthodox Christians in danger and fear, and carried by many soldiers. Read it slowly, aloud if you can.
      </p>
      <ol className="scripture-text grid gap-2 text-[1.05rem]">
        {PSALM_90_VERSES.map((verse, index) => (
          <li key={index} className="flex gap-2">
            <span className="w-5 shrink-0 text-right text-xs leading-7 text-accent tabular-nums">{index + 1}</span>
            <span>{verse}</span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-muted-foreground">Psalm 90 (Psalm 91 in most English Bibles) · King James Version</p>
      <Link to="/learn?tab=byheart&prayer=psalm-90" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
        Learn it by heart
      </Link>
    </div>
  );
}
