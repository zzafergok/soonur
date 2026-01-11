import * as React from 'react'

// Button türleri
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  fullWidth?: boolean
  loading?: boolean
}

// Input türleri
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

// Theme türleri
export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeState {
  mode: ThemeMode
  systemPreference: 'light' | 'dark'
}
