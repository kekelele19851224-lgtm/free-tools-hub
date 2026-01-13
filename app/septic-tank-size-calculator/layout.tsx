import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Septic Tank Size Calculator - Free Capacity Calculator | FreeToolsHub',
  description: 'Free septic tank size calculator. Calculate tank capacity by bedrooms, occupants, or dimensions. Get recommendations in gallons and liters with pumping frequency estimates.',
  alternates: {
    canonical: '/septic-tank-size-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}