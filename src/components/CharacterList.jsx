import { useState } from 'react'
import CharacterCard from './CharacterCard'

export default function CharacterList({ characters, onView, onEdit, onDelete, onNew }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const filtered = characters.filter(c => c.fullName.toLowerCase().includes(search.toLowerCase()) && (filter === 'all' || c.role === filter))

  return (
    <section id="view-list">
      <h2 className="section-title">Meus personagens</h2>
      <div className="search-bar">
        <input type="text" placeholder="Buscar por nome..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-btns">
          {['all','Protagonista','Antagonista','Secundario'].map(f => (
            <button key={f} className={`filter-btn ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
              {f==='all'?'Todos':f==='Secundario'?'Secundarios':f+'s'}
            </button>
          ))}
        </div>
      </div>
      <div className="grid">
        {filtered.length === 0 ? <div className="empty-state"><p>Nenhum personagem criado ainda.</p><small>Clique em "+ Novo" para comecar!</small></div> : filtered.map(c => <CharacterCard key={c.id} character={c} onView={onView} onEdit={onEdit} onDelete={onDelete} />)}
      </div>
      <button className="btn-new-card" onClick={onNew}><div className="plus">+</div><span>Novo personagem</span></button>
    </section>
  )
}
