'use client'

import React, { useState, useMemo, useCallback } from 'react'

import {
  Eye,
  Search,
  Filter,
  Download,
  ChevronUp,
  RefreshCw,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/core/dropdown'
import { Input } from '@/components/core/input'
import { Badge } from '@/components/core/badge'
import { Button } from '@/components/core/button'
import { Checkbox } from '@/components/core/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from '@/components/core/table'

import { cn } from '@/utils/utils'

// Enhanced Data Table Types
export interface TableColumn<T = Record<string, unknown>> {
  key: string
  title: string
  width?: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: unknown, record: T, index: number) => React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
}

export interface TableAction<T = Record<string, unknown>> {
  key: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (record: T, index: number) => void
  visible?: (record: T) => boolean
  disabled?: (record: T) => boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
}

export interface TableFilter {
  key: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange'
  options?: { label: string; value: string }[]
  placeholder?: string
}

export interface TablePagination {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizeOptions?: number[]
}

export interface TableSelection<T = Record<string, unknown>> {
  selectedRowKeys: string[]
  onChange: (selectedRowKeys: string[], selectedRows: T[]) => void
  getCheckboxProps?: (record: T) => { disabled?: boolean }
}

export interface EnhancedDataTableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  rowKey: string | ((record: T) => string)
  loading?: boolean
  pagination?: TablePagination
  selection?: TableSelection<T>
  actions?: TableAction<T>[]
  filters?: TableFilter[]
  searchable?: boolean
  searchPlaceholder?: string
  exportable?: boolean
  refreshable?: boolean
  onRefresh?: () => void
  onExport?: (data: T[], filters: Record<string, unknown>) => void
  className?: string
  size?: 'small' | 'middle' | 'large'
  bordered?: boolean
  striped?: boolean
  sticky?: boolean
  virtualScroll?: boolean
  maxHeight?: string
  emptyText?: string
  expandable?: {
    expandedRowRender: (record: T, index: number) => React.ReactNode
    expandRowByClick?: boolean
    defaultExpandAllRows?: boolean
  }
  summary?: (data: T[]) => React.ReactNode
}

export function EnhancedDataTable<T = Record<string, unknown>>({
  columns,
  data,
  rowKey,
  loading = false,
  pagination,
  selection,
  actions,
  filters = [],
  searchable = true,
  searchPlaceholder = 'Search...',
  exportable = false,
  refreshable = false,
  onRefresh,
  onExport,
  className,
  size = 'middle',
  bordered: _bordered = true,
  striped = true,
  sticky = false,
  virtualScroll: _virtualScroll = false,
  maxHeight,
  emptyText = 'No data available',
  expandable,
  summary,
}: EnhancedDataTableProps<T>) {
  const [searchText, setSearchText] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columns.map((col) => col.key)))

  // Get row key function
  const getRowKey = useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(record)
      }
      return String((record as Record<string, unknown>)[rowKey] || index)
    },
    [rowKey],
  )

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data]

    // Apply search filter
    if (searchText.trim()) {
      result = result.filter((record) => {
        return columns.some((column) => {
          const value = (record as any)[column.key]
          if (value == null) return false
          return String(value).toLowerCase().includes(searchText.toLowerCase())
        })
      })
    }

    // Apply column filters
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          result = result.filter((record) => value.includes((record as any)[key]))
        } else {
          result = result.filter((record) => {
            const recordValue = (record as any)[key]
            if (recordValue == null) return false
            return String(recordValue).toLowerCase().includes(String(value).toLowerCase())
          })
        }
      }
    })

    // Apply sorting
    if (sortConfig) {
      result = result.sort((a, b) => {
        const aValue = (a as any)[sortConfig.key]
        const bValue = (b as any)[sortConfig.key]

        if (aValue == null && bValue == null) return 0
        if (aValue == null) return 1
        if (bValue == null) return -1

        let comparison = 0
        if (aValue > bValue) comparison = 1
        if (aValue < bValue) comparison = -1

        return sortConfig.direction === 'desc' ? -comparison : comparison
      })
    }

    return result
  }, [data, searchText, filterValues, sortConfig, columns])

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData

    const start = (pagination.current - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return processedData.slice(start, end)
  }, [processedData, pagination])

  // Visible columns
  const visibleColumnsArray = useMemo(() => {
    return columns.filter((col) => visibleColumns.has(col.key))
  }, [columns, visibleColumns])

  // Handle sort
  const handleSort = useCallback((columnKey: string) => {
    setSortConfig((current) => {
      if (current?.key === columnKey) {
        if (current.direction === 'asc') {
          return { key: columnKey, direction: 'desc' }
        } else {
          return null // Remove sort
        }
      } else {
        return { key: columnKey, direction: 'asc' }
      }
    })
  }, [])

  // Handle filter change
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilterValues((current) => ({ ...current, [key]: value }))
  }, [])

  // Handle expand/collapse
  const handleExpandRow = useCallback((rowKey: string) => {
    setExpandedRows((current) => {
      const newSet = new Set(current)
      if (newSet.has(rowKey)) {
        newSet.delete(rowKey)
      } else {
        newSet.add(rowKey)
      }
      return newSet
    })
  }, [])

  // Handle column visibility
  const handleColumnVisibility = useCallback((columnKey: string, visible: boolean) => {
    setVisibleColumns((current) => {
      const newSet = new Set(current)
      if (visible) {
        newSet.add(columnKey)
      } else {
        newSet.delete(columnKey)
      }
      return newSet
    })
  }, [])

  // Handle selection
  const handleSelectRow = useCallback(
    (rowKey: string, _record: T) => {
      if (!selection) return

      const { selectedRowKeys, onChange } = selection
      const newSelectedKeys = selectedRowKeys.includes(rowKey)
        ? selectedRowKeys.filter((key) => key !== rowKey)
        : [...selectedRowKeys, rowKey]

      const selectedRows = data.filter((item) => newSelectedKeys.includes(getRowKey(item, data.indexOf(item))))

      onChange(newSelectedKeys, selectedRows)
    },
    [selection, data, getRowKey],
  )

  // Handle select all
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (!selection) return

      const { onChange } = selection

      if (checked) {
        const allKeys = paginatedData.map((record, index) => getRowKey(record, index))
        onChange(allKeys, paginatedData)
      } else {
        onChange([], [])
      }
    },
    [selection, paginatedData, getRowKey],
  )

  // Export functionality
  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(processedData, filterValues)
    }
  }, [onExport, processedData, filterValues])

  // Render cell content
  const renderCell = useCallback((column: TableColumn<T>, record: T, index: number) => {
    const value = (record as any)[column.key]

    if (column.render) {
      return column.render(value, record, index)
    }

    if (value == null) return '-'

    // Handle different data types
    if (typeof value === 'boolean') {
      return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
    }

    if (Array.isArray(value)) {
      return value.join(', ')
    }

    return String(value)
  }, [])

  // Table size classes
  const sizeClasses = {
    small: 'text-xs',
    middle: 'text-sm',
    large: 'text-base',
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Table Controls */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 items-center space-x-2'>
          {/* Search */}
          {searchable && (
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder={searchPlaceholder}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className='pl-9'
              />
            </div>
          )}

          {/* Filters */}
          {filters.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  <Filter className='h-4 w-4 mr-2' />
                  Filters
                  {Object.keys(filterValues).length > 0 && (
                    <Badge variant='secondary' className='ml-2'>
                      {Object.keys(filterValues).length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='w-80'>
                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filters.map((filter) => (
                  <div key={filter.key} className='p-2'>
                    <label className='text-sm font-medium'>{filter.label}</label>
                    {filter.type === 'text' && (
                      <Input
                        placeholder={filter.placeholder}
                        value={(filterValues[filter.key] as string) || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        className='mt-1'
                      />
                    )}
                    {filter.type === 'select' && (
                      <Select
                        value={(filterValues[filter.key] as string) || ''}
                        onValueChange={(value) => handleFilterChange(filter.key, value)}
                      >
                        <SelectTrigger className='mt-1'>
                          <SelectValue placeholder={filter.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Actions */}
        <div className='flex items-center space-x-2'>
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <Eye className='h-4 w-4 mr-2' />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Show/Hide Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={visibleColumns.has(column.key)}
                  onCheckedChange={(checked) => handleColumnVisibility(column.key, checked)}
                >
                  {column.title}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          {exportable && (
            <Button variant='outline' size='sm' onClick={handleExport}>
              <Download className='h-4 w-4 mr-2' />
              Export
            </Button>
          )}

          {/* Refresh */}
          {refreshable && (
            <Button variant='outline' size='sm' onClick={onRefresh}>
              <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        className={cn('rounded-md border bg-card', sticky && 'sticky top-0 z-10', maxHeight && 'overflow-auto')}
        style={{ maxHeight }}
      >
        <Table className={cn(sizeClasses[size])}>
          <TableHeader className={sticky ? 'sticky top-0 bg-background z-20' : undefined}>
            <TableRow>
              {/* Selection Column */}
              {selection && (
                <TableHead className='w-12'>
                  <Checkbox
                    checked={paginatedData.length > 0 && selection.selectedRowKeys.length === paginatedData.length}
                    onCheckedChange={handleSelectAll}
                    aria-label='Select all'
                  />
                </TableHead>
              )}

              {/* Expandable Column */}
              {expandable && <TableHead className='w-12'></TableHead>}

              {/* Data Columns */}
              {visibleColumnsArray.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    column.className,
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer hover:bg-muted/50',
                    column.width && `w-[${column.width}]`,
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className='flex items-center gap-2'>
                    {column.title}
                    {column.sortable && (
                      <div className='flex flex-col'>
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className='h-3 w-3' />
                          ) : (
                            <ChevronDown className='h-3 w-3' />
                          )
                        ) : (
                          <div className='h-3 w-3' />
                        )}
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}

              {/* Actions Column */}
              {actions && actions.length > 0 && <TableHead className='w-12'>Actions</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnsArray.length + (selection ? 1 : 0) + (expandable ? 1 : 0) + (actions ? 1 : 0)}
                  className='h-24 text-center'
                >
                  <div className='flex items-center justify-center'>
                    <RefreshCw className='h-4 w-4 animate-spin mr-2' />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnsArray.length + (selection ? 1 : 0) + (expandable ? 1 : 0) + (actions ? 1 : 0)}
                  className='h-24 text-center text-muted-foreground'
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((record, index) => {
                const rowKeyValue = getRowKey(record, index)
                const isExpanded = expandedRows.has(rowKeyValue)
                const isSelected = selection?.selectedRowKeys.includes(rowKeyValue)

                return (
                  <React.Fragment key={rowKeyValue}>
                    <TableRow className={cn(striped && index % 2 === 0 && 'bg-muted/25', isSelected && 'bg-muted/50')}>
                      {/* Selection Cell */}
                      {selection && (
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleSelectRow(rowKeyValue, record)}
                            aria-label={`Select row ${index + 1}`}
                            {...selection.getCheckboxProps?.(record)}
                          />
                        </TableCell>
                      )}

                      {/* Expandable Cell */}
                      {expandable && (
                        <TableCell>
                          <Button variant='ghost' size='sm' onClick={() => handleExpandRow(rowKeyValue)}>
                            {isExpanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
                          </Button>
                        </TableCell>
                      )}

                      {/* Data Cells */}
                      {visibleColumnsArray.map((column) => (
                        <TableCell
                          key={column.key}
                          className={cn(
                            column.className,
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right',
                          )}
                        >
                          {renderCell(column, record, index)}
                        </TableCell>
                      ))}

                      {/* Actions Cell */}
                      {actions && actions.length > 0 && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='sm'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              {actions
                                .filter((action) => !action.visible || action.visible(record))
                                .map((action) => (
                                  <DropdownMenuItem
                                    key={action.key}
                                    onClick={() => action.onClick(record, index)}
                                    disabled={action.disabled?.(record)}
                                  >
                                    {action.icon && <action.icon className='h-4 w-4 mr-2' />}
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>

                    {/* Expanded Row */}
                    {expandable && isExpanded && (
                      <TableRow>
                        <TableCell
                          colSpan={
                            visibleColumnsArray.length + (selection ? 1 : 0) + (expandable ? 1 : 0) + (actions ? 1 : 0)
                          }
                          className='p-0'
                        >
                          <div className='p-4 bg-muted/25'>{expandable.expandedRowRender(record, index)}</div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })
            )}
          </TableBody>

          {/* Table Footer/Summary */}
          {summary && <TableFooter>{summary(processedData)}</TableFooter>}
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className='flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            Showing {(pagination.current - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} entries
          </div>

          <div className='flex items-center space-x-2'>
            {pagination.showSizeChanger && (
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(value) => {
                  // Handle page size change
                  console.log('Page size changed:', value)
                }}
              >
                <SelectTrigger className='w-20'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pagination.pageSizeOptions?.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                // Handle previous page
                console.log('Previous page')
              }}
              disabled={pagination.current <= 1}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>

            <div className='flex items-center gap-1'>
              <span className='text-sm'>Page</span>
              <span className='text-sm font-medium'>{pagination.current}</span>
              <span className='text-sm'>of</span>
              <span className='text-sm font-medium'>{Math.ceil(pagination.total / pagination.pageSize)}</span>
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                // Handle next page
                console.log('Next page')
              }}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
