import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ranch Brand Generator - Free Cattle Brand Maker & Logo Designer | FreeToolsHub',
  description: 'Free ranch brand generator to create custom cattle brands and ranch logos. Design with traditional Western symbols, download PNG or SVG for branding irons. No registration required.',
  alternates: {
    canonical: '/ranch-brand-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}