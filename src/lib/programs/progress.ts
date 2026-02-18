import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

export type ProgramProgress = {
  programId: string;
  completedSessionIds: string[];
  lastPlayedSessionId?: string;
  updatedAt: number;
};

function key(programId: string) {
  return `programs:progress:${programId}`;
}

export function getProgramProgress(programId: string): ProgramProgress {
  const existing = getStoredItem<ProgramProgress>(key(programId));
  if (existing?.programId === programId) return existing;
  return {
    programId,
    completedSessionIds: [],
    updatedAt: Date.now(),
  };
}

export function markSessionPlayed(programId: string, sessionId: string) {
  const p = getProgramProgress(programId);
  const next: ProgramProgress = {
    ...p,
    lastPlayedSessionId: sessionId,
    updatedAt: Date.now(),
  };
  setStoredItem(key(programId), next, { ttlMs: 1000 * 60 * 60 * 24 * 365 });
}

export function markSessionComplete(programId: string, sessionId: string) {
  const p = getProgramProgress(programId);
  const set = new Set(p.completedSessionIds);
  set.add(sessionId);
  const next: ProgramProgress = {
    ...p,
    completedSessionIds: Array.from(set),
    lastPlayedSessionId: sessionId,
    updatedAt: Date.now(),
  };
  setStoredItem(key(programId), next, { ttlMs: 1000 * 60 * 60 * 24 * 365 });
}

export function resetProgramProgress(programId: string) {
  const next: ProgramProgress = {
    programId,
    completedSessionIds: [],
    updatedAt: Date.now(),
  };
  setStoredItem(key(programId), next, { ttlMs: 1000 * 60 * 60 * 24 * 365 });
}
