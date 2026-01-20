import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Many Sessions to Remove Tattoo? Free Calculator | FreeToolsHub',
  description: 'Find out how many sessions to remove your tattoo. Free calculator estimates laser removal sessions based on size, color, location. Small black tattoo: 3-6 sessions. Large color: 10-15+.',
  keywords: 'how many sessions to remove tattoo, tattoo removal sessions, how many sessions to remove small tattoo, how many sessions to remove black tattoo, tattoo removal session calculator, how many sessions to remove tattoo on finger, tattoo removal session cost, laser tattoo removal sessions, how many sessions to fully remove a tattoo',
  alternates: {
    canonical: '/how-many-sessions-to-remove-tattoo',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}