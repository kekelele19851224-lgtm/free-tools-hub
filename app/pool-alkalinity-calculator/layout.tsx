import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pool Alkalinity Calculator - Raise or Lower Total Alkalinity | FreeToolsHub',
  description: 'Free pool alkalinity calculator to determine how much baking soda to raise or muriatic acid to lower total alkalinity. Works for pools, spas, and hot tubs. Supports gallons and liters.',
  alternates: {
    canonical: '/pool-alkalinity-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}