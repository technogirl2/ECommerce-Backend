import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import CollapsibleSection from '../../components/CollapsibleSection/CollapsibleSection'
import { useCart } from '../../context/CartContext'
import { API_BASE_URL } from '../../config/api'
import { authFetch } from '../../util/authFetch'
import type { CheckoutRequest, DeliveryOptionType, Order } from '../../types/order'
import './CheckoutPage.css'

interface Address {
  street: string
  city: string
  state: string
  zip: string
  instructions: string
}

interface CardInfo {
  name: string
  number: string
  expiry: string
  cvc: string
}

interface FormErrors {
  street?: string
  city?: string
  state?: string
  zip?: string
  scheduledTime?: string
  cardName?: string
  cardNumber?: string
  cardExpiry?: string
  cardCvc?: string
}

const DELIVERY_OPTIONS: {
  id: DeliveryOptionType
  label: string
  detail: string
  fee: number
}[] = [
  { id: 'STANDARD', label: 'Standard', detail: '3-5 business days', fee: 4.99 },
  { id: 'PRIORITY', label: 'Priority', detail: '1-2 business days', fee: 9.99 },
  { id: 'SCHEDULED', label: 'Scheduled', detail: 'Pick a date and time', fee: 6.99 },
]

const TAX_RATE = 0.08
const ZIP_REGEX = /^\d{5}(-\d{4})?$/
const EXPIRY_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/

const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1)

const formatPrice = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const guessCardBrand = (number: string): string => {
  const digits = number.replace(/\D/g, '')
  if (digits.startsWith('4')) return 'Visa'
  if (/^5[1-5]/.test(digits)) return 'Mastercard'
  if (/^3[47]/.test(digits)) return 'Amex'
  if (digits.startsWith('6')) return 'Discover'
  return 'Card'
}

const formatExpiry = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length < 3) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function validate(
  address: Address,
  deliveryOptionId: DeliveryOptionType,
  scheduledTime: string,
  card: CardInfo,
): FormErrors {
  const errors: FormErrors = {}

  if (!address.street.trim()) errors.street = 'Street address is required'
  if (!address.city.trim()) errors.city = 'City is required'
  if (!address.state.trim()) errors.state = 'State is required'
  if (!address.zip.trim()) errors.zip = 'ZIP code is required'
  else if (!ZIP_REGEX.test(address.zip.trim())) errors.zip = 'Enter a valid ZIP code'

  if (deliveryOptionId === 'SCHEDULED') {
    if (!scheduledTime) errors.scheduledTime = 'Choose a delivery date and time'
    else if (new Date(scheduledTime).getTime() < Date.now()) {
      errors.scheduledTime = 'Choose a time in the future'
    }
  }

  if (!card.name.trim()) errors.cardName = 'Name on card is required'

  const cardDigits = card.number.replace(/\D/g, '')
  if (!cardDigits) errors.cardNumber = 'Card number is required'
  else if (cardDigits.length < 13 || cardDigits.length > 19) {
    errors.cardNumber = 'Enter a valid card number'
  }

  if (!card.expiry) errors.cardExpiry = 'Expiry date is required'
  else if (!EXPIRY_REGEX.test(card.expiry)) errors.cardExpiry = 'Use MM/YY format'
  else {
    const [month, year] = card.expiry.split('/').map(Number)
    const expiresAt = new Date(2000 + year, month, 1)
    if (expiresAt.getTime() < Date.now()) errors.cardExpiry = 'Card has expired'
  }

  if (!card.cvc) errors.cardCvc = 'CVC is required'
  else if (card.cvc.length < 3 || card.cvc.length > 4) errors.cardCvc = 'Enter a valid CVC'

  return errors
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, refreshCart, updateItemQuantity, removeItem, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})

  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zip: '',
    instructions: '',
  })
  const [deliveryOptionId, setDeliveryOptionId] = useState<DeliveryOptionType>('STANDARD')
  const [scheduledTime, setScheduledTime] = useState('')
  const [card, setCard] = useState<CardInfo>({ name: '', number: '', expiry: '', cvc: '' })

  useEffect(() => {
    refreshCart().finally(() => setIsLoading(false))
  }, [refreshCart])

  const updateAddress = (field: keyof Address, value: string) =>
    setAddress((prev) => ({ ...prev, [field]: value }))

  const updateCard = (field: keyof CardInfo, value: string) =>
    setCard((prev) => ({ ...prev, [field]: value }))

  const markTouched = (field: string) =>
    setTouchedFields((prev) => ({ ...prev, [field]: true }))

  const showError = (field: keyof FormErrors) =>
    (attemptedSubmit || touchedFields[field]) && errors[field]

  const errors = validate(address, deliveryOptionId, scheduledTime, card)
  const hasErrors = Object.keys(errors).length > 0
  const addressHasError = attemptedSubmit && !!(errors.street || errors.city || errors.state || errors.zip)
  const deliveryHasError = attemptedSubmit && !!errors.scheduledTime
  const paymentHasError =
    attemptedSubmit && !!(errors.cardName || errors.cardNumber || errors.cardExpiry || errors.cardCvc)

  const items = cart?.items ?? []
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const selectedDelivery = DELIVERY_OPTIONS.find((o) => o.id === deliveryOptionId)!
  const deliveryFee = selectedDelivery.fee
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax + deliveryFee

  const addressSummary = address.street
    ? `${address.street}, ${address.city} ${address.state} ${address.zip}`.trim()
    : 'Add a delivery address'

  const deliverySummary =
    deliveryOptionId === 'SCHEDULED' && scheduledTime
      ? `Scheduled: ${scheduledTime}`
      : `${selectedDelivery.label} · ${selectedDelivery.detail}`

  const cardSummary = card.number
    ? `Card ending in ${card.number.replace(/\D/g, '').slice(-4)}`
    : 'Add payment method'

  const reviewSummary = itemCount > 0 ? `${itemCount} item${itemCount === 1 ? '' : 's'}` : ''

  const handlePlaceOrder = async () => {
    if (hasErrors) {
      setAttemptedSubmit(true)
      return
    }

    setIsPlacingOrder(true)
    setOrderError('')

    try {
      const body: CheckoutRequest = {
        street: address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        zip: address.zip.trim(),
        instructions: address.instructions.trim(),
        deliveryOption: deliveryOptionId,
        scheduledTime:
          deliveryOptionId === 'SCHEDULED' && scheduledTime
            ? new Date(scheduledTime).toISOString()
            : null,
        cardBrand: guessCardBrand(card.number),
        last4: card.number.replace(/\D/g, '').slice(-4),
      }

      const response = await authFetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      const order = (await response.json()) as Order
      clearCart()
      navigate(`/orders/${order.id}`)
    } catch {
      setOrderError('Unable to place your order. Please check your details and try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Header showSearch={false} showAccountMenu />
        <div className="checkout-page">
          <p className="checkout-empty">Loading your cart...</p>
        </div>
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <Header showSearch={false} showAccountMenu />
        <div className="checkout-page">
          <p className="checkout-empty">
            Your cart is empty. <Link to="/searchPage">Keep shopping</Link>
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header showSearch={false} showAccountMenu />
      <div className="checkout-page">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-main">
            <CollapsibleSection
              title="Deliver to"
              summary={addressSummary}
              defaultOpen
              hasError={addressHasError}
            >
              <div className="checkout-form-grid">
                <label className="checkout-field checkout-field-full">
                  <span>Street address</span>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => updateAddress('street', e.target.value)}
                    onBlur={() => markTouched('street')}
                    placeholder="123 Main St"
                    className={showError('street') ? 'has-error' : ''}
                  />
                  {showError('street') && <p className="checkout-field-error">{errors.street}</p>}
                </label>
                <label className="checkout-field">
                  <span>City</span>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => updateAddress('city', e.target.value)}
                    onBlur={() => markTouched('city')}
                    className={showError('city') ? 'has-error' : ''}
                  />
                  {showError('city') && <p className="checkout-field-error">{errors.city}</p>}
                </label>
                <label className="checkout-field">
                  <span>State</span>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => updateAddress('state', e.target.value)}
                    onBlur={() => markTouched('state')}
                    className={showError('state') ? 'has-error' : ''}
                  />
                  {showError('state') && <p className="checkout-field-error">{errors.state}</p>}
                </label>
                <label className="checkout-field">
                  <span>ZIP code</span>
                  <input
                    type="text"
                    value={address.zip}
                    onChange={(e) => updateAddress('zip', e.target.value)}
                    onBlur={() => markTouched('zip')}
                    className={showError('zip') ? 'has-error' : ''}
                  />
                  {showError('zip') && <p className="checkout-field-error">{errors.zip}</p>}
                </label>
                <label className="checkout-field checkout-field-full">
                  <span>Delivery instructions (optional)</span>
                  <input
                    type="text"
                    value={address.instructions}
                    onChange={(e) => updateAddress('instructions', e.target.value)}
                    placeholder="Leave at the door"
                  />
                </label>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="When" summary={deliverySummary} hasError={deliveryHasError}>
              <div className="checkout-delivery-options">
                {DELIVERY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`checkout-delivery-option${
                      deliveryOptionId === option.id ? ' is-selected' : ''
                    }`}
                    onClick={() => setDeliveryOptionId(option.id)}
                  >
                    <span className="checkout-delivery-option-label">{option.label}</span>
                    <span className="checkout-delivery-option-detail">{option.detail}</span>
                    <span className="checkout-delivery-option-fee">
                      {formatPrice(option.fee)}
                    </span>
                  </button>
                ))}
              </div>

              {deliveryOptionId === 'SCHEDULED' && (
                <label className="checkout-field checkout-field-full checkout-schedule-field">
                  <span>Choose a date and time</span>
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    onBlur={() => markTouched('scheduledTime')}
                    className={showError('scheduledTime') ? 'has-error' : ''}
                  />
                  {showError('scheduledTime') && (
                    <p className="checkout-field-error">{errors.scheduledTime}</p>
                  )}
                </label>
              )}
            </CollapsibleSection>

            <CollapsibleSection title="Pay with" summary={cardSummary} hasError={paymentHasError}>
              <div className="checkout-form-grid">
                <label className="checkout-field checkout-field-full">
                  <span>Name on card</span>
                  <input
                    type="text"
                    value={card.name}
                    onChange={(e) => updateCard('name', e.target.value)}
                    onBlur={() => markTouched('cardName')}
                    className={showError('cardName') ? 'has-error' : ''}
                  />
                  {showError('cardName') && (
                    <p className="checkout-field-error">{errors.cardName}</p>
                  )}
                </label>
                <label className="checkout-field checkout-field-full">
                  <span>Card number</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    value={card.number}
                    onChange={(e) =>
                      updateCard('number', e.target.value.replace(/[^\d ]/g, ''))
                    }
                    onBlur={() => markTouched('cardNumber')}
                    placeholder="1234 5678 9012 3456"
                    className={showError('cardNumber') ? 'has-error' : ''}
                  />
                  {showError('cardNumber') && (
                    <p className="checkout-field-error">{errors.cardNumber}</p>
                  )}
                </label>
                <label className="checkout-field">
                  <span>Expiry (MM/YY)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={card.expiry}
                    onChange={(e) => updateCard('expiry', formatExpiry(e.target.value))}
                    onBlur={() => markTouched('cardExpiry')}
                    placeholder="MM/YY"
                    className={showError('cardExpiry') ? 'has-error' : ''}
                  />
                  {showError('cardExpiry') && (
                    <p className="checkout-field-error">{errors.cardExpiry}</p>
                  )}
                </label>
                <label className="checkout-field">
                  <span>CVC</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={card.cvc}
                    onChange={(e) => updateCard('cvc', e.target.value.replace(/\D/g, ''))}
                    onBlur={() => markTouched('cardCvc')}
                    className={showError('cardCvc') ? 'has-error' : ''}
                  />
                  {showError('cardCvc') && (
                    <p className="checkout-field-error">{errors.cardCvc}</p>
                  )}
                </label>
              </div>
              <p className="checkout-mock-note">
                This is a mock checkout — no real payment is processed and card details
                never leave your browser.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Review order" summary={reviewSummary}>
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
                        {QUANTITY_OPTIONS.map((n) => (
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
            </CollapsibleSection>
          </div>

          <aside className="checkout-sidebar">
            <div className="checkout-summary-box">
              <h2 className="checkout-summary-title">Summary</h2>

              <div className="checkout-summary-row">
                <span>
                  Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})
                </span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Delivery</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Estimated tax</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <div className="checkout-summary-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button
                type="button"
                className="checkout-submit"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? 'Placing order...' : 'Place order'}
              </button>
              {orderError ? (
                <p className="checkout-submit-note checkout-submit-error">{orderError}</p>
              ) : attemptedSubmit && hasErrors ? (
                <p className="checkout-submit-note checkout-submit-error">
                  Please fix the highlighted fields above.
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

export default CheckoutPage
