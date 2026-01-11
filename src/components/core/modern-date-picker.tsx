'use client'

import React, { useState, useMemo } from 'react'

import { Calendar, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/core/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

import { cn } from '@/utils/utils'

interface ModernDatePickerProps {
  value?: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
  error?: boolean
  includeTime?: boolean
}

const MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

const DAYS = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa']

const QUICK_DATES = [
  { label: 'Bugün', getValue: () => new Date() },
  { label: 'Yarın', getValue: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
  { label: '1 Hafta Sonra', getValue: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  { label: '2 Hafta Sonra', getValue: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  { label: '1 Ay Sonra', getValue: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
]

export function ModernDatePicker({
  value,
  onChange,
  placeholder = 'Tarih seçin',
  disabled = false,
  clearable = true,
  minDate,
  maxDate,
  className,
  error = false,
  includeTime = false,
  showQuickSelect = true,
}: ModernDatePickerProps & { showQuickSelect?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value?.getMonth() ?? new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(value?.getFullYear() ?? new Date().getFullYear())

  // Format displayed date
  const displayValue = useMemo(() => {
    if (!value) return placeholder
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }

    if (includeTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }

    return value.toLocaleDateString('tr-TR', options)
  }, [value, placeholder, includeTime])

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const startDate = new Date(firstDay)
    const endDate = new Date(lastDay)

    // Adjust to start from Monday
    const startDay = (firstDay.getDay() + 6) % 7
    startDate.setDate(firstDay.getDate() - startDay)

    // Adjust to end on Sunday
    const endDay = (lastDay.getDay() + 6) % 7
    endDate.setDate(lastDay.getDate() + (6 - endDay))

    const days = []
    const current = new Date(startDate)

    while (current <= endDate) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }, [currentMonth, currentYear])

  const handleDateSelect = (date: Date) => {
    if (includeTime) {
      // Set time to start of day (00:00:00.000Z) for consistent ISO datetime format
      const dateWithTime = new Date(date)
      dateWithTime.setHours(0, 0, 0, 0)
      onChange(dateWithTime)
    } else {
      onChange(date)
    }
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
  }

  const handleQuickDateSelect = (quickDate: (typeof QUICK_DATES)[0]) => {
    const date = quickDate.getValue()
    if (includeTime) {
      // Set time to start of day (00:00:00.000Z) for consistent ISO datetime format
      date.setHours(0, 0, 0, 0)
    }
    onChange(date)
    setIsOpen(false)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const isDateSelected = (date: Date) => {
    if (!value) return false
    return date.toDateString() === value.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'h-10 w-full justify-start px-3 py-2 text-left font-normal',
            !value && 'text-muted-foreground',
            error && 'border-red-500 focus:border-red-500',
            'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            'transition-all duration-200',
            className,
          )}
          disabled={disabled}
        >
          <Calendar className='mr-2 h-4 w-4 shrink-0 text-gray-500' />
          <span className='truncate'>{displayValue}</span>
          {clearable && value && !disabled && (
            <X
              className='ml-auto h-4 w-4 shrink-0 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300'
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className='z-[10001] w-auto border border-gray-200 p-0 shadow-lg dark:border-gray-700'
        align='start'
      >
        <div className='flex flex-col sm:flex-row'>
          {/* Quick dates sidebar */}
          {showQuickSelect && (
            <div className='flex max-w-full gap-2 overflow-x-auto border-b border-gray-200 p-3 dark:border-gray-700 sm:max-w-[100px] sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r'>
              <div className='mb-0 hidden text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:mb-2 sm:block'>
                Hızlı Seçim
              </div>
              <div className='flex gap-1 sm:flex-col'>
                {QUICK_DATES.map((quickDate, index) => (
                  <Button
                    key={index}
                    variant='ghost'
                    size='sm'
                    className='h-8 justify-center whitespace-nowrap px-2 text-xs font-normal hover:bg-primary/5 dark:hover:bg-primary/20 sm:justify-start'
                    onClick={() => handleQuickDateSelect(quickDate)}
                  >
                    {quickDate.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Calendar */}
          <div className='p-3'>
            {/* Calendar header */}
            <div className='mb-4 flex items-center justify-between'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => navigateMonth('prev')}
                className='h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>

              <div className='min-w-[120px] text-center text-sm font-semibold text-gray-900 dark:text-gray-100'>
                {MONTHS[currentMonth]} {currentYear}
              </div>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => navigateMonth('next')}
                className='h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>

            {/* Days header */}
            <div className='mb-2 grid grid-cols-7 gap-1'>
              {DAYS.map((day) => (
                <div
                  key={day}
                  className='flex h-8 items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400'
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className='grid grid-cols-7 gap-1'>
              {calendarDays.map((date, index) => {
                const selected = isDateSelected(date)
                const today = isToday(date)
                const currentMonthDate = isCurrentMonth(date)
                const disabled = isDateDisabled(date)

                return (
                  <Button
                    key={index}
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'relative h-8 w-8 p-0 text-sm font-normal',
                      !currentMonthDate && 'text-gray-300 dark:text-gray-600',
                      currentMonthDate &&
                        !selected &&
                        'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                      selected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                      today &&
                        !selected &&
                        'bg-primary/10 font-semibold text-primary dark:bg-primary/20 dark:text-primary',
                      disabled && 'cursor-not-allowed opacity-50',
                    )}
                    onClick={() => {
                      if (!disabled) {
                        // Create new date preserving existing time if present, else default to 09:00 or current?
                        // If value exists, keep its time. If not, maybe 09:00?
                        const newDate = new Date(date)
                        if (value && includeTime) {
                          newDate.setHours(value.getHours(), value.getMinutes(), 0, 0)
                        } else if (includeTime) {
                          newDate.setHours(9, 0, 0, 0) // Default start time
                        } else {
                          newDate.setHours(0, 0, 0, 0)
                        }

                        onChange(newDate)
                        if (!includeTime) {
                          setIsOpen(false)
                        }
                      }
                    }}
                    disabled={disabled}
                  >
                    {date.getDate()}
                    {today && !selected && (
                      <div className='absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-primary dark:bg-primary' />
                    )}
                  </Button>
                )
              })}
            </div>

            {/* Time Selection */}
            {includeTime && (
              <div className='mt-4 border-t border-gray-100 pt-3 dark:border-gray-700'>
                <div className='mb-2 flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-gray-500' />
                  <span className='text-xs font-semibold uppercase text-gray-500'>Saat Seçimi</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Select
                    value={value ? value.getHours().toString() : '9'}
                    onValueChange={(val) => {
                      const newDate = value ? new Date(value) : new Date()
                      newDate.setHours(parseInt(val), newDate.getMinutes(), 0, 0)
                      onChange(newDate)
                    }}
                  >
                    <SelectTrigger className='h-8 w-[70px] text-xs'>
                      <SelectValue placeholder='Saat' />
                    </SelectTrigger>
                    <SelectContent className='max-h-[200px]'>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className='text-gray-400'>:</span>
                  <Select
                    value={value ? value.getMinutes().toString() : '0'}
                    onValueChange={(val) => {
                      const newDate = value ? new Date(value) : new Date()
                      newDate.setHours(newDate.getHours(), parseInt(val), 0, 0)
                      onChange(newDate)
                    }}
                  >
                    <SelectTrigger className='h-8 w-[70px] text-xs'>
                      <SelectValue placeholder='Dk' />
                    </SelectTrigger>
                    <SelectContent className='max-h-[200px]'>
                      {Array.from({ length: 12 }).map((_, i) => {
                        const m = i * 5
                        return (
                          <SelectItem key={m} value={m.toString()}>
                            {m.toString().padStart(2, '0')}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className='mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700'>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                {value
                  ? value.toLocaleDateString('tr-TR', includeTime ? { hour: '2-digit', minute: '2-digit' } : undefined)
                  : 'Tarih seçilmedi'}
              </div>
              <Button size='sm' variant='outline' onClick={() => setIsOpen(false)} className='h-7 px-3 text-xs'>
                Tamam
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
