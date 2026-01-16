import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage APR Calculator - Compare Loan APR vs Interest Rate | FreeToolsHub",
  description: "Free mortgage APR calculator. Calculate the true Annual Percentage Rate including fees, compare loan offers, and find the break-even point for discount points. Understand APR vs interest rate.",
  keywords: "mortgage APR calculator, mortgage annual percentage rate calculator, loan APR calculator, APR vs interest rate calculator, how to calculate APR on a mortgage, mortgage APR calculator excel, simple APR calculator, compare mortgage APR, discount points calculator",
  alternates: {
    canonical: "/mortgage-apr-calculator",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}