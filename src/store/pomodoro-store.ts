'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PomodoroMode = 'focus' | 'break' | 'long-break'
export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'completed'

interface PomodoroSession {
  mode: PomodoroMode
  duration: number // in seconds
  timeLeft: number
  status: PomodoroStatus
  startedAt?: Date
  completedSessions: number
  currentCycle: number
}

interface PomodoroStore extends PomodoroSession {
  // Settings
  focusDuration: number // 25 minutes default
  shortBreakDuration: number // 5 minutes default
  longBreakDuration: number // 15 minutes default
  longBreakInterval: number // Every 4 sessions

  // Actions
  startFocus: () => void
  startBreak: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  tick: () => void
  complete: () => void

  // Settings actions
  updateSettings: (settings: {
    focusDuration?: number
    shortBreakDuration?: number
    longBreakDuration?: number
    longBreakInterval?: number
  }) => void
}

const getInitialState = (): PomodoroSession => ({
  mode: 'focus',
  duration: 25 * 60, // 25 minutes in seconds
  timeLeft: 25 * 60,
  status: 'idle',
  completedSessions: 0,
  currentCycle: 1,
})

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      // Default settings (in seconds)
      focusDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      longBreakInterval: 4,

      startFocus: () => {
        const { focusDuration } = get()
        set({
          mode: 'focus',
          duration: focusDuration,
          timeLeft: focusDuration,
          status: 'running',
          startedAt: new Date(),
        })
      },

      startBreak: () => {
        const { shortBreakDuration, longBreakDuration, completedSessions, longBreakInterval } = get()
        const isLongBreak = completedSessions > 0 && completedSessions % longBreakInterval === 0
        const breakDuration = isLongBreak ? longBreakDuration : shortBreakDuration
        const breakMode: PomodoroMode = isLongBreak ? 'long-break' : 'break'

        set({
          mode: breakMode,
          duration: breakDuration,
          timeLeft: breakDuration,
          status: 'running',
          startedAt: new Date(),
        })
      },

      pause: () => {
        set({ status: 'paused' })
      },

      resume: () => {
        set({ status: 'running', startedAt: new Date() })
      },

      reset: () => {
        set({
          ...getInitialState(),
          // Keep settings and completed sessions
          completedSessions: get().completedSessions,
          focusDuration: get().focusDuration,
          shortBreakDuration: get().shortBreakDuration,
          longBreakDuration: get().longBreakDuration,
          longBreakInterval: get().longBreakInterval,
        })
      },

      tick: () => {
        const { status, timeLeft } = get()
        if (status !== 'running' || timeLeft <= 0) return

        const newTimeLeft = timeLeft - 1

        if (newTimeLeft <= 0) {
          get().complete()
        } else {
          set({ timeLeft: newTimeLeft })
        }
      },

      complete: () => {
        const { mode, completedSessions, currentCycle } = get()

        set({
          status: 'completed',
          timeLeft: 0,
          completedSessions: mode === 'focus' ? completedSessions + 1 : completedSessions,
          currentCycle: mode === 'focus' ? currentCycle + 1 : currentCycle,
        })

        // Play notification sound (if available)
        if (typeof window !== 'undefined') {
          try {
            const audio = new Audio('/notification.mp3')
            audio.play().catch(() => {
              // Fallback to system notification
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(mode === 'focus' ? 'Odaklanma tamamlandı!' : 'Mola tamamlandı!', {
                  body: mode === 'focus' ? 'Mola zamanı 🎉' : 'Tekrar odaklanma zamanı 💪',
                  icon: '/favicon.ico',
                })
              }
            })
          } catch (error) {
            console.log('Audio notification failed:', error)
          }
        }
      },

      updateSettings: (settings) => {
        set((state) => ({
          ...state,
          ...settings,
        }))
      },
    }),
    {
      name: 'pomodoro-storage',
      partialize: (state) => ({
        mode: state.mode,
        duration: state.duration,
        timeLeft: state.timeLeft,
        status: state.status,
        completedSessions: state.completedSessions,
        currentCycle: state.currentCycle,
        focusDuration: state.focusDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
        longBreakInterval: state.longBreakInterval,
      }),
      onRehydrateStorage: () => (state) => {
        // Resume timer if it was running before refresh
        if (state && (state.status === 'running' || state.status === 'paused')) {
          // Convert back to paused state to prevent automatic running
          state.status = 'paused'
        }
      },
    },
  ),
)
