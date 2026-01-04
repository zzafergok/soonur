'use client'

import React, { forwardRef, useRef, useEffect, useState } from 'react'

import { cn } from '@/utils/utils'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  orientation?: 'vertical' | 'horizontal' | 'both'
  scrollbarClassName?: string
  thumbClassName?: string
  trackClassName?: string
  hideScrollbar?: boolean
  fadeScrollbar?: boolean
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      children,
      className,
      orientation = 'vertical',
      scrollbarClassName,
      thumbClassName,
      trackClassName,
      hideScrollbar = false,
      fadeScrollbar = true,
      ...props
    },
    ref,
  ) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isScrolling, setIsScrolling] = useState(false)
    const [scrollTop, setScrollTop] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [scrollHeight, setScrollHeight] = useState(0)
    const [scrollWidth, setScrollWidth] = useState(0)
    const [clientHeight, setClientHeight] = useState(0)
    const [clientWidth, setClientWidth] = useState(0)

    useEffect(() => {
      const scrollElement = scrollRef.current
      if (!scrollElement) return

      const updateScrollInfo = () => {
        setScrollTop(scrollElement.scrollTop)
        setScrollLeft(scrollElement.scrollLeft)
        setScrollHeight(scrollElement.scrollHeight)
        setScrollWidth(scrollElement.scrollWidth)
        setClientHeight(scrollElement.clientHeight)
        setClientWidth(scrollElement.clientWidth)
      }

      const handleScroll = () => {
        updateScrollInfo()
        setIsScrolling(true)

        // Hide scrollbar after scrolling stops
        if (fadeScrollbar) {
          setTimeout(() => setIsScrolling(false), 1000)
        }
      }

      const resizeObserver = new ResizeObserver(updateScrollInfo)

      scrollElement.addEventListener('scroll', handleScroll)
      resizeObserver.observe(scrollElement)

      // Initial update
      updateScrollInfo()

      return () => {
        scrollElement.removeEventListener('scroll', handleScroll)
        resizeObserver.disconnect()
      }
    }, [fadeScrollbar])

    const verticalThumbHeight = clientHeight > 0 ? (clientHeight / scrollHeight) * clientHeight : 0
    const verticalThumbTop = scrollHeight > 0 ? (scrollTop / scrollHeight) * clientHeight : 0

    const horizontalThumbWidth = clientWidth > 0 ? (clientWidth / scrollWidth) * clientWidth : 0
    const horizontalThumbLeft = scrollWidth > 0 ? (scrollLeft / scrollWidth) * clientWidth : 0

    const showVerticalScrollbar = orientation !== 'horizontal' && scrollHeight > clientHeight
    const showHorizontalScrollbar = orientation !== 'vertical' && scrollWidth > clientWidth

    return (
      <div className={cn('relative overflow-hidden', className)} ref={ref} {...props}>
        {/* Scroll Content */}
        <div
          ref={scrollRef}
          className={cn(
            'h-full w-full overflow-auto',
            // Hide native scrollbars
            'scrollbar-none',
            '[&::-webkit-scrollbar]:hidden',
            '[-ms-overflow-style:none]',
            '[scrollbar-width:none]',
          )}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {children}
        </div>

        {/* Custom Scrollbars */}
        {!hideScrollbar && (
          <>
            {/* Vertical Scrollbar */}
            {showVerticalScrollbar && (
              <div
                className={cn(
                  'absolute right-0 top-0 z-10 h-full w-2 transition-opacity duration-300',
                  fadeScrollbar && !isScrolling ? 'opacity-0' : 'opacity-100',
                  trackClassName,
                )}
              >
                <div
                  className={cn(
                    'absolute right-0 w-2 bg-border/30 rounded-full transition-all duration-200 hover:bg-border/50',
                    scrollbarClassName,
                  )}
                  style={{
                    height: `${Math.max(verticalThumbHeight, 20)}px`,
                    top: `${verticalThumbTop}px`,
                  }}
                >
                  <div
                    className={cn(
                      'w-full h-full bg-foreground/20 rounded-full transition-colors duration-200 hover:bg-foreground/30',
                      thumbClassName,
                    )}
                  />
                </div>
              </div>
            )}

            {/* Horizontal Scrollbar */}
            {showHorizontalScrollbar && (
              <div
                className={cn(
                  'absolute bottom-0 left-0 z-10 w-full h-2 transition-opacity duration-300',
                  fadeScrollbar && !isScrolling ? 'opacity-0' : 'opacity-100',
                  trackClassName,
                )}
              >
                <div
                  className={cn(
                    'absolute bottom-0 h-2 bg-border/30 rounded-full transition-all duration-200 hover:bg-border/50',
                    scrollbarClassName,
                  )}
                  style={{
                    width: `${Math.max(horizontalThumbWidth, 20)}px`,
                    left: `${horizontalThumbLeft}px`,
                  }}
                >
                  <div
                    className={cn(
                      'w-full h-full bg-foreground/20 rounded-full transition-colors duration-200 hover:bg-foreground/30',
                      thumbClassName,
                    )}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  },
)

ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
