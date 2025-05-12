"use client";
import Image from "next/image"
import { FaArrowRight } from "react-icons/fa6";

const Hero = () => {
  return (
    <section className="w-full min-h-[70vh] flex flex-col justify-center items-center bg-primary-dark py-12 md:py-0 relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-dark/80 via-primary/60 to-secondary/40 pointer-events-none"></div>
      {/* Decorative SVG Sparkles */}
      <svg className="absolute top-8 left-8 w-16 h-16 text-secondary opacity-30 animate-pulse-custom z-10" fill="none" viewBox="0 0 64 64">
        <path d="M32 8 L36 28 L56 32 L36 36 L32 56 L28 36 L8 32 L28 28 Z" fill="currentColor"/>
      </svg>
      <svg className="absolute bottom-8 right-8 w-10 h-10 text-white opacity-20 animate-spin z-10" fill="none" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8" />
      </svg>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-10 px-6 relative z-20">
        {/* Left: Hero Image */}
        <div className="flex-shrink-0 flex justify-center items-center w-full md:w-1/2">
          <Image
            src="/static/hero.png"
            alt="Hero Banner"
            width={400}
            height={400}
            className="w-72 h-72 md:w-96 md:h-96 object-contain"
            priority
          />
        </div>
        {/* Right: Tagline and CTA */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2 gap-4 animate-slide-up">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-xl tracking-tight mb-2 animate-fade-in">
            Simple. Smart. <br className="hidden md:inline" />
            AndMore.
          </h1>
          <p className="text-lg md:text-2xl text-white/90 font-medium mb-4 animate-fade-in" style={{animationDelay: "0.2s"}}>
            Discover the best products, curated for you.
          </p>
          <a
            href="/products"
            className="btn btn-primary text-lg px-8 py-3 rounded-full shadow-lg flex items-center gap-2 transition hover:scale-105 hover:bg-primary-dark animate-fade-in"
            style={{animationDelay: "0.4s"}}
          >
            Browse products
            <FaArrowRight className="inline-block text-xl" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
