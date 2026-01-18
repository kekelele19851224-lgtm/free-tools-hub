import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cartoon Speech Bubble Generator | Free Comic Bubble Maker Online | FreeToolsHub',
  description: 'Free cartoon speech bubble generator online. Create custom speech bubbles, thought bubbles, comic bubbles for memes, Discord, and social media. Download PNG instantly. No signup required.',
  keywords: 'cartoon bubble generator, speech bubble generator, speech bubble generator free, comic bubble generator, speech bubble generator free online, thought bubble generator, pixel speech bubble generator, manga speech bubble generator, anime speech bubble generator, speech bubble meme generator, talking bubble generator, caption bubble generator, speech bubble maker, discord speech bubble',
  alternates: {
    canonical: '/cartoon-bubble-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}