import { useState, useEffect, useRef } from 'react'
import { resizeImage, detectMusicType, extractSpotifyId, extractYoutubeId } from '../utils/helpers'

const ROLES = ['Protagonista','Antagonista','Secundario','Co-protagonista','Mentor','Aliado','Narrador','Outro']
const empty = { fullName:'', nicknames:'', age:'', birthDate:'', appearance:'', psychology:'', mainGoal:'', wants:'', needs:'', themeSong:'', moreInfo:'', role:'Protagonista', image:null }

export default function CharacterForm({ character, onSave, onCancel }) {
  const [form, setForm] = useState(empty)
  const [preview, setPreview] = useState(null)
  const imgRef = useRef(null)

  useEffect(() => {
    if (character) {
      setForm({ fullName:character.fullName||'', nicknames:character.nicknames||'', age:character.age||'', birthDate:character.birthDate||'', appearance:character.appearance||'', psychology:character.psychology||'', mainGoal:character.mainGoal||'', wants:character.wants||'', needs:character.needs||'', themeSong:character.themeSong||'', moreInfo:character.moreInfo||'', role:character.role||'Protagonista', image:character.image||null })
      if (character.image) setPreview(character.image)
    } else { setForm(empty); setPreview(null) }
  }, [character])

  const change = e => setForm(p => ({...p, [e.target.name]: e.target.value}))
  const handleImg = async e => {
    const f = e.target.files[0]
    if (f && f.size <= 5*1024*1024) { const d = await resizeImage(f,400); setForm(p=>({...p,image:d})); setPreview(d) }
  }
  const removeImg = () => { setForm(p=>({...p,image:null})); setPreview(null); if(imgRef.current) imgRef.current.value='' }

  const submit = e => {
    e.preventDefault()
    if (!form.fullName.trim()) { alert('O nome e obrigatoro!'); return }
    onSave(form)
  }

  const type = detectMusicType(form.themeSong)
  const sid = type==='spotify' ? extractSpotifyId(form.themeSong) : null
  const yid = type==='youtube' ? extractYoutubeId(form.themeSong) : null

  return (
    <section id="view-form" style={{display:'block'}}>
      <div className="form-container">
        <div className="form-header"><h3>{character?'Editar Personagem':'Novo Personagem'}</h3><button onClick={onCancel}>X Fechar</button></div>
        <form onSubmit={submit}>
          <div className="form-body">
            <div className="form-section" style={{borderTop:'none',paddingTop:0,marginTop:0}}>
              <h4>Tipo de Personagem</h4>
              <div className="form-group"><label>Papel na Historia</label><select name="role" value={form.role} onChange={change}>{ROLES.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
            </div>
            <div className="form-section">
              <h4>Imagem</h4>
              <div className="form-group">
                {!preview ? <div className="image-upload-area"><div className="upload-icon">📷</div><div className="upload-text">Clique para adicionar imagem</div><input type="file" ref={imgRef} accept="image/*" onChange={handleImg}/></div> : <div className="image-preview-container"><img src={preview} className="image-preview" alt=""/><button type="button" className="image-remove" onClick={removeImg}>X</button></div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Nome Completo *</label><input type="text" name="fullName" value={form.fullName} onChange={change} required/></div>
              <div className="form-group"><label>Apelidos</label><input type="text" name="nicknames" value={form.nicknames} onChange={change}/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Idade</label><input type="text" name="age" value={form.age} onChange={change} placeholder="Ex: 30 anos"/></div>
              <div className="form-group"><label>Nascimento</label><input type="date" name="birthDate" value={form.birthDate} onChange={change}/></div>
            </div>
            <div className="form-section"><h4>Aparencia</h4><div className="form-group"><label>Descricao</label><textarea name="appearance" rows="3" value={form.appearance} onChange={change}></textarea></div></div>
            <div className="form-section"><h4>Psicologia</h4><div className="form-group"><label>Tracos</label><textarea name="psychology" rows="3" value={form.psychology} onChange={change}></textarea></div></div>
            <div className="form-section"><h4>Motivacoes</h4><div className="form-group"><label>Objetivo</label><input type="text" name="mainGoal" value={form.mainGoal} onChange={change}/></div></div>
            <div className="form-section"><h4>Arco Narrativo</h4><div className="form-row"><div className="form-group"><label>Quer</label><input type="text" name="wants" value={form.wants} onChange={change}/></div><div className="form-group"><label>Precisa</label><input type="text" name="needs" value={form.needs} onChange={change}/></div></div></div>
            <div className="form-section"><h4>Extras</h4>
              <div className="form-group"><label>Musica Tema</label><input type="text" name="themeSong" value={form.themeSong} onChange={change} placeholder="Link do Spotify ou YouTube"/>
                {type && form.themeSong && <div style={{marginTop:'0.75rem'}}>{sid && <iframe style={{borderRadius:'12px'}} src={`https://open.spotify.com/embed/track/${sid}`} width="100%" height="152" frameBorder="0" allowFullScreen></iframe>}{yid && <iframe width="100%" height="200" src={`https://www.youtube.com/embed/${yid}`} frameBorder="0" allowFullScreen></iframe>}<div style={{marginTop:'0.75rem',textAlign:'center'}}><img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(form.themeSong)}`} style={{width:'120px',height:'120px',borderRadius:'0.5rem',border:'1px solid #374151',background:'white',padding:'0.25rem'}} alt="QR"/></div></div>}
              </div>
              <div className="form-group"><label>Mais Informacoes</label><input type="text" name="moreInfo" value={form.moreInfo} onChange={change}/></div>
            </div>
            <div className="form-actions"><button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button><button type="submit" className="btn-save">Salvar</button></div>
          </div>
        </form>
      </div>
    </section>
  )
}
