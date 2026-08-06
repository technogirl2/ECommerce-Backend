import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import './SearchBar.css'

interface SearchBarProps {
  placeholder?: string
  initialValue?: string
  onSearch?: (query: string) => void
  className?: string
}

function SearchBar({
  placeholder = 'Search products...',
  initialValue = '',
  onSearch,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch?.(query.trim())
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onSearch?.(e.target.value.trim())
  }

  const handleClear = () => {
    setQuery('')
    onSearch?.('')
  }

  return (
    <form
      className={`search-bar ${className}`.trim()}
      onSubmit={handleSubmit}
      role="search"
    >
      <svg
        className="search-bar-icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <line
          x1="21"
          y1="21"
          x2="16.65"
          y2="16.65"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <input
        type="search"
        className="search-bar-input"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        aria-label={placeholder}
      />

      {query && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </form>
  )
}

export default SearchBar
