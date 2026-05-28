import { Gauge, Smartphone, Sparkles, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const highlights = [
  {
    icon: Sparkles,
    title: "Simple, modern design",
    text: "Clean, professional sites that are easy to use.",
  },
  {
    icon: Smartphone,
    title: "Great on every phone",
    text: "Your site looks sharp on all devices, especially mobile.",
  },
  {
    icon: Gauge,
    title: "Fast and smooth",
    text: "Quick load times and a good user experience.",
  },
  {
    icon: Wallet,
    title: "Affordable pricing",
    text: "Professional results without expensive agency prices.",
  },
];

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 overflow-hidden py-28 sm:py-36">
      {/* Ambient background so the section clearly stands out */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-spotlight opacity-80" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-faint bg-[size:64px_64px] opacity-30 mask-fade-b" />

      <Container>
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge>About us</Badge>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
            A small team building{" "}
            <span className="text-gradient-brand">better websites</span> for local
            businesses
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-ink-200 sm:text-xl">
            We are a small team of two people who help local businesses improve their
            online presence.
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mx-auto mt-10 flex max-w-3xl flex-col gap-5 text-center text-base leading-relaxed text-ink-300 sm:text-lg"
        >
          <p>
            Our goal is to create modern, clean, and easy to use websites for small
            businesses at affordable prices. We also redesign old or outdated websites to
            make them look more professional and modern on all devices, especially phones.
          </p>
          <p>
            We focus on simple and modern design, fast websites, and a good user
            experience. We also help with contact forms, booking systems, and other useful
            features that make it easier for customers to interact with a business online.
          </p>
          <p className="text-xl font-medium text-white sm:text-2xl">
            We believe every business deserves a professional website without paying
            expensive agency prices.
          </p>
        </Reveal>

        <Stagger className="mx-auto mt-16 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <div className="card h-full p-6">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/20 to-accent-500/10 text-brand-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{item.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
