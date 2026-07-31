import SearchBar from '../SearchBar/SearchBar'
import './Header.css'

interface HeaderProps {
  onSearch?: (query: string) => void
  showSearch?: boolean
}

function Header({ onSearch, showSearch = true }: HeaderProps) {
  return (
    <header className="header">
      <span className="header-logo">Tastella</span>
      {showSearch && <SearchBar onSearch={onSearch} />}
    </header>
  )
}

export default Header
