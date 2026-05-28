/**
 * Central site configuration. Keeping brand/content here makes the marketing
 * surface easy to rebrand without touching component internals.
 */
export const siteConfig = {
  name: "VexelSP",
  tagline: "Onboarding made simple.",
  description:
    "VexelSP helps new users get started fast. Guided flows, smart checklists, and an easy setup, all in one onboarding tool.",
  url: "https://vexelsp.example.com",
  email: "hello@vexelsp.example.com",
  /** Booking requests are emailed here from the booking form. */
  bookingEmail: "shadowyop2@gmail.com",
} as const;

export type NavItem = { label: string; href: string };

export const navLinks: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
  { label: "Book a call", href: "#booking" },
  { label: "FAQ", href: "#faq" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Book a call", href: "#booking" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Support", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];
