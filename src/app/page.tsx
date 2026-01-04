'use client'

import React from 'react'
import { SearchBar } from '@/components/ui/SearchBar'
import { HeroCountdown } from '@/components/ui/countdown/HeroCountdown'
import { CountdownCard } from '@/components/ui/countdown/CountdownCard'
import { featuredEvent, categories } from '@/data/countdown-events'

export default function Home() {
  // Get Priority 1 events, limit to 6
  const priorityEvents = React.useMemo(() => {
    return categories
      .flatMap((c) => c.events)
      .filter((e) => e.priority === 1)
      .slice(0, 6)
  }, [])

  // All events for search
  const allEvents = React.useMemo(() => {
    return categories.flatMap((c) => c.events)
  }, [])

  return (
    <div className='h-auto w-full flex flex-col items-center container mx-auto px-4 pb-8 md:pb-12'>
      {/* Background decoration */}
      <div className='absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-50/50 to-transparent -z-10' />

      <div className='w-full max-w-7xl flex-1 flex flex-col items-center gap-8'>
        {/* Search Bar */}
        <div className='w-full flex justify-center'>
          <SearchBar events={allEvents} />
        </div>

        {/* Top Section: Hero */}
        <div className='flex-0 flex items-center justify-center w-full'>
          <HeroCountdown title={featuredEvent.title} targetDate={featuredEvent.targetDate} />
        </div>

        {/* Bottom Section: Grid */}
        <div className='w-full'>
          <div className='flex items-center justify-between mb-4 px-2'>
            <h2 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-red-500 animate-pulse' />
              Yaklaşan Önemli Günler
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'>
            {priorityEvents.map((event) => (
              <CountdownCard
                key={event.id}
                title={event.title}
                targetDate={event.targetDate}
                color={event.color}
                className='h-full shadow-sm hover:shadow-md border-slate-100'
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
