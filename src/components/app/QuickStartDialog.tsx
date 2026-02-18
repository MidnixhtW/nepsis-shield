import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Hand, PenLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

const ONBOARDING_KEY = "onboarding:quickstart_done";

type QuickPick = {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  go: () => void;
};

export function QuickStartDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const done = getStoredItem<boolean>(ONBOARDING_KEY);
    setOpen(!done);
  }, []);

  const picks = useMemo<QuickPick[]>(
    () => [
      {
        key: "read",
        title: "Read today's Gospel",
        description: "Start with the lectionary (Epistle and Gospel).",
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        go: () => navigate("/read?read=daily"),
      },
      {
        key: "pray",
        title: "Keep a small prayer rule",
        description: "A simple checklist you can actually keep.",
        icon: <Hand className="h-4 w-4 text-primary" />,
        go: () => navigate("/pray?tab=rule"),
      },
      {
        key: "practice",
        title: "Pray the Jesus Prayer",
        description: "A quiet counter and stillness timer.",
        icon: <Sparkles className="h-4 w-4 text-primary" />,
        go: () => navigate("/pray?tab=counter"),
      },
      {
        key: "journal",
        title: "Write a 1-minute reflection",
        description: "One prompt. A few honest lines.",
        icon: <PenLine className="h-4 w-4 text-primary" />,
        go: () => navigate("/pray?tab=journal"),
      },
    ],
    [navigate],
  );

  function finish(next?: () => void) {
    setStoredItem(ONBOARDING_KEY, true);
    setOpen(false);
    next?.();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogContent className="rounded-3xl p-0 sm:max-w-[36rem]">
        <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Welcome</DialogTitle>
            <DialogDescription>
              Pick one thing for today, for all Orthodox Christians.

            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <div className="grid gap-3 sm:grid-cols-2">
            {picks.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => finish(p.go)}
                className="text-left"
              >
                <Card className="h-full rounded-3xl border-border/60 bg-card/70 p-4 shadow-sm transition-colors hover:bg-card">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary/10">
                      {p.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold tracking-tight">{p.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              className="rounded-2xl text-muted-foreground hover:text-foreground"
              onClick={() => finish()}
            >
              Not now
            </Button>
            <Button
              type="button"
              className="rounded-2xl"
              onClick={() => finish(() => navigate("/today"))}
            >
              Take me to Today
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}