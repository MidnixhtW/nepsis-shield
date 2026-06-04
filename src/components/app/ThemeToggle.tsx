import { useEffect, useState } from "react";
import { Moon, Shield, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

type AppTheme = "dark" | "light" | "red-dark";

const themeOrder: AppTheme[] = ["dark", "light", "red-dark"];

const themeMeta: Record<AppTheme, { label: string; next: string; icon: typeof Shield }> = {
  dark: {
    label: "Deployed green",
    next: "Switch to St Michael light",
    icon: Shield,
  },
  light: {
    label: "St Michael light",
    next: "Switch to red dark",
    icon: Sun,
  },
  "red-dark": {
    label: "Red dark",
    next: "Switch to deployed green",
    icon: Moon,
  },
};

function normalizeTheme(theme: string | undefined): AppTheme {
  return theme === "light" || theme === "red-dark" ? theme : "dark";
}

export function ThemeToggle({
  variant = "icon",
}: {
  variant?: "icon" | "row";
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = normalizeTheme(mounted ? theme : "dark");
  const currentIndex = themeOrder.indexOf(currentTheme);
  const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
  const meta = themeMeta[currentTheme];
  const Icon = meta.icon;

  function cycleTheme() {
    setTheme(nextTheme);
  }

  if (variant === "row") {
    return (
      <Button
        type="button"
        variant="outline"
        className="h-11 justify-start rounded-2xl border-border/60"
        onClick={cycleTheme}
      >
        <Icon className="mr-2 h-4 w-4" />
        {meta.label}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      className="h-10 w-10 rounded-2xl border-border/60 bg-background/60"
      onClick={cycleTheme}
      aria-label={meta.next}
      title={`${meta.label} · ${meta.next}`}
    >
      <Icon className="h-5 w-5" />
    </Button>
  );
}
