import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Amps to kW Converter - Free Electrical Power Calculator | FreeToolsHub',
  description: 'Free amps to kilowatts converter for DC, single-phase AC, and three-phase AC circuits. Calculate power from current and voltage with quick reference tables and formulas.',
  alternates: {
    canonical: '/amps-to-kw-converter',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}