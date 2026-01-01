import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Spray Foam Insulation Cost Calculator - Free Estimate Tool",
  description: "Calculate spray foam insulation costs for your project. Compare open-cell vs closed-cell foam prices, get estimates for attics, walls, garages, and more.",
  keywords: "spray foam insulation cost calculator, spray foam cost per sq ft, closed cell spray foam calculator, open cell foam cost, insulation cost estimator, spray foam price",
  alternates: {
    canonical: "/spray-foam-insulation-cost-calculator",
  },
  openGraph: {
    title: "Spray Foam Insulation Cost Calculator - Free Estimate Tool",
    description: "Calculate spray foam insulation costs. Compare open-cell vs closed-cell and get instant project estimates.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}