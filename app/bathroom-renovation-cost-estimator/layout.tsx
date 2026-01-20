import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bathroom Renovation Cost Estimator - Free Remodel Calculator 2025 | FreeToolsHub',
  description: 'Free bathroom renovation cost estimator. Calculate your bathroom remodel cost by size, fixtures, and finishes. Get detailed breakdowns for 5x7, 5x10, 10x10 bathrooms. See labor costs and money-saving tips.',
  keywords: 'bathroom renovation cost estimator, bathroom remodel cost estimator, bathroom remodel cost calculator, bathroom renovation cost calculator, 5x7 bathroom remodel cost, 5x10 bathroom remodel cost, small bathroom remodel cost calculator, labor cost to remodel bathroom, bathroom remodel cost per square foot, bath remodeling cost estimator',
  alternates: {
    canonical: '/bathroom-renovation-cost-estimator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}