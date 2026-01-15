import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Epoxy Flooring Cost Calculator - Free Estimate Tool | FreeToolsHub',
  description: 'Free epoxy flooring cost calculator. Estimate garage, basement, and commercial epoxy floor costs. Compare DIY vs professional installation prices, calculate materials needed, and get accurate project estimates.',
  alternates: {
    canonical: '/epoxy-flooring-cost-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}