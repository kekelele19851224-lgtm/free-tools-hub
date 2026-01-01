import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Venmo Fee Calculator - Free Instant Transfer & Seller Fee Calculator 2025",
  description: "Calculate Venmo fees instantly for instant transfers (1.75%), goods & services (1.9%), credit card payments (3%), and business transactions. See exactly how much you'll pay or receive.",
  keywords: "venmo fee calculator, venmo instant transfer fee, venmo goods and services fee, venmo credit card fee, venmo business fee, venmo fee calculator 2025",
  alternates: {
    canonical: "/venmo-fee-calculator",
  },
  openGraph: {
    title: "Venmo Fee Calculator - Free Instant Transfer & Seller Fee Calculator",
    description: "Calculate Venmo fees for instant transfers, goods & services, credit cards, and business. Know exactly what you'll pay.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}