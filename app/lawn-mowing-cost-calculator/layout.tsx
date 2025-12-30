import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Lawn Mowing Cost Calculator - Free Lawn Care Price Estimator",
  description: "Calculate lawn mowing costs by size, frequency, and services. Get accurate estimates for professional lawn care or learn how much to charge as a provider.",
  keywords: "lawn mowing cost calculator, lawn care pricing, mowing cost per acre, lawn service prices, grass cutting cost, how much to charge for lawn mowing",
  openGraph: {
    title: "Lawn Mowing Cost Calculator - Free Lawn Care Price Estimator",
    description: "Calculate lawn mowing costs by size, frequency, and services. Get accurate estimates for professional lawn care.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

