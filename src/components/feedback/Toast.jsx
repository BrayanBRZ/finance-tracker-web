import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, CircleAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const toastVariants = {
  success: {
    icon: CheckCircle2,
    iconClassName: 'text-success',
    role: 'status',
  },
  error: {
    icon: CircleAlert,
    iconClassName: 'text-destructive',
    role: 'alert',
  },
}

export function Toast({
  toastId,
  message,
  variant = 'success',
  duration = 4500,
  onClose,
}) {
  const [visible, setVisible] = useState(false)
  const isClosingRef = useRef(false)
  const timeoutRef = useRef(null)
  const selectedVariant = toastVariants[variant] ?? toastVariants.success
  const Icon = selectedVariant.icon

  const dismiss = useCallback(() => {
    if (isClosingRef.current) return

    isClosingRef.current = true
    setVisible(false)
    timeoutRef.current = setTimeout(() => onClose(toastId), 350)
  }, [onClose, toastId])

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true))
    const hide = setTimeout(dismiss, duration)

    return () => {
      cancelAnimationFrame(show)
      clearTimeout(hide)
      clearTimeout(timeoutRef.current)
    }
  }, [dismiss, duration])

  return (
    <div
      role={selectedVariant.role}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'fixed right-6 bottom-6 z-50 flex max-w-sm items-center gap-3 rounded-(--radius) border border-border bg-card px-4 py-3 shadow-lg transition-all duration-350 ease-in-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
      )}
    >
      <Icon
        size={20}
        className={cn('shrink-0', selectedVariant.iconClassName)}
      />
      <p className="flex-1 text-sm font-medium text-card-foreground">
        {message}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fechar notificação"
        className="ml-1 shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
      >
        <X size={15} />
      </button>
    </div>
  )
}
