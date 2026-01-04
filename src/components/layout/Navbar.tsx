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
      <div className='w-full flex justify-center py-4 md:py-6 z-[100] px-4 sticky top-0'>
        <nav className='bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-full px-4 py-3 md:px-6 md:py-3 flex items-center justify-between w-full max-w-2xl relative transition-all duration-300'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2 z-10'>
            <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm'>
              <Timer className='w-4 h-4 text-white' />
            </div>
            <span className='font-bold text-lg text-gray-900 tracking-tight block'>Soonur</span>
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center gap-4'>
            <Link href='/categories' className='text-sm font-medium text-gray-600 hover:text-primary transition-colors'>
              Tüm Etkinlikler
            </Link>
            <Button
              size='sm'
              onClick={openDrawer}
              className='bg-primary hover:bg-primary/90 text-white rounded-full px-6'
            >
              Geri Sayım Oluştur
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className='flex items-center gap-2 md:hidden z-10'>
            <Button
              size='sm'
              onClick={openDrawer}
              className='bg-primary hover:bg-primary/90 text-white rounded-full px-3 h-8 text-xs'
            >
              <Plus className='w-4 h-4' />
              <span className='ml-1 hidden sm:inline'>Oluştur</span>
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='p-2 text-gray-600 hover:text-gray-900 focus:outline-none'
            >
              {isMobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-top-2 flex flex-col p-2 gap-1 z-20'>
              {pathname !== '/' && (
                <Link
                  href='/'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors'
                >
                  <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                    <Timer className='w-4 h-4 text-primary' />
                  </div>
                  Anasayfa
                </Link>
              )}
              <Link
                href='/categories'
                onClick={() => setIsMobileMenuOpen(false)}
                className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors'
              >
                <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                  <Menu className='w-4 h-4 text-primary' />
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
          className='fixed inset-0 bg-black/20 z-[90] md:hidden backdrop-blur-sm animate-in fade-in'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
