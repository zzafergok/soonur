'use client'

import React, { useState, useCallback, useMemo } from 'react'

import { format } from 'date-fns'
import { Search, Filter, X, Calendar as CalendarIcon, Plus, Minus, ChevronDown } from 'lucide-react'

import { Input } from '@/components/core/input'
import { Badge } from '@/components/core/badge'
import { Button } from '@/components/core/button'
import { Calendar } from '@/components/core/calendar'
import { Checkbox } from '@/components/core/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/core/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

import { cn } from '@/utils/utils'

// Filter Types
export type FilterType = 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'daterange' | 'boolean' | 'search'

export interface FilterOption {
  label: string
  value: string | number | boolean
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

export interface FilterField {
  key: string
  label: string
  type: FilterType
  placeholder?: string
  options?: FilterOption[]
  validation?: {
    min?: number
    max?: number
    required?: boolean
    pattern?: RegExp
  }
  defaultValue?: any
  width?: string
  visible?: boolean
  searchable?: boolean // For select/multiselect
  allowClear?: boolean
  multiple?: boolean // For text inputs (tags)
}

export interface FilterGroup {
  key: string
  label: string
  fields: FilterField[]
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export interface FilterValues {
  [key: string]: any
}

export interface SearchFiltersProps {
  fields?: FilterField[]
  groups?: FilterGroup[]
  values: FilterValues
  onChange: (values: FilterValues) => void
  onSearch?: (searchText: string) => void
  searchPlaceholder?: string
  showSearch?: boolean
  showClearAll?: boolean
  showFilterCount?: boolean
  className?: string
  size?: 'small' | 'default' | 'large'
  layout?: 'horizontal' | 'vertical' | 'grid'
  gridColumns?: number
  collapsible?: boolean
  defaultCollapsed?: boolean
  maxHeight?: string
}

export function EnhancedSearchFilters({
  fields = [],
  groups = [],
  values,
  onChange,
  onSearch,
  searchPlaceholder = 'Search...',
  showSearch = true,
  showClearAll = true,
  showFilterCount = true,
  className,
  size = 'default',
  layout = 'horizontal',
  gridColumns = 3,
  collapsible = false,
  defaultCollapsed = false,
  maxHeight,
}: SearchFiltersProps) {
  const [searchText, setSearchText] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [groupCollapsed, setGroupCollapsed] = useState<Record<string, boolean>>(
    groups.reduce(
      (acc, group) => ({
        ...acc,
        [group.key]: group.defaultCollapsed || false,
      }),
      {},
    ),
  )

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(values).filter((value) => {
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value !== undefined && value !== null && value !== ''
    }).length
  }, [values])

  // Handle filter value change
  const handleValueChange = useCallback(
    (key: string, value: any) => {
      onChange({
        ...values,
        [key]: value,
      })
    },
    [values, onChange],
  )

  // Handle clear all filters
  const handleClearAll = useCallback(() => {
    onChange({})
    setSearchText('')
    if (onSearch) {
      onSearch('')
    }
  }, [onChange, onSearch])

  // Handle search
  const handleSearch = useCallback(
    (text: string) => {
      setSearchText(text)
      if (onSearch) {
        onSearch(text)
      }
    },
    [onSearch],
  )

  // Handle group collapse toggle
  const handleGroupCollapse = useCallback((groupKey: string) => {
    setGroupCollapsed((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }))
  }, [])

  // Render filter field
  const renderFilterField = useCallback(
    (field: FilterField) => {
      if (!field.visible && field.visible !== undefined) return null

      const value = values[field.key]

      switch (field.type) {
        case 'text':
          return (
            <div key={field.key} className={cn('space-y-2', field.width)}>
              <label className='text-sm font-medium'>{field.label}</label>
              <Input
                placeholder={field.placeholder}
                value={value || ''}
                onChange={(e) => handleValueChange(field.key, e.target.value)}
                className={size === 'small' ? 'h-8' : size === 'large' ? 'h-12' : ''}
              />
            </div>
          )

        case 'number':
          return (
            <div key={field.key} className={cn('space-y-2', field.width)}>
              <label className='text-sm font-medium'>{field.label}</label>
              <Input
                type='number'
                placeholder={field.placeholder}
                value={value || ''}
                onChange={(e) => handleValueChange(field.key, e.target.value ? Number(e.target.value) : '')}
                min={field.validation?.min}
                max={field.validation?.max}
                className={size === 'small' ? 'h-8' : size === 'large' ? 'h-12' : ''}
              />
            </div>
          )

        case 'select':
          return (
            <div key={field.key} className={cn('space-y-2', field.width)}>
              <label className='text-sm font-medium'>{field.label}</label>
              <Select value={value || ''} onValueChange={(newValue) => handleValueChange(field.key, newValue)}>
                <SelectTrigger className={size === 'small' ? 'h-8' : size === 'large' ? 'h-12' : ''}>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.allowClear && (
                    <SelectItem value=''>
                      <span className='text-muted-foreground'>Clear selection</span>
                    </SelectItem>
                  )}
                  {field.options?.map((option) => (
                    <SelectItem key={String(option.value)} value={String(option.value)} disabled={option.disabled}>
                      <div className='flex items-center gap-2'>
                        {option.icon && <option.icon className='h-4 w-4' />}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )

        case 'multiselect':
          return (
            <div key={field.key} className={cn('space-y-2', field.width)}>
              <label className='text-sm font-medium'>{field.label}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full justify-between',
                      size === 'small' ? 'h-8' : size === 'large' ? 'h-12' : '',
                      !value?.length && 'text-muted-foreground',
                    )}
                  >
                    {value?.length ? (
                      <div className='flex items-center gap-1'>
                        <Badge variant='secondary'>{value.length} selected</Badge>
                      </div>
                    ) : (
                      field.placeholder || 'Select options'
                    )}
                    <ChevronDown className='h-4 w-4 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0' align='start'>
                  <div className='max-h-60 overflow-auto'>
                    {field.options?.map((option) => (
                      <div key={String(option.value)} className='flex items-center space-x-2 p-2 hover:bg-muted'>
                        <Checkbox
                          checked={value?.includes(option.value) || false}
                          onCheckedChange={(checked) => {
                            const currentValues = value || []
                            const newValues = checked
                              ? [...currentValues, option.value]
                              : currentValues.filter((v: any) => v !== option.value)
                            handleValueChange(field.key, newValues)
                          }}
                          disabled={option.disabled}
                        />
                        <div className='flex items-center gap-2'>
                          {option.icon && <option.icon className='h-4 w-4' />}
                          <span className='text-sm'>{option.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )

        case 'date':
          return (
            <div key={field.key} className={cn('space-y-2', field.width)}>
              <label className='text-sm font-medium'>{field.label}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      size === 'small' ? 'h-8' : size === 'large' ? 'h-12' : '',
                      !value && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {value ? format(new Date(value), 'PPP') : field.placeholder || 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={value ? new Date(value) : undefined}
                    onSelect={(date) => handleValueChange(field.key, date?.toISOString())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )

        case 'daterange':
          return (
            <div key={field.key} className={cn('space-y-2', field.width)}>
              <label className='text-sm font-medium'>{field.label}</label>
              <div className='flex items-center gap-2'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'flex-1 justify-start text-left font-normal',
                        size === 'small' ? 'h-8' : size === 'large' ? 'h-12' : '',
                        !value?.start && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {value?.start ? format(new Date(value.start), 'MMM dd') : 'Start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={value?.start ? new Date(value.start) : undefined}
                      onSelect={(date) =>
                        handleValueChange(field.key, {
                          ...value,
                          start: date?.toISOString(),
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>

                <span className='text-muted-foreground'>to</span>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'flex-1 justify-start text-left font-normal',
                        size === 'small' ? 'h-8' : size === 'large' ? 'h-12' : '',
                        !value?.end && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {value?.end ? format(new Date(value.end), 'MMM dd') : 'End date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={value?.end ? new Date(value.end) : undefined}
                      onSelect={(date) =>
                        handleValueChange(field.key, {
                          ...value,
                          end: date?.toISOString(),
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )

        case 'boolean':
          return (
            <div key={field.key} className={cn('space-y-2', field.width)}>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  checked={value || false}
                  onCheckedChange={(checked) => handleValueChange(field.key, checked)}
                />
                <label className='text-sm font-medium'>{field.label}</label>
              </div>
            </div>
          )

        default:
          return null
      }
    },
    [values, handleValueChange, size],
  )

  // Get layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col gap-4'
      case 'grid':
        return `grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridColumns}`
      default:
        return 'flex flex-wrap items-end gap-4'
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Controls */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        {/* Search */}
        {showSearch && (
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder={searchPlaceholder}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className={cn('pl-9', size === 'small' ? 'h-8' : size === 'large' ? 'h-12' : '')}
            />
          </div>
        )}

        {/* Filter Controls */}
        <div className='flex items-center gap-2'>
          {/* Active Filter Count */}
          {showFilterCount && activeFilterCount > 0 && (
            <Badge variant='secondary'>
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
            </Badge>
          )}

          {/* Collapse Toggle */}
          {collapsible && (
            <Button
              variant='outline'
              size={size === 'small' ? 'sm' : 'default'}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Filter className='h-4 w-4 mr-2' />
              {isCollapsed ? 'Show Filters' : 'Hide Filters'}
            </Button>
          )}

          {/* Clear All */}
          {showClearAll && (activeFilterCount > 0 || searchText) && (
            <Button variant='outline' size={size === 'small' ? 'sm' : 'default'} onClick={handleClearAll}>
              <X className='h-4 w-4 mr-2' />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {(!collapsible || !isCollapsed) && (
        <div className={cn('border rounded-lg p-4 space-y-4', maxHeight && 'overflow-auto')} style={{ maxHeight }}>
          {/* Standalone Fields */}
          {fields.length > 0 && <div className={getLayoutClasses()}>{fields.map(renderFilterField)}</div>}

          {/* Grouped Fields */}
          {groups.map((group) => (
            <div key={group.key} className='space-y-3'>
              {/* Group Header */}
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-medium'>{group.label}</h3>
                {group.collapsible && (
                  <Button variant='ghost' size='sm' onClick={() => handleGroupCollapse(group.key)}>
                    {groupCollapsed[group.key] ? <Plus className='h-4 w-4' /> : <Minus className='h-4 w-4' />}
                  </Button>
                )}
              </div>

              {/* Group Fields */}
              {(!group.collapsible || !groupCollapsed[group.key]) && (
                <div className={getLayoutClasses()}>{group.fields.map(renderFilterField)}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Hook for managing filter state
export function useFilters(initialValues: FilterValues = {}) {
  const [values, setValues] = useState<FilterValues>(initialValues)

  const updateFilter = useCallback((key: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const updateFilters = useCallback((newValues: FilterValues) => {
    setValues(newValues)
  }, [])

  const clearFilter = useCallback((key: string) => {
    setValues((prev) => {
      const { [key]: _, ...rest } = prev
      return rest
    })
  }, [])

  const clearAllFilters = useCallback(() => {
    setValues({})
  }, [])

  const getActiveFilters = useCallback(() => {
    return Object.entries(values).filter(([_, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value !== undefined && value !== null && value !== ''
    })
  }, [values])

  const hasActiveFilters = useMemo(() => {
    return getActiveFilters().length > 0
  }, [getActiveFilters])

  return {
    values,
    updateFilter,
    updateFilters,
    clearFilter,
    clearAllFilters,
    getActiveFilters,
    hasActiveFilters,
  }
}

// Utility function to apply filters to data
export function applyFilters<T>(data: T[], filters: FilterValues, fieldMap: Record<string, keyof T>): T[] {
  return data.filter((item) => {
    return Object.entries(filters).every(([filterKey, filterValue]) => {
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
        return true
      }

      const dataKey = fieldMap[filterKey]
      if (!dataKey) return true

      const itemValue = item[dataKey]

      if (Array.isArray(filterValue)) {
        return filterValue.includes(itemValue)
      }

      if (typeof filterValue === 'object' && filterValue.start && filterValue.end) {
        const itemDate = new Date(itemValue as any)
        const startDate = new Date(filterValue.start)
        const endDate = new Date(filterValue.end)
        return itemDate >= startDate && itemDate <= endDate
      }

      if (typeof filterValue === 'string') {
        return String(itemValue).toLowerCase().includes(filterValue.toLowerCase())
      }

      return itemValue === filterValue
    })
  })
}

// Predefined filter field types for common use cases
export const CommonFilterFields = {
  dateRange: (key: string, label: string): FilterField => ({
    key,
    label,
    type: 'daterange',
    placeholder: 'Select date range',
  }),

  status: (key: string, label: string, options: FilterOption[]): FilterField => ({
    key,
    label,
    type: 'select',
    options,
    allowClear: true,
    placeholder: 'Select status',
  }),

  multiStatus: (key: string, label: string, options: FilterOption[]): FilterField => ({
    key,
    label,
    type: 'multiselect',
    options,
    placeholder: 'Select statuses',
  }),

  search: (key: string, label: string): FilterField => ({
    key,
    label,
    type: 'text',
    placeholder: 'Search...',
  }),

  boolean: (key: string, label: string): FilterField => ({
    key,
    label,
    type: 'boolean',
  }),
}
