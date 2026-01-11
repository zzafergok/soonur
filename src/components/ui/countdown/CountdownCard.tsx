'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { Clock, Timer, Hourglass } from 'lucide-react'
import { differenceInSeconds, intervalToDuration, Duration } from 'date-fns'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'

import { cn } from '@/utils/utils'

interface CountdownCardProps {
  title: string
  targetDate: Date
  className?: string
  color?: string
  href?: string
}

export function CountdownCard({ title, targetDate, className, color, href }: CountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState<Duration | null>(null)
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const diff = differenceInSeconds(targetDate, now)

      if (diff <= 0) {
        setIsPast(true)
        setTimeLeft(null)
        return
      }

      const duration = intervalToDuration({
        start: now,
        end: targetDate,
      })

      setTimeLeft(duration)
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const calculateProgress = () => {
    if (!timeLeft) return 100
    // Simple mock progress for now, in real app calculate based on start date
    return 65
  }

  const Content = (
    <Card
      className={cn(
        'group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg',
        className,
      )}
    >
      <div className='flex items-start gap-5'>
        {/* Icon Box */}
        <div
          className='flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-sm'
          style={{ backgroundColor: color ? `${color}15` : 'hsl(var(--primary) / 0.1)' }}
        >
          <span style={{ color: color || 'hsl(var(--primary))' }}>{title.charAt(0)}</span>
        </div>

        {/* Content Area */}
        <div className='min-w-0 flex-1'>
          {/* Header: Title & Arrow */}
          <div className='mb-1 flex items-start justify-between'>
            <div>
              <CardTitle className='line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-primary'>
                {title}
              </CardTitle>
              <div className='mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400'>
                {isPast ? 'Tamamlandı' : 'Yaklaşıyor'}
              </div>
            </div>

            <div className='-mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-primary group-hover:text-white'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='transform transition-transform group-hover:translate-x-0.5'
              >
                <path d='M5 12h14' />
                <path d='m12 5 7 7-7 7' />
              </svg>
            </div>
          </div>

          {/* Date & Days Remaining */}
          <div className='mb-3 mt-4 flex items-end justify-between'>
            <span className='text-sm font-medium text-slate-500'>
              {targetDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>

            <div className='text-right'>
              {!isPast ? (
                <>
                  <span className='text-xl font-bold tabular-nums' style={{ color: color || 'hsl(var(--primary))' }}>
                    {timeLeft?.days || 0}
                  </span>
                  <span className='ml-1 text-xs font-bold text-slate-400'>Gün</span>
                </>
              ) : (
                <span className='text-sm font-bold text-slate-400'>Süre Doldu</span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className='h-1.5 w-full overflow-hidden rounded-full bg-slate-100'>
            <div
              className='h-full rounded-full transition-all duration-1000 ease-out'
              style={{
                width: `${calculateProgress()}%`,
                backgroundColor: color || 'hsl(var(--primary))',
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className='block h-full'>
        {Content}
      </Link>
    )
  }

  return Content
}
