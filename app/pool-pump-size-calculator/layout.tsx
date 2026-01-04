import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pool Pump Size Calculator - GPM & HP Guide | FreeToolsHub',
  description: 'Free pool pump size calculator. Calculate the right pump horsepower (HP) based on your pool volume, GPM requirements, and turnover rate. Includes sizing chart for all pool sizes.',
  alternates: {
    canonical: '/pool-pump-size-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}