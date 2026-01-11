'use client'

import React from 'react'

import { Check } from 'lucide-react'

import { cn } from '@/utils/utils'

interface StepperProps {
  activeStep?: number
  currentStep?: any
  children: React.ReactNode
  className?: string
}

interface StepperItemProps {
  step?: number
  title: string
  description?: string
  isActive?: boolean
  isCompleted?: boolean
  isLast?: boolean
  id?: string
  status?: 'current' | 'completed' | 'upcoming'
}

export function Stepper({ activeStep = 1, currentStep, children, className }: StepperProps) {
  const currentActiveStep = activeStep || currentStep || 1
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              ...child.props,
              step: index + 1,
              isActive: currentActiveStep === index + 1,
              isCompleted: currentActiveStep > index + 1,
              isLast: index === React.Children.count(children) - 1,
            })
          : child,
      )}
    </div>
  )
}

export function StepperItem({ step = 1, title, description, isActive, isCompleted, isLast }: StepperItemProps) {
  return (
    <div className='flex items-center'>
      <div className='flex flex-col items-center'>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
            {
              'border-primary bg-primary text-primary-foreground': isActive || isCompleted,
              'border-muted-foreground text-muted-foreground': !isActive && !isCompleted,
            },
          )}
        >
          {isCompleted ? <Check className='h-5 w-5' /> : step}
        </div>
        <div className='mt-2 text-center'>
          <div
            className={cn('text-sm font-medium', {
              'text-primary': isActive,
              'text-foreground': isCompleted,
              'text-muted-foreground': !isActive && !isCompleted,
            })}
          >
            {title}
          </div>
          {description && (
            <div
              className={cn('mt-1 text-xs', {
                'text-primary/70': isActive,
                'text-muted-foreground': !isActive,
              })}
            >
              {description}
            </div>
          )}
        </div>
      </div>
      {!isLast && (
        <div
          className={cn('mx-4 h-px w-24 transition-colors', {
            'bg-primary': isCompleted,
            'bg-muted': !isCompleted,
          })}
        />
      )}
    </div>
  )
}
