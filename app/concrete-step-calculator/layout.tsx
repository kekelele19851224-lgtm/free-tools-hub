import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Concrete Step Calculator - Volume, Bags & Cost Estimate | FreeToolsHub',
  description: 'Free concrete step calculator. Calculate concrete volume for stairs, estimate bags needed (40/60/80 lb), design code-compliant steps, and estimate project costs. Includes rise, run, and landing calculations.',
  alternates: {
    canonical: '/concrete-step-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}