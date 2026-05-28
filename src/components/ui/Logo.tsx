import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { VexelMark } from "@/components/ui/VexelMark";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  href?: string;
};

/** Brand mark plus the VexelSP wordmark. */
export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <VexelMark className="h-8 w-8 transition-transform duration-300 group-hover:scale-105" />
      <span className="font-display text-lg font-semibold tracking-tight text-white">
        {siteConfig.name}
      </span>
    </Link>
  );
}
