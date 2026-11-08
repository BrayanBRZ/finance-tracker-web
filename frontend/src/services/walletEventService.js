import { buildApiUrl } from '@/services/api/client'
import { clearApiSession, readApiSession } from '@/storage/authTokenStorage'

const waitForRetry = (signal) =>
  new Promise((resolve) => {
    if (signal.aborted) {
      resolve()
      return
    }
    const timer = window.setTimeout(finish, 2000)
    signal.addEventListener('abort', finish, { once: true })

    function finish() {
      window.clearTimeout(timer)
      signal.removeEventListener('abort', finish)
      resolve()
    }
  })

export function watchWalletTransactions(walletId, onChange, onAccessLost) {
  const controller = new AbortController()
  let hasConnected = false

  const listen = async () => {
    while (!controller.signal.aborted) {
      const token = readApiSession()?.accessToken
      if (!token) return

      try {
        const response = await fetch(buildApiUrl(`/wallets/${walletId}/events`), {
          headers: {
            Accept: 'text/event-stream',
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })

        if (response.status === 401) {
          clearApiSession()
          return
        }
        if (response.status === 403 || response.status === 404) {
          onAccessLost()
          return
        }
        if (!response.ok || !response.body) throw new Error('SSE indisponível')

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (!controller.signal.aborted) {
          const { done, value } = await reader.read()
          if (done) break

          buffer = (buffer + decoder.decode(value, { stream: true })).replaceAll(
            '\r\n',
            '\n',
          )
          let separator = buffer.indexOf('\n\n')
          while (separator !== -1) {
            const frame = buffer.slice(0, separator)
            buffer = buffer.slice(separator + 2)
            const eventName = frame
              .split('\n')
              .find((line) => line.startsWith('event:'))
              ?.slice(6)
              .trim()

            if (eventName === 'transaction-changed') onChange()
            if (eventName === 'ready') {
              if (hasConnected) onChange()
              hasConnected = true
            }
            separator = buffer.indexOf('\n\n')
          }
        }
      } catch {
        if (controller.signal.aborted) return
      }

      await waitForRetry(controller.signal)
    }
  }

  void listen()
  return () => controller.abort()
}
