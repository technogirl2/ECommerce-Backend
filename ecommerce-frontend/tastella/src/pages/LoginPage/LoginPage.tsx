import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import { API_BASE_URL } from '../../config/api'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(
    (location.state as { message?: string } | null)?.message ?? '',
  )

  useEffect(() => {
    if (!successMessage) return

    const timeoutId = setTimeout(() => setSuccessMessage(''), 5000)
    return () => clearTimeout(timeoutId)
  }, [successMessage])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/user-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        setError('Incorrect username or password')
        return
      }

      const { token, refreshToken } = (await response.json()) as {
        token: string
        refreshToken: string
      }

      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      navigate('/searchPage')
    } catch {
      setError('Unable to reach the server. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header showSearch={false} />
      <div className="login-page">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="login-title">Welcome back</h1>

          {successMessage && <p className="login-success">{successMessage}</p>}

          <label className="login-field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>

          <p className="login-register-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </>
  )
}

export default LoginPage
