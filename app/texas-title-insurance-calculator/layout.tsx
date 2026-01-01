import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Texas Title Insurance Calculator - Official TDI Rates 2024",
  description: "Calculate Texas title insurance costs using official TDI rates. Get owner's and lender's policy premiums for residential and commercial properties in Texas.",
  keywords: "texas title insurance calculator, texas title insurance cost, texas title policy calculator, TDI title rates, owner's title policy texas, lender's title policy texas, texas closing costs",
  alternates: {
    canonical: "/texas-title-insurance-calculator",
  },
  openGraph: {
    title: "Texas Title Insurance Calculator - Official TDI Rates",
    description: "Calculate title insurance costs for Texas real estate. Uses official rates set by the Texas Department of Insurance.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}