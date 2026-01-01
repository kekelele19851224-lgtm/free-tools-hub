import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Wrongful Termination Settlement Calculator - Free Estimate Tool",
  description: "Estimate your wrongful termination settlement amount and calculate take-home after attorney fees and taxes. Free calculator for discrimination, retaliation, and harassment cases.",
  keywords: "wrongful termination settlement calculator, wrongful termination payout, settlement calculator, employment lawsuit calculator, discrimination settlement, retaliation settlement, California wrongful termination",
  alternates: {
    canonical: "/wrongful-termination-settlement-calculator",
  },
  openGraph: {
    title: "Wrongful Termination Settlement Calculator - Free Estimate Tool",
    description: "Estimate your wrongful termination settlement and calculate how much you'll take home after fees and taxes.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}