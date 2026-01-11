'use client'

import { useEffect, useState } from 'react'
import { tr } from 'date-fns/locale'
import { Calendar, Clock } from 'lucide-react'
import { differenceInDays, differenceInSeconds, intervalToDuration, format, Duration } from 'date-fns'
import { CountdownEvent } from '@/data/countdown-events'

interface EventDetailClientProps {
  event: CountdownEvent & { categoryName: string; categorySlug: string }
}

// Large countdown unit component
function CountdownUnit({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className='flex flex-col items-center'>
      <div
        className='text-5xl font-bold tabular-nums sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl'
        style={{ color }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className='mt-2 text-sm font-medium uppercase tracking-wider text-gray-500 sm:text-base md:text-lg'>
        {label}
      </div>
    </div>
  )
}

// Separator
function Separator() {
  return (
    <div className='mx-2 text-4xl font-bold text-gray-300 sm:mx-4 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'>
      :
    </div>
  )
}

export function EventDetailClient({ event }: EventDetailClientProps) {
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

  return (
    <div className=''>
      {/* Main Content */}
      <div className='lg:32 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-24 text-center'>
        {/* Event Title */}
        <div className=''>
          <div
            className='mb-4 inline-block rounded-full px-4 py-2 text-sm font-semibold'
            style={{ backgroundColor: `${color}15`, color }}
          >
            {event.categoryName}
          </div>
          <h1 className='mb-4 text-2xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl'>{event.title}</h1>
          <div className='flex items-center justify-center gap-4 text-gray-500'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              <span className='text-base md:text-lg'>
                {format(event.targetDate, 'd MMMM yyyy, EEEE', { locale: tr })}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='h-5 w-5' />
              <span className='text-base md:text-lg'>
                {event.targetDate.getHours() === 0 && event.targetDate.getMinutes() === 0
                  ? 'Tüm Gün'
                  : format(event.targetDate, 'HH:mm', { locale: tr })}
              </span>
            </div>
          </div>
        </div>

        {/* Large Countdown */}
        <div className='rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8 md:p-12 lg:p-16'>
          {isPast ? (
            <div className='text-center'>
              <div className='mb-4 text-6xl font-bold text-gray-300 md:text-8xl'>00:00:00</div>
              <div className='text-xl text-gray-500 md:text-2xl'>Bu etkinlik geçmiş</div>
            </div>
          ) : timeLeft ? (
            <>
              {/* Days display */}
              {timeLeft.years || timeLeft.months || timeLeft.days ? (
                <div className='mb-8 md:mb-12'>
                  <div
                    className='text-7xl font-bold leading-none sm:text-8xl md:text-9xl lg:text-[12rem]'
                    style={{ color }}
                  >
                    {days > 0 ? days : 0}
                  </div>
                  <div className='mt-2 text-xl font-medium text-gray-500 sm:text-2xl md:text-3xl'>Gün Kaldı</div>
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
            <div className='text-4xl font-bold text-gray-400 md:text-6xl'>Yükleniyor...</div>
          )}
        </div>
      </div>
    </div>
  )
}
