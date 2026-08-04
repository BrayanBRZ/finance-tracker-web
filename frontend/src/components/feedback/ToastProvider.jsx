import { useCallback, useMemo, useState } from 'react'
import { Toast } from '@/components/feedback/Toast'
import { ToastContext } from '@/context/toastContext'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ message, variant = 'success', duration }) => {
    const nextToast = {
      id: crypto.randomUUID(),
      message,
      variant,
      duration,
    }

    setToasts((currentToasts) => [...currentToasts, nextToast])
  }, [])

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((currentToast) => currentToast.id !== toastId),
    )
  }, [])

  const value = useMemo(() => ({ toast }), [toast])
  const currentToast = toasts[0]

  return (
    <ToastContext.Provider value={value}>
      {children}
      {currentToast ? (
        <Toast
          key={currentToast.id}
          toastId={currentToast.id}
          message={currentToast.message}
          variant={currentToast.variant}
          duration={currentToast.duration}
          onClose={dismissToast}
        />
      ) : null}
    </ToastContext.Provider>
  )
}
