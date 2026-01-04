'use client'

import * as React from 'react'

import { Minus, Plus } from 'lucide-react'

import { cn } from '@/utils/utils'

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value?: number
  onChange?: (value: number | undefined) => void
  min?: number
  max?: number
  step?: number
  showButtons?: boolean
  allowDecimal?: boolean
  precision?: number
  formatValue?: (value: number) => string
  parseValue?: (value: string) => number
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value,
      onChange,
      min,
      max,
      step = 1,
      showButtons = true,
      allowDecimal = false,
      precision = 0,
      formatValue,
      parseValue,
      disabled,
      placeholder = '0',
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState<string>(value?.toString() || '')
    const [isFocused, setIsFocused] = React.useState(false)

    // Sync internal value with external value
    React.useEffect(() => {
      if (!isFocused) {
        if (value !== undefined && !isNaN(value)) {
          const formattedValue = formatValue ? formatValue(value) : value.toString()
          setInternalValue(formattedValue)
        } else {
          setInternalValue('')
        }
      }
    }, [value, formatValue, isFocused])

    const parseInputValue = (inputValue: string): number | undefined => {
      if (!inputValue) return undefined

      // Use custom parser if provided
      if (parseValue) {
        return parseValue(inputValue)
      }

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      setInternalValue(inputValue)

      // Parse and validate the value
      const parsed = parseInputValue(inputValue)
      const validated = validateValue(parsed)

      onChange?.(validated)
    }

    const handleBlur = () => {
      setIsFocused(false)

      // Clean up the display value on blur
      if (value !== undefined && !isNaN(value)) {
        const formattedValue = formatValue ? formatValue(value) : value.toString()
        setInternalValue(formattedValue)
      } else {
        setInternalValue('')
      }
    }

    const handleFocus = () => {
      setIsFocused(true)
      // Show raw value when focused
      if (value !== undefined && !isNaN(value)) {
        setInternalValue(value.toString())
      } else {
        setInternalValue('')
      }
    }

    const increment = () => {
      if (disabled) return

      const currentValue = value ?? 0
      const newValue = currentValue + step
      const validated = validateValue(newValue)

      if (validated !== undefined) {
        onChange?.(validated)
      }
    }

    const decrement = () => {
      if (disabled) return

      const currentValue = value ?? 0
      const newValue = currentValue - step
      const validated = validateValue(newValue)

      if (validated !== undefined) {
        onChange?.(validated)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      <div className='relative flex items-center'>
        <input
          ref={ref}
          type='text'
          inputMode={allowDecimal ? 'decimal' : 'numeric'}
          value={internalValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            showButtons && 'pr-20', // Add padding for buttons
            className,
          )}
          {...props}
        />

        {showButtons && (
          <div className='absolute right-1 flex items-center gap-1'>
            <button
              type='button'
              onClick={decrement}
              disabled={disabled || (min !== undefined && value !== undefined && value <= min)}
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
              disabled={disabled || (max !== undefined && value !== undefined && value >= max)}
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
    )
  },
)

NumberInput.displayName = 'NumberInput'

export { NumberInput }
