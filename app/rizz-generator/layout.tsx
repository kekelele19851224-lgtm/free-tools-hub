import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rizz Generator - Free Pickup Lines & Flirty Messages | FreeToolsHub',
  description: 'Free rizz generator with 1000+ smooth pickup lines, flirty messages, and conversation starters. Generate rizz for dating apps, DMs, texts, and in-person situations.',
  keywords: 'rizz generator, rizz lines, pickup lines, flirty messages, rizz generator free, rizz response generator, tinder rizz, dating app opener, conversation starters, rizz ai',
  alternates: {
    canonical: '/rizz-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}