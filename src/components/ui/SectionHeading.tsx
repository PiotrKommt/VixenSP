import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
};

/** Consistent eyebrow + title + description block used to lead each section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Badge>{eyebrow}</Badge>
        </Reveal>
      ) : null}
      <Reveal delay={0.05}>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.1}>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
