import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react'

const icons = {
  success: CheckCircle,
  info: Info,
  warn: AlertTriangle,
  error: XCircle,
}

const colors = {
  success: { border: 'border-l-eco-400', icon: 'text-eco-400' },
  info: { border: 'border-l-blue-400', icon: 'text-blue-400' },
  warn: { border: 'border-l-amber-400', icon: 'text-amber-400' },
  error: { border: 'border-l-red-400', icon: 'text-red-400' },
}

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((msg, type = 'info') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  return { toasts, showToast }
}

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence>
        {toasts.map(({ id, msg, type }) => {
          const Icon = icons[type] || Info
          const c = colors[type] || colors.info
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 bg-[rgba(10,22,16,0.95)] backdrop-blur-xl border border-border-bright rounded-xl min-w-[280px] shadow-[0_8px_40px_rgba(0,0,0,0.4)] border-l-[3px] ${c.border}`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${c.icon}`} />
              <span className="text-sm text-eco-100">{msg}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
