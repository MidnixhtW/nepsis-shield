import { FormEvent, useMemo, useState } from "react";
import { Bot, ExternalLink, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { buildSaintAssistantReply, ocaSaintSearchUrl } from "@/lib/patronSaints";
import { cn } from "@/lib/utils";

const starterPrompts = ["depression", "anxiety", "grief", "illness", "work", "travel"];

export function SaintSearchAssistant() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const reply = useMemo(() => buildSaintAssistantReply(submittedQuery), [submittedQuery]);

  function askAssistant(nextQuery: string) {
    setQuery(nextQuery);
    setSubmittedQuery(nextQuery.trim());
    setOpen(true);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  }

  return (
    <div className="fixed bottom-[calc(6.8rem+env(safe-area-inset-bottom))] right-4 z-50 sm:bottom-5">
      {open ? (
        <Card className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border-primary/25 bg-card/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <Badge className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  Saint search AI
                </Badge>
                <h2 className="mt-1 text-sm font-semibold tracking-tight">Ask by need or condition</h2>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Local guidance from the app’s Orthodox patron-saints guide.
                </p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-2xl" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close saint search assistant</span>
            </Button>
          </div>

          <div className="grid gap-3 p-4">
            <form onSubmit={onSubmit} className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try: Who helps with depression?"
                className="h-10 rounded-2xl"
              />
              <Button type="submit" className="rounded-2xl" disabled={!query.trim()}>
                <Send className="mr-2 h-4 w-4" /> Ask
              </Button>
            </form>

            {!submittedQuery ? (
              <div className="flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-2xl border-border/60"
                    onClick={() => askAssistant(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            ) : null}

            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Response
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{reply.message}</p>
              {reply.crisis ? (
                <p className="mt-2 rounded-xl border border-destructive/25 bg-destructive/10 p-2 text-xs leading-relaxed text-destructive">
                  If you may harm yourself or someone else, seek immediate help from emergency services, a trusted person, clergy, or a qualified clinician.
                </p>
              ) : null}
            </div>

            {reply.matches.length ? (
              <div className="grid gap-2">
                <Separator />
                {reply.matches.map((item) => (
                  <div key={item.need} className="rounded-2xl border border-border/60 bg-background/60 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{item.need}</p>
                    <h3 className="mt-1 text-sm font-semibold">{item.saints}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.note}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                        <a href={ocaSaintSearchUrl(item.search)} target="_blank" rel="noopener noreferrer">
                          Read life <ExternalLink className="ml-2 h-3.5 w-3.5" />
                        </a>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="rounded-2xl">
                        <Link to="/saints" onClick={() => setOpen(false)}>
                          Open Saints
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </Card>
      ) : null}

      <Button
        type="button"
        className={cn(
          "h-12 rounded-full border border-primary/30 px-4 shadow-xl",
          "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
        onClick={() => setOpen((value) => !value)}
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Saint AI
      </Button>
    </div>
  );
}
