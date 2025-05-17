import { Metadata } from 'next'
import ContactForm from '@modules/contact/components/contact-form'

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the AndMore team for questions, support, or feedback.",
}

export default function ContactPage() {
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
          <ContactForm />
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