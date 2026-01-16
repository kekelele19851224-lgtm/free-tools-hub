import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ESOP Calculator - Free Stock Option Value & Vesting Schedule Calculator | FreeToolsHub",
  description: "Free ESOP calculator for employees. Calculate stock option value, visualize vesting schedules, and compare job offers with equity compensation. Includes growth projections and tax estimates. No signup required.",
  keywords: "esop calculator, esop calculator for employees, esop calculator free, startup esop calculator, stock option calculator, esop vesting calculator, esop tax calculator, esop payout calculator, employee stock option calculator, esop value calculator, compare job offers equity"
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}