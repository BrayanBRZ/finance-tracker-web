import { useCallback, useEffect, useRef } from 'react'

export function useAsyncScopeGuard(scopeKey) {
  const scopeRef = useRef({
    key: scopeKey,
    version: 0,
  })
  const requestIdRef = useRef(0)

  useEffect(() => {
    scopeRef.current = {
      key: scopeKey,
      version: scopeRef.current.version + 1,
    }
    requestIdRef.current += 1

    return () => {
      scopeRef.current = {
        ...scopeRef.current,
        version: scopeRef.current.version + 1,
      }
      requestIdRef.current += 1
    }
  }, [scopeKey])

  const captureScope = useCallback(
    () => ({
      ...scopeRef.current,
    }),
    [],
  )

  const isScopeCurrent = useCallback(
    (scope) =>
      scope.key === scopeRef.current.key &&
      scope.version === scopeRef.current.version,
    [],
  )

  const beginRequest = useCallback(() => {
    requestIdRef.current += 1

    return {
      id: requestIdRef.current,
      scope: {
        ...scopeRef.current,
      },
    }
  }, [])

  const isRequestCurrent = useCallback(
    (request) =>
      request.id === requestIdRef.current && isScopeCurrent(request.scope),
    [isScopeCurrent],
  )

  const invalidateRequests = useCallback(() => {
    requestIdRef.current += 1
  }, [])

  return {
    beginRequest,
    captureScope,
    invalidateRequests,
    isRequestCurrent,
    isScopeCurrent,
  }
}
