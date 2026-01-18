import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Birth Flower Tattoo Generator - Free with Names & Bouquet | FreeToolsHub',
  description: 'Free birth flower tattoo generator with names. Create personalized birth month flower tattoos, family bouquet designs. Discover meanings of all 12 birth flowers.',
  keywords: 'birth flower tattoo generator, birth flower tattoo generator with names, birth flower bouquet generator, birth month flower tattoo, family birth flower bouquet tattoo, birth flower tattoo free, what are the 12 birth month flowers',
  alternates: {
    canonical: '/birth-flower-tattoo-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}