import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import { API_BASE_URL } from '../../config/api'
import { authFetch } from '../../util/authFetch'
import type { Order } from '../../types/order'
import './OrderHistoryPage.css'

const formatPrice = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', { dateStyle: 'medium' })

const STATUS_LABELS: Record<Order['status'], string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/orders`)

        if (!response.ok) {
          throw new Error('Failed to load orders')
        }

        setOrders((await response.json()) as Order[])
      } catch {
        setError('Unable to load your orders. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <>
      <Header showSearch={false} showAccountMenu />
      <div className="order-history-page">
        <h1 className="order-history-title">Your orders</h1>

        {isLoading ? (
          <p className="order-history-empty">Loading your orders...</p>
        ) : error ? (
          <p className="order-history-empty">{error}</p>
        ) : orders.length === 0 ? (
          <p className="order-history-empty">
            You haven't placed any orders yet. <Link to="/searchPage">Start shopping</Link>
          </p>
        ) : (
          <ul className="order-history-list">
            {orders.map((order, index) => (
              <li key={order.id} className="order-history-item">
                <Link to={`/orders/${order.id}`} className="order-history-link">
                  <div className="order-history-item-main">
                    <p className="order-history-item-id">Order #{orders.length - index}</p>
                    <p className="order-history-item-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <p className="order-history-item-items">
                    {order.items.length} item{order.items.length === 1 ? '' : 's'}
                  </p>
                  <span className="order-history-item-status">
                    {STATUS_LABELS[order.status]}
                  </span>
                  <p className="order-history-item-total">{formatPrice(order.total)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default OrderHistoryPage
