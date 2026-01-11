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
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-countdown-primary text-2xl font-bold'>{title}</h2>
        <Link
          href={`/countdown/category/${slug}`}
          className='text-countdown-secondary hover:text-countdown-primary flex items-center text-sm font-medium transition-colors'
        >
          Tümünü Gör <ArrowRight className='ml-1 h-4 w-4' />
        </Link>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {events.slice(0, 4).map((event) => (
          <CountdownCard key={event.id} title={event.title} targetDate={event.targetDate} color={event.color} />
        ))}
      </div>
    </section>
  )
}
