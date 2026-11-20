import { useEffect } from "react";
import { useReadAloud } from "@/lib/readAloud";
import { startIson, stopIson, useIsonEnabled } from "@/lib/ison";

// Holds the ison under whatever the app is reading aloud, when it is turned on; it fades out when reading pauses or ends.
export function IsonSync() {
  const reading = useReadAloud();
  const on = useIsonEnabled();
  const playing = on && reading.playing;

  useEffect(() => {
    if (playing) startIson();
    else stopIson();
  }, [playing]);

  useEffect(() => () => stopIson(), []);
  return null;
}
