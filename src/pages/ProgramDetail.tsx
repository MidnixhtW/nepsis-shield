import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  getProgramById,
  type Session,
} from "@/lib/programs/catalog";
import {
  getProgramProgress,
  markSessionComplete,
  markSessionPlayed,
  resetProgramProgress,
} from "@/lib/programs/progress";
import { GuidedSessionPlayer } from "@/components/app/GuidedSessionPlayer";

function firstIncompleteSession(programId: string, sessions: Session[]) {
  const prog = getProgramProgress(programId);
  const done = new Set(prog.completedSessionIds);
  return sessions.find((s) => !done.has(s.id)) ?? sessions[0] ?? null;
}

export default function ProgramDetail() {
  const params = useParams();
  const programId = params.programId || "";

  const program = useMemo(() => getProgramById(programId), [programId]);
  const progress = useMemo(() => getProgramProgress(programId), [programId]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const session = useMemo(() => {
    if (!program) return null;
    const fromUrl = new URL(window.location.href).searchParams.get("s");
    const found = fromUrl ? program.sessions.find((x) => x.id === fromUrl) : null;
    const fromState = selectedSessionId
      ? program.sessions.find((x) => x.id === selectedSessionId)
      : null;
    return fromState ?? found ?? firstIncompleteSession(program.id, program.sessions);
  }, [program, selectedSessionId]);

  if (!program) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Program not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            That program doesn't exist.
          </p>
          <div className="mt-4">
            <Button asChild className="rounded-2xl">
              <Link to="/programs">Back to Programs</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const doneCount = progress.completedSessionIds.length;
  const total = program.sessions.length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Program</p>
          <h1 className="text-2xl font-semibold tracking-tight">{program.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{program.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <Link to="/programs">Back</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-border/60"
            onClick={() => resetProgramProgress(program.id)}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset progress
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {program.minutesPerDay} min/day
            </Badge>
            <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
              {doneCount}/{total} completed
            </Badge>
          </div>
          <Separator className="my-4" />
          <p className="text-sm leading-relaxed text-foreground/90">{program.description}</p>
        </Card>

        {session ? (
          <div
            onMouseEnter={() => markSessionPlayed(program.id, session.id)}
            onFocus={() => markSessionPlayed(program.id, session.id)}
          >
            <GuidedSessionPlayer
              title={session.title}
              segments={session.segments}
              audioKey={`program:${program.id}:session:${session.id}`}
              onComplete={() => {
                markSessionComplete(program.id, session.id);
              }}
            />
          </div>
        ) : null}

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold tracking-tight">Sessions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap a session to load it.
          </p>
          <Separator className="my-4" />

          <div className="grid gap-2">
            {program.sessions.map((s) => {
              const completed = progress.completedSessionIds.includes(s.id);
              const active = session?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  className="text-left"
                  onClick={() => {
                    setSelectedSessionId(s.id);
                    markSessionPlayed(program.id, s.id);
                  }}
                >
                  <div
                    className={
                      "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors " +
                      (active
                        ? "border-primary/30 bg-primary/10"
                        : "border-border/60 bg-muted/20 hover:bg-muted/30")
                    }
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{s.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {s.durationMinutes} min
                      </p>
                    </div>
                    {completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">Open</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {session?.sources?.length ? (
            <>
              <Separator className="my-4" />
              <div className="grid gap-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">Sources</p>
                {session.sources.map((src) => (
                  <Button
                    key={src.url}
                    asChild
                    variant="outline"
                    className="btn-wrap justify-between rounded-2xl border-border/60"
                  >
                    <a href={src.url} target="_blank" rel="noopener noreferrer">
                      {src.label} <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </>
          ) : null}
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">
            Note: guided voice uses your device text-to-speech. This avoids hosting audio while we
            build a licensed Orthodox audio library.
          </p>
        </Card>
      </div>
    </div>
  );
}