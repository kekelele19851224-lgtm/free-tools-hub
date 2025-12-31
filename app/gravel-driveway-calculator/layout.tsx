import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gravel Driveway Calculator - Free Online Tool | FreeToolsHub',
  description: 'Estimate gravel needs and costs for driveways. Calculate volume in cubic yards and tons by dimensions, choose material types, and plan new builds or top‑up refresh projects.',
  alternates: {
    canonical: '/gravel-driveway-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
