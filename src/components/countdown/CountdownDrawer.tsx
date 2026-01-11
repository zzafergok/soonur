'use client'

import React, { useEffect } from 'react'

import * as z from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

const COLORS = ['hsl(var(--primary))', '#3b82f6', '#ef4444', '#f59e0b', '#a855f7', '#6b7280'] as const

// Form Schema
const formSchema = z.object({
  title: z.string().min(1, 'Etkinlik adı zorunludur'),
  targetDate: z.date({
    required_error: 'Tarih ve saat seçimi zorunludur',
    invalid_type_error: 'Geçersiz tarih formatı',
  }),
  type: z.enum(['exam', 'application_start', 'application_end', 'result', 'holiday'] as const),
  color: z.string(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CountdownDrawer({
  open,
  onOpenChange,
  onSubmit,
  editEvent,
  onUpdate,
  onSuccess,
}: CountdownDrawerProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'exam',
      color: COLORS[0],
      notes: '',
    },
  })

  // Populate form when editing or reset when opening new
  useEffect(() => {
    if (open) {
      if (editEvent) {
        form.reset({
          title: editEvent.title,
          targetDate: new Date(editEvent.targetDate),
          type: (editEvent.type as EventType) || 'exam',
          color: editEvent.color,
          notes: editEvent.notes || '',
        })
      } else {
        form.reset({
          title: '',
          targetDate: undefined,
          type: 'exam',
          color: COLORS[0],
          notes: '',
        })
      }
    }
  }, [editEvent, open, form])

  const handleSubmit = (values: FormValues) => {
    const data = {
      title: values.title.trim(),
      targetDate: values.targetDate.toISOString(),
      color: values.color,
      priority: 1,
      type: values.type,
      notes: values.notes?.trim() || undefined,
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

  return (
    <ModernDrawer
      open={open}
      onOpenChange={onOpenChange}
      size='md'
      placement='right'
      title={editEvent ? 'Geri Sayımı Düzenle' : 'Yeni Geri Sayım'}
      className='bg-white'
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className='flex h-full flex-col'>
        <div className='flex-1 space-y-6'>
          {/* Description */}
          <p className='text-sm text-gray-500'>Takviminize yeni bir etkinlik ekleyin.</p>

          {/* Event Title */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>
              Etkinlik Adı <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <Pencil className='absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Controller
                name='title'
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type='text'
                    placeholder='Örn: KPSS 2024'
                    className={cn(
                      'border-gray-200 bg-gray-50 pl-10 transition-all focus:border-primary',
                      form.formState.errors.title && 'border-red-500 focus:border-red-500',
                    )}
                  />
                )}
              />
            </div>
            {form.formState.errors.title && (
              <p className='text-xs text-red-500'>{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>
              Tarih ve Saat <span className='text-red-500'>*</span>
            </label>
            <Controller
              name='targetDate'
              control={form.control}
              render={({ field }) => (
                <ModernDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder='Tarih ve saat seçin'
                  includeTime={true}
                  minDate={new Date()}
                  showQuickSelect={false}
                  className={cn('w-full', form.formState.errors.targetDate && 'border-red-500 ring-red-500')}
                />
              )}
            />
            {form.formState.errors.targetDate && (
              <p className='text-xs text-red-500'>{form.formState.errors.targetDate.message}</p>
            )}
          </div>

          {/* Event Type Selection */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>Etkinlik Türü</label>
            <Controller
              name='type'
              control={form.control}
              render={({ field }) => (
                <div className='grid grid-cols-1 gap-3'>
                  {EVENT_TYPES.map((type) => {
                    const Icon = type.icon
                    const isSelected = field.value === type.id
                    return (
                      <Button
                        key={type.id}
                        type='button'
                        variant='ghost'
                        onClick={() => field.onChange(type.id)}
                        className={cn(
                          'group relative flex h-auto items-center justify-start gap-4 overflow-hidden rounded-xl border p-4 transition-all duration-200',
                          isSelected
                            ? 'border-primary bg-primary text-white shadow-md'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-colors',
                            isSelected ? 'bg-white' : 'bg-gray-50 group-hover:bg-white',
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-6 w-6 transition-colors',
                              isSelected ? 'text-primary' : 'text-gray-500 group-hover:text-primary',
                            )}
                          />
                        </div>
                        <div className='flex flex-col items-start gap-1'>
                          <span className={cn('text-base font-semibold', isSelected ? 'text-white' : 'text-gray-900')}>
                            {type.label}
                          </span>
                          {isSelected && (
                            <span className='animate-in fade-in slide-in-from-left-1 text-xs font-medium text-white/90'>
                              Seçildi
                            </span>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                            <div className='animate-in zoom-in flex h-6 w-6 items-center justify-center rounded-full bg-white'>
                              <Check className='h-3.5 w-3.5 text-primary' />
                            </div>
                          </div>
                        )}
                      </Button>
                    )
                  })}
                </div>
              )}
            />
          </div>

          {/* Color Theme */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>Renk Teması</label>
            <Controller
              name='color'
              control={form.control}
              render={({ field }) => (
                <div className='flex gap-3'>
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type='button'
                      onClick={() => field.onChange(c)}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full transition-transform',
                        field.value === c ? 'scale-110 ring-2 ring-offset-2' : 'hover:scale-105',
                      )}
                      style={
                        {
                          backgroundColor: c,
                          '--tw-ring-color': c,
                        } as React.CSSProperties
                      }
                    >
                      {field.value === c && <Check className='h-5 w-5 text-white' />}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Notes - Using Textarea component */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900'>
              Notlar <span className='font-normal text-gray-400'>(İsteğe Bağlı)</span>
            </label>
            <Controller
              name='notes'
              control={form.control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder='Bu geri sayım için kısa bir açıklama ekleyin...'
                  rows={3}
                  className='resize-none border-gray-200 bg-gray-50'
                />
              )}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className='mt-6 space-y-3 border-t border-gray-100 pt-4'>
          <Button
            type='submit'
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            className='w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90'
          >
            <Check className='mr-2 h-5 w-5' />
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
