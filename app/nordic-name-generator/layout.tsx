import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nordic Name Generator - Viking & Norse Names with Meanings | FreeToolsHub',
  description: 'Free Nordic name generator with 150+ authentic Viking and Norse names. Generate male and female names with meanings, patronymic surnames, and epithets. Perfect for Skyrim, fantasy games, and creative writing.',
  keywords: 'nordic name generator, viking name generator, norse name generator, viking names male, viking names female, nordic names with meaning, skyrim name generator, viking surname generator, old norse names',
  alternates: {
    canonical: '/nordic-name-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}