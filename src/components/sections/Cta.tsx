import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function Cta() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="ring-gradient relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute inset-0 bg-spotlight opacity-80" />
            <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:48px_48px] opacity-30 mask-fade-b" />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                Ready to make every first impression count?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-pretty text-base text-ink-300 sm:text-lg">
                Book a demo and see how VexelSP can lift your activation, with
                no commitment required.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="#booking" size="lg" className="w-full sm:w-auto">
                  Book a demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="#booking" variant="secondary" size="lg" className="w-full sm:w-auto">
                  Talk to sales
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
