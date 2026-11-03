import { useEffect, useState } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AppTheme } from "@/components/app/ThemeProvider";

/** Shared by the theme picker and first-time setup. `preview` is background, text, and accent. */
export const themeOptions: Array<{
  value: AppTheme;
  label: string;
  description: string;
  swatch: string;
  preview: [string, string, string];
}> = [
  {
    value: "dark",
    label: "Olive & Brass",
    description: "Quiet field colors, matched to the shield",
    swatch: "bg-[#8ea65c]",
    preview: ["#0e0f0b", "#ece4cc", "#d0b063"],
  },
  {
    value: "parchment",
    label: "Parchment",
    description: "Light olive and cream for daytime reading",
    swatch: "bg-[#ebe3cc]",
    preview: ["#f2ecdc", "#2a2f1c", "#8c6421"],
  },
  {
    value: "red-dark",
    label: "Black & Red",
    description: "High-alert command display",
    swatch: "bg-[#e6333c]",
    preview: ["#080808", "#ebe8e8", "#e6333c"],
  },
  {
    value: "blue-cream",
    label: "Blue & Cream",
    description: "Daylight operations display",
    swatch: "bg-[#225ea8]",
    preview: ["#f1ead8", "#14243e", "#225ea8"],
  },
];
const themes = themeOptions;

export function ThemeToggle({
  variant = "icon",
}: {
  variant?: "icon" | "row";
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const activeTheme = mounted && themes.some((option) => option.value === theme)
    ? (theme as AppTheme)
    : "dark";
  const activeLabel = themes.find((option) => option.value === activeTheme)?.label ?? "Olive & Brass";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size={variant === "icon" ? "icon" : "default"}
          variant="ghost"
          className={cn(
            "border border-primary/30 bg-card/75 text-foreground shadow-sm backdrop-blur hover:border-primary/55 hover:bg-primary/10 hover:text-primary",
            variant === "icon"
              ? "h-10 w-10 rounded-md"
              : "h-11 w-full justify-between rounded-md px-3 font-semibold",
          )}
          aria-label={`Theme: ${activeLabel}. Choose appearance.`}
          title={`Theme: ${activeLabel}`}
        >
          <span className={cn("flex min-w-0 items-center", variant === "icon" && "justify-center")}>
            <Palette className={cn("h-[18px] w-[18px]", variant === "row" && "mr-2 shrink-0 text-primary")} />
            {variant === "row" ? <span className="truncate">{activeLabel}</span> : null}
          </span>
          {variant === "row" ? <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" /> : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 border-primary/25 bg-popover/95 p-1.5 backdrop-blur-xl">
        <DropdownMenuLabel className="px-2 py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Interface palette
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((option) => {
          const selected = option.value === activeTheme;

          return (
            <DropdownMenuItem
              key={option.value}
              className="gap-3 rounded-sm px-2.5 py-2.5 focus:bg-primary/10 focus:text-foreground"
              onSelect={() => setTheme(option.value)}
            >
              <span className={cn("h-3.5 w-3.5 shrink-0 rounded-full border border-foreground/25", option.swatch)} />

              <span className="min-w-0 flex-1">
                <span className="block font-bold leading-tight">{option.label}</span>
                <span className="mt-0.5 block text-xs leading-tight text-muted-foreground">{option.description}</span>
              </span>
              <Check className={cn("h-4 w-4 shrink-0 text-primary", selected ? "opacity-100" : "opacity-0")} />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
