import { useEffect, useRef, useState } from 'react'
import { isAbortError } from '@/services/api/client'
import { generateFinancialInsight } from '@/services/insightService'
import { getErrorMessage } from '@/utils/errors'

export function useFinancialInsight({
  walletId,
  startDate,
  endDate,
  revision,
}) {
  const key = `${walletId}:${startDate}:${endDate}`
  const scope = `${key}:${revision}`
  const activeRequest = useRef(null)
  const [result, setResult] = useState(null)
  const [request, setRequest] = useState(null)
  const [error, setError] = useState(null)

  // Changing data cancels the old request; closing the modal preserves the request and its result.
  useEffect(
    () => () => {
      activeRequest.current?.abort()
      activeRequest.current = null
    },
    [scope],
  )

  const generate = async () => {
    if (!walletId || activeRequest.current) return
    const controller = new AbortController()
    activeRequest.current = controller
    setRequest({ scope, pending: true, controller })
    setError(null)
    try {
      const response = await generateFinancialInsight({
        walletId,
        startDate,
        endDate,
        signal: controller.signal,
      })
      if (!controller.signal.aborted) setResult({ key, revision, response })
    } catch (cause) {
      if (!isAbortError(cause) && !controller.signal.aborted) {
        setError({ scope, message: getErrorMessage(cause) })
      }
    } finally {
      if (activeRequest.current === controller) activeRequest.current = null
      setRequest((current) =>
        current?.controller === controller
          ? { ...current, pending: false }
          : current,
      )
    }
  }

  const matchingResult = result?.key === key ? result : null
  return {
    analysis: matchingResult?.response ?? null,
    isStale: Boolean(matchingResult && matchingResult.revision !== revision),
    isGenerating: request?.scope === scope && request.pending,
    errorMessage: error?.scope === scope ? error.message : null,
    generate,
  }
}
