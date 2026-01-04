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
            'w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors',
            {
              'bg-primary border-primary text-primary-foreground': isActive || isCompleted,
              'border-muted-foreground text-muted-foreground': !isActive && !isCompleted,
            },
          )}
        >
          {isCompleted ? <Check className='w-5 h-5' /> : step}
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
              className={cn('text-xs mt-1', {
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
          className={cn('h-px w-24 mx-4 transition-colors', {
            'bg-primary': isCompleted,
            'bg-muted': !isCompleted,
          })}
        />
      )}
    </div>
  )
}
