"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How long does it take to get started?",
    a: "Most teams ship their first flow the same day. Install the snippet or SDK, build a flow in the visual editor, and publish with no engineering backlog required.",
  },
  {
    q: "Do I need a developer to use VexelSP?",
    a: "Only for the first install. After that, product, growth, and lifecycle teams build and edit flows on their own in the visual editor.",
  },
  {
    q: "Which platforms do you support?",
    a: "Web apps out of the box, plus mobile (iOS & Android) via our SDKs. Flows stay in sync across surfaces from a single dashboard.",
  },
  {
    q: "Can I A/B test onboarding flows?",
    a: "Yes. Run experiments on any flow, measure activation and funnel impact, and roll out winners with a click.",
  },
  {
    q: "Is my data secure?",
    a: "VexelSP is SOC 2 Type II compliant with SSO/SAML, granular roles, and full audit logs. Data is encrypted in transit and at rest.",
  },
  {
    q: "How do I get started?",
    a: "Book a quick call using the form above. We'll learn about your product, map out your onboarding goals, and get you set up. No commitment, no credit card.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title={<>Questions, answered</>}
          description="Everything you need to know before you start. Still curious? Reach out anytime."
        />

        <div className="mx-auto mt-12 max-w-2xl divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <span className="text-sm font-medium text-white sm:text-base">{item.q}</span>
                  <Plus
                    className={cn(
                      "h-5 w-5 shrink-0 text-ink-400 transition-transform duration-300",
                      isOpen && "rotate-45 text-brand-300",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-ink-400">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
