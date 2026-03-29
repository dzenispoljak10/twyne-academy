import type { MetadataRoute } from 'next'

const locales = ['de', 'en', 'fr']
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://twyneacademy.com'

const publicRoutes = ['', '/kurse', '/preise', '/login', '/registrieren']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const route of publicRoutes) {
      entries.push({
        url: `${appUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      })
    }
  }

  return entries
}
