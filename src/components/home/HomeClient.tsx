'use client'

import React from 'react'
import { SearchBar } from '@/components/ui/searchbar/SearchBar'
import { HeroSlider } from '@/components/ui/countdown/HeroSlider'
import { CountdownCard } from '@/components/ui/countdown/CountdownCard'
import { featuredEvent, categories, CountdownEvent } from '@/data/countdown-events'

export function HomeClient() {
  // State
  const [activeTab, setActiveTab] = React.useState('all')

  // All events flat list
  const allEvents = React.useMemo(() => {
    return categories.flatMap((c) => c.events)
  }, [])

  // Hero Slider Groups Logic
  const heroGroups = React.useMemo(() => {
    // 1. Identify specific priority exams
    const kpssOrtaogretim = allEvents.find((e) => e.title.includes('KPSS Ortaöğretim') && e.type === 'exam')
    const kpssOnLisans = allEvents.find((e) => e.title.includes('KPSS Ön Lisans') && e.type === 'exam')

    const specialIds = new Set([kpssOrtaogretim?.id, kpssOnLisans?.id].filter(Boolean) as string[])

    const groups: CountdownEvent[][] = []

    // Group 1: KPSS Ortaöğretim & Ön Lisans (Priority Pair)
    const firstGroup: CountdownEvent[] = []
    if (kpssOrtaogretim) firstGroup.push(kpssOrtaogretim)
    if (kpssOnLisans) firstGroup.push(kpssOnLisans)

    if (firstGroup.length > 0) {
      groups.push(firstGroup)
    }

    // 2. Find remaining KPSS exams
    const remainingKpss = allEvents
      .filter((e) => e.type === 'exam' && e.title.includes('KPSS') && !specialIds.has(e.id))
      .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())

    // 3. Find all other events (Non-KPSS or Non-Exam)
    const otherEvents = allEvents
      .filter((e) => !specialIds.has(e.id) && !remainingKpss.find((k) => k.id === e.id))
      .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())

    // Helper to chunk array
    const chunkArray = (arr: CountdownEvent[], size: number) => {
      const chunks = []
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size))
      }
      return chunks
    }

    // Add remaining KPSS groups
    if (remainingKpss.length > 0) {
      groups.push(...chunkArray(remainingKpss, 2))
    }

    // Add other events groups
    if (otherEvents.length > 0) {
      groups.push(...chunkArray(otherEvents, 2))
    }

    // Fallback
    if (groups.length === 0 && allEvents.length > 0) {
      groups.push([allEvents[0]])
    }

    return groups
  }, [allEvents])

  // Filter logic
  const filteredEvents = React.useMemo(() => {
    let events: CountdownEvent[] = []

    if (activeTab === 'all') {
      // For "All", we might want to mix specific categories or just show priority ones
      // Let's show a mix of everything, sorted by date
      events = allEvents.filter((e) => e.priority === 1 || e.priority === 2)
    } else if (activeTab === 'exams') {
      events = categories.find((c) => c.slug === 'exams')?.events || []
    } else if (activeTab === 'holidays') {
      events = categories.find((c) => c.slug === 'holidays')?.events || []
    } else if (activeTab === 'special') {
      events = categories.find((c) => c.slug === 'special')?.events || []
    }

    // Sort by date (nearest first)
    return events
      .filter((e) => new Date(e.targetDate) > new Date()) // Only future
      .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
      .slice(0, 6) // Limit to 6 cards
  }, [allEvents, activeTab])

  // Randomize Handler (Optional logic for button if needed contextually)
  const handleRandomize = () => {
    // Logic can be moved inside HeroSlider or kept here if controlling global state
    // For now, HeroSlider controls its own slide state, but this prop exists for "Action"
    console.log('Random event requested')
  }

  const tabs = [
    { id: 'all', label: 'Tümü' },
    { id: 'exams', label: 'Sınavlar' },
    { id: 'holidays', label: 'Resmi Tatiller' },
    { id: 'special', label: 'Özel Günler' },
  ]

  return (
    <div className='container mx-auto flex min-h-screen w-full flex-col items-center px-4 py-8 md:py-12'>
      {/* Background decoration */}
      <div className='absolute left-0 top-0 -z-10 h-[60vh] w-full bg-gradient-to-b from-blue-50/50 via-white to-transparent' />

      <div className='flex w-full max-w-6xl flex-1 flex-col items-center gap-12'>
        {/* Search Bar */}
        <div className='flex w-full justify-center'>
          <SearchBar events={allEvents} />
        </div>

        {/* Hero Section */}
        <div className='flex-0 flex w-full items-center justify-center'>
          <HeroSlider groups={heroGroups} />
        </div>

        {/* Filter Tabs */}
        <div className='flex w-full flex-wrap justify-center gap-3'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'scale-105 bg-primary text-white shadow-md shadow-primary/20'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-primary/50 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className='w-full'>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
            {filteredEvents.map((event) => (
              <CountdownCard
                key={event.id}
                title={event.title}
                targetDate={event.targetDate}
                color={event.color}
                className='h-full'
                href={`/categories/${event.id}`}
              />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className='py-12 text-center text-slate-400'>Bu kategoride yaklaşan etkinlik bulunamadı.</div>
          )}
        </div>
      </div>
    </div>
  )
}
