'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useState } from 'react'

import { Timer, Menu, X, Plus } from 'lucide-react'

import { Button } from '../core/button'

import { useCountdownDrawer } from '@/context/CountdownDrawerContext'

export function Navbar() {
  const pathname = usePathname()
  const { openDrawer } = useCountdownDrawer()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <div className='sticky top-0 z-[100] flex w-full justify-center px-4 py-4 md:py-6'>
        <nav className='relative flex w-full max-w-2xl items-center justify-between rounded-full border border-white/20 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-md transition-all duration-300 md:px-6 md:py-3'>
          {/* Logo */}
          <Link href='/' className='z-10 flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-sm'>
              <Timer className='h-4 w-4 text-white' />
            </div>
            <span className='block text-lg font-bold tracking-tight text-gray-900'>Soonur</span>
          </Link>

          {/* Desktop Menu */}
          <div className='hidden items-center gap-4 md:flex'>
            <Link href='/categories' className='text-sm font-medium text-gray-600 transition-colors hover:text-primary'>
              Tüm Etkinlikler
            </Link>
            <Button
              size='sm'
              onClick={openDrawer}
              className='rounded-full bg-primary px-6 text-white hover:bg-primary/90'
            >
              Geri Sayım Oluştur
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className='z-10 flex items-center gap-2 md:hidden'>
            <Button
              size='sm'
              onClick={openDrawer}
              className='h-8 rounded-full bg-primary px-3 text-xs text-white hover:bg-primary/90'
            >
              <Plus className='h-4 w-4' />
              <span className='ml-1 hidden sm:inline'>Oluştur</span>
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='p-2 text-gray-600 hover:text-gray-900 focus:outline-none'
            >
              {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className='animate-in slide-in-from-top-2 absolute left-0 right-0 top-full z-20 mt-2 flex flex-col gap-1 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl'>
              {pathname !== '/' && (
                <Link
                  href='/'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50'
                >
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                    <Timer className='h-4 w-4 text-primary' />
                  </div>
                  Anasayfa
                </Link>
              )}
              <Link
                href='/categories'
                onClick={() => setIsMobileMenuOpen(false)}
                className='flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50'
              >
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                  <Menu className='h-4 w-4 text-primary' />
                </div>
                Tüm Etkinlikler
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className='animate-in fade-in fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm md:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
