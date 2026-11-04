import { useState } from "react";
import { Link } from "react-router";
import { HardDriveDownload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { isBackupDue, snoozeBackupReminder } from "@/lib/backupReminder";

// Monthly nudge to export: all data lives only on this device and is lost with it.
export function BackupReminderCard() {
  const [due, setDue] = useState(() => isBackupDue());
  if (!due) return null;

  return (
    <Card className="flex flex-wrap items-start gap-3 rounded-[1.5rem] border p-4 sm:items-center sm:p-5" role="region" aria-label="Backup reminder">
      <HardDriveDownload className="mt-0.5 h-5 w-5 shrink-0 text-accent sm:mt-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Back up your prayer data</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          Your rule, journal, and progress are saved only on this device. An encrypted backup keeps them safe if you change phones or clear your browser.
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={() => {
            snoozeBackupReminder();
            setDue(false);
          }}
        >
          Remind me later
        </Button>
        <Button asChild size="sm" className="rounded-full">
          <Link to="/privacy#backup">Back up now</Link>
        </Button>
      </div>
    </Card>
  );
}
