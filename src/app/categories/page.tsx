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
    return <span className='rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500'>GEÇMİŞ</span>
  }
  if (diff <= 7) {
    return (
      <span className='rounded-full bg-purple-500 px-3 py-1 text-xs font-bold text-white shadow-sm'>ÇOK YAKINDA</span>
    )
  }
  if (diff <= 30) {
    return (
      <span className='rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm'>YAKLAŞIYOR</span>
    )
  }
  if (diff <= 90) {
    return <span className='rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white shadow-sm'>STANDART</span>
  }
  return (
    <span className='rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm'>
      UZUN DÖNEM
    </span>
  )
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
      <div className='mb-1 text-4xl font-bold' style={{ color: color || 'hsl(var(--primary))' }}>
        {days > 0 ? days : 0}
      </div>
      <div className='mb-3 text-sm text-gray-500'>Gün Kaldı</div>
      {/* Progress Bar */}
      <div className='space-y-1'>
        <div className='flex items-center justify-between text-xs text-gray-400'>
          <span>%{remainingPercent}</span>
          <span>%{elapsedPercent}</span>
        </div>
        <div className='flex h-2 w-full overflow-hidden rounded-full bg-gray-100'>
          <div
            className='h-full rounded-l-full transition-all duration-500'
            style={{ width: `${remainingPercent}%`, backgroundColor: color || 'hsl(var(--primary))' }}
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
      <div className='flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:shadow-md'>
        <div className='flex min-w-0 flex-1 items-center gap-4'>
          <div
            className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white'
            style={{ backgroundColor: event.color || 'hsl(var(--primary))' }}
          >
            {event.title.charAt(0)}
          </div>
          <div className='min-w-0 flex-1'>
            <Link href={`/categories/${event.id}`} className='transition-colors hover:text-primary'>
              <h3 className='truncate font-semibold text-gray-900'>{event.title}</h3>
            </Link>
            <p className='text-sm text-gray-500'>{format(event.targetDate, 'd MMMM yyyy, EEEE', { locale: tr })}</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <StatusBadge event={event} />
          <div className='text-right'>
            <div className='text-2xl font-bold' style={{ color: event.color || 'hsl(var(--primary))' }}>
              {Math.max(0, differenceInDays(event.targetDate, new Date()))}
            </div>
            <div className='text-xs text-gray-400'>Gün</div>
          </div>
          {isCustom && (
            <div className='flex items-center gap-2'>
              <button
                onClick={onEdit}
                className='rounded-lg p-2 text-primary transition-colors hover:bg-primary/10'
                title='Düzenle'
              >
                <Edit2 className='h-4 w-4' />
              </button>
              <button
                onClick={onDelete}
                className='rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50'
                title='Sil'
              >
                <Trash2 className='h-4 w-4' />
              </button>
            </div>
          )}
          <Link
            href={`/event/${event.id}`}
            className='flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80'
          >
            Detaylar <ChevronRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='group relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-lg'>
      {/* Custom Event Actions */}
      {isCustom && (
        <div className='absolute right-3 top-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
          <button
            onClick={onEdit}
            className='rounded-lg border border-gray-200 bg-white p-1.5 text-primary shadow-sm transition-colors hover:bg-primary/10'
            title='Düzenle'
          >
            <Edit2 className='h-3.5 w-3.5' />
          </button>
          <button
            onClick={onDelete}
            className='rounded-lg border border-gray-200 bg-white p-1.5 text-red-600 shadow-sm transition-colors hover:bg-red-50'
            title='Sil'
          >
            <Trash2 className='h-3.5 w-3.5' />
          </button>
        </div>
      )}

      {/* Header */}
      <div className='mb-4 flex items-start justify-between'>
        <StatusBadge event={event} />
        {!isCustom && <Share2 className='h-4 w-4 text-gray-400 transition-colors hover:text-gray-600' />}
      </div>

      {/* Title */}
      <h3 className='mb-1 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary'>
        {event.title}
      </h3>

      {/* Date */}
      <div className='mb-6 flex items-center gap-2 text-sm text-gray-500'>
        <Calendar className='h-4 w-4' />
        <span>{format(event.targetDate, 'd MMMM yyyy, EEEE', { locale: tr })}</span>
      </div>

      {/* Countdown */}
      <CountdownDisplay targetDate={event.targetDate} color={event.color} />

      {/* Footer */}
      <div className='mt-4 flex items-center justify-between border-t border-gray-100 pt-4'>
        <span className='text-xs text-gray-400'>{categoryName || 'Genel'}</span>
        <Link
          href={`/categories/${event.id}`}
          className='flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80'
        >
          Detaylar <ChevronRight className='h-4 w-4' />
        </Link>
      </div>
    </div>
  )
}

// Category card for suggestions (info only, no navigation)
function CategorySuggestion({ category, icon: Icon }: { category: Category; icon: LucideIcon }) {
  return (
    <div className='flex w-full flex-col items-center rounded-xl border border-gray-100 bg-white p-6 text-center lg:w-auto lg:flex-row lg:gap-4'>
      <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10'>
        <Icon className='h-6 w-6 text-primary' />
      </div>
      <h3 className='mb-1 font-semibold text-gray-900'>{category.title}</h3>
      <p className='text-xs text-gray-400'>{category.events.length} Etkinlik</p>
    </div>
  )
}

export default function CategoriesPage() {
  // State
  const [showCount, setShowCount] = useState(12)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [quickFilter, setQuickFilter] = useState<string>('all')
  const [sortMode, setSortMode] = useState<SortMode>('date_asc')
  const [selectedType, setSelectedType] = useState<EventType>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

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
    <div className='mx-auto min-h-screen max-w-7xl bg-gray-50/50'>
      {/* Header */}
      <div className='border-b border-gray-100 bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-8'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <div className='mb-2 flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary'>
                  <BookOpen className='h-5 w-5 text-white' />
                </div>
                <h1 className='text-2xl font-bold text-gray-900 md:text-3xl'>Tüm Etkinlikler</h1>
              </div>
              <p className='max-w-2xl text-gray-500'>
                2026 yılına ait tüm sınavlar, başvuru tarihleri, tatiller ve önemli günler için geri sayım sayaçları.
              </p>
            </div>
            {/* Create Button */}
            <Button
              onClick={openDrawer}
              className='rounded-xl bg-primary px-4 py-2.5 text-primary-foreground hover:bg-primary/90'
            >
              <Plus className='mr-2 h-5 w-5' />
              Geri Sayım Oluştur
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10'>
        {/* Stats bar - matching reference */}
        <section className='mb-8 space-y-4'>
          <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
            <h2 className='flex items-center gap-3 text-lg font-bold text-gray-900'>
              Tüm Etkinlikler
              <span className='rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-500'>
                {filteredEvents.length} Adet
              </span>
            </h2>
            <div className='flex items-center gap-2'>
              <span className='hidden items-center gap-1 text-sm text-gray-500 sm:flex'>
                <Clock className='h-4 w-4' />
                Son güncelleme: Bugün {format(new Date(), 'HH:mm')}
              </span>
            </div>
          </div>

          {/* Filter Bar - matching reference exactly */}
          <div className='flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center'>
            {/* Search Input */}
            <div className='group relative w-full lg:flex-1'>
              <Search className='absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary' />
              <Input
                type='text'
                placeholder='Kategori içinde ara...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm'
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className='absolute right-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600'
                  type='button'
                >
                  <X className='h-5 w-5' />
                </button>
              )}
            </div>

            {/* Right side filters */}
            <div className='flex w-full flex-wrap items-center gap-3 lg:w-auto'>
              {/* Category Select */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className='w-full min-w-[160px] rounded-lg border-gray-200 bg-gray-50 text-sm font-medium sm:w-auto'>
                  <BookOpen className='mr-2 h-4 w-4 text-gray-400' />
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
                <SelectTrigger className='w-full min-w-[200px] rounded-lg border-gray-200 bg-gray-50 text-sm font-medium sm:w-auto'>
                  <Calendar className='mr-2 h-4 w-4 text-gray-400' />
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
              <div className='hidden h-[42px] w-[104px] items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 sm:flex'>
                <Button
                  variant='ghost'
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'h-full flex-1 rounded-md p-0 transition-all',
                    viewMode === 'grid'
                      ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                      : 'text-gray-400 hover:text-gray-600',
                  )}
                  title='Grid Görünüm'
                >
                  <Grid3X3 className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'h-full flex-1 rounded-md p-0 transition-all',
                    viewMode === 'list'
                      ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                      : 'text-gray-400 hover:text-gray-600',
                  )}
                  title='Liste Görünüm'
                >
                  <List className='h-4 w-4' />
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
                    ? 'border-primary bg-primary text-white shadow-md hover:bg-primary/90'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary',
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
                  ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6'
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
          <div className='rounded-2xl bg-white p-12 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
              <Search className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>Sonuç Bulunamadı</h3>
            <p className='text-gray-500'>
              Arama kriterlerinize uygun etkinlik bulunamadı. Filtreleri değiştirmeyi deneyin.
            </p>
          </div>
        )}

        {/* Category Suggestions */}
        <div className='mt-12'>
          <div className='flex w-full flex-col justify-center gap-4 lg:flex-row'>
            {categories.map((cat) => (
              <CategorySuggestion key={cat.id} category={cat} icon={categoryIcons[cat.slug] || BookOpen} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
