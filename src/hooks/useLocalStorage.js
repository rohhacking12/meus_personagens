import { useState, useEffect } from 'react'

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try { return localStorage.getItem(key) || defaultValue } catch { return defaultValue }
  })
  useEffect(() => { try { if (value) localStorage.setItem(key, value) } catch(e){} }, [key, value])
  return [value, setValue]
}
