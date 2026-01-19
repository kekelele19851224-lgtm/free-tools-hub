import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roman Numeral Tattoo Generator - Free Date & Number Converter | FreeToolsHub',
  description: 'Convert dates and numbers into elegant Roman numerals for your tattoo. Free online generator with multiple font previews, date formats, and separators. Perfect for birthdays, anniversaries, and memorial tattoos.',
  alternates: {
    canonical: '/roman-numeral-tattoo-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}