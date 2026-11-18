import type { SVGProps } from "react";

type MotifProps = SVGProps<SVGSVGElement>;

export function CenserIcon({ className, ...props }: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
      <path d="M8 4.5 12 2l4 2.5M9.2 5.8l1.1 8.1m4.5-8.1-1.1 8.1M7.5 14h9l-1.2 4.1a3.4 3.4 0 0 1-6.6 0L7.5 14Z" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 17.1h4M9.3 20.5h5.4M12 2v2.2M10.7 3.1h2.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M6.1 10.5c-1.4-1.3-.3-2.6.6-3.4M17.9 10.5c1.4-1.3.3-2.6-.6-3.4" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" opacity=".65" />
    </svg>
  );
}

export function ChurchDomeIcon({ className, ...props }: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
      <path d="M5 21h14M6.5 21v-7.1h11V21M8 13.9c.2-3 1.7-5.3 4-6.2 2.3.9 3.8 3.2 4 6.2" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3v4.7M10.4 4.5h3.2M11 6.2h2M9.6 21v-3.4a2.4 2.4 0 0 1 4.8 0V21" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <path d="M4.5 13.9h15" stroke="currentColor" strokeWidth="1.2" opacity=".7" />
    </svg>
  );
}

export function VigilLampIcon({ className, ...props }: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
      <path d="M8.2 10.5h7.6l-1 8.2a2.8 2.8 0 0 1-5.6 0l-1-8.2Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M7 8.2h10M9 5.5l3-3 3 3M12 2.5v5.7M10.2 6h3.6M9.1 21h5.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 12.7c1.1 1 1.5 1.8 1.5 2.6a1.5 1.5 0 0 1-3 0c0-.8.4-1.6 1.5-2.6Z" fill="currentColor" opacity=".72" />
    </svg>
  );
}

export function GospelBookIcon({ className, ...props }: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
      <path d="M5.5 4.5A2.5 2.5 0 0 1 8 2h10.5v18H8a2.5 2.5 0 0 0-2.5 2V4.5Zm0 0V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.8 7v8M10.2 9.5h5.2M11 12h3.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

export function SaintHaloIcon({ className, ...props }: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
      <circle cx="12" cy="8.2" r="5.2" stroke="currentColor" strokeWidth="1.25" opacity=".65" />
      <circle cx="12" cy="9" r="2.8" stroke="currentColor" strokeWidth="1.45" />
      <path d="M5.5 21c.5-4.5 2.7-7 6.5-7s6 2.5 6.5 7M8.2 17.2 12 20l3.8-2.8" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3V1.8M7.4 4.3l-.9-.9M16.6 4.3l.9-.9" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" opacity=".65" />
    </svg>
  );
}

// A prayer rope (chotki): a ring of knots with the cross and tassel below.
export function PrayerRopeIcon({ className, ...props }: MotifProps) {
  const knots = Array.from({ length: 10 }, (_, index) => {
    const angle = (index / 10) * Math.PI * 2 - Math.PI / 2;
    return [12 + 6.2 * Math.cos(angle), 9 + 6.2 * Math.sin(angle)] as const;
  });
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
      {knots.map(([cx, cy], index) => (
        <circle key={index} cx={cx} cy={cy} r={index === 5 ? 1.4 : 1.05} stroke="currentColor" strokeWidth="1.2" />
      ))}
      <path d="M12 16.4v5.1M10.4 18h3.2" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

// The chalice of Holy Communion.
export function ChaliceIcon({ className, ...props }: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
      <path d="M6.5 4h11c0 4.6-2.4 7.6-5.5 7.6S6.5 8.6 6.5 4Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M12 11.6v6.2M8.2 21h7.6M9.4 21c.4-1.7 1.3-2.9 2.6-3.2 1.3.3 2.2 1.5 2.6 3.2" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 5.6v3.6M10.4 7.1h3.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

// The Orthodox cross: the title board above, the crossbar, and the footrest. The footrest rises toward the viewer's
// left, Christ's right, where the penitent thief was, as on the app's other crosses.
export function ThreeBarCrossIcon({ className, ...props }: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
      <path d="M12 2.5v19M9.6 5.5h4.8M7 9.2h10M9.2 15.2l5.6 1.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// An icon panel: a board with a haloed figure, for the saints' lives and stories.
export function IconPanelIcon({ className, ...props }: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
      <rect x="4.5" y="2.5" width="15" height="19" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="9" r="3.6" stroke="currentColor" strokeWidth="1.15" opacity=".65" />
      <circle cx="12" cy="9.4" r="1.9" stroke="currentColor" strokeWidth="1.35" />
      <path d="M7.8 18.5c.4-2.9 1.9-4.4 4.2-4.4s3.8 1.5 4.2 4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
