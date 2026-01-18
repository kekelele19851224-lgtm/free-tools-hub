import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TikTok Comment Generator - Free Copy & Paste Comments | FreeToolsHub',
  description: 'Free TikTok comment generator with 500+ ready-to-use templates. Generate funny, supportive, flirty, and engaging comments instantly. Copy and paste to boost your TikTok engagement.',
  keywords: 'tiktok comment generator, tiktok comments copy and paste, tiktok comment generator free, tiktok comment generator ai, tiktok comment reply, funny tiktok comments, tiktok engagement',
  alternates: {
    canonical: '/tiktok-comment-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}