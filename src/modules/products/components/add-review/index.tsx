'use client'

import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

type AddReviewProps = {
  productId: string
}

const AddReview = ({ productId }: AddReviewProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // In a real implementation, this would call the Medusa API to submit the review
      // For demo purposes, we're just simulating success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitSuccess(true)
      resetForm()
    } catch (err) {
      setError('An error occurred while submitting your review')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setRating(0)
    setTitle('')
    setContent('')
  }

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mt-6">
        <svg className="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-green-800 mb-2">Thanks for your review!</h3>
        <p className="text-green-600 mb-4">Your review has been submitted and is pending approval.</p>
        <button 
          onClick={() => setSubmitSuccess(false)}
          className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
        >
          Write another review
        </button>
      </div>
    )
  }

  return (
    <div className="mt-8 border-t pt-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-900 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Write a Review
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl focus:outline-none"
                >
                  <FaStar 
                    className={`${
                      (hoverRating || rating) >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Summarize your review"
            />
          </div>
          
          <div>
            <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">
              Review
            </label>
            <textarea
              id="review-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Share your experience with this product"
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className={`px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium
                ${(isSubmitting || rating === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}
              `}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AddReview 