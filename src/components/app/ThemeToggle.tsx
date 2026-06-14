import { useEffect, useState } from "react";
import { Crosshair, Flame, HeartPulse, Moon, Radio, Shield, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { APP_THEMES } from "@/components/app/ThemeProvider";

type AppTheme = (typeof APP_THEMES)[number];

const themeOrder: AppTheme[] = [...APP_THEMES];

const themeMeta: Record<AppTheme, { label: string; shortLabel: string; next: string; icon: typeof Shield }> = {
  dark: {
    label: "Military green",
    shortLabel: "Military",
    next: "Switch theme",
    icon: Crosshair,
  },
  light: {
    label: "St Michael light",
    shortLabel: "Light",
    next: "Switch theme",
    icon: Sun,
  },
  "red-dark": {
    label: "Command red",
    shortLabel: "Command",
    next: "Switch theme",
    icon: Moon,
  },
  police: {
    label: "Law enforcement blue",
    shortLabel: "Police",
    next: "Switch theme",
    icon: Shield,
  },
  fire: {
    label: "Fire rescue orange",
    shortLabel: "Fire",
    next: "Switch theme",
    icon: Flame,
  },
  ems: {
    label: "EMS teal",
    shortLabel: "EMS",
    next: "Switch theme",
    icon: HeartPulse,
  },
  dispatch: {
    label: "Dispatch purple",
    shortLabel: "Dispatch",
    next: "Switch theme",
    icon: Radio,
  },
  corrections: {
    label: "Corrections gold",
    shortLabel: "Corrections",
    next: "Switch theme",
    icon: Shield,
  },
};

function normalizeTheme(theme: string | undefined): AppTheme {
  return APP_THEMES.includes(theme as AppTheme) ? (theme as AppTheme) : "dark";
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
      <div className="rounded-3xl border border-border/60 bg-muted/20 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Service themes
            </p>
            <p className="mt-1 text-sm font-semibold">{meta.label}</p>
          </div>
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {themeOrder.map((item) => {
            const ItemIcon = themeMeta[item].icon;
            const active = item === currentTheme;
            return (
              <Button
                key={item}
                type="button"
                variant={active ? "default" : "outline"}
                size="sm"
                className="h-10 justify-start rounded-2xl border-border/60 px-3"
                onClick={() => setTheme(item)}
              >
                <ItemIcon className="mr-2 h-4 w-4" />
                {themeMeta[item].shortLabel}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      className="h-10 w-10 rounded-2xl border-border/60 bg-background/60"
      onClick={cycleTheme}
      aria-label={`${meta.label}. ${meta.next}`}
      title={`${meta.label} · ${meta.next}`}
    >
      <Icon className="h-5 w-5" />
    </Button>
  );
}
