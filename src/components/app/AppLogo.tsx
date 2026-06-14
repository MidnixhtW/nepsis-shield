export function AppLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/20 via-secondary/30 to-background p-[2px] shadow-sm ring-1 ring-background/70 ${className}`}
    >
      <img
        src="/nepsis-shield-logo.png"
        alt="Nepsis Shield logo"
        className="h-full w-full rounded-[inherit] object-cover saturate-[0.92] contrast-[1.05]"
      />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-primary/10 via-transparent to-background/20" />
    </span>
  );
}
