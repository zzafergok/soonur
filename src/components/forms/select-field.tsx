'use client'

import { AlertCircle } from 'lucide-react'
import { useFormContext, Controller } from 'react-hook-form'

import { Label } from '@/components/core/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

import { cn } from '@/utils/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectFieldProps {
  name: string
  label: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  description?: string
  className?: string
  disabled?: boolean
  allowNone?: boolean
  noneLabel?: string
}

export function SelectField({
  name,
  label,
  options,
  placeholder = 'Select...',
  required = false,
  description,
  className,
  disabled,
  allowNone = false,
  noneLabel = 'None',
}: SelectFieldProps) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext()

  // Get nested error if field name contains dots (e.g., "settings.defaultProjectType")
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
          <Select
            value={field.value ? String(field.value) : allowNone ? 'none' : ''}
            onValueChange={(value) => {
              if (value === 'none' && allowNone) {
                field.onChange(null)
              } else {
                field.onChange(value)
              }
            }}
            disabled={isDisabled}
          >
            <SelectTrigger id={name} className={cn('text-xs sm:text-sm', error && 'border-red-500')}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {allowNone && (
                <SelectItem value='none' className='text-xs sm:text-sm'>
                  {noneLabel}
                </SelectItem>
              )}
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className='text-xs sm:text-sm'
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
