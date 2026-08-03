import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import { API_BASE_URL } from '../../config/api'
import { useCart } from '../../context/CartContext'
import './Header.css'

interface HeaderProps {
  onSearch?: (query: string) => void
  showSearch?: boolean
  showLogout?: boolean
  showCart?: boolean
}

function Header({
  onSearch,
  showSearch = true,
  showLogout = false,
  showCart = false,
}: HeaderProps) {
  const navigate = useNavigate()
  const { cartCount, refreshCart } = useCart()

  useEffect(() => {
    if (showCart) refreshCart()
  }, [showCart, refreshCart])

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
      {showCart && (
        <button
          type="button"
          className="header-cart"
          onClick={() => navigate('/checkout')}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>Cart ({cartCount})</span>
        </button>
      )}
    </header>
  )
}

export default Header
