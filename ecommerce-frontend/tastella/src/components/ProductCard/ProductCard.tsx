import './ProductCard.css'

interface ProductCardProps {
  name: string
  price: number
  imageUrl?: string
  className?: string
}

function ProductCard({ name, price, imageUrl, className = '' }: ProductCardProps) {
  const formattedPrice = price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return (
    <div className={`product-card ${className}`.trim()}>
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
