import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Floor Joist Calculator - Free Joist Span & Spacing Calculator",
  description: "Calculate how many floor joists you need, find the right joist size for your span, and estimate material costs. Free floor joist span tables for 2x6, 2x8, 2x10, 2x12.",
  keywords: "floor joist calculator, floor joist span calculator, joist spacing calculator, how many floor joists do I need, 2x10 span, 2x8 span, floor joist span table, joist count calculator",
  alternates: {
    canonical: "/floor-joist-calculator",
  },
  openGraph: {
    title: "Floor Joist Calculator - Free Joist Span & Spacing Calculator",
    description: "Calculate floor joist count, find the right size for your span, and estimate costs. Includes span tables for all joist sizes.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}