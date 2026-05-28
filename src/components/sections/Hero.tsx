"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-44">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-spotlight" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-faint bg-[size:64px_64px] opacity-40 mask-fade-b" />

      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <Badge>
              <Sparkles className="h-3.5 w-3.5 text-brand-300" />
              New · Guided onboarding flows
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.05 }}
            className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]"
          >
            Help new users{" "}
            <span className="text-gradient-brand">get started fast</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.12 }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-300 sm:text-lg"
          >
            VexelSP gives every new user a clear path to their first win.
            Simple checklists, helpful tours, and an easy setup that just
            works.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.19 }}
            className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
          >
            <Button href="#booking" size="lg" className="w-full sm:w-auto">
              Book a demo
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="#how-it-works" variant="secondary" size="lg" className="w-full sm:w-auto">
              <Play className="h-4 w-4" />
              Watch demo
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 text-sm text-ink-500"
          >
            Free 30 minute call · No commitment · We reply within 24 hours
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
