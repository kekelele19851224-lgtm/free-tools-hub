import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fencing Cost Calculator - Estimate Fence Installation | FreeToolsHub",
  description: "Free fencing cost calculator. Estimate fence installation costs for wood, vinyl, chain link, and aluminum. Calculate by linear foot or acre with gate costs included.",
  keywords: [
    "fencing cost calculator",
    "fence cost calculator",
    "wood fence cost calculator",
    "chain link fence calculator",
    "vinyl fence cost",
    "fence calculator by acre",
    "fence installation cost",
    "privacy fence cost",
    "how much does fencing cost",
    "fence estimate calculator"
  ],
  openGraph: {
    title: "Fencing Cost Calculator - Estimate Fence Installation | FreeToolsHub",
    description: "Free fencing cost calculator. Estimate fence installation costs for wood, vinyl, chain link, and aluminum. Calculate by linear foot or acre with gate costs included.",
    type: "website",
    locale: "en_US",
  },
};

export default function FencingCostCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}