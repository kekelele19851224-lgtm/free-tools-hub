import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Wedding Liquor Calculator - Free Wedding Alcohol Estimator",
  description: "Calculate exactly how much beer, wine, champagne and liquor you need for your wedding. Get a shopping list with bottles, cases, and cost estimates.",
  keywords: "wedding liquor calculator, wedding alcohol calculator, how much alcohol for wedding, beer wine calculator wedding, wedding drink calculator, alcohol for 100 guests",
  alternates: {
    canonical: "/wedding-liquor-calculator",
  },
  openGraph: {
    title: "Wedding Liquor Calculator - Free Wedding Alcohol Estimator",
    description: "Calculate exactly how much beer, wine, champagne and liquor you need for your wedding.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
