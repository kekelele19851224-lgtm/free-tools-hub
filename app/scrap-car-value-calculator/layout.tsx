import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scrap Car Value Calculator | Free Junk Car Estimate 2025",
  description: "Calculate your scrap car's value by weight, condition, and location. Get instant estimates for junk cars including metal value and parts like catalytic converters, engines, and transmissions.",
  keywords: "scrap car value calculator, junk car value, scrap car price, how much is my car worth for scrap, scrap metal value, catalytic converter value, junk car calculator, scrap car per ton, car scrap value by weight",
  openGraph: {
    title: "Scrap Car Value Calculator | Free Junk Car Estimate 2025",
    description: "Calculate your scrap car's value by weight, condition, and location. Get instant estimates for junk cars including metal value and salvageable parts.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scrap Car Value Calculator | Free Junk Car Estimate 2025",
    description: "Calculate your scrap car's value by weight, condition, and location. Get instant estimates for junk cars."
  },
  alternates: {
    canonical: "https://freetoolshub.com/scrap-car-value-calculator"
  }
};

export default function ScrapCarValueCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}