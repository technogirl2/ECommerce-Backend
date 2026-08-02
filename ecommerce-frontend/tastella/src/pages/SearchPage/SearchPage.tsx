import { useEffect, useMemo, useState } from 'react'
import Header from '../../components/Header/Header'
import ProductCard from '../../components/ProductCard/ProductCard'
import { API_BASE_URL } from '../../config/api'
import './SearchPage.css'

const MAX_PRODUCTS = 20

interface Product {
  id: number
  name: string
  price: number
  imageUrl?: string
}

function SearchPage() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_BASE_URL}/products`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!response.ok) {
          throw new Error('Failed to load products')
        }

        const data = (await response.json()) as Product[]
        setProducts(data.slice(0, MAX_PRODUCTS))
      } catch {
        setError('Unable to load products. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return products
    return products.filter((product) =>
      product.name.toLowerCase().startsWith(normalized),
    )
  }, [query, products])

  return (
    <>
      <Header onSearch={setQuery} showLogout />
      <div className="search-page-results">
        {isLoading ? (
          <p className="search-page-empty">Loading snacks...</p>
        ) : error ? (
          <p className="search-page-empty">{error}</p>
        ) : visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          ))
        ) : (
          <p className="search-page-empty">No snacks match "{query}"</p>
        )}
      </div>
    </>
  )
}

export default SearchPage
