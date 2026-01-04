'use client'

import { AlertCircle } from 'lucide-react'
import { useFormContext, Controller } from 'react-hook-form'

import { Label } from '@/components/core/label'

import { cn } from '@/utils/utils'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface RadioFieldProps {
  name: string
  label: string
  options: RadioOption[]
  required?: boolean
  description?: string
  className?: string
  disabled?: boolean
  orientation?: 'vertical' | 'horizontal'
}

export function RadioField({
  name,
  label,
  options,
  required = false,
  description,
  className,
  disabled,
  orientation = 'vertical',
}: RadioFieldProps) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext()

  // Get nested error if field name contains dots
  const error = name.split('.').reduce((obj: any, key) => obj?.[key], errors)

  const isDisabled = disabled || isSubmitting

  return (
    <div className={cn('space-y-1.5 sm:space-y-2', className)}>
      <Label className='text-xs sm:text-sm'>
        {label} {required && <span className='text-red-500'>*</span>}
      </Label>
      {description && !error && <p className='text-[10px] sm:text-xs text-muted-foreground'>{description}</p>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div
            className={cn(
              orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2',
              error && 'border-red-500',
            )}
          >
            {options.map((option) => (
              <div key={option.value} className='flex items-start space-x-2 sm:space-x-3'>
                <input
                  type='radio'
                  id={`${name}-${option.value}`}
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={() => field.onChange(option.value)}
                  disabled={option.disabled || isDisabled}
                  className='mt-0.5 h-4 w-4 text-primary disabled:cursor-not-allowed disabled:opacity-50'
                />
                <div className='flex-1 space-y-1'>
                  <Label
                    htmlFor={`${name}-${option.value}`}
                    className={cn(
                      'text-xs sm:text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                    )}
                  >
                    {option.label}
                  </Label>
                  {option.description && (
                    <p className='text-[10px] sm:text-xs text-muted-foreground'>{option.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      />
      {error && (
        <p className='text-[10px] sm:text-xs text-red-500 flex items-center gap-1'>
          <AlertCircle className='w-3 h-3' />
          {error.message as string}
        </p>
      )}
    </div>
  )
}
