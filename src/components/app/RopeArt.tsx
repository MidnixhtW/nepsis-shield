// Single knots and beads of the prayer rope, for places that draw them one at a time (the rope you pull). They match
// the whole rope drawn in PrayerRopeLoop: soft black wool, strands crossing at a slant, amber wood beads.

export function WoolKnot({ size = 26, lit = false, current = false }: { size?: number; lit?: boolean; current?: boolean }) {
  const strand = lit ? "#6f5e3c" : "#2e2b29";
  return (
    <svg viewBox="-9 -9 18 18" width={size} height={size} aria-hidden className="block overflow-visible">
      <defs>
        <radialGradient id="rope-art-wool" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#2a2826" />
          <stop offset="65%" stopColor="#131211" />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
        <filter id="rope-art-fuzz" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="1" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="0.9" />
        </filter>
      </defs>
      {current ? <circle r="9" fill="#d8b26a" opacity="0.28" /> : null}
      <g filter="url(#rope-art-fuzz)">
      <circle r="7.4" fill="url(#rope-art-wool)" />
      <g fill="none" stroke={strand} strokeWidth="1.1" strokeLinecap="round">
        <path d="M-4.8 -3.6 L-1.6 -5.6" />
        <path d="M-5.6 0.6 L0.6 -4.4" />
        <path d="M-4 4.2 L4 -2.2" />
        <path d="M0.2 5.4 L5 1.6" />
      </g>
      </g>
      {current ? <circle r="8.4" fill="none" stroke="#d8b26a" strokeWidth="1.2" /> : null}
    </svg>
  );
}

export function WoodBead({ size = 22, current = false }: { size?: number; current?: boolean }) {
  return (
    <svg viewBox="-9 -9 18 18" width={size} height={size} aria-hidden className="block overflow-visible">
      <defs>
        <radialGradient id="rope-art-wood" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#e8a25a" />
          <stop offset="50%" stopColor="#a9581c" />
          <stop offset="100%" stopColor="#4d220a" />
        </radialGradient>
      </defs>
      {current ? <circle r="9" fill="#d8b26a" opacity="0.3" /> : null}
      <circle r="7.2" fill="url(#rope-art-wood)" />
      <ellipse rx="6.8" ry="2.4" fill="none" stroke="#5a2a0c" strokeOpacity="0.35" strokeWidth="0.7" />
      <ellipse cx="-2.4" cy="-2.8" rx="2.4" ry="1.4" fill="#fff" opacity="0.3" />
      {current ? <circle r="8.4" fill="none" stroke="#d8b26a" strokeWidth="1.2" /> : null}
    </svg>
  );
}
