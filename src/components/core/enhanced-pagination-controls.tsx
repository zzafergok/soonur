'use client'

import React, { useState, useCallback, useMemo } from 'react'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react'

import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

import { useTranslation } from 'react-i18next'

import { cn } from '@/utils/utils'

export interface PaginationInfo {
  total: number
  current: number
  pageSize: number
  totalPages: number
}

export interface PaginationControlsProps {
  simple?: boolean
  disabled?: boolean
  className?: string
  showTotal?: boolean
  maxPageButtons?: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pagination: PaginationInfo
  pageSizeOptions?: number[]
  hideOnSinglePage?: boolean
  showPrevNextJumpers?: boolean
  onPageChange: (page: number) => void
  size?: 'small' | 'default' | 'large'
  onPageSizeChange: (pageSize: number) => void
  itemRender?: (
    page: number,
    originalElement: React.ReactElement,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
  ) => React.ReactNode
  showLessItems?: boolean
}

export function EnhancedPaginationControls({
  className,
  pagination,
  itemRender,
  onPageChange,
  simple = false,
  size = 'default',
  onPageSizeChange,
  disabled = false,
  showTotal = false,
  maxPageButtons = 7,
  showLessItems = false,
  showSizeChanger = false,
  showQuickJumper = false,
  hideOnSinglePage = false,
  showPrevNextJumpers = true,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationControlsProps) {
  const { t } = useTranslation()
  const [jumpPage, setJumpPage] = useState('')

  const { current, pageSize, total, totalPages } = pagination

  // Size classes - defined before any conditional returns
  const sizeClasses = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base',
  }

  const buttonSizes = useMemo(
    () => ({
      small: 'sm' as const,
      default: 'sm' as const,
      large: 'default' as const,
    }),
    [],
  )

  // Calculate visible page numbers
  const getVisiblePages = useCallback(() => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const delta = Math.floor((maxPageButtons - 1) / 2)
    let start = Math.max(1, current - delta)
    const end = Math.min(totalPages, start + maxPageButtons - 1)

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [current, totalPages, maxPageButtons])

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === current || disabled) return
      onPageChange(page)
    },
    [current, totalPages, onPageChange, disabled],
  )

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newPageSize: string) => {
      const size = parseInt(newPageSize, 10)
      if (size === pageSize || disabled) return

      // Calculate new current page to maintain position
      const newCurrentPage = Math.ceil(((current - 1) * pageSize) / size) + 1
      onPageSizeChange(size)

      if (newCurrentPage !== current && newCurrentPage <= Math.ceil(total / size)) {
        onPageChange(newCurrentPage)
      }
    },
    [pageSize, current, total, onPageSizeChange, onPageChange, disabled],
  )

  // Handle quick jump
  const handleQuickJump = useCallback(() => {
    const page = parseInt(jumpPage, 10)
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page)
      setJumpPage('')
    }
  }, [jumpPage, totalPages, handlePageChange])

  // Handle enter key in quick jump
  const handleJumpKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleQuickJump()
      }
    },
    [handleQuickJump],
  )

  // Get total info text
  const getTotalText = useCallback(() => {
    const start = (current - 1) * pageSize + 1
    const end = Math.min(current * pageSize, total)

    if (total === 0) {
      return t('common.pagination.noItems')
    }

    return t('common.pagination.showing', {
      start: start.toLocaleString(),
      end: end.toLocaleString(),
      total: total.toLocaleString(),
    })
  }, [current, pageSize, total, t])

  // Render page button
  const renderPageButton = useCallback(
    (page: number, isActive: boolean = false) => {
      const buttonElement = (
        <Button
          key={page}
          variant={isActive ? 'default' : 'outline'}
          size={buttonSizes[size]}
          onClick={() => handlePageChange(page)}
          disabled={disabled}
          className={cn('min-w-9', isActive && 'pointer-events-none')}
        >
          {page}
        </Button>
      )

      if (itemRender) {
        return itemRender(page, buttonElement, 'page')
      }

      return buttonElement
    },
    [size, handlePageChange, disabled, itemRender, buttonSizes],
  )

  // Render ellipsis button
  const renderEllipsis = useCallback(
    (key: string, direction: 'prev' | 'next') => {
      const jumpPages = direction === 'prev' ? Math.max(1, current - 5) : Math.min(totalPages, current + 5)

      const buttonElement = (
        <Button
          key={key}
          variant='outline'
          size={buttonSizes[size]}
          onClick={() => handlePageChange(jumpPages)}
          disabled={disabled}
          className='min-w-9'
        >
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      )

      if (itemRender) {
        return itemRender(jumpPages, buttonElement, direction === 'prev' ? 'jump-prev' : 'jump-next')
      }

      return buttonElement
    },
    [current, totalPages, size, handlePageChange, disabled, itemRender, buttonSizes],
  )

  // Hide pagination if only one page and hideOnSinglePage is true
  if (hideOnSinglePage && totalPages <= 1) {
    return null
  }

  // Simple pagination
  if (simple) {
    return (
      <div className={cn('flex items-center justify-between', sizeClasses[size], className)}>
        {showTotal && <div className='text-muted-foreground'>{getTotalText()}</div>}

        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size={buttonSizes[size]}
            onClick={() => handlePageChange(current - 1)}
            disabled={disabled || current <= 1}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>

          <span className='flex items-center gap-1 px-2'>
            <Input
              type='number'
              value={current}
              onChange={(e) => {
                const page = parseInt(e.target.value, 10)
                if (page >= 1 && page <= totalPages) {
                  handlePageChange(page)
                }
              }}
              className='w-16 text-center'
              min={1}
              max={totalPages}
              disabled={disabled}
            />
            <span className='text-muted-foreground'>/ {totalPages}</span>
          </span>

          <Button
            variant='outline'
            size={buttonSizes[size]}
            onClick={() => handlePageChange(current + 1)}
            disabled={disabled || current >= totalPages}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    )
  }

  const visiblePages = getVisiblePages()
  const showLeftEllipsis = visiblePages[0] > 1
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages

  return (
    <div
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center', sizeClasses[size], className)}
    >
      {/* Total Info */}
      {showTotal && <div className='text-muted-foreground'>{getTotalText()}</div>}

      {/* Main Pagination Controls */}
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
        {/* Page Navigation */}
        <div className='flex items-center gap-1'>
          {/* First Page & Previous */}
          {showPrevNextJumpers && (
            <Button
              variant='outline'
              size={buttonSizes[size]}
              onClick={() => handlePageChange(1)}
              disabled={disabled || current <= 1}
              className='min-w-9'
            >
              <ChevronsLeft className='h-4 w-4' />
            </Button>
          )}

          <Button
            variant='outline'
            size={buttonSizes[size]}
            onClick={() => handlePageChange(current - 1)}
            disabled={disabled || current <= 1}
            className='min-w-9'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>

          {/* Page Numbers */}
          {showLeftEllipsis && !showLessItems && (
            <>
              {renderPageButton(1)}
              {visiblePages[0] > 2 && renderEllipsis('left-ellipsis', 'prev')}
            </>
          )}

          {visiblePages.map((page) => renderPageButton(page, page === current))}

          {showRightEllipsis && !showLessItems && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && renderEllipsis('right-ellipsis', 'next')}
              {renderPageButton(totalPages)}
            </>
          )}

          {/* Next & Last Page */}
          <Button
            variant='outline'
            size={buttonSizes[size]}
            onClick={() => handlePageChange(current + 1)}
            disabled={disabled || current >= totalPages}
            className='min-w-9'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>

          {showPrevNextJumpers && (
            <Button
              variant='outline'
              size={buttonSizes[size]}
              onClick={() => handlePageChange(totalPages)}
              disabled={disabled || current >= totalPages}
              className='min-w-9'
            >
              <ChevronsRight className='h-4 w-4' />
            </Button>
          )}
        </div>

        {/* Page Size Selector */}
        {showSizeChanger && (
          <div className='flex items-center gap-2'>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange} disabled={disabled}>
              <SelectTrigger className='w-20'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Quick Jump */}
        {showQuickJumper && (
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground whitespace-nowrap'>{t('common.pagination.goTo')}</span>
            <Input
              type='number'
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={handleJumpKeyDown}
              placeholder={t('common.pagination.page')}
              className='w-20'
              min={1}
              max={totalPages}
              disabled={disabled}
            />
            <Button
              variant='outline'
              size={buttonSizes[size]}
              onClick={handleQuickJump}
              disabled={disabled || !jumpPage || parseInt(jumpPage, 10) < 1 || parseInt(jumpPage, 10) > totalPages}
            >
              {t('common.pagination.go')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Hook for managing pagination state
export function usePagination(initialPageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const getPaginationInfo = useCallback(
    (total: number): PaginationInfo => {
      const totalPages = Math.ceil(total / pageSize)
      return {
        current: currentPage,
        pageSize,
        total,
        totalPages,
      }
    },
    [currentPage, pageSize],
  )

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    // Reset to first page when page size changes
    setCurrentPage(1)
  }, [])

  const reset = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const goToPage = useCallback(
    (page: number, total: number) => {
      const totalPages = Math.ceil(total / pageSize)
      const validPage = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(validPage)
    },
    [pageSize],
  )

  return {
    currentPage,
    pageSize,
    getPaginationInfo,
    handlePageChange,
    handlePageSizeChange,
    reset,
    goToPage,
  }
}

// Utility function to calculate pagination offset
export const getPaginationOffset = (page: number, pageSize: number): number => {
  return (page - 1) * pageSize
}

// Utility function to get paginated data
export const getPaginatedData = <T,>(
  data: T[],
  page: number,
  pageSize: number,
): { items: T[]; total: number; totalPages: number } => {
  const total = data.length
  const totalPages = Math.ceil(total / pageSize)
  const offset = getPaginationOffset(page, pageSize)
  const items = data.slice(offset, offset + pageSize)

  return {
    items,
    total,
    totalPages,
  }
}

// Advanced pagination with filtering and sorting
export interface AdvancedPaginationOptions<T> {
  data: T[]
  page: number
  pageSize: number
  sortBy?: keyof T
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
  searchText?: string
  searchFields?: (keyof T)[]
}

export function getAdvancedPaginatedData<T>({
  data,
  page,
  pageSize,
  sortBy,
  sortOrder = 'asc',
  filters = {},
  searchText = '',
  searchFields = [],
}: AdvancedPaginationOptions<T>) {
  let processedData = [...data]

  // Apply search filter
  if (searchText.trim() && searchFields.length > 0) {
    const searchLower = searchText.toLowerCase()
    processedData = processedData.filter((item) =>
      searchFields.some((field) => {
        const value = item[field]
        return value != null && String(value).toLowerCase().includes(searchLower)
      }),
    )
  }

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          processedData = processedData.filter((item) => value.includes((item as any)[key]))
        }
      } else {
        processedData = processedData.filter((item) => {
          const itemValue = (item as any)[key]
          if (itemValue == null) return false
          return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
        })
      }
    }
  })

  // Apply sorting
  if (sortBy) {
    processedData = processedData.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (aValue == null && bValue == null) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1

      let comparison = 0
      if (aValue > bValue) comparison = 1
      if (aValue < bValue) comparison = -1

      return sortOrder === 'desc' ? -comparison : comparison
    })
  }

  // Apply pagination
  return getPaginatedData(processedData, page, pageSize)
}
