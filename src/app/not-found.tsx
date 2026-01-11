'use client'

import { useRouter } from 'next/navigation'

import { Home, ArrowLeft } from 'lucide-react'

import { Button } from '@/components/core/button'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
      {/* 404 Visual */}
      <div className='relative mb-8'>
        <div className='select-none text-9xl font-black text-primary/10'>404</div>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='animate-pulse text-3xl font-bold text-primary'>Sayfa Bulunamadı</div>
        </div>
      </div>

      {/* Message */}
      <div className='mx-auto mb-10 max-w-md space-y-4'>
        <p className='text-lg text-slate-600 dark:text-slate-300'>
          Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
        </p>
      </div>

      {/* Actions */}
      <div className='flex w-full max-w-xs flex-col justify-center gap-3 sm:max-w-none sm:flex-row'>
        <Button onClick={() => router.push('/')} className='gap-2 rounded-xl px-8'>
          <Home className='h-4 w-4' />
          Ana Sayfa
        </Button>
        <Button variant='outline' onClick={() => router.back()} className='gap-2 rounded-xl px-8'>
          <ArrowLeft className='h-4 w-4' />
          Geri Dön
        </Button>
      </div>
    </div>
  )
}
