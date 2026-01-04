'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, SlidersHorizontal, ChevronRight, Clock } from 'lucide-react'
import { CountdownEvent } from '@/data/countdown-events'
import { differenceInDays } from 'date-fns'

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
    <div ref={containerRef} className='w-full max-w-2xl mx-auto mb-8 relative group z-50'>
      <div className='relative'>
        <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
          <Search className='h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors' />
        </div>

        <input
          type='text'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className='w-full h-12 md:h-14 pl-12 pr-12 rounded-2xl bg-white border border-gray-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:border-gray-300 focus:border-primary transition-all outline-none text-gray-700 font-medium placeholder:text-gray-400'
          placeholder={placeholder}
        />

        <div className='absolute inset-y-0 right-4 flex items-center cursor-pointer hover:opacity-75 transition-opacity'>
          <SlidersHorizontal className='h-5 w-5 text-gray-400' />
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200'>
          {filteredEvents.length > 0 ? (
            <>
              <div className='px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                {query ? 'Sonuçlar' : 'Önerilen Etkinlikler'}
              </div>
              {filteredEvents.map((event) => {
                const daysLeft = differenceInDays(event.targetDate, new Date())
                return (
                  <div
                    key={event.id}
                    className='px-4 py-3 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors group/item'
                    onClick={() => {
                      setQuery(event.title)
                      setIsOpen(false)
                    }}
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className='w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold opacity-80'
                        style={{ backgroundColor: `${event.color}20`, color: event.color }}
                      >
                        {event.title.charAt(0)}
                      </div>
                      <span className='font-medium text-gray-700 group-hover/item:text-gray-900 transition-colors'>
                        {event.title}
                      </span>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-gray-400'>
                      <Clock className='w-3.5 h-3.5' />
                      <span>{daysLeft} gün kaldı</span>
                      <ChevronRight className='w-4 h-4' />
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <div className='px-4 py-8 text-center text-gray-500'>
              <p className='font-medium'>Sonuç bulunamadı</p>
              <p className='text-sm text-gray-400 mt-1'>Böyle bir bilgi yok gibi görünüyor.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
