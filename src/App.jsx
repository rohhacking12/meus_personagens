import { useState, useRef } from 'react'
import Nav from './components/Nav'
import Header from './components/Header'
import CharacterList from './components/CharacterList'
import CharacterForm from './components/CharacterForm'
import PdfView from './components/PdfView'
import { useCharacters } from './hooks/useCharacters'
import { useLocalStorage } from './hooks/useLocalStorage'

export default function App() {
  const [view, setView] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [viewingId, setViewingId] = useState(null)
  const { characters, addCharacter, updateCharacter, deleteCharacter, getById } = useCharacters()
  const [bgImage, setBgImage] = useLocalStorage('follett_bg_image', '')
  const bgRef = useRef(null)
  const logoRef = useRef(null)

  const handleSave = (data) => {
    if (editingId) { updateCharacter(editingId, data); alert('Personagem atualizado!') } else { addCharacter(data); alert('Personagem criado!') }
    setEditingId(null); setView('list')
  }

  const editingChar = editingId ? getById(editingId) : null
  const viewingChar = viewingId ? getById(viewingId) : null

  return (
    <>
      <div id="bg-layer" style={bgImage ? {backgroundImage:`url(${bgImage})`} : {}}></div>
      <div id="bg-overlay"></div>
      <Nav onBgChange={setBgImage} />
      <Header onNew={()=>{setEditingId(null);setView('form')}} onList={()=>setView('list')} onBgClick={()=>bgRef.current?.click()} onLogoClick={()=>logoRef.current?.click()} />
      <main>
        {view==='list' && <CharacterList characters={characters} onView={id=>{setViewingId(id);setView('pdf')}} onEdit={id=>{setEditingId(id);setView('form')}} onDelete={id=>{if(confirm('Excluir?'))deleteCharacter(id)}} onNew={()=>{setEditingId(null);setView('form')}} />}
        {view==='form' && <CharacterForm character={editingChar} onSave={handleSave} onCancel={()=>setView('list')} />}
        {view==='pdf' && <PdfView character={viewingChar} onBack={()=>setView('list')} />}
      </main>
    </>
  )
}
