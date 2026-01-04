import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crusher Run Calculator - Tons & Cubic Yards | FreeToolsHub',
  description: 'Calculate how much crusher run you need in tons and cubic yards. Free calculator with coverage chart, tons to cubic yards conversion, and 2025 pricing for driveways, walkways, and patios.',
  alternates: {
    canonical: '/crusher-run-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}