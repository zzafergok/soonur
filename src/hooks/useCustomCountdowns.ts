'use client'

import { useState, useEffect, useCallback } from 'react'

// Type matching countdown-events.ts
export type EventType = 'exam' | 'application_start' | 'application_end' | 'result' | 'holiday'

export interface CustomCountdownEvent {
  id: string
  title: string
  targetDate: string // ISO string for localStorage compatibility
  color: string
  priority: number
  type: EventType // Matching countdown-events.ts
  notes?: string
  isCustom: true
  createdAt: string // ISO string
}

const STORAGE_KEY = 'soonur_custom_countdowns'

// Convert stored event to usable format with Date objects
export function parseCustomEvent(event: CustomCountdownEvent): CustomCountdownEvent & { targetDateObj: Date } {
  return {
    ...event,
    targetDateObj: new Date(event.targetDate),
  }
}

export function useCustomCountdowns() {
  const [customEvents, setCustomEvents] = useState<CustomCountdownEvent[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CustomCountdownEvent[]
        setCustomEvents(parsed)
      }
    } catch (error) {
      console.error('Failed to load custom countdowns:', error)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever events change
  const saveToStorage = useCallback((events: CustomCountdownEvent[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch (error) {
      console.error('Failed to save custom countdowns:', error)
    }
  }, [])

  // Add new countdown
  const addCustomCountdown = useCallback(
    (event: Omit<CustomCountdownEvent, 'id' | 'isCustom' | 'createdAt'>) => {
      const newEvent: CustomCountdownEvent = {
        ...event,
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isCustom: true,
        createdAt: new Date().toISOString(),
      }

      setCustomEvents((prev) => {
        const updated = [...prev, newEvent]
        saveToStorage(updated)
        return updated
      })

      return newEvent
    },
    [saveToStorage],
  )

  // Update existing countdown
  const updateCustomCountdown = useCallback(
    (id: string, updates: Partial<Omit<CustomCountdownEvent, 'id' | 'isCustom' | 'createdAt'>>) => {
      setCustomEvents((prev) => {
        const updated = prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
        saveToStorage(updated)
        return updated
      })
    },
    [saveToStorage],
  )

  // Delete countdown
  const deleteCustomCountdown = useCallback(
    (id: string) => {
      setCustomEvents((prev) => {
        const updated = prev.filter((event) => event.id !== id)
        saveToStorage(updated)
        return updated
      })
    },
    [saveToStorage],
  )

  // Get event by ID
  const getCustomCountdown = useCallback(
    (id: string) => {
      return customEvents.find((event) => event.id === id)
    },
    [customEvents],
  )

  return {
    customEvents,
    isLoaded,
    addCustomCountdown,
    updateCustomCountdown,
    deleteCustomCountdown,
    getCustomCountdown,
  }
}
