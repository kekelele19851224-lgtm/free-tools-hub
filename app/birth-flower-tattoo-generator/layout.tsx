import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Birth Flower Tattoo Generator | Free Bouquet Generator with Names | FreeToolsHub',
  description: 'Free birth flower tattoo generator & birth flower bouquet generator with names. Create personalized family birth flower bouquet tattoos, combine multiple birth months. Discover all 12 birth month flowers and meanings.',
  keywords: 'birth flower tattoo generator, birth flower bouquet generator, birth flower bouquet generator free, birth flower tattoo generator with names, family birth flower bouquet tattoo, birth flower bouquet generator with name, birth flower bouquet tattoo generator, birth flower bouquet generator free printable, best birth flower bouquet generator online free, birth month flower tattoo, what are the 12 birth month flowers',
  alternates: {
    canonical: '/birth-flower-tattoo-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}