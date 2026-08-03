import { useState } from 'react'
import { getSnackTypeLabel } from '../../constants/snackTypes'
import './ProductPopComponent.css'

interface Product {
  id: number
  name: string
  price: number
  imageUrl?: string
  brand: string
  snackType: string
}

interface ProductPopComponentProps {
  product: Product
  onClose: () => void
}

const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1)

function ProductPopComponent({ product, onClose }: ProductPopComponentProps) {
  const [quantity, setQuantity] = useState(1)

  const formattedPrice = product.price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return (
    <div className="product-pop-overlay" onClick={onClose}>
      <div
        className="product-pop"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="product-pop-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="product-pop-body">
          <div className="product-pop-image-wrap">
            {product.imageUrl ? (
              <img
                className="product-pop-image"
                src={product.imageUrl}
                alt={product.name}
              />
            ) : (
              <div className="product-pop-image-placeholder" />
            )}
          </div>

          <div className="product-pop-info">
            <h2 className="product-pop-name">{product.name}</h2>
            <p className="product-pop-meta">
              {product.brand} · {getSnackTypeLabel(product.snackType)}
            </p>
          </div>

          <div className="product-pop-purchase">
            <p className="product-pop-price">{formattedPrice}</p>

            <label className="product-pop-quantity">
              <span>Quantity</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {QUANTITY_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            <button type="button" className="product-pop-add">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPopComponent
