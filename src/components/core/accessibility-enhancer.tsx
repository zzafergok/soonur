'use client'

import React, { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/utils/utils'

interface AccessibleRegionProps extends HTMLAttributes<HTMLElement> {
  label?: string
  description?: string
  live?: 'off' | 'polite' | 'assertive'
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  busy?: boolean
  as?: keyof JSX.IntrinsicElements
}

export const AccessibleRegion = forwardRef<HTMLDivElement, AccessibleRegionProps>(
  (
    {
      label,
      description,
      live = 'off',
      atomic = false,
      relevant = 'additions text',
      busy = false,
      as = 'div',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Component = as as any
    return (
      <Component
        ref={ref}
        role='region'
        aria-label={label}
        aria-describedby={description ? `${props.id}-desc` : undefined}
        aria-live={live}
        aria-atomic={atomic}
        aria-relevant={relevant as any}
        aria-busy={busy}
        className={cn('outline-none', className)}
        {...props}
      >
        {description && (
          <div id={`${props.id}-desc`} className='sr-only'>
            {description}
          </div>
        )}
        {children}
      </Component>
    )
  },
)

AccessibleRegion.displayName = 'AccessibleRegion'

interface SkipLinkProps {
  href: string
  children: React.ReactNode
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none'
    >
      {children}
    </a>
  )
}

interface AccessibleListProps extends HTMLAttributes<HTMLUListElement> {
  label?: string
  orientation?: 'horizontal' | 'vertical'
  multiselectable?: boolean
}

export const AccessibleList = forwardRef<HTMLUListElement, AccessibleListProps>(
  ({ label, orientation = 'vertical', multiselectable = false, className, children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        role='list'
        aria-label={label}
        aria-orientation={orientation}
        aria-multiselectable={multiselectable}
        className={cn('list-none', className)}
        {...props}
      >
        {children}
      </ul>
    )
  },
)

AccessibleList.displayName = 'AccessibleList'

interface AccessibleListItemProps extends HTMLAttributes<HTMLLIElement> {
  selected?: boolean
  disabled?: boolean
  level?: number
}

export const AccessibleListItem = forwardRef<HTMLLIElement, AccessibleListItemProps>(
  ({ selected = false, disabled = false, level, className, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        role='listitem'
        aria-selected={selected}
        aria-disabled={disabled}
        aria-level={level}
        className={cn('outline-none', disabled && 'opacity-50 cursor-not-allowed', className)}
        {...props}
      >
        {children}
      </li>
    )
  },
)

AccessibleListItem.displayName = 'AccessibleListItem'

interface VisuallyHiddenProps {
  as?: keyof JSX.IntrinsicElements
  className?: string
  children?: React.ReactNode
}

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ as = 'span', className, children, ...props }, ref) => {
    if (as === 'span') {
      return (
        <span ref={ref} className={cn('sr-only', className)} {...props}>
          {children}
        </span>
      )
    }
    const Component = as
    return React.createElement(Component as any, { className: cn('sr-only', className), ...props }, children)
  },
)

VisuallyHidden.displayName = 'VisuallyHidden'
