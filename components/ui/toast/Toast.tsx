'use client'

import React from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

export interface ToastProps {
  id: string
  title: string
  message?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onHide?: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

export function Toast({
  id,
  title,
  message,
  type = 'info',
  onHide,
}: ToastProps) {
  const Icon = toastIcons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={clsx(
        'flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg',
        toastStyles[type],
      )}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
      </div>
      <button
        onClick={() => onHide?.(id)}
        className="flex-shrink-0 rounded p-1 hover:bg-black/10">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
