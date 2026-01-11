import React from 'react'
import { Metadata } from 'next'

import { Providers } from '@/providers/Providers'

import { Navbar } from '@/components/layout/Navbar'
import { GlobalBreadcrumb } from '@/components/layout/GlobalBreadcrumb'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Soonur - Geri Sayım ve Sınav Takvimi',
    template: '%s | Soonur',
  },
  description:
    'KPSS, YKS, ALES gibi ÖSYM sınavları, resmi tatiller ve özel günler için gelişmiş geri sayım ve takip uygulaması.',
  keywords: ['kpss sayaç', 'yks geri sayım', 'sınav takvimi', 'resmi tatiller', 'soonur'],
  authors: [{ name: 'Zafer Gök', url: 'https://github.com/zzafergok' }],
  creator: 'Zafer Gök',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://soonur.vercel.app',
    title: 'Soonur - Geri Sayım ve Sınav Takvimi',
    description: 'Sınavlara ve tatillere ne kadar kaldığını saniyesi saniyesine takip edin.',
    siteName: 'Soonur',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soonur - Geri Sayım',
    description: 'Sınavlara ne kadar kaldı?',
    creator: '@zzafergok',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='tr'>
      <body className='antialiased'>
        <Providers>
          <div className='flex min-h-screen flex-col bg-[#f8fbff]'>
            <Navbar />
            <GlobalBreadcrumb />
            <main className=''>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
