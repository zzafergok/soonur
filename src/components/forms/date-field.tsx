'use client'

import { AlertCircle } from 'lucide-react'
import { useFormContext, Controller } from 'react-hook-form'

import { Label } from '@/components/core/label'
import { ModernDatePicker } from '@/components/core/modern-date-picker'

import { cn } from '@/utils/utils'

interface DateFieldProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  description?: string
  className?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  clearable?: boolean
  includeTime?: boolean
}

export function DateField({
  name,
  label,
  placeholder,
  required = false,
  description,
  className,
  disabled,
  minDate,
  maxDate,
  clearable = true,
  includeTime = false,
}: DateFieldProps) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext()

  // Get nested error if field name contains dots
  const error = name.split('.').reduce((obj: any, key) => obj?.[key], errors)

  const isDisabled = disabled || isSubmitting

  return (
    <div className={cn('space-y-1.5 sm:space-y-2', className)}>
      <Label htmlFor={name} className='text-xs sm:text-sm'>
        {label} {required && <span className='text-red-500'>*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ModernDatePicker
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            disabled={isDisabled}
            minDate={minDate}
            maxDate={maxDate}
            clearable={clearable}
            includeTime={includeTime}
            error={!!error}
            className='text-xs sm:text-sm'
          />
        )}
      />
      {description && !error && <p className='text-[10px] sm:text-xs text-muted-foreground'>{description}</p>}
      {error && (
        <p className='text-[10px] sm:text-xs text-red-500 flex items-center gap-1'>
          <AlertCircle className='w-3 h-3' />
          {error.message as string}
        </p>
      )}
    </div>
  )
}
