'use client'

import React from 'react'

import { Navbar } from '@/components/layout/Navbar'
import { GlobalBreadcrumb } from '@/components/layout/GlobalBreadcrumb'

import { CountdownDrawerProvider } from '@/context/CountdownDrawerContext'

import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='tr'>
      <body className='antialiased'>
        <CountdownDrawerProvider>
          <div className='min-h-screen flex flex-col bg-[#f8fbff]'>
            <Navbar />
            <GlobalBreadcrumb />
            <main className=''>{children}</main>
            {/* <Footer /> */}
          </div>
        </CountdownDrawerProvider>
      </body>
    </html>
  )
}
