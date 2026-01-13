import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aggregate Calculator - Gravel, Sand & Crushed Stone | FreeToolsHub',
  description: 'Free aggregate calculator. Calculate how much gravel, sand, or crushed stone you need in cubic yards and tons. Get coverage estimates and cost calculations for your project.',
  alternates: {
    canonical: '/aggregate-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}