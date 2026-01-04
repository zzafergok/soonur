'use client'

import { cn } from '@/utils/utils'

interface PasswordStrengthBarProps {
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  percentage: number
  className?: string
}

/**
 * Visual password strength indicator bar
 */
export function PasswordStrengthBar({ strength, percentage, className }: PasswordStrengthBarProps) {
  // Color mapping based on strength
  const colorMap = {
    weak: 'bg-red-500',
    medium: 'bg-orange-500',
    strong: 'bg-yellow-500',
    'very-strong': 'bg-green-500',
  }

  // Label mapping
  const labelMap = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
    'very-strong': 'Very Strong',
  }

  const barColor = colorMap[strength]
  const label = labelMap[strength]

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className='flex items-center justify-between'>
        <p className='text-xs font-medium text-muted-foreground'>Password Strength:</p>
        <span
          className={cn(
            'text-xs font-semibold transition-colors duration-300',
            strength === 'weak' && 'text-red-600 dark:text-red-400',
            strength === 'medium' && 'text-orange-600 dark:text-orange-400',
            strength === 'strong' && 'text-yellow-600 dark:text-yellow-400',
            strength === 'very-strong' && 'text-green-600 dark:text-green-400',
          )}
        >
          {label}
        </span>
      </div>

      {/* Progress bar */}
      <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
        <div
          className={cn('h-full transition-all duration-500 ease-out rounded-full', barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
