import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { cn } from "@/lib/utils";

export function ByzantineDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center gap-3 text-zinc-600", className)}>
      <span className="h-px flex-1 bg-zinc-800" />
      <span className="grid h-7 w-7 place-items-center rounded-full border border-zinc-800 bg-zinc-900">
        <OrthodoxCrossIcon className="h-3 w-3" />
      </span>
      <span className="h-px flex-1 bg-zinc-800" />
    </div>
  );
}

export function ByzantineApse({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative mx-auto aspect-[4/5] w-full max-w-56 overflow-hidden rounded-b-2xl rounded-t-[999px] border border-zinc-800 bg-zinc-950/45 p-4 text-zinc-500",
        className,
      )}
    >
      <div className="absolute inset-2 rounded-b-xl rounded-t-[999px] border border-zinc-800/80" />
      <svg viewBox="0 0 220 280" fill="none" className="relative h-full w-full" role="presentation">
        <path d="M34 246V111C34 62 68 27 110 27s76 35 76 84v135" stroke="currentColor" strokeWidth="1.5" />
        <path d="M51 246V116c0-39 26-70 59-70s59 31 59 70v130" stroke="currentColor" strokeWidth="1" opacity=".55" />
        <path d="M21 246h178M31 230h158M47 214h126" stroke="currentColor" strokeWidth="1" opacity=".7" />
        <circle cx="110" cy="120" r="39" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="110" cy="120" r="31" stroke="currentColor" strokeWidth="1" opacity=".5" />
        <path d="M110 89v59M94 103h32M99 120h22M101 148l9-8 9 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m73 78 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8 2.5-5ZM147 78l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8 2.5-5Z" fill="currentColor" opacity=".45" />
        <path d="M75 181h70M84 195h52M96 209h28" stroke="currentColor" strokeWidth="1" opacity=".55" />
      </svg>
    </div>
  );
}
