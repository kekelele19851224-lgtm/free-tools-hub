import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alimony Calculator NC - North Carolina Spousal Support | FreeToolsHub',
  description: 'Free North Carolina alimony calculator. Estimate spousal support using AAML formula, duration, and eligibility check. Understand NC alimony laws and 16 factors courts consider.',
  alternates: {
    canonical: '/alimony-calculator-nc',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}