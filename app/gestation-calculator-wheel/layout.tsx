import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestation Calculator Wheel - Free Pregnancy Due Date Calculator | FreeToolsHub",
  description: "Free online gestation calculator wheel. Calculate your due date from LMP, find gestational age, track pregnancy milestones. Works like an OB wheel - no download needed.",
  keywords: "gestation calculator wheel, gestational calculator wheel, pregnancy calculator wheel, pregnancy wheel online free, due date calculator wheel, ob wheel calculator, pregnancy wheel chart, gestational age calculator, pregnancy week calculator, free pregnancy wheel",
  alternates: {
    canonical: "/gestation-calculator-wheel",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}