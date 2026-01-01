import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "NVIDIA Stock Calculator - Investment Return Calculator (NVDA)",
  description: "Calculate NVIDIA stock returns. See what $1,000 invested in NVDA would be worth today, check your current holdings value, and project future growth.",
  keywords: "nvidia stock calculator, nvda calculator, nvidia investment calculator, if you invested in nvidia, nvidia stock return, nvidia stock split, nvda stock value",
  alternates: {
    canonical: "/nvidia-stock-calculator",
  },
  openGraph: {
    title: "NVIDIA Stock Calculator - Investment Return Calculator",
    description: "Calculate your NVIDIA (NVDA) investment returns. Historical returns, current value, and future projections.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}