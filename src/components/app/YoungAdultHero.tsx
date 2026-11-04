import { ORTHODOX_ICONOGRAPHY } from "@/lib/orthodoxIconography";

// On phones the icon sits small beside the text so the day's journey and rule show sooner;
// from the sm breakpoint up it is shown large with its caption.
export function OrthodoxHero() {
  const credit = (
    <a href={ORTHODOX_ICONOGRAPHY.deesis.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
      {ORTHODOX_ICONOGRAPHY.deesis.credit}
    </a>
  );

  return (
    <section className="flex items-start gap-4 rounded-3xl border bg-card p-4 sm:items-center sm:gap-6 sm:px-6 sm:py-5">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">A quiet place to begin</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Return to what is essential.</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Pray simply, receive today’s Scripture, and carry one faithful step into the day.</p>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground sm:hidden">{credit}</p>
      </div>
      <figure className="w-24 shrink-0 sm:w-40">
        <img src={ORTHODOX_ICONOGRAPHY.deesis.imageUrl} alt={ORTHODOX_ICONOGRAPHY.deesis.alt} className="mx-auto w-full rounded-xl object-contain shadow-[0_18px_40px_hsl(75_40%_2%/0.45)] sm:max-h-40" />
        <figcaption className="mt-2 hidden text-center text-[11px] leading-relaxed text-muted-foreground sm:block">{credit}</figcaption>
      </figure>
    </section>
  );
}
