import { useSyncExternalStore } from 'react'
import { WifiOff } from 'lucide-react'

function subscribeToConnection(onChange) {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

const isConnected = () => navigator.onLine

export function OfflineNotice() {
  const online = useSyncExternalStore(subscribeToConnection, isConnected)

  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-3 bottom-3 z-50 flex justify-center"
    >
      {!online && (
        <p className="border-warning/30 bg-background text-foreground flex items-center gap-2 rounded-lg border px-4 py-2 text-sm shadow-md">
          <WifiOff
            className="text-warning size-4 shrink-0"
            aria-hidden="true"
          />
          Sem conexão. Conecte-se para acessar suas carteiras e transações.
        </p>
      )}
    </div>
  )
}
