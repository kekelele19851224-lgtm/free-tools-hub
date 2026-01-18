import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chinese Name Generator - Generate Names with Meanings 中文名字生成器 | FreeToolsHub',
  description: 'Free Chinese name generator with 200+ authentic names. Generate male and female Chinese names with characters (汉字), pinyin, and meanings. Traditional, modern, ancient, and Five Elements styles.',
  keywords: 'chinese name generator, chinese name generator male, chinese name generator female, chinese name generator with meaning, chinese name generator with surname, mandarin name generator, ancient chinese name generator, chinese fantasy names',
  alternates: {
    canonical: '/chinese-name-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}