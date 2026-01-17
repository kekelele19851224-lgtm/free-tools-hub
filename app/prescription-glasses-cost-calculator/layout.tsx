import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prescription Glasses Cost Calculator - Estimate Eyeglasses Price | FreeToolsHub',
  description: 'Free prescription glasses cost calculator. Estimate the price of eyeglasses based on frames, lens type, coatings, and insurance. Find out how much glasses cost with or without insurance.',
  alternates: {
    canonical: '/prescription-glasses-cost-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}