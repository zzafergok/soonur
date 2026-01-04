'use client'

import { useState, useEffect } from 'react'

import { useFormContext } from 'react-hook-form'
import { AlertCircle, Eye, EyeOff, Minus, Plus } from 'lucide-react'

import { Label } from '@/components/core/label'

import { cn } from '@/utils/utils'

interface TextFieldProps {
  name: string
  min?: number
  max?: number
  label: string
  step?: number
  pattern?: string
  required?: boolean
  className?: string
  disabled?: boolean
  maxLength?: number
  minLength?: number
  precision?: number
  placeholder?: string
  description?: string
  isPassword?: boolean
  autoComplete?: string
  allowDecimal?: boolean
  showNumberButtons?: boolean
  showPasswordToggle?: boolean
  showPasswordStrength?: boolean
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number' | 'search' | 'date' | 'time' | 'datetime-local'
}

export function TextField({
  min,
  max,
  name,
  label,
  pattern,
  disabled,
  step = 1,
  className,
  maxLength,
  minLength,
  placeholder,
  description,
  type = 'text',
  precision = 0,
  required = false,
  isPassword = false,
  autoComplete = 'off',
  allowDecimal = false,
  showNumberButtons = true,
  showPasswordToggle = true,
  showPasswordStrength = false,
}: TextFieldProps) {
  const {
    watch,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormContext()

  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [internalValue, setInternalValue] = useState<string>('')

  // Get nested error if field name contains dots (e.g., "settings.defaultProjectType")
  const error = name.split('.').reduce((obj: any, key) => obj?.[key], errors)

  const isDisabled = disabled || isSubmitting
  const isNumberType = type === 'number'

  // Watch the field value for number inputs and password strength
  const fieldValue = watch(name)

  // Sync internal value with field value for number inputs
  useEffect(() => {
    if (isNumberType && !isFocused && fieldValue !== undefined && fieldValue !== '') {
      setInternalValue(fieldValue.toString())
    }
  }, [fieldValue, isNumberType, isFocused])

  // Determine actual input type
  // Password fields always use 'text' type, masking is done via CSS
  const inputType = isNumberType ? 'text' : type

  const parseInputValue = (inputValue: string): number | undefined => {
    if (!inputValue) return undefined

    // Remove non-numeric characters except decimal point and minus
    const cleanValue = inputValue.replace(/[^\d.-]/g, '')
    const parsed = allowDecimal ? parseFloat(cleanValue) : parseInt(cleanValue, 10)

    if (isNaN(parsed)) return undefined

    // Apply precision for decimal numbers
    if (allowDecimal && precision > 0) {
      return parseFloat(parsed.toFixed(precision))
    }

    return parsed
  }

  const validateValue = (val: number | undefined): number | undefined => {
    if (val === undefined) return undefined

    let validated = val

    // Apply min constraint
    if (min !== undefined && validated < min) {
      validated = min
    }

    // Apply max constraint
    if (max !== undefined && validated > max) {
      validated = max
    }

    return validated
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setInternalValue(inputValue)

    // Parse and validate the value
    const parsed = parseInputValue(inputValue)
    const validated = validateValue(parsed)

    setValue(name, validated, { shouldValidate: true })
  }

  const handleNumberBlur = () => {
    setIsFocused(false)
    // Clean up the display value on blur
    if (fieldValue !== undefined && !isNaN(fieldValue)) {
      setInternalValue(fieldValue.toString())
    } else {
      setInternalValue('')
    }
  }

  const handleNumberFocus = () => {
    setIsFocused(true)
    // Show raw value when focused
    if (fieldValue !== undefined && !isNaN(fieldValue)) {
      setInternalValue(fieldValue.toString())
    } else {
      setInternalValue('')
    }
  }

  const increment = () => {
    if (isDisabled) return
    const currentValue = fieldValue ?? 0
    const newValue = currentValue + step
    const validated = validateValue(newValue)
    if (validated !== undefined) {
      setValue(name, validated, { shouldValidate: true })
    }
  }

  const decrement = () => {
    if (isDisabled) return
    const currentValue = fieldValue ?? 0
    const newValue = currentValue - step
    const validated = validateValue(newValue)
    if (validated !== undefined) {
      setValue(name, validated, { shouldValidate: true })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isNumberType) return

    // Arrow up to increment
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      increment()
    }
    // Arrow down to decrement
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      decrement()
    }
  }

  return (
    <div className={cn('space-y-1.5 sm:space-y-2', className)}>
      <Label htmlFor={name} className='text-xs sm:text-sm'>
        {label} {required && <span className='text-red-500'>*</span>}
      </Label>

      <div className='relative'>
        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          disabled={isDisabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          inputMode={isNumberType ? (allowDecimal ? 'decimal' : 'numeric') : undefined}
          {...(isNumberType
            ? {
                value: internalValue,
                onChange: handleNumberChange,
                onBlur: handleNumberBlur,
                onFocus: handleNumberFocus,
                onKeyDown: handleKeyDown,
              }
            : {
                ...register(name, {
                  valueAsNumber: false,
                }),
                min,
                max,
                step,
              })}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive',
            isPassword && showPasswordToggle && 'pr-10',
            isNumberType && showNumberButtons && 'pr-20',
            isPassword && !showPassword && 'password-input',
          )}
        />

        {/* Password Toggle Button */}
        {isPassword && showPasswordToggle && (
          <button
            type='button'
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
            tabIndex={-1}
            disabled={isDisabled}
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4 text-muted-foreground hover:text-foreground transition-colors' />
            ) : (
              <Eye className='h-4 w-4 text-muted-foreground hover:text-foreground transition-colors' />
            )}
            <span className='sr-only'>{showPassword ? 'Hide password' : 'Show password'}</span>
          </button>
        )}

        {/* Number Input Buttons */}
        {isNumberType && showNumberButtons && (
          <div className='absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1'>
            <button
              type='button'
              onClick={decrement}
              disabled={isDisabled || (min !== undefined && fieldValue !== undefined && fieldValue <= min)}
              className={cn(
                'h-8 w-8 rounded-md flex items-center justify-center',
                'bg-muted hover:bg-muted/80 active:bg-muted/60',
                'transition-colors duration-150',
                'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-muted',
                'focus-visible:outline-none',
              )}
              aria-label='Decrement'
            >
              <Minus className='h-3.5 w-3.5' />
            </button>
            <button
              type='button'
              onClick={increment}
              disabled={isDisabled || (max !== undefined && fieldValue !== undefined && fieldValue >= max)}
              className={cn(
                'h-8 w-8 rounded-md flex items-center justify-center',
                'bg-muted hover:bg-muted/80 active:bg-muted/60',
                'transition-colors duration-150',
                'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-muted',
                'focus-visible:outline-none',
              )}
              aria-label='Increment'
            >
              <Plus className='h-3.5 w-3.5' />
            </button>
          </div>
        )}
      </div>

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
