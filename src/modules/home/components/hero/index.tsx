"use client";
import Image from "next/image"
import { FaArrowRight } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  const [imageError, setImageError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Hero slides data
  const heroSlides = [
    {
      title: "Simple. Smart. Premium.",
      subtitle: "Discover the best tech products, curated for you.",
      image: "/static/hero.png",
      btnText: "Browse products",
      btnLink: "/products"
    },
    {
      title: "Premium Tech Accessories",
      subtitle: "Enhance your digital lifestyle with our premium collection.",
      image: "/static/hero2.png", // You can add another image for rotation
      btnText: "Explore collection",
      btnLink: "/categories"
    }
  ];
  
  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const currentSlide = heroSlides[activeIndex];

  return (
    <section className="w-full min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-br from-primary-dark via-primary to-lilac-900 py-12 md:py-0 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-dark/90 via-primary/70 to-lilac-900/60 pointer-events-none"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Glowing orbs */}
        <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[5%] w-96 h-96 rounded-full bg-secondary/10 blur-3xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-grid-white/[0.2] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>
        </div>
        
        {/* Decorative SVG elements */}
        <svg className="absolute top-16 left-16 w-24 h-24 text-secondary opacity-20 animate-pulse" fill="none" viewBox="0 0 64 64">
          <path d="M32 8 L36 28 L56 32 L36 36 L32 56 L28 36 L8 32 L28 28 Z" fill="currentColor"/>
        </svg>
        <svg className="absolute bottom-20 right-20 w-16 h-16 text-white opacity-10 animate-spin-slow" fill="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8" />
        </svg>
      </div>
      
      <motion.div 
        className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-10 px-6 relative z-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left: Hero Image */}
        <motion.div 
          className="flex-shrink-0 flex justify-center items-center w-full md:w-1/2"
          variants={itemVariants}
        >
          {!imageError ? (
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl transform -translate-x-4 translate-y-4"></div>
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <Image
                  src={currentSlide.image}
                  alt="Hero Banner"
                  width={400}
                  height={400}
                  className="w-72 h-72 md:w-96 md:h-96 object-contain transform transition-all duration-700 hover:scale-105"
                  priority
                  onError={() => setImageError(true)}
                />
              </div>
            </div>
          ) : (
            <div className="w-72 h-72 md:w-96 md:h-96 flex items-center justify-center bg-gray-200 rounded-lg text-gray-500">
              <p className="text-center p-4">Image not available</p>
            </div>
          )}
        </motion.div>
        
        {/* Right: Tagline and CTA */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2 gap-4">
          <motion.h1 
            className="text-white text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-xl tracking-tight mb-2"
            variants={itemVariants}
          >
            {currentSlide.title.split(' ').map((word, i) => (
              <span key={i} className="inline-block">
                {i > 0 && ' '}
                {word === "Premium." ? (
                  <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">{word}</span>
                ) : (
                  word
                )}
              </span>
            ))}
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-2xl text-white/90 font-medium mb-4"
            variants={itemVariants}
          >
            {currentSlide.subtitle}
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Link
              href={currentSlide.btnLink}
              className="btn inline-block bg-gradient-to-r from-secondary to-secondary-light text-white text-lg px-8 py-3 rounded-full shadow-lg flex items-center gap-2 transition hover:scale-105 hover:shadow-xl"
            >
              {currentSlide.btnText}
              <FaArrowRight className="inline-block text-xl" />
            </Link>
          </motion.div>
          
          {/* Slide indicators */}
          <motion.div 
            className="flex space-x-2 mt-8"
            variants={itemVariants}
          >
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-secondary w-8" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
