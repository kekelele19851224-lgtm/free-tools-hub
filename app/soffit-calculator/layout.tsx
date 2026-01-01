import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Soffit Calculator - How Much Soffit Do I Need?",
  description: "Calculate how much soffit you need for your project. Get panel counts, ventilation requirements, and cost estimates for vinyl, aluminum, or wood soffit installation.",
  keywords: "soffit calculator, how much soffit do I need, soffit square feet calculator, vinyl soffit calculator, aluminum soffit calculator, soffit vent calculator, soffit installation cost",
  alternates: {
    canonical: "/soffit-calculator",
  },
  openGraph: {
    title: "Soffit Calculator - How Much Soffit Do I Need?",
    description: "Calculate soffit panels, ventilation requirements, and installation costs. Free online calculator for vinyl, aluminum, and wood soffit.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}