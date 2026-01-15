import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fence Picket Calculator - How Many Pickets Do I Need? | FreeToolsHub',
  description: 'Free fence picket calculator. Calculate how many fence pickets, posts, rails, and materials you need. Supports standard, privacy, and board-on-board fence styles with cost estimates.',
  alternates: {
    canonical: '/fence-picket-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}