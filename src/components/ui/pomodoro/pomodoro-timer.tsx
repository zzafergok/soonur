'use client'

import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { X, Play, Pause, Timer, Square, Coffee, Target, Circle } from 'lucide-react'

import { Button } from '@/components/core/button'
import { Card, CardContent } from '@/components/core/card'

import { usePomodoroStore } from '@/store/pomodoro-store'

import { cn } from '@/utils/utils'

interface PomodoroTimerProps {
  className?: string
}

export function PomodoroTimer({ className }: PomodoroTimerProps) {
  const { t } = useTranslation()
  const {
    tick,
    mode,
    reset,
    pause,
    resume,
    status,
    timeLeft,
    startFocus,
    startBreak,
    currentCycle,
    completedSessions,
  } = usePomodoroStore()

  const [isMinimized, setIsMinimized] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  // const [soundEnabled, setSoundEnabled] = useState(true)

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (status === 'running') {
      interval = setInterval(() => {
        tick()
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [status, tick])

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = (): number => {
    const { duration } = usePomodoroStore.getState()
    return duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0
  }

  const getModeConfig = () => {
    switch (mode) {
      case 'focus':
        return {
          icon: <Target className='w-4 h-4' />,
          label: t('pomodoro.focus'),
          color: 'bg-red-500',
          bgColor: 'from-red-500/20 to-red-600/20',
          borderColor: 'border-red-200 dark:border-red-800',
        }
      case 'break':
        return {
          icon: <Coffee className='w-4 h-4' />,
          label: t('pomodoro.shortBreak'),
          color: 'bg-green-500',
          bgColor: 'from-green-500/20 to-green-600/20',
          borderColor: 'border-green-200 dark:border-green-800',
        }
      case 'long-break':
        return {
          icon: <Coffee className='w-4 h-4' />,
          label: t('pomodoro.longBreak'),
          color: 'bg-blue-500',
          bgColor: 'from-blue-500/20 to-blue-600/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
        }
      default:
        return {
          icon: <Timer className='w-4 h-4' />,
          label: t('pomodoro.ready'),
          color: 'bg-gray-500',
          bgColor: 'from-gray-500/20 to-gray-600/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
        }
    }
  }

  const config = getModeConfig()

  if (status === 'idle') {
    return null
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 z-50 transition-all duration-300 ease-in-out',
        isMinimized ? 'w-16 h-16' : 'w-80',
        className,
      )}
    >
      <Card className={cn('relative overflow-hidden shadow-2xl', config.borderColor)}>
        {/* Background gradient */}
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', config.bgColor)} />

        {isMinimized && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='relative w-14 h-14'>
              {/* Background circle */}
              <Circle className='w-14 h-14 text-muted/20' strokeWidth={3} fill='none' />
              {/* Progress circle */}
              <Circle
                className={cn(
                  'w-14 h-14 absolute inset-0 transition-all duration-1000',
                  mode === 'focus' ? 'text-red-500' : mode === 'break' ? 'text-green-500' : 'text-blue-500',
                )}
                style={{
                  strokeDasharray: `${2 * Math.PI * 22}`,
                  strokeDashoffset: `${2 * Math.PI * 22 * (1 - getProgressPercentage() / 100)}`,
                  transform: 'rotate(-90deg)',
                }}
                strokeWidth={3}
                fill='none'
                strokeLinecap='round'
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='text-center'>
                  <div className='text-[10px] font-mono font-bold text-foreground leading-tight'>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <CardContent className={cn('relative z-10', isMinimized ? 'p-0' : 'p-4')}>
          {/* Minimized view */}
          {isMinimized ? (
            <button
              onClick={() => setIsMinimized(false)}
              className='w-full h-16 flex items-center justify-center hover:bg-white/10 transition-colors rounded-lg'
            >
              <span className='sr-only'>{t('pomodoro.expandTimer')}</span>
            </button>
          ) : (
            /* Expanded view */
            <div className='space-y-4'>
              {/* Header */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className={cn('p-1.5 rounded-lg text-white', config.color)}>{config.icon}</div>
                  <div>
                    <h3 className='text-sm font-semibold text-foreground'>{config.label}</h3>
                    <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                      <span>
                        {t('pomodoro.session')} {currentCycle} • {completedSessions} {t('pomodoro.completed')}
                      </span>
                      <span className='text-xs'>•</span>
                      <span className='font-mono'>{currentTime.toLocaleTimeString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-1'>
                  {/* <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className='w-8 h-8 p-0'
                  >
                    {soundEnabled ? <Volume2 className='w-4 h-4' /> : <VolumeX className='w-4 h-4' />}
                  </Button> */}
                  <Button variant='ghost' size='sm' onClick={() => setIsMinimized(true)} className='w-8 h-8 p-0'>
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              </div>

              {/* Timer display */}
              <div className='text-center space-y-3'>
                <div className='relative'>
                  <div className='text-4xl font-mono font-bold text-foreground'>{formatTime(timeLeft)}</div>
                  {status === 'completed' && (
                    <div className='absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg'>
                      <span className='text-lg font-semibold text-primary animate-pulse'>
                        {t('pomodoro.sessionComplete')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
                  <div
                    className={cn('h-full rounded-full transition-all duration-1000', config.color)}
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className='flex items-center justify-center gap-2'>
                {status === 'completed' ? (
                  <div className='flex gap-2'>
                    <Button onClick={mode === 'focus' ? startBreak : startFocus} className='flex-1' variant='default'>
                      {mode === 'focus' ? (
                        <>
                          <Coffee className='w-4 h-4 mr-2' />
                          {t('pomodoro.startBreak')}
                        </>
                      ) : (
                        <>
                          <Target className='w-4 h-4 mr-2' />
                          {t('pomodoro.focusAction')}
                        </>
                      )}
                    </Button>
                    <Button onClick={reset} variant='outline' size='sm'>
                      <Square className='w-4 h-4' />
                    </Button>
                  </div>
                ) : (
                  <div className='flex gap-2'>
                    <Button onClick={status === 'running' ? pause : resume} variant='default' size='sm'>
                      {status === 'running' ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
                    </Button>
                    <Button onClick={reset} variant='outline' size='sm'>
                      <Square className='w-4 h-4' />
                    </Button>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              {status === 'completed' ? (
                <div className='flex gap-2 pt-2 border-t border-border/50'>
                  <Button onClick={startFocus} variant='outline' size='sm' className='flex-1'>
                    <Target className='w-4 h-4 mr-1' />
                    {t('pomodoro.focusAction')}
                  </Button>
                  <Button onClick={startBreak} variant='outline' size='sm' className='flex-1'>
                    <Coffee className='w-4 h-4 mr-1' />
                    {t('pomodoro.break')}
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
