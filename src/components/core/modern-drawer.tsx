'use client'

import React, { useEffect } from 'react'

import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { Button } from './button'

import { cn } from '@/utils/utils'

export interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
  placement?: 'right' | 'left' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  maskClosable?: boolean
  className?: string
  footer?: React.ReactNode
}

export function ModernDrawer({
  open,
  onOpenChange,
  children,
  title,
  placement = 'right',
  size = 'md',
  showCloseButton = true,
  maskClosable = true,
  className,
  footer,
}: DrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // ESC key handler
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [open, onOpenChange])

  const sizeClasses = {
    sm: 'w-screen sm:w-96 sm:max-w-sm',
    md: 'w-screen sm:w-[28rem] sm:max-w-md',
    lg: 'w-screen sm:w-[36rem] sm:max-w-2xl',
    xl: 'w-screen sm:w-[42rem] sm:max-w-3xl',
  }

  const placementClasses = {
    right: `top-0 bottom-0 left-0 right-0 sm:top-4 sm:bottom-4 sm:right-4 sm:left-auto ${sizeClasses[size]}`,
    left: `top-0 bottom-0 left-0 right-0 sm:top-4 sm:bottom-4 sm:left-4 sm:right-auto ${sizeClasses[size]}`,
    top: `top-0 bottom-0 left-0 right-0 sm:top-4 sm:left-4 sm:right-4 sm:bottom-auto h-screen sm:h-80`,
    bottom: `top-0 bottom-0 left-0 right-0 sm:bottom-4 sm:left-4 sm:right-4 sm:top-auto h-screen sm:h-80`,
  }

  const getAnimationProps = () => {
    switch (placement) {
      case 'right':
        return {
          initial: { opacity: 0, x: '100%' },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: '100%' },
        }
      case 'left':
        return {
          initial: { opacity: 0, x: '-100%' },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: '-100%' },
        }
      case 'top':
        return {
          initial: { opacity: 0, y: '-100%' },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: '-100%' },
        }
      case 'bottom':
        return {
          initial: { opacity: 0, y: '100%' },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: '100%' },
        }
      default:
        return {
          initial: { opacity: 0, x: '100%' },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: '100%' },
        }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop/Mask - Hidden on mobile since drawer is fullscreen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm hidden sm:block m-0 p-0'
            style={{ margin: 0, padding: 0 }}
            onClick={maskClosable ? () => onOpenChange(false) : undefined}
          />

          {/* Drawer Container */}
          <motion.div
            {...getAnimationProps()}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            className={cn(
              'fixed z-[9999] flex flex-col bg-background border shadow-2xl',
              'rounded-none sm:rounded-lg', // No border radius on mobile, 8px on desktop
              'm-0 p-0',
              placementClasses[placement],
              className,
            )}
            style={{ margin: 0, padding: 0 }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className='flex items-center justify-between p-4 sm:p-6 border-b border-border/50 bg-muted/20'>
                {title && <h2 className='text-base sm:text-lg font-semibold text-foreground pr-4 truncate'>{title}</h2>}
                {showCloseButton && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onOpenChange(false)}
                    className='h-8 w-8 p-0 rounded-md hover:bg-muted/80 flex-shrink-0'
                  >
                    <X className='h-4 w-4' />
                    <span className='sr-only'>Close drawer</span>
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className='flex-1 overflow-y-auto p-4 sm:p-6'>{children}</div>

            {/* Footer */}
            {footer && <div className='border-t border-border/50 bg-muted/20 p-4 sm:p-6'>{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Export drawer hook for programmatic usage
export function useDrawer() {
  const [open, setOpen] = React.useState(false)

  const openDrawer = React.useCallback(() => setOpen(true), [])
  const closeDrawer = React.useCallback(() => setOpen(false), [])
  const toggleDrawer = React.useCallback(() => setOpen((prev) => !prev), [])

  return {
    open,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setOpen,
  }
}
