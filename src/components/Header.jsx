export default function Header({ onNew, onList, onBgClick, onLogoClick }) {
  return (
    <header>
      <div className="header-inner">
        <div><h1>Atelie</h1><p>Metodo Follett</p></div>
        <div className="header-btns">
          <button onClick={onList}>Meus Personagens</button>
          <button onClick={onNew}>+ Novo</button>
          <button onClick={onBgClick}>Fundo</button>
          <button onClick={onLogoClick}>Logo</button>
        </div>
      </div>
    </header>
  )
}
