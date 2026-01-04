'use client'

import React from 'react'

import { Navbar } from '@/components/layout/Navbar'
import { CountdownDrawerProvider } from '@/context/CountdownDrawerContext'

import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='tr'>
      <body className='antialiased'>
        <CountdownDrawerProvider>
          <div className='min-h-screen flex flex-col bg-[#f8fbff]'>
            <Navbar />
            <main className=''>{children}</main>
            {/* <Footer /> */}
          </div>
        </CountdownDrawerProvider>
      </body>
    </html>
  )
}
