import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Whole House Generator Cost Calculator - Estimate Installation Price | FreeToolsHub',
  description: 'Free whole house generator cost calculator. Estimate total installation cost including generator unit, transfer switch, labor, and permits. Get pricing for 1000-3500 sq ft homes.',
  keywords: 'whole house generator cost, whole house generator cost calculator, whole house generator cost installed, generator cost for 2000 sq ft house, standby generator cost, generac generator cost, home generator installation cost',
  alternates: {
    canonical: '/whole-house-generator-cost-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}