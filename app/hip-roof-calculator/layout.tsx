import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hip Roof Calculator - Free Roof Area & Shingles Estimator | FreeToolsHub",
  description: "Free hip roof calculator. Calculate roof area in square feet, estimate shingles and materials, find rafter lengths. Works for regular and pyramid hip roofs. Includes pitch angle chart.",
  keywords: "hip roof calculator, hip roof calculator square feet, hip roof calculator shingles, pyramid hip roof calculator, hip roof angle chart, hip rafter calculator, free hip roof calculator, hip roof pitch calculator, hip roof area calculator, roof pitch chart",
  alternates: {
    canonical: "/hip-roof-calculator",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}