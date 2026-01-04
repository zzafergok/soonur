'use client'

import { AlertCircle } from 'lucide-react'
import { useFormContext, Controller } from 'react-hook-form'

import { Label } from '@/components/core/label'
import { Checkbox } from '@/components/core/checkbox'

import { cn } from '@/utils/utils'

interface CheckboxFieldProps {
  name: string
  label: React.ReactNode
  description?: string
  className?: string
  disabled?: boolean
  required?: boolean
}

export function CheckboxField({ name, label, description, className, disabled, required = false }: CheckboxFieldProps) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext()

  // Get nested error if field name contains dots
  const error = name.split('.').reduce((obj: any, key) => obj?.[key], errors)

  const isDisabled = disabled || isSubmitting

  return (
    <div className={cn('space-y-1.5 sm:space-y-2', className)}>
      <div className='flex items-center space-x-2 sm:space-x-3'>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isDisabled}
              className={cn(error && 'border-red-500')}
            />
          )}
        />
        <div className='flex-1 space-y-1'>
          <Label
            htmlFor={name}
            className={cn(
              'text-xs sm:text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            )}
          >
            {label} {required && <span className='text-red-500'>*</span>}
          </Label>
          {description && !error && <p className='text-[10px] sm:text-xs text-muted-foreground'>{description}</p>}
          {error && (
            <p className='text-[10px] sm:text-xs text-red-500 flex items-center gap-1'>
              <AlertCircle className='w-3 h-3' />
              {error.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
