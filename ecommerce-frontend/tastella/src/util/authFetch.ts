import { API_BASE_URL } from '../config/api'

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken')
  console.log("refresh-token line 5")
  if (!refreshToken) return null

  try {
    const response = await fetch(`${API_BASE_URL}/user-refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) return null

    const { token } = (await response.json()) as { token: string }
    localStorage.setItem('token', token)
    return token
  } catch {
    return null
  }
}

function withAuthHeader(init: RequestInit, token: string | null): RequestInit {
  return {
    ...init,
    headers: {
      ...init.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
}

/**
 * fetch() wrapper that attaches the access token and, on a 401 (expired
 * token), uses the refresh token to get a new access token and retries once.
 * If the refresh token is missing or invalid, clears the session and sends
 * the user back to login.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem('token')
  const response = await fetch(input, withAuthHeader(init, token))

  if (response.status !== 401) {
    return response
  }

  const newToken = await refreshAccessToken()

  if (!newToken) {
    console.log('Token refresh failed; redirecting to login.')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
    return response
  }

  console.log('Access token refreshed.')
  return fetch(input, withAuthHeader(init, newToken))
}
