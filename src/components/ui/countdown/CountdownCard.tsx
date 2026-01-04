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
        'group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full',
        className,
      )}
    >
      {/* Top Section */}
      <CardHeader className='flex flex-row items-start justify-between space-y-0 p-6 pb-8'>
        <div className='flex items-center gap-4'>
          {/* Icon Box */}
          <div
            className='w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-sm'
            style={{ backgroundColor: color ? `${color}15` : 'hsl(var(--primary) / 0.1)' }} // Light background
          >
            <span style={{ color: color || 'hsl(var(--primary))' }}>{title.charAt(0)}</span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <CardTitle className='font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1 mb-1'>
              {title}
            </CardTitle>
            <span className='text-xs font-semibold text-gray-400 uppercase tracking-wide'>GENEL</span>
          </div>
        </div>

        {/* Arrow Button */}
        <div className='w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
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
      </CardHeader>

      {/* Bottom Section */}
      <CardContent className='mt-auto p-6 pt-0'>
        {/* Date & Days Row */}
        <div className='flex items-center justify-between mb-4'>
          <span className='text-sm font-medium text-gray-500 whitespace-nowrap'>
            {targetDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>

          <div
            className='text-sm font-bold flex items-center gap-x-1.5 whitespace-nowrap'
            style={{ color: color || 'hsl(var(--primary))' }}
          >
            {timeLeft ? (
              <>
                {timeLeft.months ? <span>{timeLeft.months}Ay</span> : null}
                {timeLeft.days ? <span>{timeLeft.days}G</span> : null}
                {timeLeft.hours !== undefined && (
                  <span className='flex items-center gap-0.5'>
                    {timeLeft.hours}
                    <Clock className='w-3 h-3' />
                  </span>
                )}
                {timeLeft.minutes !== undefined && (
                  <span className='flex items-center gap-0.5'>
                    {timeLeft.minutes}
                    <Timer className='w-3 h-3' />
                  </span>
                )}
                <span className='flex items-center gap-0.5'>
                  {timeLeft.seconds}
                  <Hourglass className='w-3 h-3' />
                </span>
              </>
            ) : (
              '0 Sn'
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className='h-2 w-full bg-gray-100 rounded-full overflow-hidden'>
          <div
            className='h-full rounded-full transition-all duration-1000 ease-out'
            style={{ width: `${calculateProgress()}%`, backgroundColor: color || '#2563eb' }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
