'use client'

import React from 'react'
import { CountdownCard } from './CountdownCard'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export interface CountdownEvent {
  id: string
  title: string
  targetDate: Date
  color?: string
}

export interface CategorySectionProps {
  title: string
  slug: string
  events: CountdownEvent[]
}

export function CategorySection({ title, slug, events }: CategorySectionProps) {
  return (
    <section className='py-8'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-countdown-primary'>{title}</h2>
        <Link
          href={`/countdown/category/${slug}`}
          className='flex items-center text-sm font-medium text-countdown-secondary hover:text-countdown-primary transition-colors'
        >
          Tümünü Gör <ArrowRight className='ml-1 h-4 w-4' />
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {events.slice(0, 4).map((event) => (
          <CountdownCard key={event.id} title={event.title} targetDate={event.targetDate} color={event.color} />
        ))}
      </div>
    </section>
  )
}
