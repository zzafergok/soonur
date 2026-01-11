import React from 'react'
import { Metadata } from 'next'
import { HomeClient } from '@/components/home/HomeClient'

export const metadata: Metadata = {
  title: 'Soonur - Sınav ve Tatil Geri Sayım Aracı',
  description:
    'KPSS, YKS, ALES gibi önemli sınavlara ve kaç gün kaldığını öğrenin. Resmi tatil ve bayram sayaçları ile planlarınızı yapın.',
}

export default function Home() {
  return <HomeClient />
}
