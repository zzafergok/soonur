'use client'

import React, { useState, useEffect } from 'react'

import { Pencil, GraduationCap, Calendar, Clock, CheckCircle, Check, PartyPopper } from 'lucide-react'

import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'
import { Textarea } from '@/components/core/textarea'
import { ModernDrawer } from '@/components/core/modern-drawer'
import { ModernDatePicker } from '@/components/core/modern-date-picker'

import { CustomCountdownEvent } from '@/hooks/useCustomCountdowns'

import { cn } from '@/utils/utils'

interface CountdownDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<CustomCountdownEvent, 'id' | 'isCustom' | 'createdAt'>) => void
  editEvent?: CustomCountdownEvent | null
  onUpdate?: (id: string, data: Partial<Omit<CustomCountdownEvent, 'id' | 'isCustom' | 'createdAt'>>) => void
  onSuccess?: () => void
}

// Type values matching countdown-events.ts
const EVENT_TYPES = [
  { id: 'exam', label: 'Sınav', icon: GraduationCap, color: '#3b82f6' },
  { id: 'application_start', label: 'Başvuru Başlangıç', icon: Calendar, color: '#10b981' },
  { id: 'application_end', label: 'Son Başvuru', icon: Clock, color: '#f59e0b' },
  { id: 'result', label: 'Sonuç Açıklama', icon: CheckCircle, color: '#a855f7' },
  { id: 'holiday', label: 'Tatil / Özel Gün', icon: PartyPopper, color: '#ec4899' },
] as const

type EventType = (typeof EVENT_TYPES)[number]['id']

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#a855f7', '#6b7280'] as const

export function CountdownDrawer({
  open,
  onOpenChange,
  onSubmit,
  editEvent,
  onUpdate,
  onSuccess,
}: CountdownDrawerProps) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [color, setColor] = useState<string>(COLORS[0])
  const [eventType, setEventType] = useState<EventType>('exam')

  // Populate form when editing
  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title)
      setTargetDate(new Date(editEvent.targetDate))
      setEventType(editEvent.type || 'exam')
      setColor(editEvent.color)
      setNotes(editEvent.notes || '')
    } else {
      // Reset form for new entry
      setTitle('')
      setTargetDate(null)
      setEventType('exam')
      setColor(COLORS[0])
      setNotes('')
    }
  }, [editEvent, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !targetDate) {
      return
    }

    const data = {
      title: title.trim(),
      targetDate: targetDate.toISOString(),
      color,
      priority: 1,
      type: eventType,
      notes: notes.trim() || undefined,
    }

    if (editEvent && onUpdate) {
      onUpdate(editEvent.id, data)
    } else {
      onSubmit(data)
    }

    if (onSuccess) {
      onSuccess()
    } else {
      onOpenChange(false)
    }
  }

  const isValid = title.trim() && targetDate

  return (
    <ModernDrawer
      open={open}
      onOpenChange={onOpenChange}
      size='md'
      placement='right'
      title={editEvent ? 'Geri Sayımı Düzenle' : 'Yeni Geri Sayım'}
      className='bg-white'
    >
      <form onSubmit={handleSubmit} className='flex flex-col h-full'>
        <div className='flex-1 space-y-6'>
          {/* Description */}
          <p className='text-sm text-gray-500'>Takviminize yeni bir etkinlik ekleyin.</p>

          {/* Event Title */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>Etkinlik Adı</label>
            <div className='relative'>
              <Pencil className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10' />
              <Input
                type='text'
                placeholder='Örn: KPSS 2024'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all'
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>Tarih ve Saat</label>
            <ModernDatePicker
              value={targetDate}
              onChange={setTargetDate}
              placeholder='Tarih ve saat seçin'
              includeTime={true}
              minDate={new Date()}
              showQuickSelect={false}
              className='w-full'
            />
          </div>

          {/* Event Type Selection */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>Etkinlik Türü</label>
            <div className='grid grid-cols-1 gap-3'>
              {EVENT_TYPES.map((type) => {
                const Icon = type.icon
                const isSelected = eventType === type.id
                return (
                  <Button
                    key={type.id}
                    type='button'
                    variant='ghost'
                    onClick={() => setEventType(type.id)}
                    className={cn(
                      'flex items-center justify-start gap-4 p-4 h-auto rounded-xl border transition-all duration-200 group relative overflow-hidden',
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm text-gray-700',
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                        isSelected ? 'bg-white' : 'bg-gray-50 group-hover:bg-white',
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-6 h-6 transition-colors',
                          isSelected ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500',
                        )}
                        style={isSelected ? { color: type.color } : undefined}
                      />
                    </div>
                    <div className='flex flex-col items-start gap-1'>
                      <span className={cn('font-semibold text-base', isSelected ? 'text-blue-900' : 'text-gray-900')}>
                        {type.label}
                      </span>
                      {isSelected && (
                        <span className='text-xs text-blue-600 font-medium animate-in fade-in slide-in-from-left-1'>
                          Seçildi
                        </span>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                        <div className='w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center animate-in zoom-in'>
                          <Check className='w-3.5 h-3.5 text-white' />
                        </div>
                      </div>
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Color Theme */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>Renk Teması</label>
            <div className='flex gap-3'>
              {COLORS.map((c) => (
                <button
                  key={c}
                  type='button'
                  onClick={() => setColor(c)}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-transform',
                    color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105',
                  )}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className='w-5 h-5 text-white' />}
                </button>
              ))}
            </div>
          </div>

          {/* Notes - Using Textarea component */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>
              Notlar <span className='text-gray-400 font-normal'>(İsteğe Bağlı)</span>
            </label>
            <Textarea
              placeholder='Bu geri sayım için kısa bir açıklama ekleyin...'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className='bg-gray-50 border-gray-200 resize-none'
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className='mt-6 pt-4 border-t border-gray-100 space-y-3'>
          <Button
            type='submit'
            disabled={!isValid}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold'
          >
            <Check className='w-5 h-5 mr-2' />
            {editEvent ? 'Değişiklikleri Kaydet' : 'Geri Sayım Oluştur'}
          </Button>
          <Button type='button' variant='ghost' onClick={() => onOpenChange(false)} className='w-full'>
            İptal Et
          </Button>
        </div>
      </form>
    </ModernDrawer>
  )
}
