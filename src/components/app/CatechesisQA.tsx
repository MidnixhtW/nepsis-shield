import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Crosshair, ExternalLink, Filter, Hand, HelpCircle, Search, SearchX, ShieldCheck } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QA_ITEMS, type Category, type QA } from "@/content/catechesisQuestions";

function practicalToolFor(item: QA) {
  const text = `${item.category} ${item.q}`.toLowerCase();

  if (text.includes("confession") || text.includes("repent")) {
    return { label: "Open confession prep", to: "/pray?tab=prep", icon: <ShieldCheck className="h-4 w-4" /> };
  }

  if (text.includes("bible") || text.includes("scripture") || text.includes("liturgy") || text.includes("service")) {
    return { label: "Open readings", to: "/read?read=daily", icon: <BookOpen className="h-4 w-4" /> };
  }

  if (text.includes("fast") || text.includes("daily") || text.includes("service") || text.includes("field")) {
    return { label: "Open life & service guide", to: "/field-manual", icon: <Crosshair className="h-4 w-4" /> };
  }

  return { label: "Open prayer tools", to: "/pray?tab=prayers", icon: <Hand className="h-4 w-4" /> };
}

function PracticalToolLink({ item }: { item: QA }) {
  const tool = practicalToolFor(item);

  return (
    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Practice next</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Connect this teaching to a concrete prayer or reading action inside the app.
        </p>
        <Button asChild size="sm" className="shrink-0 rounded-2xl">
          <Link to={tool.to}>
            {tool.icon}
            <span className="ml-2">{tool.label}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function categoryOrder(c: Exclude<Category, "All">) {
  const order: Array<Exclude<Category, "All">> = [
    "Daily life",
    "Prayer",
    "Worship",
    "Sacraments",
    "Scripture",
    "Saints & icons",
    "Parish life",
    "Liturgical year",
    "Liturgical arts",
    "Church history",
    "Other Christians",
    "Priesthood & monasticism",
    "Death & funerals",
  ];
  return order.indexOf(c) === -1 ? 999 : order.indexOf(c);
}

export function CatechesisQA() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");

  const categories = useMemo(() => {
    const set = new Set<Exclude<Category, "All">>();
    for (const item of QA_ITEMS) set.add(item.category);
    return Array.from(set).sort((a, b) => categoryOrder(a) - categoryOrder(b));
  }, []);

  const countsByCategory = useMemo(() => {
    const counts = new Map<Category, number>();
    counts.set("All", QA_ITEMS.length);
    for (const c of categories) counts.set(c, 0);
    for (const item of QA_ITEMS) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
    return counts;
  }, [categories]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return QA_ITEMS.filter((item) => {
      const categoryOk = category === "All" ? true : item.category === category;
      if (!categoryOk) return false;
      if (!q) return true;
      const hay = `${item.q}\n${item.a}\n${item.sourceLabel}\n${item.sourceUrl}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    const map = new Map<Exclude<Category, "All">, QA[]>();
    for (const c of categories) map.set(c, []);
    for (const item of filtered) map.get(item.category)?.push(item);
    return map;
  }, [filtered, categories]);

  function selectCategory(value: string) {
    if (value === "All") {
      setCategory("All");
      return;
    }

    if (categories.includes(value as Exclude<Category, "All">)) {
      setCategory(value as Exclude<Category, "All">);
    }
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Catechesis (Q&A)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Short summaries + direct OCA sources.
            </p>
          </div>
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="grid gap-2">
            <Label htmlFor="qa-search" className="text-xs font-semibold tracking-wide text-muted-foreground">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="qa-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: confession, icons, fasting, Bible…"
                className="h-11 rounded-2xl pl-10"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="qa-category" className="text-xs font-semibold tracking-wide text-muted-foreground">
              Category
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={category} onValueChange={selectCategory}>
                <SelectTrigger id="qa-category" className="h-11 rounded-2xl">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="max-h-[60vh]">
                  <SelectItem value="All">
                    All ({countsByCategory.get("All") ?? 0})
                  </SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c} ({countsByCategory.get(c) ?? 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-2xl border-border/60"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span>.
          </p>
          <Button asChild variant="outline" className="btn-wrap rounded-2xl border-border/60">
            <a href="https://www.oca.org/questions" target="_blank" rel="noopener noreferrer">
              Full OCA Q&A index <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </Card>

      {!filtered.length ? (
        <EmptyState
          icon={<SearchX className="h-5 w-5" />}
          title="No matching questions"
          description="Try a broader search term, choose All categories, or open the full OCA Q&A index."
          action={
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-border/60"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : category === "All" ? (
        <div className="grid gap-4">
          {categories.map((c) => {
            const items = grouped.get(c) ?? [];
            if (!items.length) return null;

            return (
              <Card key={c} className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight">{c}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {items.length} question{items.length === 1 ? "" : "s"}
                  </p>
                </div>

                <Separator className="my-4" />

                <Accordion type="multiple" className="w-full">
                  {items.map((item, idx) => (
                    <AccordionItem
                      key={`${c}:${item.q}:${idx}`}
                      value={`${c}:${idx}`}
                      className="border-none"
                    >
                      <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
                        <span className="pr-3">{item.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-3">
                        <div className="grid gap-3">
                          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                            {item.a}
                          </p>

                          <PracticalToolLink item={item} />

                          <div className="grid gap-2">
                            <Button
                              asChild
                              variant="outline"
                              className="btn-wrap rounded-2xl border-border/60"

                            >
                              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                                {item.sourceLabel} <ExternalLink className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                            <div className="break-words text-xs text-muted-foreground">
                              Source: "{item.sourceUrl}"
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div>
            <h3 className="text-base font-semibold tracking-tight">{category}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} question{filtered.length === 1 ? "" : "s"}
            </p>
          </div>

          <Separator className="my-4" />

          <Accordion type="multiple" className="w-full">
            {filtered.map((item, idx) => (
              <AccordionItem
                key={`${item.category}:${item.q}:${idx}`}
                value={`qa-${idx}`}
                className="border-none"
              >
                <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
                  <span className="pr-3">{item.q}</span>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="grid gap-3">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                      {item.a}
                    </p>

                    <PracticalToolLink item={item} />

                    <div className="grid gap-2">
                      <Button
                        asChild
                        variant="outline"

                        className="btn-wrap rounded-2xl border-border/60"
                      >
                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                          {item.sourceLabel} <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                      <div className="break-words text-xs text-muted-foreground">
                        Source: "{item.sourceUrl}"
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-4 break-words text-xs text-muted-foreground">
            Full OCA Q&A index: "https://www.oca.org/questions"
          </p>
        </Card>
      )}
    </div>
  );
}