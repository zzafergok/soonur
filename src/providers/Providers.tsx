'use client'

import React from 'react'
import { CountdownDrawerProvider } from '@/context/CountdownDrawerContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return <CountdownDrawerProvider>{children}</CountdownDrawerProvider>
}
