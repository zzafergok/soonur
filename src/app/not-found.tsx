'use client'

import { useRouter } from 'next/navigation'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/core/button'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] px-4 text-center'>
      {/* 404 Visual */}
      <div className='mb-8 relative'>
        <div className='text-9xl font-black text-blue-100 dark:text-blue-900/30 select-none'>404</div>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-3xl font-bold text-blue-600 dark:text-blue-400 animate-pulse'>Sayfa Bulunamadı</div>
        </div>
      </div>

      {/* Message */}
      <div className='max-w-md mx-auto space-y-4 mb-10'>
        <p className='text-gray-600 dark:text-gray-300 text-lg'>
          Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
        </p>
      </div>

      {/* Actions */}
      <div className='flex flex-col sm:flex-row gap-3 justify-center w-full max-w-xs sm:max-w-none'>
        <Button
          onClick={() => router.push('/')}
          className='flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]'
        >
          <Home className='h-4 w-4' />
          Ana Sayfa
        </Button>
        <Button
          variant='outline'
          onClick={() => router.back()}
          className='flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50 text-gray-700 min-w-[140px]'
        >
          <ArrowLeft className='h-4 w-4' />
          Geri Dön
        </Button>
      </div>
    </div>
  )
}
