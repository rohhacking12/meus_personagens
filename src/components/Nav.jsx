import { useRef } from 'react'
import { resizeImage } from '../utils/helpers'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Nav({ onBgChange }) {
  const bgRef = useRef(null)
  const logoRef = useRef(null)
  const [logo, setLogo] = useLocalStorage('follett_logo', '')

  const handleBg = async (e) => {
    const f = e.target.files[0]
    if (f && f.size <= 10*1024*1024) onBgChange(await resizeImage(f, 1920))
  }
  const handleLogo = async (e) => {
    const f = e.target.files[0]
    if (f && f.size <= 5*1024*1024) {
      const r = new FileReader()
      r.onload = (ev) => setLogo(ev.target.result)
      r.readAsDataURL(f)
    }
  }

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          {logo ? <img src={logo} alt="Logo" className="nav-logo" onClick={() => logoRef.current?.click()} /> : <img src="/logo.png" alt="Logo" className="nav-logo" onError={e => e.target.style.display='none'} />}
          <span className="nav-title">Ferramentas do Escritor</span>
        </div>
      </nav>
      <input type="file" ref={bgRef} accept="image/*" style={{display:'none'}} onChange={handleBg} />
      <input type="file" ref={logoRef} accept="image/*" style={{display:'none'}} onChange={handleLogo} />
    </>
  )
}
