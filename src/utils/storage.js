const STORAGE_KEY = 'follett_characters_db'

export function loadCharacters() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveCharacters(characters) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters))
  } catch (e) {
    console.warn('Erro ao salvar no localStorage:', e)
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}
