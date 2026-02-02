import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ExternalLink, HandCoins, Minus, Plus, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

type MercyState = {
  count: number;
  plan?: string;
};

function weekKey() {
  const d = new Date();
  return `${format(d, "yyyy")}-W${format(d, "II")}`;
}

function storageKey(wk: string) {
  return `mercy:${wk}`;
}

export function MercyTracker() {
  const wk = useMemo(() => weekKey(), []);
  const [state, setState] = useState<MercyState>({ count: 0, plan: "" });

  useEffect(() => {
    const saved = getStoredItem<MercyState>(storageKey(wk));
    if (saved) setState({ count: saved.count ?? 0, plan: saved.plan ?? "" });
  }, [wk]);

  useEffect(() => {
    setStoredItem(storageKey(wk), state);
  }, [state, wk]);

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Acts of mercy (this week)</h3>
          <p className="mt-1 text-sm text-muted-foreground">Keep it concrete: time, attention, giving, forgiveness.</p>
        </div>
        <HandCoins className="h-5 w-5 text-muted-foreground" />
      </div>

      <Separator className="my-4" />

      <div className="grid gap-4">
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Count</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-2xl font-semibold tabular-nums">{state.count}</div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-2xl border-border/60"
                onClick={() => setState((s) => ({ ...s, count: Math.max(0, s.count - 1) }))}
              >
                <Minus className="mr-2 h-4 w-4" /> -1
              </Button>
              <Button
                type="button"
                className="h-11 rounded-2xl"
                onClick={() => setState((s) => ({ ...s, count: s.count + 1 }))}
              >
                <Plus className="mr-2 h-4 w-4" /> +1
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-11 rounded-2xl text-muted-foreground hover:text-foreground"
                onClick={() => setState((s) => ({ ...s, count: 0 }))}
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Plan (keep it small)</p>
          <Input
            value={state.plan ?? ""}
            onChange={(e) => setState((s) => ({ ...s, plan: e.target.value }))}
            placeholder="Example: call someone lonely; set aside $ for someone in need…"
            className="mt-2 h-11 rounded-2xl"
          />
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Learn</p>
          <Button
            asChild
            variant="outline"
            className="mt-2 rounded-2xl border-border/60"
          >
            <a
              href="https://www.oca.org/orthodoxy/the-orthodox-faith/spirituality/prayer-fasting-and-almsgiving/almsgiving"
              target="_blank"
              rel="noreferrer"
            >
              OCA – Almsgiving <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default MercyTracker;