import { useState, useCallback } from 'react'
import { loadCharacters, saveCharacters, generateId } from '../utils/storage'

export function useCharacters() {
  const [characters, setCharacters] = useState(() => loadCharacters())

  const addCharacter = useCallback((data) => {
    const c = { ...data, id: generateId() }
    const next = [...characters, c]; setCharacters(next); saveCharacters(next); return c
  }, [characters])

  const updateCharacter = useCallback((id, data) => {
    const next = characters.map(c => c.id === id ? { ...c, ...data } : c)
    setCharacters(next); saveCharacters(next)
  }, [characters])

  const deleteCharacter = useCallback((id) => {
    const next = characters.filter(c => c.id !== id)
    setCharacters(next); saveCharacters(next)
  }, [characters])

  const getById = useCallback((id) => characters.find(c => c.id === id) || null, [characters])
  return { characters, addCharacter, updateCharacter, deleteCharacter, getById }
}
