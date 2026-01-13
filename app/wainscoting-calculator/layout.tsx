import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wainscoting Calculator - Free Picture Frame & Board and Batten Calculator | FreeToolsHub',
  description: 'Free wainscoting calculator. Calculate panel spacing, frame dimensions, and material needs for picture frame wainscoting and board and batten projects. Get measurements in fractions.',
  alternates: {
    canonical: '/wainscoting-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}