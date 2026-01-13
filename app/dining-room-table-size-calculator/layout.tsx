import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dining Room Table Size Calculator - Find Perfect Table for Your Room | FreeToolsHub',
  description: 'Free dining room table size calculator. Find the perfect table size by room dimensions or seating needs. Supports rectangular, round, square, and oval tables.',
  alternates: {
    canonical: '/dining-room-table-size-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}