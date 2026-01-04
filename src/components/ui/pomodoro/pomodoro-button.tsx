'use client'

import { cn } from '@/utils/utils'

import { usePomodoroStore } from '@/store/pomodoro-store'

interface PomodoroButtonProps {
  className?: string
  type: 'focus' | 'break'
}

export function PomodoroButton({ type, className }: PomodoroButtonProps) {
  const { startFocus, startBreak, status } = usePomodoroStore()

  const handleClick = () => {
    if (type === 'focus') {
      startFocus()
    } else {
      startBreak()
    }
  }

  const isDisabled = status === 'running'

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'p-1.5 sm:p-2 text-xs sm:text-sm rounded font-medium transition-all duration-200',
        type === 'focus'
          ? 'bg-primary/10 hover:bg-primary/20 text-primary disabled:bg-primary/5'
          : 'bg-muted hover:bg-muted/80 disabled:bg-muted/40',
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]',
        className,
      )}
    >
      {type === 'focus' ? 'Focus Başlat' : 'Mola Ver'}
    </button>
  )
}
