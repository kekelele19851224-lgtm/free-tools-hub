import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tire Gear Ratio Calculator - RPM, Speed & Effective Ratio | FreeToolsHub',
  description: 'Free tire gear ratio calculator. Calculate engine RPM at any speed, find effective gear ratio after tire size change, and compare speedometer accuracy. Includes gear ratio chart.',
  alternates: {
    canonical: '/tire-gear-ratio-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}