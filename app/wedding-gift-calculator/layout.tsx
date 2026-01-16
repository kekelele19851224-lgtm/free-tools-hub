import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wedding Gift Calculator - How Much Money to Give | FreeToolsHub',
  description: 'Free wedding gift calculator to determine how much money to give. Get personalized recommendations based on your relationship, budget, and wedding type. 2025 etiquette guide included.',
  alternates: {
    canonical: '/wedding-gift-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}