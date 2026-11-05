import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { ArrowLeft, BookOpen, Clock, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReaderFontSizeSlider } from "@/components/app/ReaderFontSizeSlider";
import { SERVICES, isServiceId, type ServiceInfo } from "@/content/services";
import type { ServiceBlock } from "@/content/services/types";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { cn } from "@/lib/utils";
import { canReadAloud, startReadAloud, stopReadAloud, useReadAloud } from "@/lib/readAloud";
import { FavoriteStar } from "@/components/app/FavoriteStar";

const FONT_KEY = "services:font-size";

// The Church's own services to pray at home: Compline, the Hours, the Akathist, canons and the Panikhida.
export function ServicesLibrary() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("service");
  const active = isServiceId(requested) ? SERVICES.find((service) => service.id === requested) ?? null : null;

  function open(id: string | null) {
    const next = new URLSearchParams(params);
    if (id) next.set("service", id);
    else next.delete("service");
    setParams(next);
    window.scrollTo({ top: 0 });
  }

  if (active) return <ServiceReader service={active} onBack={() => open(null)} />;

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Services</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Pray with the whole Church.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The services below are the Church's own prayer, said in monasteries and parishes every day. At home, read the parts marked for the Reader and the Choir, and leave out the priest's blessings. Your parish may use a different translation.
        </p>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((service) => (
          <Card key={service.id} className="flex flex-col rounded-3xl border p-5">
            <h3 className="text-lg font-semibold tracking-tight">{service.title}</h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-accent">
              <span>{service.when}</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock aria-hidden className="h-3.5 w-3.5" /> {service.minutes}</span>
            </p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
            <Button type="button" variant="outline" className="mt-4 w-fit rounded-full" onClick={() => open(service.id)} aria-label={`Pray ${service.title}`}>
              <BookOpen className="mr-2 h-4 w-4" /> Pray
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function readFontSize() {
  const stored = getStoredItem<number>(FONT_KEY);
  return typeof stored === "number" && stored >= 14 && stored <= 22 ? stored : 17;
}

function ServiceReader({ service, onBack }: { service: ServiceInfo; onBack: () => void }) {
  const [blocks, setBlocks] = useState<ServiceBlock[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [fontSize, setFontSize] = useState(readFontSize);
  const reading = useReadAloud();
  const speaking = reading.title === service.title;
  const canSpeak = canReadAloud();

  useEffect(() => {
    let cancelled = false;
    setBlocks(null);
    setFailed(false);
    service
      .load()
      .then((module) => !cancelled && setBlocks(module.default.blocks))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [service]);

  const sections = useMemo(
    () => (blocks ?? []).flatMap((block, index) => (block.kind === "heading" ? [{ index, text: block.text }] : [])),
    [blocks],
  );

  function changeFont(next: number) {
    setFontSize(next);
    setStoredItem(FONT_KEY, next);
  }

  function goTo(index: string) {
    document.getElementById(`service-part-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Read the prayers aloud with the device's voice. Instructions are skipped. The player bar keeps going between screens.
  function toggleSpeech() {
    if (!canSpeak || !blocks) return;
    if (speaking) {
      stopReadAloud();
      return;
    }
    startReadAloud(service.title, blocks.filter((block) => block.kind !== "rubric").map((block) => block.text));
  }

  return (
    <article className="grid gap-4" aria-labelledby="service-title">
      <div>
        <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> All services
        </Button>
      </div>
      <Card className="rounded-3xl border p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{service.when}</p>
        <div className="mt-1 flex items-start justify-between gap-2">
          <h2 id="service-title" className="text-2xl font-semibold tracking-tight">{service.title}</h2>
          <FavoriteStar to={`/pray?tab=services&service=${service.id}`} label={service.title} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_minmax(0,14rem)] sm:items-end">
          {sections.length > 1 ? (
            <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
              Go to
              <select
                className="h-10 rounded-xl border border-border/60 bg-background px-3 text-sm text-foreground"
                defaultValue=""
                onChange={(event) => event.target.value && goTo(event.target.value)}
              >
                <option value="" disabled>Choose a part</option>
                {sections.map((section) => (
                  <option key={section.index} value={section.index}>{section.text}</option>
                ))}
              </select>
            </label>
          ) : <span />}
          <div className="grid gap-1 text-xs font-semibold text-muted-foreground">
            Text size
            <ReaderFontSizeSlider value={fontSize} onChange={changeFont} label="Service text size" />
          </div>
        </div>
        {canSpeak && blocks ? (
          <Button type="button" variant="outline" size="sm" className="mt-4 rounded-full" aria-pressed={speaking} onClick={() => toggleSpeech()}>
            {speaking ? <Square className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
            {speaking ? "Stop reading" : "Read aloud"}
          </Button>
        ) : null}
      </Card>

      <Card className="rounded-3xl border p-5 sm:p-8">
        {failed ? (
          <p className="text-sm text-muted-foreground">This service could not be opened. Check your connection and try again.</p>
        ) : !blocks ? (
          <p className="text-sm text-muted-foreground" role="status">Opening {service.title}...</p>
        ) : (
          <div className="mx-auto grid max-w-2xl gap-3" style={{ fontSize }}>
            {blocks.map((block, index) => (
              <ServiceBlockView key={index} block={block} index={index} />
            ))}
          </div>
        )}
      </Card>
      <p className="px-2 text-xs leading-relaxed text-muted-foreground">Text: {service.source}</p>
    </article>
  );
}

function ServiceBlockView({ block, index }: { block: ServiceBlock; index: number }) {
  switch (block.kind) {
    case "heading":
      return (
        <h3 id={`service-part-${index}`} className="mt-6 scroll-mt-24 border-t border-border/60 pt-5 text-[1.15em] font-semibold tracking-tight first:mt-0 first:border-t-0 first:pt-0">
          {block.text}
        </h3>
      );
    case "subheading":
      return <h4 className="mt-3 text-[0.75em] font-semibold uppercase tracking-[0.14em] text-accent">{block.text}</h4>;
    case "rubric":
      return <p className="text-[0.82em] italic leading-relaxed text-muted-foreground">{block.text}</p>;
    case "refrain":
      return <p className="scripture-text font-semibold leading-relaxed text-primary">{block.text}</p>;
    case "verse":
      return (
        <p className="scripture-text leading-relaxed">
          {block.text.split("\n").map((line, i) => (
            <span key={i} className={cn("block", i > 0 && !line.startsWith("  ") && "mt-2", line.startsWith("  ") && "pl-6")}>{line.trim()}</span>
          ))}
        </p>
      );
    default:
      return (
        <p className="scripture-text leading-relaxed">
          {block.who ? <span className="mr-2 text-[0.72em] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{block.who}</span> : null}
          {block.text}
        </p>
      );
  }
}
