import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Towing Estimate Calculator - Free Tow Truck Cost Estimator",
  description: "Calculate towing costs based on distance, vehicle type, and services. Compare AAA membership savings. Get accurate tow truck price estimates.",
  keywords: "towing cost calculator, tow truck price, how much does towing cost, AAA towing, roadside assistance cost, flatbed towing price",
  openGraph: {
    title: "Towing Estimate Calculator - Free Tow Truck Cost Estimator",
    description: "Calculate towing costs based on distance, vehicle type, and services. Compare AAA membership savings.",
    type: "website"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

