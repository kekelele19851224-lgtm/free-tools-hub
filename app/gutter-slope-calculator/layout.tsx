import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Gutter Slope Calculator - Free Gutter Pitch & Fall Calculator",
  description: "Calculate the proper slope for your rain gutters. Get the exact drop needed per foot for efficient drainage. Supports imperial and metric units with visual diagram.",
  keywords: "gutter slope calculator, gutter pitch calculator, gutter fall calculator, gutter drop calculator, rain gutter slope, gutter angle calculator, gutter slope per foot",
  alternates: {
    canonical: "/gutter-slope-calculator",
  },
  openGraph: {
    title: "Gutter Slope Calculator - Free Gutter Pitch Calculator",
    description: "Calculate proper gutter slope for efficient drainage. Get exact drop measurements with our free calculator.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}