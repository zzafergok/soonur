'use client'

import { Check, X } from 'lucide-react'

import { cn } from '@/utils/utils'

interface PasswordRulesProps {
  rules: Array<{ id: string; label: string; passed: boolean }>
  className?: string
}

/**
 * Display password validation rules with check/uncheck status
 */
export function PasswordRules({ rules, className }: PasswordRulesProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <p className='text-xs font-medium text-muted-foreground'>Password Requirements:</p>
      <ul className='space-y-1.5'>
        {rules.map((rule) => (
          <li key={rule.id} className='flex items-center gap-2 text-xs transition-colors duration-200'>
            {rule.passed ? (
              <Check className='h-3.5 w-3.5 text-green-500 flex-shrink-0' />
            ) : (
              <X className='h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0' />
            )}
            <span
              className={cn(
                'transition-colors duration-200',
                rule.passed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground',
              )}
            >
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
