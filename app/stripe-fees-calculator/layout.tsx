import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Stripe Fees Calculator - Estimate Net Receipts",
  description: "Calculate Stripe processing fees instantly and estimate net receipts. Reverse calculate charge amounts to meet targets. Supports domestic, international cards and ACH.",
  keywords: "stripe fees calculator, stripe processing fees, stripe net receipts, stripe ach fees, stripe international card fees",
  alternates: {
    canonical: "/stripe-fees-calculator",
  },
  openGraph: {
    title: "Stripe Fees Calculator - Estimate Net Receipts",
    description: "Calculate Stripe processing fees and net receipts; reverse calculate charges.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

