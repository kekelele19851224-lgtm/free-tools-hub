import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "River Stone Calculator - How Much River Rock Do I Need?",
  description: "Calculate how much river rock you need for landscaping. Get estimates in tons, cubic yards, and bags. Coverage calculator for pea gravel, 3/4 inch, 1-3 inch river rock.",
  keywords: "river stone calculator, river rock calculator, how much river rock do I need, river rock coverage, landscaping rock calculator, gravel calculator, rock coverage per ton",
  alternates: {
    canonical: "/river-stone-calculator",
  },
  openGraph: {
    title: "River Stone Calculator - How Much River Rock Do I Need?",
    description: "Calculate river rock needed for your project. Get estimates in tons, yards, and bags with cost calculations.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}