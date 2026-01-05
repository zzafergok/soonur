'use client'

import React from 'react'
import { SearchBar } from '@/components/ui/SearchBar'
import { HeroCountdown } from '@/components/ui/countdown/HeroCountdown'
import { CountdownCard } from '@/components/ui/countdown/CountdownCard'
import { featuredEvent, categories, CountdownEvent } from '@/data/countdown-events'

export default function Home() {
  // State
  const [featured, setFeatured] = React.useState<CountdownEvent>(featuredEvent as CountdownEvent)
  const [activeTab, setActiveTab] = React.useState('all')

  // All events flat list
  const allEvents = React.useMemo(() => {
    return categories.flatMap((c) => c.events)
  }, [])

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
      .slice(0, 8) // Limit to 8 cards
  }, [allEvents, activeTab])

  // Randomize Handler
  const handleRandomize = () => {
    const futureEvents = allEvents.filter((e) => new Date(e.targetDate) > new Date())
    if (futureEvents.length > 0) {
      const randomIndex = Math.floor(Math.random() * futureEvents.length)
      setFeatured(futureEvents[randomIndex])
    }
  }

  const tabs = [
    { id: 'all', label: 'Tümü' },
    { id: 'exams', label: 'Sınavlar' },
    { id: 'holidays', label: 'Resmi Tatiller' },
    { id: 'special', label: 'Özel Günler' },
  ]

  return (
    <div className='min-h-screen w-full flex flex-col items-center container mx-auto px-4 py-8 md:py-12'>
      {/* Background decoration */}
      <div className='absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-blue-50/50 via-white to-transparent -z-10' />

      <div className='w-full max-w-6xl flex-1 flex flex-col items-center gap-12'>
        {/* Search Bar */}
        <div className='w-full flex justify-center'>
          <SearchBar events={allEvents} />
        </div>

        {/* Hero Section */}
        <div className='flex-0 flex items-center justify-center w-full'>
          <HeroCountdown title={featured.title} targetDate={featured.targetDate} onRandomize={handleRandomize} />
        </div>

        {/* Filter Tabs */}
        <div className='w-full flex flex-wrap justify-center gap-3'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/50 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className='w-full'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {filteredEvents.map((event) => (
              <CountdownCard
                key={event.id}
                title={event.title}
                targetDate={event.targetDate}
                color={event.color}
                className='h-full'
              />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className='text-center py-12 text-slate-400'>Bu kategoride yaklaşan etkinlik bulunamadı.</div>
          )}
        </div>
      </div>
    </div>
  )
}
