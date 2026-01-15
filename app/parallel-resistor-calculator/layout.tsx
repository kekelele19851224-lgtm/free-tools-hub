import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Parallel Resistor Calculator - Series, Parallel & Find Missing Value | FreeToolsHub',
  description: 'Free parallel resistor calculator. Calculate equivalent resistance for 2-10 resistors in parallel or series. Find missing resistor value and current distribution. Supports Ω, kΩ, MΩ.',
  alternates: {
    canonical: '/parallel-resistor-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}