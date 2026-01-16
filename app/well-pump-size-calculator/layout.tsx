import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Well Pump Size Calculator - Free Online Tool | FreeToolsHub',
  description: 'Calculate the right well pump size for your home. Determine GPM needs, Total Dynamic Head (TDH), and recommended pump horsepower based on well depth and fixtures.',
  alternates: {
    canonical: '/well-pump-size-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}