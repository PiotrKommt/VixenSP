import { cn } from "@/lib/utils";

type BadgeProps = {
  className?: string;
  children: React.ReactNode;
};

/** Small pill used for eyebrow labels above section headings. */
export function Badge({ className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-ink-200 backdrop-blur",
        className,
      )}
    >
      {children}
    </span>
  );
}
