'use client'

import { useState } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the AndMore team for questions, support, or feedback.",
}

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      // Reset form after success
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    }, 1500)
  }

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto mt-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
        <p className="text-gray-600 text-lg">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Customer Support</h3>
              <p className="text-gray-600 mb-1">Email: support@andmore.com</p>
              <p className="text-gray-600">Phone: +45 12 34 56 78</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Business Inquiries</h3>
              <p className="text-gray-600 mb-1">Email: business@andmore.com</p>
              <p className="text-gray-600">Phone: +45 87 65 43 21</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Office Location</h3>
              <p className="text-gray-600 mb-1">123 Tech Street</p>
              <p className="text-gray-600 mb-1">Copenhagen, 2100</p>
              <p className="text-gray-600">Denmark</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Hours</h3>
              <p className="text-gray-600 mb-1">Monday - Friday: 9am - 5pm CET</p>
              <p className="text-gray-600">Saturday - Sunday: Closed</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
          
          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-green-800 mb-2">Message Sent!</h3>
              <p className="text-green-600">Thank you for contacting us. We'll get back to you as soon as possible.</p>
              <button 
                className="mt-4 text-green-700 font-medium underline"
                onClick={() => setSubmitSuccess(false)}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a subject</option>
                  <option value="support">Product Support</option>
                  <option value="sales">Sales Inquiry</option>
                  <option value="return">Returns & Refunds</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-md ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'
                } transition-colors`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              
              {submitError && (
                <p className="text-red-600 text-sm mt-2">
                  There was an error sending your message. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">Find Us</h2>
        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">[Map Placeholder]</p>
        </div>
      </div>
    </div>
  )
} 