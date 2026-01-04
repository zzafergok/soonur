'use client'

import { useMemo } from 'react'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { tr } from 'date-fns/locale'
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'
import { ArrowLeft, Clock, Calendar, CheckCircle, Share2, Trash2, GraduationCap, PartyPopper } from 'lucide-react'

import { Button } from '@/components/core/button'

import { useCustomCountdowns } from '@/hooks/useCustomCountdowns'

import { categories, CountdownEvent } from '@/data/countdown-events'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { customEvents, deleteCustomCountdown } = useCustomCountdowns()

  const { id } = params

  // Find event (Static or Custom)
  const event = useMemo(() => {
    // 1. Search in static events
    let foundEvent: (CountdownEvent & { categoryName?: string; isCustom?: boolean }) | undefined

    categories.some((cat: { title: string; events: CountdownEvent[] }) => {
      const match = cat.events.find((e: CountdownEvent) => e.id === id)
      if (match) {
        foundEvent = { ...match, categoryName: cat.title, isCustom: false }
        return true
      }
      return false
    })

    if (foundEvent) return foundEvent

    // 2. Search in custom events
    const customMatch = customEvents.find((e) => e.id === id)
    if (customMatch) {
      return {
        ...customMatch,
        targetDate: new Date(customMatch.targetDate),
        categoryName: 'Kişisel',
        isCustom: true,
      } as CountdownEvent & { categoryName: string; isCustom: boolean }
    }

    return undefined
  }, [id, customEvents])

  if (!event) {
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4'>
        <div className='text-center space-y-4'>
          <h1 className='text-2xl font-bold text-gray-900'>Etkinlik Bulunamadı</h1>
          <p className='text-gray-500'>Aradığınız geri sayım etkinliği silinmiş veya mevcut değil.</p>
          <Link href='/categories'>
            <Button variant='default'>Geri Dön</Button>
          </Link>
        </div>
      </div>
    )
  }

  const now = new Date()
  const isPast = event.targetDate < now
  const diffDays = Math.abs(differenceInDays(event.targetDate, now))
  const diffHours = Math.abs(differenceInHours(event.targetDate, now)) % 24
  const diffMinutes = Math.abs(differenceInMinutes(event.targetDate, now)) % 60

  const handleDelete = () => {
    if (event.isCustom && window.confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
      deleteCustomCountdown(event.id)
      router.push('/categories')
    }
  }

  // Determine Icon based on type
  const getIcon = () => {
    switch (event.type) {
      case 'exam':
        return GraduationCap
      case 'application_start':
        return Calendar
      case 'application_end':
        return Clock
      case 'result':
        return CheckCircle
      case 'holiday':
        return PartyPopper
      default:
        return Calendar
    }
  }

  const Icon = getIcon()

  return (
    <div className='min-h-screen bg-gray-50 pb-20'>
      {/* Header */}
      <header className='bg-white border-b border-gray-100 sticky top-0 z-10'>
        <div className='max-w-4xl mx-auto px-4 h-16 flex items-center justify-between'>
          <Link href='/categories' className='flex items-center text-gray-500 hover:text-gray-900 transition-colors'>
            <ArrowLeft className='w-5 h-5 mr-2' />
            <span className='font-medium'>Geri Dön</span>
          </Link>

          <div className='flex items-center gap-2'>
            {event.isCustom && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleDelete}
                className='text-red-500 hover:text-red-600 hover:bg-red-50'
              >
                <Trash2 className='w-4 h-4 mr-2' />
                Sil
              </Button>
            )}
            <Button variant='ghost' size='sm'>
              <Share2 className='w-4 h-4 mr-2' />
              Paylaş
            </Button>
          </div>
        </div>
      </header>

      <main className='max-w-4xl mx-auto px-4 py-8 space-y-6'>
        {/* Main Card */}
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='p-8 sm:p-12 text-center space-y-8'>
            {/* Cateogry & Icon */}
            <div className='flex flex-col items-center gap-4'>
              <div
                className='w-16 h-16 rounded-2xl flex items-center justify-center'
                style={{ backgroundColor: `${event.color}20`, color: event.color || '#2563eb' }}
              >
                <Icon className='w-8 h-8' />
              </div>
              <span className='px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600'>
                {event.categoryName}
              </span>
            </div>

            {/* Title */}
            <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 leading-tight'>{event.title}</h1>

            {/* Countdown */}
            <div className='grid grid-cols-3 gap-4 max-w-lg mx-auto py-8 border-t border-b border-gray-100'>
              <div className='text-center'>
                <div className='text-4xl sm:text-5xl font-bold text-gray-900 mb-1'>{diffDays}</div>
                <div className='text-gray-500 font-medium'>Gün</div>
              </div>
              <div className='text-center border-l border-gray-100'>
                <div className='text-4xl sm:text-5xl font-bold text-gray-900 mb-1'>{diffHours}</div>
                <div className='text-gray-500 font-medium'>Saat</div>
              </div>
              <div className='text-center border-l border-gray-100'>
                <div className='text-4xl sm:text-5xl font-bold text-gray-900 mb-1'>{diffMinutes}</div>
                <div className='text-gray-500 font-medium'>Dakika</div>
              </div>
            </div>

            {/* Date Details */}
            <div className='flex items-center justify-center gap-2 text-lg text-gray-600 font-medium'>
              <Calendar className='w-5 h-5' />
              {format(event.targetDate, 'd MMMM yyyy, EEEE', { locale: tr })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
