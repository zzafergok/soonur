'use client'

import { notFound } from 'next/navigation'

import { useEffect, useState, use } from 'react'

import { tr } from 'date-fns/locale'
import { Calendar, Clock } from 'lucide-react'
import { differenceInDays, differenceInSeconds, intervalToDuration, format, Duration } from 'date-fns'

import { categories, CountdownEvent } from '@/data/countdown-events'

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

// Large countdown unit component
function CountdownUnit({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className='flex flex-col items-center'>
      <div
        className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tabular-nums'
        style={{ color }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className='text-sm sm:text-base md:text-lg font-medium text-gray-500 mt-2 uppercase tracking-wider'>
        {label}
      </div>
    </div>
  )
}

// Separator
function Separator() {
  return (
    <div className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-300 mx-2 sm:mx-4'>
      :
    </div>
  )
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = use(params)

  // Find the event
  let foundEvent: (CountdownEvent & { categoryName: string; categorySlug: string }) | null = null
  for (const cat of categories) {
    const event = cat.events.find((e) => e.id === id)
    if (event) {
      foundEvent = { ...event, categoryName: cat.title, categorySlug: cat.slug }
      break
    }
  }

  if (!foundEvent) {
    notFound()
  }

  const event = foundEvent

  const [timeLeft, setTimeLeft] = useState<Duration | null>(null)
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    const calc = () => {
      const now = new Date()
      const diff = differenceInSeconds(event.targetDate, now)

      if (diff <= 0) {
        setIsPast(true)
        setTimeLeft(null)
        return
      }

      const duration = intervalToDuration({ start: now, end: event.targetDate })
      setTimeLeft(duration)
    }

    calc()
    const timer = setInterval(calc, 1000)
    return () => clearInterval(timer)
  }, [event.targetDate])

  const days = differenceInDays(event.targetDate, new Date())
  const color = event.color || '#2563eb'

  // Progress calculation
  const remainingPercent = Math.max(0, Math.min(100, Math.round((days / 365) * 100)))
  const elapsedPercent = 100 - remainingPercent

  return (
    <div className=''>
      {/* Main Content */}
      <div className='max-w-7xl w-full  flex flex-col gap-8 mx-auto text-center py-24 px-4 lg:32'>
        {/* Event Title */}
        <div className=''>
          <div
            className='inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4'
            style={{ backgroundColor: `${color}15`, color }}
          >
            {event.categoryName}
          </div>
          <h1 className='text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4'>{event.title}</h1>
          <div className='flex items-center justify-center gap-4 text-gray-500'>
            <div className='flex items-center gap-2'>
              <Calendar className='w-5 h-5' />
              <span className='text-base md:text-lg'>
                {format(event.targetDate, 'd MMMM yyyy, EEEE', { locale: tr })}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-5 h-5' />
              <span className='text-base md:text-lg'>
                {event.targetDate.getHours() === 0 && event.targetDate.getMinutes() === 0
                  ? 'Tüm Gün'
                  : format(event.targetDate, 'HH:mm', { locale: tr })}
              </span>
            </div>
          </div>
        </div>

        {/* Large Countdown */}
        <div className='bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12 lg:p-16'>
          {isPast ? (
            <div className='text-center'>
              <div className='text-6xl md:text-8xl font-bold text-gray-300 mb-4'>00:00:00</div>
              <div className='text-xl md:text-2xl text-gray-500'>Bu etkinlik geçmiş</div>
            </div>
          ) : timeLeft ? (
            <>
              {/* Days display */}
              {timeLeft.years || timeLeft.months || timeLeft.days ? (
                <div className='mb-8 md:mb-12'>
                  <div
                    className='text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold leading-none'
                    style={{ color }}
                  >
                    {days > 0 ? days : 0}
                  </div>
                  <div className='text-xl sm:text-2xl md:text-3xl font-medium text-gray-500 mt-2'>Gün Kaldı</div>
                </div>
              ) : null}

              {/* Hours, Minutes, Seconds */}
              <div className='flex items-center justify-center'>
                <CountdownUnit value={timeLeft.hours || 0} label='Saat' color={color} />
                <Separator />
                <CountdownUnit value={timeLeft.minutes || 0} label='Dakika' color={color} />
                <Separator />
                <CountdownUnit value={timeLeft.seconds || 0} label='Saniye' color={color} />
              </div>
            </>
          ) : (
            <div className='text-4xl md:text-6xl font-bold text-gray-400'>Yükleniyor...</div>
          )}
        </div>
      </div>
    </div>
  )
}
