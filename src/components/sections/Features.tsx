import {
  Workflow,
  ListChecks,
  MousePointerClick,
  BarChart3,
  Puzzle,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const features = [
  {
    icon: Workflow,
    title: "Branching flows",
    description:
      "Design onboarding paths that fit each user's role, plan, and goals. No code needed.",
  },
  {
    icon: ListChecks,
    title: "Smart checklists",
    description:
      "Simple tasks that update in real time as users finish each key step.",
  },
  {
    icon: MousePointerClick,
    title: "Guided tours",
    description:
      "Easy product tours and hotspots that show users right where they need to go.",
  },
  {
    icon: BarChart3,
    title: "Clear analytics",
    description:
      "See where users drop off, measure how fast they reach value, and test flows to lift conversion.",
  },
  {
    icon: Puzzle,
    title: "100+ integrations",
    description:
      "Connect your stack in minutes. Analytics, CRM, data warehouse, and messaging all work out of the box.",
  },
  {
    icon: ShieldCheck,
    title: "Built for enterprise",
    description:
      "SOC 2 Type II, SSO and SAML, fine grained roles, and full audit logs to keep security teams happy.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Everything you need"
          title={<>One platform for the whole onboarding journey</>}
          description="From the first click onward, VexelSP gives you the tools to activate every user."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title}>
                <article className="group card h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-glow">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/20 to-accent-500/10 text-brand-300 transition-colors group-hover:text-brand-200">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">
                    {feature.description}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
