import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Propane Generator Fuel Calculator - Usage Per Hour & Runtime | FreeToolsHub',
  description: 'Free propane generator calculator. Calculate fuel consumption per hour, estimate costs, and find how long your tank will last. Works for 7kW to 38kW generators. Includes usage chart.',
  keywords: 'propane generator calculator, how much propane does a generator use, generator propane usage chart, propane generator fuel consumption, how much propane does a 20kw generator use per hour, how long will a generator run on a 20lb tank of propane, how much propane does a generator use in 24 hours, generac generator propane consumption, propane generator runtime calculator',
  alternates: {
    canonical: '/propane-generator-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}