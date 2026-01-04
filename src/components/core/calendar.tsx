'use client'

import React, { useState, useMemo } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/core/button'

import { cn } from '@/utils/utils'

interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range'
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function Calendar({ mode: _mode = 'single', selected, onSelect, disabled, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(selected || new Date())

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }, [currentDate])

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (date: Date) => {
    if (disabled && disabled(date)) return
    onSelect?.(date)
  }

  const isSelected = (date: Date | null) => {
    if (!date || !selected) return false
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    )
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className={cn('p-3', className)}>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <Button variant='ghost' size='icon' onClick={handlePreviousMonth} className='h-7 w-7'>
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <div className='text-sm font-semibold'>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <Button variant='ghost' size='icon' onClick={handleNextMonth} className='h-7 w-7'>
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>

      {/* Days of week */}
      <div className='grid grid-cols-7 gap-1 mb-2'>
        {DAYS.map((day) => (
          <div
            key={day}
            className='text-center text-xs font-medium text-muted-foreground h-8 flex items-center justify-center'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className='grid grid-cols-7 gap-1'>
        {daysInMonth.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className='h-8' />
          }

          const isDisabled = disabled && disabled(date)
          const selected = isSelected(date)
          const today = isToday(date)

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={cn(
                'h-8 w-8 text-sm rounded-md flex items-center justify-center transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:outline-none',
                selected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                today && !selected && 'border border-primary',
                isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
