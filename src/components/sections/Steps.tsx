import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Connect your product",
    description:
      "Drop in a single snippet or use our SDK. VexelSP finds your screens and key events in minutes.",
  },
  {
    number: "02",
    title: "Design the journey",
    description:
      "Build flows, checklists, and tours in a visual editor. Branch by persona, plan, or behavior with no engineering needed.",
  },
  {
    number: "03",
    title: "Launch & target",
    description:
      "Ship flows to the right users at the right moment with precise audience rules and scheduling.",
  },
  {
    number: "04",
    title: "Measure & optimize",
    description:
      "Track activation, find friction, and A/B test variations to continuously lift your conversion.",
  },
];

export function Steps() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title={<>Live in an afternoon, not a quarter</>}
          description="A guided setup that gets your first onboarding flow in front of users the same day."
        />

        <div className="relative mt-16">
          {/* Connecting line (desktop) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block"
          />
          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.number} delay={i * 0.1} className="relative">
                <div
                  className={cn(
                    "relative z-10 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-ink-900 font-display text-lg font-semibold",
                    "text-gradient-brand shadow-glow",
                  )}
                >
                  {step.number}
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
