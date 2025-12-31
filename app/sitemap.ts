import { MetadataRoute } from 'next'
import { calculators } from '@/lib/calculators'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://free-tools-hub.com'
  const lastModified = new Date()

  const entries = new Map<string, MetadataRoute.Sitemap[number]>()

  entries.set(`${baseUrl}/`, {
    url: `${baseUrl}/`,
    lastModified,
    changeFrequency: 'daily',
    priority: 1.0,
  })

  calculators.forEach((calc) => {
    const path = calc.url ?? calc.href
    if (!path) return
    const url = path.startsWith('http') ? path : `${baseUrl}${path}`
    entries.set(url, {
      url,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  })

  return Array.from(entries.values())
}
