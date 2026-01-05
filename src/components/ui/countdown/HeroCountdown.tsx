import React, { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import { Timer, Shuffle } from 'lucide-react'
import { Button } from '@/components/core/button'

interface HeroCountdownProps {
  title: string
  targetDate: Date
  icon?: React.ReactNode
  onRandomize?: () => void
}

export function HeroCountdown({ title, targetDate, onRandomize }: HeroCountdownProps) {
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
      <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 shadow-sm text-primary text-xs font-bold tracking-wider mb-8'>
        <Timer className='w-3.5 h-3.5' />
        ÖNE ÇIKAN
      </div>

      <h1 className='text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight drop-shadow-sm'>
        {title}&apos;e Kalan Süre
      </h1>
      <p className='text-slate-500 mb-10 text-lg font-medium'>
        {targetDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}
      </p>

      {/* Countdown Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto w-full mb-10'>
        <TimeUnit value={timeLeft?.days} label='GÜN' />
        <TimeUnit value={timeLeft?.hours} label='SAAT' />
        <TimeUnit value={timeLeft?.minutes} label='DAKİKA' />
        <TimeUnit value={timeLeft?.seconds} label='SANİYE' />
      </div>

      {/* Randomize Button */}
      {onRandomize && (
        <Button
          onClick={onRandomize}
          variant='secondary'
          className='bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 py-6 rounded-xl'
        >
          <Shuffle className='w-4 h-4 mr-2' />
          Rastgele Olay Getir
        </Button>
      )}
    </div>
  )
}

function TimeUnit({ value, label }: { value?: number; label: string }) {
  return (
    <div className='bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center aspect-[4/3] md:aspect-square transition-transform hover:-translate-y-1'>
      <span className='text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2 font-mono tracking-tight tabular-nums'>
        {String(value || 0).padStart(2, '0')}
      </span>
      <span className='text-xs font-bold text-slate-400 tracking-[0.2em] uppercase'>{label}</span>
    </div>
  )
}
