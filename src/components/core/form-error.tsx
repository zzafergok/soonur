'use client'

import { AlertCircle } from 'lucide-react'

import { cn } from '@/utils/utils'

interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null

  return (
    <div className={cn('flex items-center gap-2 mt-1 text-sm text-destructive', className)}>
      <AlertCircle className='h-3 w-3 flex-shrink-0' />
      <span>{message}</span>
    </div>
  )
}
