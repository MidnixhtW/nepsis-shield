import * as React from "react";

/**
 * Military Orthodox cross: an Orthodox cross set into a field-shield silhouette.
 */
export function OrthodoxCrossIcon({
  className,
  strokeWidth = 1.65,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2.25L19.25 5.15V10.55C19.25 15.35 16.45 19.75 12 21.75C7.55 19.75 4.75 15.35 4.75 10.55V5.15L12 2.25Z"
        fill="currentColor"
        opacity="0.13"
      />
      <path
        d="M12 2.25L19.25 5.15V10.55C19.25 15.35 16.45 19.75 12 21.75C7.55 19.75 4.75 15.35 4.75 10.55V5.15L12 2.25Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M12 5.05V18.7"
        stroke="currentColor"
        strokeWidth={strokeWidth + 0.25}
        strokeLinecap="square"
      />
      <path
        d="M9.35 7.55H14.65"
        stroke="currentColor"
        strokeWidth={strokeWidth + 0.15}
        strokeLinecap="square"
      />
      <path
        d="M7.15 10.8H16.85"
        stroke="currentColor"
        strokeWidth={strokeWidth + 0.15}
        strokeLinecap="square"
      />
      <path
        d="M8.45 14.35L15.3 16.15"
        stroke="currentColor"
        strokeWidth={strokeWidth + 0.15}
        strokeLinecap="square"
      />
      <path
        d="M7.3 6.1L5.9 6.75M16.7 6.1L18.1 6.75M7.6 18.05L6.55 19.05M16.4 18.05L17.45 19.05"
        stroke="currentColor"
        strokeWidth="0.95"
        strokeLinecap="square"
        opacity="0.55"
      />
    </svg>
  );
}
