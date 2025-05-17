import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa"
import AddReview from "@modules/products/components/add-review"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  reviews?: any[]
}

const ProductInfo = ({ product, reviews = [] }: ProductInfoProps) => {
  // For demo, provide mock reviews if none exist
  const allReviews = reviews.length > 0 ? reviews : [
    {
      id: "mock-1",
      rating: 5,
      title: "Excellent product!",
      content: "This is exactly what I was looking for. Great quality and arrived quickly.",
      first_name: "John",
      last_name: "D.",
      created_at: new Date().toISOString()
    },
    {
      id: "mock-2",
      rating: 4,
      title: "Very satisfied",
      content: "Good build quality and works as expected. Would recommend.",
      first_name: "Sara",
      last_name: "T.",
      created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    }
  ];
  
  // Calculate average rating
  const avgRating = allReviews.length
    ? allReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / allReviews.length
    : 0
  
  const fullStars = Math.floor(avgRating)
  const hasHalfStar = avgRating - fullStars >= 0.5

  return (
    <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="text-small-regular text-ui-fg-muted hover:text-ui-fg-subtle"
        >
          {product.collection.title}
        </LocalizedClientLink>
      )}
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row text-ui-fg-muted text-small-regular gap-x-2">
          <Text>{product.categories?.map((c) => c.name).join(", ")}</Text>
        </div>
        <Heading level="h2">{product.title}</Heading>
      </div>
      
      {/* Reviews summary */}
      {allReviews.length > 0 && (
        <div className="flex flex-col mt-4 gap-y-2">
          <div className="flex items-center">
            <div className="flex mr-2">
              {Array.from({ length: 5 }).map((_, i) => {
                if (i < fullStars) {
                  return <FaStar key={i} className="text-yellow-400" />
                } else if (i === fullStars && hasHalfStar) {
                  return <FaStarHalfAlt key={i} className="text-yellow-400" />
                } else {
                  return <FaRegStar key={i} className="text-gray-300" />
                }
              })}
            </div>
            <span className="text-sm font-medium">
              {avgRating.toFixed(1)} ({allReviews.length} reviews)
            </span>
          </div>
        </div>
      )}

      <Text className="text-small-regular">{product.description}</Text>
      
      {/* Review list */}
      {allReviews.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-4">Customer Reviews</h3>
          <div className="space-y-4">
            {allReviews.slice(0, 3).map((review, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < review.rating ? "text-yellow-400" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.title && (
                  <h4 className="font-medium mb-1">{review.title}</h4>
                )}
                <p className="text-sm text-gray-700">{review.content}</p>
                {(review.first_name || review.last_name) && (
                  <p className="text-xs text-gray-500 mt-2">
                    - {review.first_name} {review.last_name}
                  </p>
                )}
              </div>
            ))}
          </div>
          {allReviews.length > 3 && (
            <button className="text-sm text-blue-600 mt-4 hover:underline">
              View all {allReviews.length} reviews
            </button>
          )}
          
          {/* Add review component */}
          <AddReview productId={product.id} />
        </div>
      )}
    </div>
  )
}

export default ProductInfo
