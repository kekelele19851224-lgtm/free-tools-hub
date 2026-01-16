import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'T-Shirt Size Calculator - Find Your Perfect Fit by Height & Weight | FreeToolsHub',
  description: 'Free T-shirt size calculator for men, women & kids. Find your perfect size based on height and weight. Includes size charts, international conversion (US/UK/EU), and measurement guide.',
  alternates: {
    canonical: '/t-shirt-size-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}