import { useEffect, useState } from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import { tileArt } from "@/components/app/SectionLauncher";
import { getPatronSaint, PATRON_SAINT_CHANGED_EVENT } from "@/lib/patronSaint";
import type { PatronSaint } from "@/lib/nameDay";

// The icon the app keeps for a patron, when it has one: St Nicholas, St George, the Archangels, the Theotokos,
// the Forerunner. Other saints show their name and feast without a picture.
function patronArt(name: string) {
  const n = name.toLowerCase();
  if (n.includes("nicholas")) return "nicholas";
  if (n.includes("george")) return "george";
  if (/michael|gabriel|archangel/.test(n)) return "michael";
  if (/mary|theotokos|virgin|mother of god/.test(n)) return "theotokos";
  if (/john the baptist|forerunner/.test(n)) return "theophany";
  return null;
}

// The top of Me: the saint whose name you bear, the way a prayer corner keeps a patron's icon. Before one is chosen,
// a single line pointing to where to choose.
export function PatronOpening() {
  const [patron, setPatron] = useState<PatronSaint | null>(() => getPatronSaint() ?? null);
  useEffect(() => {
    const refresh = () => setPatron(getPatronSaint() ?? null);
    window.addEventListener(PATRON_SAINT_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PATRON_SAINT_CHANGED_EVENT, refresh);
  }, []);

  if (!patron) {
    return (
      <p className="scripture-text px-1 text-lg text-muted-foreground">
        Glory to God for all things.{" "}
        <Link to="/settings" className="inline-flex min-h-11 items-center text-foreground underline underline-offset-4">
          Choose your patron saint
        </Link>
      </p>
    );
  }

  const art = patronArt(patron.name);
  const feast = format(new Date(2024, patron.month - 1, patron.day), "MMMM d");
  return (
    <div className="flex items-center gap-4 px-1">
      {art ? <img src={tileArt(art)} alt="" className="h-24 w-[4.5rem] shrink-0 rounded-xl object-cover" /> : null}
      <div className="min-w-0">
        <p className="scripture-text text-xl leading-snug">Under the protection of {patron.name}</p>
        <p className="meta-label mt-1 text-muted-foreground">Name day {feast}</p>
      </div>
    </div>
  );
}
