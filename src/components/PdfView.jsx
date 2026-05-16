import { detectMusicType, extractSpotifyId, extractYoutubeId, getRoleTagClass } from '../utils/helpers'
import { generatePDF } from '../utils/pdfGenerator'

export default function PdfView({ character, onBack }) {
  if (!character) return null
  const type = detectMusicType(character.themeSong)
  const sid = type==='spotify' ? extractSpotifyId(character.themeSong) : null
  const yid = type==='youtube' ? extractYoutubeId(character.themeSong) : null

  return (
    <section id="view-pdf" style={{display:'block'}}>
      <div className="pdf-container">
        <div className="form-header"><h3>Ficha: {character.fullName}</h3><button onClick={onBack}>X Fechar</button></div>
        <div className="pdf-body">
          {character.image && <img src={character.image} style={{width:'150px',height:'150px',objectFit:'cover',borderRadius:'0.5rem',border:'2px solid #d1d5db',float:'right',marginLeft:'1.5rem',marginBottom:'1rem'}} alt="" />}
          <h1 style={{fontSize:'1.875rem',fontWeight:'bold',marginBottom:'0.5rem'}}>{character.fullName}</h1>
          {character.role && <span className={`tag ${getRoleTagClass(character.role)}`} style={{display:'inline-block',marginBottom:'0.75rem'}}>{character.role}</span>}
          {character.nicknames && <p style={{color:'#6b7280',marginBottom:'1rem',fontStyle:'italic'}}>"{character.nicknames}"</p>}
          <div style={{clear:'both'}}></div>
          <p><strong>Idade:</strong> {character.age||'N/A'}</p>
          <p><strong>Nascimento:</strong> {character.birthDate||'N/A'}</p>
          <p style={{marginTop:'1rem'}}><strong>Aparencia:</strong><br/>{character.appearance||'N/A'}</p>
          <p style={{marginTop:'1rem'}}><strong>Psicologia:</strong><br/>{character.psychology||'N/A'}</p>
          <p style={{marginTop:'1rem'}}><strong>Objetivo:</strong><br/>{character.mainGoal||'N/A'}</p>
          <p style={{marginTop:'1rem'}}><strong>Quer:</strong> {character.wants||'N/A'}</p>
          <p><strong>Precisa:</strong> {character.needs||'N/A'}</p>
          {character.themeSong && <><p style={{marginTop:'1rem'}}><strong>Musica:</strong></p>{sid && <iframe style={{borderRadius:'12px'}} src={`https://open.spotify.com/embed/track/${sid}`} width="100%" height="152" frameBorder="0" allowFullScreen></iframe>}{yid && <iframe width="100%" height="200" src={`https://www.youtube.com/embed/${yid}`} frameBorder="0" allowFullScreen></iframe>}<div style={{textAlign:'center',marginTop:'0.75rem'}}><img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(character.themeSong)}`} style={{width:'120px',height:'120px',borderRadius:'0.5rem',border:'1px solid #d1d5db'}} alt="QR"/></div><p style={{fontSize:'0.75rem',color:'#6b7280',marginTop:'0.5rem',wordBreak:'break-all'}}>{character.themeSong}</p></>}
          {character.moreInfo && <p style={{marginTop:'1rem'}}><strong>Mais Info:</strong><br/>{character.moreInfo}</p>}
          <div className="pdf-actions"><button className="btn-pdf-back" onClick={onBack}>Voltar</button><button className="btn-pdf-download" onClick={() => generatePDF(character)}>Baixar PDF</button></div>
        </div>
      </div>
    </section>
  )
}
