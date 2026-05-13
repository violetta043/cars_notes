import { useState, useEffect, useRef } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialRef = useRef(initialValue)

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialRef.current
    } catch {
      return initialRef.current
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      console.error('useLocalStorage: не удалось сохранить значение для ключа', key)
    }
  }

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key !== key) return
      setStoredValue(
        e.newValue !== null ? (JSON.parse(e.newValue) as T) : initialRef.current
      )
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  return [storedValue, setValue] as const
}
