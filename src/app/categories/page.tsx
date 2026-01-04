'use client'

import Link from 'next/link'

import React, { useState, useMemo } from 'react'

import {
  X,
  List,
  Home,
  Plus,
  Edit2,
  Clock,
  Trash2,
  Share2,
  Search,
  Grid3X3,
  Calendar,
  Sparkles,
  BookOpen,
  LucideIcon,
  ChevronRight,
  CalendarDays,
  GraduationCap,
} from 'lucide-react'
import { tr } from 'date-fns/locale'
import { differenceInDays, differenceInSeconds, intervalToDuration, format } from 'date-fns'

import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
// CountdownDrawer removed (global)

import { categories, CountdownEvent, Category } from '@/data/countdown-events'
import { useCustomCountdowns, CustomCountdownEvent } from '@/hooks/useCustomCountdowns'
import { useCountdownDrawer } from '@/context/CountdownDrawerContext'

import { cn } from '@/utils/utils'

type ViewMode = 'grid' | 'list'
type SortMode = 'date_asc' | 'date_desc' | 'name_asc' | 'name_desc'
type EventType = 'all' | 'exam' | 'application_start' | 'application_end' | 'result'

// Status badge component
function StatusBadge({ event }: { event: CountdownEvent }) {
  const now = new Date()
  const diff = differenceInDays(event.targetDate, now)

  if (diff < 0) {
    return <span className='px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500'>GEÇMİŞ</span>
  }
  if (diff <= 7) {
    return <span className='px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600'>ÇOK YAKINDA</span>
  }
  if (diff <= 30) {
    return (
      <span className='px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-600'>YAKLAŞIYOR</span>
    )
  }
  if (diff <= 90) {
    return <span className='px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600'>STANDART</span>
  }
  return <span className='px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-600'>UZUN DÖNEM</span>
}

// Countdown display for cards
function CountdownDisplay({ targetDate, color }: { targetDate: Date; color?: string }) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof intervalToDuration> | null>(null)

  React.useEffect(() => {
    const calc = () => {
      const diff = differenceInSeconds(targetDate, new Date())
      if (diff <= 0) {
        setTimeLeft(null)
        return
      }
      setTimeLeft(intervalToDuration({ start: new Date(), end: targetDate }))
    }
    calc()
    const timer = setInterval(calc, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const days = differenceInDays(targetDate, new Date())
  const remainingPercent = Math.max(0, Math.min(100, Math.round((days / 365) * 100)))
  const elapsedPercent = 100 - remainingPercent

  return (
    <div className='mt-auto'>
      <div className='text-4xl font-bold mb-1' style={{ color: color || '#2563eb' }}>
        {days > 0 ? days : 0}
      </div>
      <div className='text-sm text-gray-500 mb-3'>Gün Kaldı</div>
      {/* Progress Bar */}
      <div className='space-y-1'>
        <div className='flex items-center justify-between text-xs text-gray-400'>
          <span>%{remainingPercent}</span>
          <span>%{elapsedPercent}</span>
        </div>
        <div className='h-2 w-full bg-gray-100 rounded-full overflow-hidden flex'>
          <div
            className='h-full rounded-l-full transition-all duration-500'
            style={{ width: `${remainingPercent}%`, backgroundColor: color || '#2563eb' }}
          />
          <div className='h-full rounded-r-full bg-gray-300' style={{ width: `${elapsedPercent}%` }} />
        </div>
        <div className='flex items-center justify-between text-xs text-gray-400'>
          <span>Kalan</span>
          <span>Geçen</span>
        </div>
      </div>
    </div>
  )
}

// Event Card Component for this page
function EventCard({
  event,
  viewMode,
  categoryName,
  isCustom,
  onEdit,
  onDelete,
}: {
  event: CountdownEvent
  viewMode: ViewMode
  categoryName?: string
  isCustom?: boolean
  onEdit?: () => void
  onDelete?: () => void
}) {
  if (viewMode === 'list') {
    return (
      <div className='bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all flex items-center justify-between gap-4'>
        <div className='flex items-center gap-4 flex-1 min-w-0'>
          <div
            className='w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0'
            style={{ backgroundColor: event.color || '#2563eb' }}
          >
            {event.title.charAt(0)}
          </div>
          <div className='min-w-0 flex-1'>
            <Link href={`/categories/${event.id}`} className='hover:text-blue-600 transition-colors'>
              <h3 className='font-semibold text-gray-900 truncate'>{event.title}</h3>
            </Link>
            <p className='text-sm text-gray-500'>{format(event.targetDate, 'd MMMM yyyy, EEEE', { locale: tr })}</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <StatusBadge event={event} />
          <div className='text-right'>
            <div className='text-2xl font-bold' style={{ color: event.color || '#2563eb' }}>
              {Math.max(0, differenceInDays(event.targetDate, new Date()))}
            </div>
            <div className='text-xs text-gray-400'>Gün</div>
          </div>
          {isCustom && (
            <div className='flex items-center gap-2'>
              <button
                onClick={onEdit}
                className='p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors'
                title='Düzenle'
              >
                <Edit2 className='w-4 h-4' />
              </button>
              <button
                onClick={onDelete}
                className='p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors'
                title='Sil'
              >
                <Trash2 className='w-4 h-4' />
              </button>
            </div>
          )}
          <Link
            href={`/event/${event.id}`}
            className='text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1'
          >
            Detaylar <ChevronRight className='w-4 h-4' />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full group relative'>
      {/* Custom Event Actions */}
      {isCustom && (
        <div className='absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
          <button
            onClick={onEdit}
            className='p-1.5 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-blue-50 text-blue-600 transition-colors'
            title='Düzenle'
          >
            <Edit2 className='w-3.5 h-3.5' />
          </button>
          <button
            onClick={onDelete}
            className='p-1.5 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-red-50 text-red-600 transition-colors'
            title='Sil'
          >
            <Trash2 className='w-3.5 h-3.5' />
          </button>
        </div>
      )}

      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <StatusBadge event={event} />
        {!isCustom && <Share2 className='w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors' />}
      </div>

      {/* Title */}
      <h3 className='font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2'>
        {event.title}
      </h3>

      {/* Date */}
      <div className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
        <Calendar className='w-4 h-4' />
        <span>{format(event.targetDate, 'd MMMM yyyy, EEEE', { locale: tr })}</span>
      </div>

      {/* Countdown */}
      <CountdownDisplay targetDate={event.targetDate} color={event.color} />

      {/* Footer */}
      <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-100'>
        <span className='text-xs text-gray-400'>{categoryName || 'Genel'}</span>
        <Link
          href={`/categories/${event.id}`}
          className='text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1'
        >
          Detaylar <ChevronRight className='w-4 h-4' />
        </Link>
      </div>
    </div>
  )
}

// Category card for suggestions (info only, no navigation)
function CategorySuggestion({ category, icon: Icon }: { category: Category; icon: LucideIcon }) {
  return (
    <div className='bg-white rounded-xl p-6 border border-gray-100 flex lg:flex-row flex-col items-center text-center w-full lg:w-auto lg:gap-4'>
      <div className='w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3'>
        <Icon className='w-6 h-6 text-blue-600' />
      </div>
      <h3 className='font-semibold text-gray-900 mb-1'>{category.title}</h3>
      <p className='text-xs text-gray-400'>{category.events.length} Etkinlik</p>
    </div>
  )
}

export default function CategoriesPage() {
  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<EventType>('all')
  const [sortMode, setSortMode] = useState<SortMode>('date_asc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [quickFilter, setQuickFilter] = useState<string>('all')
  const [showCount, setShowCount] = useState(12)

  // Custom countdown drawer context
  const { openDrawer, openEditDrawer } = useCountdownDrawer()

  // Custom countdowns hook (only need data and delete)
  const { customEvents, isLoaded, deleteCustomCountdown } = useCustomCountdowns()

  // Get all events with category info (including custom events)
  const allEvents = useMemo(() => {
    // Original events from categories
    const originalEvents = categories.flatMap((cat) =>
      cat.events.map((event) => ({
        ...event,
        categoryName: cat.title,
        categorySlug: cat.slug,
        isCustom: false as const,
      })),
    )

    // Custom events from localStorage
    const customEventsMapped = customEvents.map((event) => ({
      id: event.id,
      title: event.title,
      targetDate: new Date(event.targetDate),
      color: event.color,
      priority: event.priority,
      type: event.type, // Now matches countdown-events.ts type values
      categoryName: 'Kişisel',
      categorySlug: 'custom',
      isCustom: true as const,
      customEvent: event, // Keep reference for edit/delete
    }))

    return [...originalEvents, ...customEventsMapped]
  }, [customEvents])

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let result = [...allEvents]
    const now = new Date()

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((e) => e.title.toLowerCase().includes(query))
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((e) => e.categorySlug === selectedCategory)
    }

    // Type filter
    if (selectedType !== 'all') {
      result = result.filter((e) => e.type === selectedType)
    }

    // Quick filters
    if (quickFilter === 'upcoming') {
      // Yaklaşan Sınavlar - only exam type events within 30 days
      result = result.filter((e) => {
        const diff = differenceInDays(e.targetDate, now)
        return diff >= 0 && diff <= 30 && e.type === 'exam'
      })
    } else if (quickFilter === 'application') {
      result = result.filter((e) => e.type === 'application_start' || e.type === 'application_end')
    } else if (quickFilter === 'exams') {
      result = result.filter((e) => e.type === 'exam')
    }

    // Only show future events by default
    result = result.filter((e) => differenceInDays(e.targetDate, now) >= -1)

    // Sort
    result.sort((a, b) => {
      switch (sortMode) {
        case 'date_asc':
          return a.targetDate.getTime() - b.targetDate.getTime()
        case 'date_desc':
          return b.targetDate.getTime() - a.targetDate.getTime()
        case 'name_asc':
          return a.title.localeCompare(b.title, 'tr')
        case 'name_desc':
          return b.title.localeCompare(a.title, 'tr')
        default:
          return 0
      }
    })

    return result
  }, [allEvents, searchQuery, selectedCategory, selectedType, sortMode, quickFilter])

  const displayedEvents = filteredEvents.slice(0, showCount)
  const hasMore = filteredEvents.length > showCount

  // Category icons mapping
  const categoryIcons: Record<string, LucideIcon> = {
    exams: GraduationCap,
    holidays: CalendarDays,
    special: Sparkles,
  }

  return (
    <div className='min-h-screen max-w-7xl mx-auto bg-gray-50/50'>
      {/* Breadcrumb */}
      <div className='bg-white border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 py-3'>
          <nav className='flex items-center gap-2 text-sm'>
            <Link href='/' className='text-gray-500 hover:text-blue-600 flex items-center gap-1'>
              <Home className='w-4 h-4' />
              Anasayfa
            </Link>
            <ChevronRight className='w-4 h-4 text-gray-300' />
            <span className='text-gray-900 font-medium'>Kategoriler</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className='bg-white border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center'>
                  <BookOpen className='w-5 h-5 text-white' />
                </div>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>Tüm Etkinlikler</h1>
              </div>
              <p className='text-gray-500 max-w-2xl'>
                2026 yılına ait tüm sınavlar, başvuru tarihleri, tatiller ve önemli günler için geri sayım sayaçları.
              </p>
            </div>
            {/* Create Button */}
            <Button onClick={openDrawer} className='bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5'>
              <Plus className='w-5 h-5 mr-2' />
              Geri Sayım Oluştur
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10'>
        {/* Stats bar - matching reference */}
        <section className='mb-8 space-y-4'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <h2 className='text-lg font-bold text-gray-900 flex items-center gap-3'>
              Tüm Etkinlikler
              <span className='text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200'>
                {filteredEvents.length} Adet
              </span>
            </h2>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-500 hidden sm:flex items-center gap-1'>
                <Clock className='w-4 h-4' />
                Son güncelleme: Bugün {format(new Date(), 'HH:mm')}
              </span>
            </div>
          </div>

          {/* Filter Bar - matching reference exactly */}
          <div className='p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center'>
            {/* Search Input */}
            <div className='relative w-full lg:flex-1 group'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10' />
              <Input
                type='text'
                placeholder='Kategori içinde ara...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-10 py-2.5 bg-gray-50 border-gray-200 rounded-lg text-sm'
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors z-10'
                  type='button'
                >
                  <X className='w-5 h-5' />
                </button>
              )}
            </div>

            {/* Right side filters */}
            <div className='flex flex-wrap items-center gap-3 w-full lg:w-auto'>
              {/* Category Select */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className='w-full sm:w-auto min-w-[160px] bg-gray-50 border-gray-200 rounded-lg text-sm font-medium'>
                  <BookOpen className='w-4 h-4 text-gray-400 mr-2' />
                  <SelectValue placeholder='Kategori: Tümü' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Kategori: Tümü</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Select */}
              <Select value={sortMode} onValueChange={(val) => setSortMode(val as SortMode)}>
                <SelectTrigger className='w-full sm:w-auto min-w-[200px] bg-gray-50 border-gray-200 rounded-lg text-sm font-medium'>
                  <Calendar className='w-4 h-4 text-gray-400 mr-2' />
                  <SelectValue placeholder='Sırala' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='date_asc'>Sırala: Tarih (En Yakın)</SelectItem>
                  <SelectItem value='date_desc'>Sırala: Tarih (En Uzak)</SelectItem>
                  <SelectItem value='name_asc'>Sırala: Alfabetik (A-Z)</SelectItem>
                  <SelectItem value='name_desc'>Sırala: Alfabetik (Z-A)</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className='hidden sm:flex bg-gray-50 rounded-lg p-1 border border-gray-200 h-[42px] items-center'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'h-full rounded aspect-square',
                    viewMode === 'grid' && 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5',
                  )}
                  title='Grid Görünüm'
                >
                  <Grid3X3 className='w-5 h-5' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'h-full rounded aspect-square',
                    viewMode === 'list' && 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5',
                  )}
                  title='Liste Görünüm'
                >
                  <List className='w-5 h-5' />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Filters - matching reference */}
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-xs font-semibold text-gray-500'>Hızlı Filtre:</span>
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'upcoming', label: 'Yaklaşan Sınavlar' },
              { id: 'application', label: 'Başvuru Tarihleri' },
              { id: 'exams', label: 'Sonuç Açıklama' },
            ].map((filter) => (
              <Button
                key={filter.id}
                variant={quickFilter === filter.id ? 'default' : 'outline'}
                size='sm'
                onClick={() => setQuickFilter(filter.id)}
                className={cn(
                  'rounded-full text-xs',
                  quickFilter === filter.id
                    ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600',
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </section>

        {/* Results */}
        {displayedEvents.length > 0 ? (
          <>
            <div
              className={cn(
                'mb-8',
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'
                  : 'flex flex-col gap-3',
              )}
            >
              {displayedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  viewMode={viewMode}
                  categoryName={event.categoryName}
                  isCustom={event.isCustom}
                  onEdit={
                    event.isCustom && 'customEvent' in event
                      ? () => openEditDrawer(event.customEvent as CustomCountdownEvent)
                      : undefined
                  }
                  onDelete={event.isCustom ? () => deleteCustomCountdown(event.id) : undefined}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className='flex justify-center'>
                <Button variant='outline' onClick={() => setShowCount((prev) => prev + 12)} className='rounded-xl'>
                  Daha Fazla Göster
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className='bg-white rounded-2xl p-12 text-center'>
            <div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4'>
              <Search className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Sonuç Bulunamadı</h3>
            <p className='text-gray-500'>
              Arama kriterlerinize uygun etkinlik bulunamadı. Filtreleri değiştirmeyi deneyin.
            </p>
          </div>
        )}

        {/* Category Suggestions */}
        <div className='mt-12'>
          <div className='w-full flex lg:flex-row flex-col justify-center gap-4'>
            {categories.map((cat) => (
              <CategorySuggestion key={cat.id} category={cat} icon={categoryIcons[cat.slug] || BookOpen} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
