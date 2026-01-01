import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "1031 Exchange Calculator - Free Tax Savings & Boot Calculator",
  description: "Calculate your 1031 exchange tax savings, boot amounts, and important deadlines. Free online tool to estimate capital gains tax deferral on real estate investments.",
  keywords: "1031 exchange calculator, 1031 tax calculator, boot calculator, 1031 exchange boot, capital gains tax calculator, like-kind exchange calculator, 1031 exchange timeline",
  alternates: {
    canonical: "/1031-exchange-calculator",
  },
  openGraph: {
    title: "1031 Exchange Calculator - Free Tax Savings Calculator",
    description: "Calculate potential tax savings with a 1031 exchange. Estimate capital gains, boot amounts, and track 45/180 day deadlines.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}