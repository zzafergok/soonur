'use client'

import React, { useState } from 'react'

import { ChevronLeft, ChevronRight, Timer, Shuffle } from 'lucide-react'

import { HeroCountdownGroup } from './HeroCountdownGroup'

import { Button } from '@/components/core/button'

import { CountdownEvent } from '@/data/countdown-events'

import { cn } from '@/utils/utils'

interface HeroSliderProps {
  groups: CountdownEvent[][]
  onRandomize?: () => void
}

export function HeroSlider({ groups, onRandomize }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? groups.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === groups.length - 1 ? 0 : prev + 1))
  }

  if (!groups || groups.length === 0) return null

  return (
    <div className='mx-auto w-full max-w-7xl'>
      <div className='flex w-full flex-col items-center text-center'>
        {/* Header Badge */}
        <div className='mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold tracking-wider text-primary shadow-sm'>
          <Timer className='h-3.5 w-3.5' />
          ÖNE ÇIKAN
        </div>

        {/* Slider Container */}
        <div className='relative mb-10 w-full'>
          {/* Navigation Buttons - Absolute positioned */}
          {groups.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className='absolute left-0 top-1/2 z-10 -ml-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:scale-110 hover:border-primary hover:text-primary disabled:opacity-50 md:-ml-12 lg:-ml-16'
                aria-label='Önceki'
              >
                <ChevronLeft className='h-5 w-5' />
              </button>

              <button
                onClick={handleNext}
                className='absolute right-0 top-1/2 z-10 -mr-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:scale-110 hover:border-primary hover:text-primary disabled:opacity-50 md:-mr-12 lg:-mr-16'
                aria-label='Sonraki'
              >
                <ChevronRight className='h-5 w-5' />
              </button>
            </>
          )}

          {/* Slider Content */}
          <div className='overflow-hidden px-1'>
            <div
              className='flex transition-transform duration-500 ease-in-out'
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {groups.map((group, index) => (
                <div key={index} className='w-full flex-shrink-0 px-2'>
                  <HeroCountdownGroup events={group} />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Indicators */}
          {groups.length > 1 && (
            <div className='mt-8 flex justify-center gap-2'>
              {groups.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all duration-300',
                    currentIndex === index ? 'w-6 bg-primary' : 'bg-slate-300 hover:bg-slate-400',
                  )}
                  aria-label={`${index + 1}. slayta git`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Randomize Button */}
        <Button
          onClick={() => {
            if (onRandomize) {
              onRandomize()
            } else {
              let nextIndex = Math.floor(Math.random() * groups.length)
              // Prevention of picking same slide if possible
              if (groups.length > 1) {
                while (nextIndex === currentIndex) {
                  nextIndex = Math.floor(Math.random() * groups.length)
                }
              }
              setCurrentIndex(nextIndex)
            }
          }}
          variant='secondary'
          className='rounded-xl bg-slate-100 px-6 py-6 font-medium text-slate-700 hover:bg-slate-200'
        >
          <Shuffle className='mr-2 h-4 w-4' />
          Rastgele Olay Getir
        </Button>
      </div>
    </div>
  )
}
