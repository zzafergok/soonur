'use client'

import Link from 'next/link'

import { Timer } from 'lucide-react'

import { Button } from '../core/button'

import { useCountdownDrawer } from '@/context/CountdownDrawerContext'

export function Navbar() {
  const { openDrawer } = useCountdownDrawer()

  return (
    <div className='w-full flex justify-center py-6 z-50 px-4'>
      <nav className='bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-full px-6 py-3 flex items-center justify-between w-full max-w-2xl'>
        <Link href='/' className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-countdown-primary rounded-full flex items-center justify-center shadow-sm'>
            <Timer className='w-4 h-4 text-white' />
          </div>
          <span className='font-bold text-lg text-gray-900 tracking-tight'>Soonur</span>
        </Link>

        <div className='flex items-center gap-4'>
          <Link
            href='/categories'
            className='text-sm font-medium text-gray-600 hover:text-countdown-primary transition-colors hidden md:block'
          >
            Tüm Etkinlikler
          </Link>
          <Button
            size='sm'
            onClick={openDrawer}
            className='bg-countdown-primary hover:bg-countdown-primary/90 text-white rounded-full px-6'
          >
            Geri Sayım Oluştur
          </Button>
        </div>
      </nav>
    </div>
  )
}
