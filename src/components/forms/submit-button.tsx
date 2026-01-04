'use client'

import { ReactNode } from 'react'

import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/core/button'
import { LoadingSpinner } from '@/components/core/loading-spinner'

import { cn } from '@/utils/utils'

interface SubmitButtonProps {
  children?: ReactNode
  loadingText?: string
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  disableIfNoChanges?: boolean
  icon?: ReactNode
}

export function SubmitButton({
  children = 'Submit',
  loadingText = 'Submitting...',
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  disableIfNoChanges = false,
  icon,
}: SubmitButtonProps) {
  const {
    formState: { isSubmitting, isDirty },
  } = useFormContext()

  // Disable button if:
  // 1. Explicitly disabled via prop
  // 2. Form is submitting
  // 3. disableIfNoChanges is true and form has no changes (not dirty)
  const isDisabled = disabled || isSubmitting || (disableIfNoChanges && !isDirty)

  return (
    <Button type='submit' variant={variant} size={size} disabled={isDisabled} className={cn('w-full', className)}>
      {isSubmitting ? (
        <>
          <LoadingSpinner size='sm' className='mr-2' />
          <span className='text-xs sm:text-sm'>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && <span className='mr-2'>{icon}</span>}
          <span className='text-xs sm:text-sm'>{children}</span>
        </>
      )}
    </Button>
  )
}
