import { Metadata } from "next";

export const metadata: Metadata = {
  title: "First Lien HELOC Calculator - Free Mortgage vs HELOC Comparison | Velocity Banking | FreeToolsHub",
  description: "Free first lien HELOC calculator. Compare HELOC vs traditional mortgage, calculate monthly payments, see how velocity banking can help you pay off your home faster. No signup required.",
  keywords: "first lien heloc calculator, first lien heloc payment calculator, first lien heloc payoff calculator, heloc vs mortgage calculator, velocity banking calculator, first lien heloc with extra payments, heloc to pay off mortgage calculator",
  alternates: {
    canonical: "/first-lien-heloc-calculator",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}