import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import { useCart } from '../../context/CartContext'
import './CheckoutPage.css'

function CheckoutPage() {
  const { cart, refreshCart, updateItemQuantity, removeItem } = useCart()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    refreshCart().finally(() => setIsLoading(false))
  }, [refreshCart])

  const formatPrice = (value: number) =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

  const items = cart?.items ?? []
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <>
      <Header showSearch={false} showLogout />
      <div className="checkout-page">
        <h1 className="checkout-title">Your cart</h1>

        {isLoading ? (
          <p className="checkout-empty">Loading your cart...</p>
        ) : items.length === 0 ? (
          <p className="checkout-empty">
            Your cart is empty. <Link to="/searchPage">Keep shopping</Link>
          </p>
        ) : (
          <>
            <ul className="checkout-items">
              {items.map((item) => (
                <li key={item.id} className="checkout-item">
                  {item.product.imageUrl ? (
                    <img
                      className="checkout-item-image"
                      src={item.product.imageUrl}
                      alt={item.product.name}
                    />
                  ) : (
                    <div className="checkout-item-image-placeholder" />
                  )}

                  <div className="checkout-item-info">
                    <p className="checkout-item-name">{item.product.name}</p>
                    <p className="checkout-item-meta">{item.product.brand}</p>
                  </div>

                  <label className="checkout-item-quantity">
                    <span>Qty</span>
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        updateItemQuantity(item.id, Number(e.target.value))
                      }
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>

                  <p className="checkout-item-price">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>

                  <button
                    type="button"
                    className="checkout-item-remove"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.product.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="checkout-summary">
              <p className="checkout-total">
                Total <span>{formatPrice(total)}</span>
              </p>
              <button type="button" className="checkout-submit" disabled>
                Checkout coming soon
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CheckoutPage
