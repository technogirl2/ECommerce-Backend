import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './util/ProtectedRoute'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import SearchPage from './pages/SearchPage/SearchPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/searchPage" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/searchPage"
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
