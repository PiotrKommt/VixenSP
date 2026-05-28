import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { Steps } from "@/components/sections/Steps";
import { Reviews } from "@/components/sections/Reviews";
import { Booking } from "@/components/sections/Booking";
import { Faq } from "@/components/sections/Faq";
import { Cta } from "@/components/sections/Cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Steps />
        <Reviews />
        <Booking />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
