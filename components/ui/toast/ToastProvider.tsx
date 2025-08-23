'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toaster } from '@/components/ui/toast/Toaster'
import type { ToastProps } from '@/components/ui/toast/Toast'

interface ToastContextType {
  showToast: (props: Omit<ToastProps, 'id'>) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (props: Omit<ToastProps, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast: ToastProps = { ...props, id }

      setToasts(prev => [...prev, newToast])

      // Auto remove after duration
      setTimeout(() => {
        hideToast(id)
      }, props.duration || 5000)
    },
    [hideToast],
  )

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toaster toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
