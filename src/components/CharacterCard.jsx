import { getRoleTagClass } from '../utils/helpers'

export default function CharacterCard({ character, onView, onEdit, onDelete }) {
  const roleClass = getRoleTagClass(character.role)
  return (
    <div className="card char-card" data-name={character.fullName.toLowerCase()} data-role={character.role||''}>
      <div style={{position:'relative'}}>
        {character.image ? <img src={character.image} className="card-image" alt="" /> : <div className="card-image-placeholder"><span>?</span></div>}
        <span className={`tag ${roleClass}`}>{character.role || 'Personagem'}</span>
      </div>
      <div className="card-body">
        <h3 className="card-name" style={{marginBottom:'0.75rem'}}>{character.fullName}</h3>
        <div className="card-actions">
          <button onClick={() => onView(character.id)} className="btn-view">Ver Ficha</button>
          <button onClick={() => onEdit(character.id)} className="btn-edit">Editar</button>
          <button onClick={() => onDelete(character.id)} className="btn-del">Excluir</button>
        </div>
      </div>
    </div>
  )
}
