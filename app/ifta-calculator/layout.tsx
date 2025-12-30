import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "IFTA Calculator - Free IFTA Fuel Tax Calculator by State",
  description: "Calculate your quarterly IFTA fuel tax obligations by state. Enter miles traveled and fuel purchased to see tax owed or credits. Free CSV export.",
  keywords: "ifta calculator, ifta fuel tax calculator, ifta miles calculator, ifta tax calculator by state, free ifta calculator, ifta mileage calculator",
  openGraph: {
    title: "IFTA Calculator - Free IFTA Fuel Tax Calculator",
    description: "Calculate quarterly IFTA fuel tax by state. Free CSV export included.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

