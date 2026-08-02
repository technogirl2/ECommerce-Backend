import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import { API_BASE_URL } from '../../config/api'
import './Header.css'

interface HeaderProps {
  onSearch?: (query: string) => void
  showSearch?: boolean
  showLogout?: boolean
}

function Header({ onSearch, showSearch = true, showLogout = false }: HeaderProps) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')

    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/user-logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })
      } catch {
        // best-effort; still clear local session below
      }
    }

    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    navigate('/login')
  }

  return (
    <header className="header">
      <span className="header-logo">Tastella</span>
      {showSearch && <SearchBar onSearch={onSearch} />}
      {showLogout && (
        <button type="button" className="header-logout" onClick={handleLogout}>
          Log out
        </button>
      )}
    </header>
  )
}

export default Header
