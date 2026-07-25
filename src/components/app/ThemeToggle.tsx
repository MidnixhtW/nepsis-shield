import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle({
  variant = "icon",
}: {
  variant?: "icon" | "row";
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";
  const Icon = isDark ? Sun : Moon;

  if (variant === "row") {
    return (
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full justify-start rounded-xl border-border/60 bg-background/45 font-semibold backdrop-blur hover:border-primary/30 hover:bg-muted/70"
        onClick={() => setTheme(nextTheme)}
        aria-label={label}
      >

        <Icon className="mr-2 h-4 w-4 text-[hsl(var(--icon-gold))]" />
        {isDark ? "Light mode" : "Dark mode"}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="h-10 w-10 rounded-xl border border-border/70 bg-card/60 text-foreground shadow-sm backdrop-blur hover:border-primary/35 hover:bg-muted/80 hover:text-primary"
      onClick={() => setTheme(nextTheme)}
      aria-label={label}
      title={label}
    >

      <Icon className="h-[18px] w-[18px]" />
    </Button>
  );
}
