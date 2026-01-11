import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { EventDetailClient } from '@/components/countdown/EventDetailClient'

import { categories } from '@/data/countdown-events'

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

async function getEvent(id: string) {
  for (const cat of categories) {
    const event = cat.events.find((e) => e.id === id)
    if (event) {
      return { ...event, categoryName: cat.title, categorySlug: cat.slug }
    }
  }
  return null
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) {
    return {
      title: 'Etkinlik Bulunamadı',
    }
  }

  const dateStr = event.targetDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

  return {
    title: `${event.title} Geri Sayım`,
    description: `${event.title} ne zaman? Sınav tarihi: ${dateStr}. ${event.title} için geri sayım sayacı.`,
    keywords: [event.title, 'geri sayım', 'sınav tarihi', 'sayaç', event.categoryName],
    openGraph: {
      title: `${event.title} Geri Sayım | Soonur`,
      description: `${event.title} için kalan zamanı takip edin. Tarih: ${dateStr}`,
    },
  }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) {
    notFound()
  }

  // Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.targetDate.toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Türkiye',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'TR',
      },
    },
    description: `${event.title} sınav tarihi ve geri sayım.`,
    organizer: {
      '@type': 'Organization',
      name: 'ÖSYM',
      url: 'https://osym.gov.tr',
    },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <EventDetailClient event={event} />
    </>
  )
}
