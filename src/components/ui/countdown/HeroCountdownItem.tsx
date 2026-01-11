import React, { useEffect, useState } from 'react'

import { differenceInSeconds } from 'date-fns'

interface HeroCountdownItemProps {
  title: string
  targetDate: Date
}

export function HeroCountdownItem({ title, targetDate }: HeroCountdownItemProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const diffInSeconds = differenceInSeconds(targetDate, now)

      if (diffInSeconds <= 0) {
        setTimeLeft(null)
        return
      }

      const days = Math.floor(diffInSeconds / (3600 * 24))
      const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600)
      const minutes = Math.floor((diffInSeconds % 3600) / 60)
      const seconds = Math.floor(diffInSeconds % 60)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className='w-full text-center'>
      <h2 className='mb-2 flex min-h-[3rem] items-center justify-center text-3xl font-bold tracking-tight text-slate-900 drop-shadow-sm lg:text-4xl'>
        {title}&apos;e Kalan Süre
      </h2>
      <p className='mb-6 text-base font-medium text-slate-500'>
        {targetDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}
      </p>

      {/* Countdown Cards */}
      <div className='mx-auto grid w-full max-w-full grid-cols-4 gap-2 md:gap-4'>
        <TimeUnit value={timeLeft?.days} label='GÜN' />
        <TimeUnit value={timeLeft?.hours} label='SAAT' />
        <TimeUnit value={timeLeft?.minutes} label='DAKİKA' />
        <TimeUnit value={timeLeft?.seconds} label='SANİYE' />
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value?: number; label: string }) {
  return (
    <div className='flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-transform hover:-translate-y-1 md:aspect-square md:p-4'>
      <span className='mb-1 font-mono text-2xl font-bold tabular-nums tracking-tight text-primary md:mb-2 md:text-3xl lg:text-4xl'>
        {String(value || 0).padStart(2, '0')}
      </span>
      <span className='text-[0.6rem] font-bold uppercase tracking-wider text-slate-400 md:text-xs'>{label}</span>
    </div>
  )
}
