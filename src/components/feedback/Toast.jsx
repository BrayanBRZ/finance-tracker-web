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
      className={`border-border bg-card fixed right-6 bottom-6 z-50 flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all duration-350 ease-in-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'} `}
    >
      <CheckCircle2 size={20} className="text-primary shrink-0" />
      <p className="text-card-foreground flex-1 text-sm font-medium">
        {message}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fechar notificação"
        className="text-muted-foreground hover:text-foreground ml-1 shrink-0 cursor-pointer transition-colors"
      >
        <X size={15} />
      </button>
    </div>
  )
}
