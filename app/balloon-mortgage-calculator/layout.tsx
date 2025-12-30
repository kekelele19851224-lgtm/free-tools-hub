import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Balloon Mortgage Calculator - Free Balloon Payment Calculator",
  description: "Calculate your balloon mortgage monthly payments and final balloon payment. Compare interest-only vs amortized payments with full amortization schedule.",
  keywords: "balloon mortgage calculator, balloon payment calculator, 5 year balloon mortgage calculator, interest only balloon calculator, balloon loan calculator, seller financing calculator",
  openGraph: {
    title: "Balloon Mortgage Calculator - Free Balloon Payment Calculator",
    description: "Calculate your balloon mortgage monthly payments and final balloon payment amount.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

