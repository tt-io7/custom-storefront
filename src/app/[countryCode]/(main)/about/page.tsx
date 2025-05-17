import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about AndMore and our mission to provide premium tech products.",
}

export default function AboutPage() {
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto mt-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About AndMore</h1>
        <p className="text-gray-600 text-lg mb-8">
          Dedicated to providing exceptional tech products with a focus on quality and innovation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2023, AndMore began with a simple mission: to offer premium tech products that enhance everyday life. We started as a small team of technology enthusiasts who believed that quality tech products should be accessible to everyone.
          </p>
          <p className="text-gray-600">
            Today, we've grown into a trusted retailer of carefully selected tech gadgets and accessories, all chosen for their exceptional quality, innovative features, and everyday usability.
          </p>
        </div>
        <div className="bg-gray-100 rounded-lg p-8 h-80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 italic">[Company Image]</p>
            <p className="text-sm text-gray-400 mt-2">Our headquarters in Copenhagen</p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium mb-3">Quality</h3>
            <p className="text-gray-600">
              We stand behind every product we sell, ensuring that each item meets our high standards for performance and durability.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium mb-3">Innovation</h3>
            <p className="text-gray-600">
              We continuously seek out the latest advancements in technology to bring innovative solutions to our customers.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium mb-3">Customer Focus</h3>
            <p className="text-gray-600">
              We prioritize a seamless shopping experience and exceptional customer service at every touchpoint.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-6">Join Our Journey</h2>
        <p className="text-gray-600 mb-8">
          We're excited to continue growing and bringing you the best in tech. Whether you're upgrading your workspace or finding the perfect tech gift, we're here to help you discover products that enhance your digital experience.
        </p>
        <a href="#" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
          Browse Our Products
        </a>
      </div>
    </div>
  )
} 