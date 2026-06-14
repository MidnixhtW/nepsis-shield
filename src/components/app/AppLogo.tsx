export function AppLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <img
      src="/nepsis-shield-logo.png"
      alt="Nepsis Shield logo"
      className={`shrink-0 rounded-2xl object-cover shadow-sm ${className}`}
    />
  );
}
