'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import { DynamicBreadcrumb } from '@/components/core/dynamic-breadcrumb'

export function GlobalBreadcrumb() {
  const pathname = usePathname()

  // Hide breadcrumb on homepage
  if (pathname === '/') {
    return null
  }

  return (
    <div className='mx-auto my-4 w-full max-w-7xl px-4 md:px-8'>
      <DynamicBreadcrumb />
    </div>
  )
}
