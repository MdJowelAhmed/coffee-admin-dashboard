import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

interface UseUrlStateOptions<T> {
  key: string
  defaultValue: T
  parse?: (value: string) => T
  serialize?: (value: T) => string
}

export function useUrlState<T>({
  key,
  defaultValue,
  parse = (v) => v as T,
  serialize = (v) => String(v),
}: UseUrlStateOptions<T>): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams()

  const value = useMemo(() => {
    const param = searchParams.get(key)
    if (param === null || param === '') return defaultValue
    try {
      return parse(param)
    } catch {
      return defaultValue
    }
  }, [searchParams, key, defaultValue, parse])

  const setValue = useCallback(
    (newValue: T) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev)
          const serialized = serialize(newValue)
          
          // Remove param if it equals default value
          if (serialized === serialize(defaultValue) || serialized === '' || serialized === 'all') {
            newParams.delete(key)
          } else {
            newParams.set(key, serialized)
          }
          
          return newParams
        },
        { replace: true }
      )
    },
    [key, setSearchParams, serialize, defaultValue]
  )

  return [value, setValue]
}

// Convenience hooks for common types
export function useUrlString(key: string, defaultValue = '') {
  return useUrlState<string>({
    key,
    defaultValue,
  })
}

export function useUrlNumber(key: string, defaultValue = 1) {
  return useUrlState<number>({
    key,
    defaultValue,
    parse: (v) => parseInt(v, 10) || defaultValue,
    serialize: (v) => String(v),
  })
}

// Hook for managing multiple URL params at once
export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const getParam = useCallback(
    (key: string, defaultValue = '') => {
      return searchParams.get(key) || defaultValue
    },
    [searchParams]
  )

  const getNumberParam = useCallback(
    (key: string, defaultValue = 1) => {
      const value = searchParams.get(key)
      return value ? parseInt(value, 10) || defaultValue : defaultValue
    },
    [searchParams]
  )

  const setParam = useCallback(
    (key: string, value: string | number) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev)
          const stringValue = String(value)
          
          if (stringValue === '' || stringValue === 'all') {
            newParams.delete(key)
          } else {
            newParams.set(key, stringValue)
          }
          
          return newParams
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  const setParams = useCallback(
    (params: Record<string, string | number | null>) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev)
          
          Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === '' || value === 'all') {
              newParams.delete(key)
            } else {
              newParams.set(key, String(value))
            }
          })
          
          return newParams
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  const clearParams = useCallback(
    (keys?: string[]) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev)
          
          if (keys) {
            keys.forEach((key) => newParams.delete(key))
          } else {
            return new URLSearchParams()
          }
          
          return newParams
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  return {
    searchParams,
    getParam,
    getNumberParam,
    setParam,
    setParams,
    clearParams,
  }
}













