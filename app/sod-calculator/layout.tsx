import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Many Square Feet in a Pallet of Sod? Free Calculator | FreeToolsHub',
  description: 'A pallet of sod covers 400-500 sq ft (most common: 450). Free sod calculator - enter your lawn size, get pallets needed. Compare grass types: Bermuda, Zoysia, St. Augustine.',
  keywords: 'how many square feet in a pallet of sod, sod calculator, pallet of sod coverage, how much sod do I need, sod pallet size, bermuda sod, zoysia sod, st augustine sod, lawn sod calculator',
  alternates: {
    canonical: '/sod-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}