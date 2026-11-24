import { ExternalLink } from "lucide-react";
import { WESTERN_MASS } from "@/content/westernMass";

// The Western Rite Mass, part by part, for Western Rite Orthodox users and anyone visiting a Western Rite parish.
export function WesternMassGuide() {
  return (
    <div className="grid gap-8 px-1">
      <p className="scripture-text text-lg leading-relaxed text-foreground/90">
        Western Rite Orthodox parishes celebrate the Mass of the ancient Western Church, the Liturgy of St. Tikhon or of
        St. Gregory, with the Orthodox faith and in communion with the Orthodox bishops. Follow it part by part.
      </p>
      {WESTERN_MASS.map((section) => (
        <section key={section.title} aria-labelledby={`mass-${section.title}`} className="border-t border-border/60 pt-5">
          <h2 id={`mass-${section.title}`} className="text-2xl">{section.title}</h2>
          <ol className="mt-4 grid gap-5">
            {section.parts.map((part) => (
              <li key={part.title}>
                <h3 className="text-lg font-semibold">{part.title}</h3>
                <p className="mt-1 text-base leading-relaxed text-foreground/85">{part.body}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}
      <a
        href="https://www.orthodoxwest.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 w-fit items-center gap-2 text-sm text-accent underline underline-offset-4"
      >
        The Orthodox West, from the Antiochian Western Rite Vicariate <ExternalLink aria-hidden className="h-4 w-4" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
