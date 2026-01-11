'use client'

import React, { useState, useRef, useEffect } from 'react'

import { differenceInDays } from 'date-fns'
import { Search, SlidersHorizontal, ChevronRight, Clock } from 'lucide-react'

import { CountdownEvent } from '@/data/countdown-events'

interface SearchBarProps {
  events: CountdownEvent[]
  placeholder?: string
}

export function SearchBar({ events, placeholder = 'Etkinlik, sınav veya kategori ara...' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter events based on query
  const filteredEvents = React.useMemo(() => {
    if (!query.trim()) return events.slice(0, 4) // Show top 4 if empty

    const lowerQuery = query.toLowerCase().trim()
    return events.filter((e) => e.title.toLowerCase().includes(lowerQuery)).slice(0, 5) // Limit to 5 results
  }, [query, events])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className='group relative z-50 mx-auto mb-8 w-full max-w-2xl'>
      <div className='relative'>
        <div className='pointer-events-none absolute inset-y-0 left-4 flex items-center'>
          <Search className='h-5 w-5 text-gray-400 transition-colors group-focus-within:text-primary' />
        </div>

        <input
          type='text'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className='h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-12 font-medium text-gray-700 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-primary md:h-14'
          placeholder={placeholder}
        />

        <div className='absolute inset-y-0 right-4 flex cursor-pointer items-center transition-opacity hover:opacity-75'>
          <SlidersHorizontal className='h-5 w-5 text-gray-400' />
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className='animate-in fade-in slide-in-from-top-2 absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-xl duration-200'>
          {filteredEvents.length > 0 ? (
            <>
              <div className='px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400'>
                {query ? 'Sonuçlar' : 'Önerilen Etkinlikler'}
              </div>
              {filteredEvents.map((event) => {
                const daysLeft = differenceInDays(event.targetDate, new Date())
                return (
                  <div
                    key={event.id}
                    className='group/item flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50'
                    onClick={() => {
                      setQuery(event.title)
                      setIsOpen(false)
                    }}
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className='flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold opacity-80'
                        style={{ backgroundColor: `${event.color}20`, color: event.color }}
                      >
                        {event.title.charAt(0)}
                      </div>
                      <span className='font-medium text-gray-700 transition-colors group-hover/item:text-gray-900'>
                        {event.title}
                      </span>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-gray-400'>
                      <Clock className='h-3.5 w-3.5' />
                      <span>{daysLeft} gün kaldı</span>
                      <ChevronRight className='h-4 w-4' />
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <div className='px-4 py-8 text-center text-gray-500'>
              <p className='font-medium'>Sonuç bulunamadı</p>
              <p className='mt-1 text-sm text-gray-400'>Böyle bir bilgi yok gibi görünüyor.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
