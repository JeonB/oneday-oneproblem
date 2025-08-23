'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { Toast, type ToastProps } from './Toast'

interface ToasterProps {
  toasts: ToastProps[]
  onHide: (id: string) => void
}

export function Toaster({ toasts, onHide }: ToasterProps) {
  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onHide={onHide} />
        ))}
      </AnimatePresence>
    </div>
  )
}
