import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Pine Straw Calculator - Coverage & Cost Estimates",
  description: "Calculate how many bales of pine straw you need for landscaping. Get coverage estimates by depth with DIY and professional installation costs.",
  keywords: "pine straw calculator, pine straw coverage, landscaping bales, pine needle mulch, yard mulch calculator",
  alternates: {
    canonical: "/pine-straw-calculator",
  },
  openGraph: {
    title: "Pine Straw Calculator - Coverage & Cost Estimates",
    description: "Estimate pine straw quantity and costs for your landscaping project.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

