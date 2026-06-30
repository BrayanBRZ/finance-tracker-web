import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

export function Toast({ message, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true))

    const hide = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 350)
    }, 4500)

    return () => {
      cancelAnimationFrame(show)
      clearTimeout(hide)
    }
  }, [onClose])

  const dismiss = () => {
    setVisible(false)
    setTimeout(onClose, 350)
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-3
        rounded-xl border border-border bg-card
        shadow-lg
        px-4 py-3
        max-w-sm
        transition-all duration-350 ease-in-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
      `}
    >
      <CheckCircle2 size={20} className="text-primary shrink-0" />
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
