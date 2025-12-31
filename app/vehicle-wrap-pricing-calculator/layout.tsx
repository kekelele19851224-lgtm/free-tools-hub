import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Vehicle Wrap Pricing Calculator - Free Car Wrap Cost Estimator",
  description: "Calculate vehicle wrap costs by vehicle type, coverage level, and material quality. Compare vinyl wrap vs paint job prices and get instant estimates.",
  keywords: "vehicle wrap pricing calculator, car wrap cost, vinyl wrap calculator, how much to wrap a car, car wrap vs paint cost, 3m car wrap cost",
  alternates: {
    canonical: "/vehicle-wrap-pricing-calculator",
  },
  openGraph: {
    title: "Vehicle Wrap Pricing Calculator - Free Car Wrap Cost Estimator",
    description: "Calculate vehicle wrap costs by vehicle type, coverage level, and material quality.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
