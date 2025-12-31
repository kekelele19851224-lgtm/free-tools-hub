import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Phone Number Extractor - Extract Phone Numbers from Text Free | FreeToolsHub',
  description: 'Free online phone number extractor tool. Extract phone numbers from text, PDF, emails, and documents instantly. Supports US, UK, and international formats with CSV export.',
  alternates: {
    canonical: '/phone-number-extractor',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}