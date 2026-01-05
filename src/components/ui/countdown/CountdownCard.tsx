'use client'

import React, { useEffect, useState } from 'react'

import { Clock, Timer, Hourglass } from 'lucide-react'
import { differenceInSeconds, intervalToDuration, Duration } from 'date-fns'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'

import { cn } from '@/utils/utils'

interface CountdownCardProps {
  title: string
  targetDate: Date
  className?: string
  color?: string
}

export function CountdownCard({ title, targetDate, className, color }: CountdownCardProps) {
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

  return (
    <Card
      className={cn(
        'group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 p-6',
        className,
      )}
    >
      <div className='flex items-start gap-5'>
        {/* Icon Box */}
        <div
          className='w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold shadow-sm'
          style={{ backgroundColor: color ? `${color}15` : 'hsl(var(--primary) / 0.1)' }}
        >
          <span style={{ color: color || 'hsl(var(--primary))' }}>{title.charAt(0)}</span>
        </div>

        {/* Content Area */}
        <div className='flex-1 min-w-0'>
          {/* Header: Title & Arrow */}
          <div className='flex items-start justify-between mb-1'>
            <div>
              <CardTitle className='font-bold text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-1'>
                {title}
              </CardTitle>
              <div className='text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider'>
                {isPast ? 'Tamamlandı' : 'Yaklaşıyor'}
              </div>
            </div>

            <div className='w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 -mr-1'>
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
                className='transform group-hover:translate-x-0.5 transition-transform'
              >
                <path d='M5 12h14' />
                <path d='m12 5 7 7-7 7' />
              </svg>
            </div>
          </div>

          {/* Date & Days Remaining */}
          <div className='flex items-end justify-between mt-4 mb-3'>
            <span className='text-sm font-medium text-slate-500'>
              {targetDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>

            <div className='text-right'>
              {!isPast ? (
                <>
                  <span className='text-xl font-bold tabular-nums' style={{ color: color || 'hsl(var(--primary))' }}>
                    {timeLeft?.days || 0}
                  </span>
                  <span className='text-xs font-bold text-slate-400 ml-1'>Gün</span>
                </>
              ) : (
                <span className='text-sm font-bold text-slate-400'>Süre Doldu</span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className='h-1.5 w-full bg-slate-100 rounded-full overflow-hidden'>
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
}
