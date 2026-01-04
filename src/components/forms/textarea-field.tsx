'use client'

import { AlertCircle } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { Label } from '@/components/core/label'
import { Textarea } from '@/components/core/textarea'

import { cn } from '@/utils/utils'

interface TextareaFieldProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  description?: string
  className?: string
  disabled?: boolean
  rows?: number
  maxLength?: number
  showCharCount?: boolean
}

export function TextareaField({
  name,
  label,
  placeholder,
  required = false,
  description,
  className,
  disabled,
  rows = 4,
  maxLength,
  showCharCount = false,
}: TextareaFieldProps) {
  const {
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext()

  // Get nested error if field name contains dots
  const error = name.split('.').reduce((obj: any, key) => obj?.[key], errors)

  // Watch field value for character count
  const fieldValue = watch(name) as string

  const isDisabled = disabled || isSubmitting
  const charCount = fieldValue?.length || 0

  return (
    <div className={cn('space-y-1.5 sm:space-y-2', className)}>
      <div className='flex items-center justify-between'>
        <Label htmlFor={name} className='text-xs sm:text-sm'>
          {label} {required && <span className='text-red-500'>*</span>}
        </Label>
        {showCharCount && maxLength && (
          <span className='text-[10px] sm:text-xs text-muted-foreground'>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      <Textarea
        id={name}
        placeholder={placeholder}
        disabled={isDisabled}
        rows={rows}
        maxLength={maxLength}
        {...register(name)}
        className={cn('text-xs sm:text-sm resize-none', error && 'border-red-500')}
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
