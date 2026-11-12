import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { OPERATOR_NAME } from "@/lib/publicSite";

const LINKS = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Use" },
  { to: "/cookies", label: "Cookie Policy" },
];

/** The policies and who runs the app, at the foot of every standalone page and on Me. */
export function PolicyLinks({ className }: { className?: string }) {
  return (
    <nav aria-label="Policies" className={cn("flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground", className)}>
      {LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="rounded py-1 underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {link.label}
        </Link>
      ))}
      <span className="py-1">© {new Date().getFullYear()} {OPERATOR_NAME}</span>
    </nav>
  );
}
