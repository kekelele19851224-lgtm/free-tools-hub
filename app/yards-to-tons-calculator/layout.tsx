import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yards to Tons Calculator - Free Online Tool | FreeToolsHub',
  description: 'Convert cubic yards to tons for gravel, sand, dirt, mulch, concrete, and more. Supports bidirectional conversion to plan deliveries, budgets, and material requirements precisely.',
  alternates: {
    canonical: '/yards-to-tons-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
