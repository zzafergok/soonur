import { MetadataRoute } from 'next'

import { categories } from '@/data/countdown-events'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://soonur.vercel.app'

  // Events urls
  const events = categories.flatMap((category) =>
    category.events.map((event) => ({
      url: `${baseUrl}/categories/${event.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  )

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...events,
  ]
}
