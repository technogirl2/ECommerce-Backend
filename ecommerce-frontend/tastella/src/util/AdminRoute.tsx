import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getRoleFromToken } from './jwt'

interface AdminRouteProps {
  children: ReactNode
}

function AdminRoute({ children }: AdminRouteProps) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (getRoleFromToken(token) !== 'ADMIN') {
    return <Navigate to="/searchPage" replace />
  }

  return children
}

export default AdminRoute
