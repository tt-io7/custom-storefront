import { Suspense } from "react"

import { Inter } from "next/font/google"
import "../styles/globals.css"
import { CartContextProvider } from "../modules/layout/context/cart-context"
import { AuthProvider } from "../modules/layout/lib/context/auth-context"
import LoadingBar from "@modules/common/components/loading-bar"
import dynamic from "next/dynamic"

// Import MedusaProvider dynamically to avoid SSR issues
const MedusaClientProvider = dynamic(
  () => import("../lib/medusa-provider"),
  { ssr: false }
)

export const metadata = {
  title: {
    default: "AndMore - Premium Tech Products",
    template: "%s | AndMore",
  },
  description: "Shop the latest tech gadgets and accessories at AndMore",
  keywords: ["tech", "gadgets", "electronics", "e-commerce", "accessories"],
  authors: [{ name: "AndMore Team" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://andmore.example.com",
    siteName: "AndMore",
    title: "AndMore - Premium Tech Products",
    description: "Shop the latest tech gadgets and accessories at AndMore",
    images: [{ url: "/images/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AndMore - Premium Tech Products",
    description: "Shop the latest tech gadgets and accessories at AndMore",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("http://localhost:3000"),
}

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-mode="light" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#9370DB" />
        <meta name="color-scheme" content="light" />
        {/* Preconnect to backend */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://backend-production-1aec.up.railway.app'} />
        {/* Hardware acceleration and performance optimization */}
        <style>{`
          body {
            -webkit-transform: translateZ(0);
            -moz-transform: translateZ(0);
            -ms-transform: translateZ(0);
            -o-transform: translateZ(0);
            transform: translateZ(0);
            text-rendering: optimizeSpeed;
            scroll-behavior: smooth;
          }
          
          img, svg {
            display: block;
            max-width: 100%;
          }
          
          /* Reduce animation for people who prefer reduced motion */
          @media (prefers-reduced-motion: reduce) {
            *, ::before, ::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        `}</style>
      </head>
      <body className={`${inter.variable} relative min-h-screen w-full overflow-x-hidden bg-ui-bg-base font-sans antialiased`}>
        <div className="sticky top-0 z-50">
          <LoadingBar />
        </div>
        <div className="pb-[8rem]">
          <main>
            <div>
              <Suspense>
                <AuthProvider>
                  <CartContextProvider>
                    <MedusaClientProvider>
                      <div className="flex min-h-screen flex-col">
                        {children}
                      </div>
                    </MedusaClientProvider>
                  </CartContextProvider>
                </AuthProvider>
              </Suspense>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
