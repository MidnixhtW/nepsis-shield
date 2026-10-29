import { ORTHODOX_ICONOGRAPHY } from "@/lib/orthodoxIconography";

export function OrthodoxHero() {
  return (
    <section className="rounded-3xl border bg-card p-5 sm:flex sm:items-center sm:gap-6 sm:p-6">
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">A quiet place to begin</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Return to what is essential.</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Pray simply, receive today’s Scripture, and carry one faithful step into the day.</p>
      </div>
      <figure className="mt-4 sm:mt-0 sm:w-56 sm:shrink-0">
        <img src={ORTHODOX_ICONOGRAPHY.deesis.imageUrl} alt={ORTHODOX_ICONOGRAPHY.deesis.alt} className="mx-auto max-h-36 w-full rounded-xl object-contain" />
        <figcaption className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
          <a href={ORTHODOX_ICONOGRAPHY.deesis.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">{ORTHODOX_ICONOGRAPHY.deesis.credit}</a>
        </figcaption>
      </figure>
    </section>
  );
}
