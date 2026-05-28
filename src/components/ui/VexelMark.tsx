import { cn } from "@/lib/utils";

type VexelMarkProps = {
  className?: string;
  /** Unique gradient id so multiple marks can render on one page. */
  id?: string;
};

/**
 * The VexelSP brand mark: a faceted blue check / swoosh.
 * Vector recreation of the logo so it stays crisp and transparent on any background.
 */
export function VexelMark({ className, id = "vexel-mark" }: VexelMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="VexelSP logo"
      className={cn("drop-shadow-[0_2px_10px_rgba(45,143,230,0.45)]", className)}
    >
      <defs>
        <linearGradient
          id={id}
          x1="42"
          y1="6"
          x2="9"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7cd4ff" />
          <stop offset="0.55" stopColor="#2b8fe6" />
          <stop offset="1" stopColor="#0a4ea8" />
        </linearGradient>
      </defs>
      <path
        d="M6.5 20 L21 39 L42 6.5"
        stroke={`url(#${id})`}
        strokeWidth="8.5"
        strokeLinejoin="miter"
      />
      <path
        d="M6.5 20 L21 39 L42 6.5"
        stroke="#cdeaff"
        strokeOpacity="0.5"
        strokeWidth="2.4"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
