'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useMemo } from 'react'

import { ChevronRight, Home } from 'lucide-react'

import { categories, featuredEvent } from '@/data/countdown-events'

import { useCustomCountdowns } from '@/hooks/useCustomCountdowns'

import { cn } from '@/utils/utils'

export interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  isCurrentPage?: boolean
}

interface DynamicBreadcrumbProps {
  className?: string
  separator?: React.ReactNode
  homeIcon?: boolean
}

export function DynamicBreadcrumb({ className, separator, homeIcon = true }: DynamicBreadcrumbProps) {
  const pathname = usePathname()
  const { customEvents } = useCustomCountdowns()

  const breadcrumbItems = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = []

    // 1. Home
    if (homeIcon) {
      items.push({
        label: 'Anasayfa',
        href: '/',
        icon: Home,
      })
    }

    // 2. Dynamic segments
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      const isLast = i === segments.length - 1

      switch (segment) {
        case 'categories':
          items.push({
            label: 'Tüm Etkinlikler',
            href: '/categories',
            isCurrentPage: isLast,
          })
          break

        case 'event':
          // Skip 'event' as a standalone item, handle [id] next
          if (!isLast && segments[i + 1]) {
            const eventId = segments[i + 1]
            let eventTitle = formatSegmentLabel(eventId)

            // 1. Check Featured Event
            if (eventId === featuredEvent.id) {
              eventTitle = featuredEvent.title
            }
            // 2. Check Static Categories
            else {
              const staticEvent = categories.flatMap((c) => c.events).find((e) => e.id === eventId)

              if (staticEvent) {
                eventTitle = staticEvent.title
              }
              // 3. Check Custom Events
              else {
                const customEvent = customEvents.find((e) => e.id === eventId)
                if (customEvent) {
                  eventTitle = customEvent.title
                }
              }
            }

            items.push({
              label: eventTitle,
              href: `/event/${eventId}`,
              isCurrentPage: true, // Event detail is always the last page
            })
            i++ // Skip processing the ID segment
          }
          break

        default:
          // Fallback for other segments
          items.push({
            label: formatSegmentLabel(segment),
            href: `/${segments.slice(0, i + 1).join('/')}`,
            isCurrentPage: isLast,
          })
      }
    }

    return items
  }, [pathname, homeIcon, customEvents])

  if (breadcrumbItems.length <= 1 && homeIcon) return null

  return (
    <nav aria-label='Breadcrumb' className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      <ol className='flex items-center space-x-1' role='list'>
        {breadcrumbItems.map((item, index) => (
          <li key={`${item.href}-${index}`} className='flex items-center'>
            {index > 0 && (
              <span className='mx-2 select-none' aria-hidden='true'>
                {separator || <ChevronRight className='h-3 w-3' />}
              </span>
            )}
            {item.isCurrentPage ? (
              <span
                className='font-medium text-foreground'
                aria-current='page'
                aria-label={`Şu anki sayfa: ${item.label}`}
              >
                {item.icon && <item.icon className='h-4 w-4 mr-1 inline' />}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className='flex items-center hover:text-foreground transition-colors focus:outline-none rounded-sm px-1'
                aria-label={`${item.label} sayfasına git`}
              >
                {item.icon && <item.icon className='h-4 w-4 mr-1' />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
