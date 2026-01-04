'use client'

import React, { useEffect, useState } from 'react'
import { differenceInSeconds, intervalToDuration, Duration } from 'date-fns'
import { Timer } from 'lucide-react'

interface HeroCountdownProps {
  title: string
  targetDate: Date
  icon?: React.ReactNode
}

export function HeroCountdown({ title, targetDate, icon }: HeroCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<Duration | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const diff = differenceInSeconds(targetDate, now)

      if (diff <= 0) {
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

  const formatNumber = (num?: number) => String(num || 0).padStart(2, '0')

  return (
    <div className='w-full text-center'>
      <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-primary/20 shadow-sm text-primary text-xs font-bold tracking-wider mb-6'>
        <Timer className='w-3.5 h-3.5' />
        ÖNE ÇIKAN
      </div>

      <h1 className='text-3xl md:text-4xl lg:text-6xl font-bold text-slate-900 mb-2 tracking-tight drop-shadow-sm'>
        {title}'e Kalan Süre
      </h1>
      <p className='text-slate-500 mb-6 text-base font-medium'>
        {targetDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}
      </p>

      <div className='grid grid-cols-6 gap-2 md:gap-3 max-w-5xl mx-auto w-full'>
        <TimeUnit value={timeLeft?.years} label='YIL' />
        <TimeUnit value={timeLeft?.months} label='AY' />
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
    <div className='bg-white rounded-xl md:rounded-2xl p-1.5 md:p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center aspect-square transition-transform hover:scale-105'>
      <span className='text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-0.5 md:mb-1 font-mono tracking-tight tabular-nums'>
        {String(value || 0).padStart(2, '0')}
      </span>
      <span className='text-[8px] sm:text-[9px] md:text-[10px] font-bold text-slate-400 tracking-wider md:tracking-[0.2em] uppercase'>
        {label}
      </span>
    </div>
  )
}
