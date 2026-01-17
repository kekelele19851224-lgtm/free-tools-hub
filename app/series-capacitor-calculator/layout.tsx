import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Series Capacitor Calculator - Calculate Total Capacitance & Voltage | FreeToolsHub',
  description: 'Free series capacitor calculator to find total capacitance, voltage distribution, charge, and energy. Supports 2-10 capacitors with pF, nF, µF, mF, F units.',
  alternates: {
    canonical: '/series-capacitor-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}