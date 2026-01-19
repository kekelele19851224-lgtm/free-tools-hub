import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Etsy Shop Name Generator - Cute & Aesthetic Store Name Ideas | FreeToolsHub',
  description: 'Free Etsy shop name generator online. Get creative, catchy, and unique name ideas for your Etsy store. Aesthetic, cute, vintage, and modern styles. Check character limits instantly. No signup required.',
  keywords: 'etsy shop name generator, etsy store name generator, etsy business name generator, etsy shop name ideas, cute etsy shop names, aesthetic etsy shop names, etsy name generator free, etsy shop name ideas for digital products, etsy shop name ideas for printables, catchy etsy store names',
  alternates: {
    canonical: '/etsy-shop-name-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}