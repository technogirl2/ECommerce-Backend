import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './util/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import SearchPage from './pages/SearchPage/SearchPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
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
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </CartProvider>
  )
}

export default App
