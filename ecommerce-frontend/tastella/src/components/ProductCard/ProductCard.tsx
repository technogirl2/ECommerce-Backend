import './ProductCard.css'

interface ProductCardProps {
  name: string
  price: number
  imageUrl?: string
  brand: string
  snackType: string
  onClick?: () => void
}

function ProductCard({ name, price, imageUrl, onClick }: ProductCardProps) {
  const formattedPrice = price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return (
    <div
      className="product-card"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {imageUrl && (
        <img className="product-card-image" src={imageUrl} alt={name} />
      )}
      <div className="product-card-body">
        <h3 className="product-card-name">{name}</h3>
        <p className="product-card-price">{formattedPrice}</p>
      </div>
    </div>
  )
}

export default ProductCard
