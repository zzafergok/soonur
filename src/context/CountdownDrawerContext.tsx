'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { CountdownDrawer } from '@/components/countdown/CountdownDrawer'
import { useCustomCountdowns, CustomCountdownEvent } from '@/hooks/useCustomCountdowns'

interface CountdownDrawerContextType {
  isOpen: boolean
  editEvent: CustomCountdownEvent | undefined
  openDrawer: () => void
  openEditDrawer: (event: CustomCountdownEvent) => void
  closeDrawer: () => void
}

const CountdownDrawerContext = createContext<CountdownDrawerContextType | undefined>(undefined)

export function CountdownDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [editEvent, setEditEvent] = useState<CustomCountdownEvent | undefined>(undefined)
  const { addCustomCountdown, updateCustomCountdown } = useCustomCountdowns()

  const openDrawer = useCallback(() => {
    setEditEvent(undefined)
    setIsOpen(true)
  }, [])

  const openEditDrawer = useCallback((event: CustomCountdownEvent) => {
    setEditEvent(event)
    setIsOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsOpen(false)
    // Small delay to clear event after animation starts closing
    setTimeout(() => setEditEvent(undefined), 300)
  }, [])

  return (
    <CountdownDrawerContext.Provider value={{ isOpen, editEvent, openDrawer, openEditDrawer, closeDrawer }}>
      {children}
      <CountdownDrawer
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) closeDrawer()
        }}
        editEvent={editEvent}
        onSubmit={addCustomCountdown}
        onUpdate={updateCustomCountdown}
        onSuccess={closeDrawer}
      />
    </CountdownDrawerContext.Provider>
  )
}

export function useCountdownDrawer() {
  const context = useContext(CountdownDrawerContext)
  if (context === undefined) {
    throw new Error('useCountdownDrawer must be used within a CountdownDrawerProvider')
  }
  return context
}
