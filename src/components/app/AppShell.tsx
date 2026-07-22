import { type ComponentType, type ReactNode, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Download } from "lucide-react";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { CenserIcon, ChurchDomeIcon } from "@/components/app/OrthodoxMotifs";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type AppSection = "today" | "pray" | "read" | "learn";

const sectionMeta: Record<
  AppSection,
  { label: string; icon: ComponentType<{ className?: string }>; aria: string }
> = {
  today: { label: "Today", icon: OrthodoxCrossIcon, aria: "Go to Today" },
  pray: { label: "Pray", icon: CenserIcon, aria: "Go to Prayer" },
  read: { label: "Read", icon: BookOpen, aria: "Go to Readings" },
  learn: { label: "Learn", icon: ChurchDomeIcon, aria: "Go to learning and tools" },
};

export function AppShell({
  header,
  section,
  onSectionChange,
  children,
}: {
  header?: ReactNode;
  section: AppSection;
  onSectionChange: (s: AppSection) => void;
  children: ReactNode;
}) {
  const location = useLocation();
  const installActive = location.pathname === "/download";
  const items = useMemo(
    () =>
      (["today", "pray", "read", "learn"] as AppSection[]).map(
        (key) => [key, sectionMeta[key]] as [AppSection, (typeof sectionMeta)[AppSection]],
      ),
    [],
  );

  return (
    <div className="youth-app-shell relative min-h-dvh min-w-0 overflow-x-clip bg-zinc-950 text-zinc-50">
      <a
        href="#main-content"
        className="sr-only fixed left-3 top-3 z-50 rounded-lg bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 focus:not-sr-only"
      >
        Skip to content
      </a>

      <div className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8">{header}</div>
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="water-page relative z-10 mx-auto w-full max-w-6xl px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-8 sm:px-6 lg:px-8 lg:pt-12"
      >
        {children}
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-zinc-950/90 px-3 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
        <div className="pointer-events-auto mx-auto grid w-full max-w-[29rem] grid-cols-5 gap-1 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-1.5">
          <ToggleGroup
            type="single"
            value={section}
            onValueChange={(value) => {
              if (value) onSectionChange(value as AppSection);
            }}
            className="contents"
          >
            {items.map(([key, meta]) => {
              const Icon = meta.icon;
              const active = section === key;

              return (
                <ToggleGroupItem
                  key={key}
                  value={key}
                  aria-label={meta.aria}
                  className="h-12 rounded-lg bg-transparent px-1 text-zinc-400 transition-all duration-200 ease-in-out hover:bg-zinc-800 hover:text-zinc-50 data-[state=on]:bg-zinc-50 data-[state=on]:text-zinc-950"
                >
                  <div className="flex w-full flex-col items-center justify-center gap-1.5">
                    <Icon className={cn("h-[17px] w-[17px]", active ? "text-zinc-950" : "text-zinc-400")} />
                    <span className={cn("text-[10px] font-medium leading-none sm:text-[11px]", active ? "text-zinc-950" : "text-zinc-400")}>
                      {meta.label}
                    </span>
                  </div>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>

          <Link
            to="/download"
            aria-label="Open more options, install, and share"
            className={cn(
              "flex h-12 flex-col items-center justify-center gap-1.5 rounded-lg px-1 text-zinc-400 transition-all duration-200 ease-in-out hover:bg-zinc-800 hover:text-zinc-50",
              installActive && "bg-zinc-50 text-zinc-950",
            )}
          >
            <Download className={cn("h-[17px] w-[17px]", installActive ? "text-zinc-950" : "text-zinc-400")} />
            <span className={cn("text-[10px] font-medium leading-none sm:text-[11px]", installActive ? "text-zinc-950" : "text-zinc-400")}>
              More
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function useAppSection() {
  const [section, setSection] = useState<AppSection>("today");
  return { section, setSection };
}
