import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Air Changes per Hour Calculator - Free ACH & CFM Calculator | FreeToolsHub',
  description: 'Free air changes per hour (ACH) calculator. Calculate ACH from CFM and room volume, or find required CFM for target ACH. Includes ASHRAE recommendations and CDC guidelines for ventilation.',
  alternates: {
    canonical: '/air-changes-per-hour-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}