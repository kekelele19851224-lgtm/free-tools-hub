import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Car Paint Calculator - Estimate Paint Quantity & Cost | FreeToolsHub',
  description: 'Free car paint calculator to estimate how much paint you need for your vehicle. Calculate primer, basecoat, and clear coat quantities with cost estimator for DIY and professional paint jobs.',
  alternates: {
    canonical: '/car-paint-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}