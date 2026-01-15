import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auto Loan Calculator MN - Minnesota Car Payment Calculator with Tax | FreeToolsHub',
  description: 'Free Minnesota auto loan calculator with 6.875% MN sales tax, Metro Area transit tax, trade-in credit, and early payoff savings. Calculate your car payment in MN accurately.',
  alternates: {
    canonical: '/auto-loan-calculator-mn',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}