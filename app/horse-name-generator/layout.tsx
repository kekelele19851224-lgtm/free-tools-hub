import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Horse Name Generator & Creator - Create Perfect Names for Your Horse | FreeToolsHub',
  description: 'Free horse name generator and creator tool. Generate unique horse names using sire and dam names, by style (classic, race, fantasy, funny, western), or random. Perfect for foals, race horses, and gaming.',
  alternates: {
    canonical: '/horse-name-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
