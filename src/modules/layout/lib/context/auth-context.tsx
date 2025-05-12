'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
interface Customer {
  id: string
  email: string
  first_name?: string
  last_name?: string
}

interface AuthContextType {
  customer: Customer | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<Customer | null>
  refresh: () => Promise<void>
  getProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state from localStorage on client side
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check if we have a token in localStorage
        const token = localStorage.getItem('medusa_access_token')
        if (token) {
          setAccessToken(token)
          await fetchCustomer(token)
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
        // Clear token if it's invalid
        if (typeof window !== 'undefined') {
          localStorage.removeItem('medusa_access_token')
        }
        setAccessToken(null)
        setCustomer(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      initializeAuth()
    } else {
      setIsLoading(false)
    }
  }, [])

  // Fetch customer profile using token
  const fetchCustomer = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch customer profile')
      }

      const data = await response.json()
      setCustomer(data.customer)
    } catch (err) {
      console.error('Error fetching customer:', err)
      throw err
    }
  }

  // Refresh access token
  const refresh = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!accessToken) {
        console.log('No token to refresh')
        return
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        // Token refresh failed, log out
        setAccessToken(null)
        setCustomer(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('medusa_access_token')
        }
        return
      }

      const data = await response.json()
      const newToken = data.token || data.access_token

      if (newToken) {
        setAccessToken(newToken)
        if (typeof window !== 'undefined') {
          localStorage.setItem('medusa_access_token', newToken)
        }
      }
    } catch (err) {
      console.error('Token refresh error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Get customer profile
  const getProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!accessToken) {
        console.log('No token to get profile')
        return
      }

      await fetchCustomer(accessToken)
    } catch (err) {
      console.error('Get profile error:', err)
      setError('Failed to get profile')
    } finally {
      setIsLoading(false)
    }
  }

  // Login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('Starting login process for:', email)

      // Try direct API call to Medusa
      try {
        console.log('Making direct API call to Medusa for login...')
        const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
        const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

        const loginResponse = await fetch(`${MEDUSA_BACKEND_URL}/auth/customer/emailpass`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_API_KEY
          },
          body: JSON.stringify({
            email,
            password
          }),
        })

        console.log('Login response status:', loginResponse.status)

        if (!loginResponse.ok) {
          // Check if the response is HTML
          const responseText = await loginResponse.text()
          if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
            console.error('Received HTML instead of JSON in login response')
            throw new Error('Server returned HTML instead of JSON. Login failed.')
          }

          // Try to parse as JSON
          try {
            const errorData = JSON.parse(responseText)
            console.error('Login API error details:', errorData)
            throw new Error(errorData.message || errorData.error || 'Login failed')
          } catch (jsonError) {
            console.error('Failed to parse login error response as JSON:', responseText)
            throw new Error('Login failed with invalid server response')
          }
        }

        const data = await loginResponse.json()
        console.log('Login response data keys:', Object.keys(data).join(', '))

        // Check for token (support both 'token' and 'access_token' formats)
        const token = data.token || data.access_token

        if (!token) {
          throw new Error('No token received from login endpoint')
        }

        console.log('Login successful, token received')

        // Store token in state
        setAccessToken(token)

        // Also store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('medusa_access_token', token)
        }

        // Fetch customer profile with the token
        console.log('Fetching customer profile with token...')
        const customerResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-publishable-api-key': PUBLISHABLE_API_KEY
          }
        })

        if (!customerResponse.ok) {
          console.error('Failed to fetch customer profile:', customerResponse.status)
          throw new Error('Login successful but failed to fetch customer profile')
        }

        const customerData = await customerResponse.json()
        console.log('Customer profile fetched successfully')

        // Set customer data
        setCustomer(customerData.customer)
      } catch (directApiError) {
        console.error('Direct API call failed:', directApiError)
        throw directApiError
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      // Clear state
      setAccessToken(null)
      setCustomer(null)

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('medusa_access_token')
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Register
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('Starting registration process for:', email)

      // Try direct API call to Medusa
      try {
        // Step 1: Get registration token
        console.log('Step 1: Getting registration token from Medusa...')
        const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
        const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

        const registrationResponse = await fetch(`${MEDUSA_BACKEND_URL}/auth/customer/emailpass/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_API_KEY
          },
          body: JSON.stringify({
            email,
            password
          }),
        })

        console.log('Registration token response status:', registrationResponse.status)

        if (!registrationResponse.ok) {
          // Check if the response is HTML
          const responseText = await registrationResponse.text()
          if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
            console.error('Received HTML instead of JSON in registration response')
            throw new Error('Server returned HTML instead of JSON. Registration failed.')
          }

          // Try to parse as JSON
          try {
            const errorData = JSON.parse(responseText)
            console.error('Registration token error details:', errorData)

            // Handle the case where the email already exists
            if (errorData.message === 'Identity with email already exists' ||
                errorData.type === 'unauthorized') {
              console.log('Email already exists, attempting login instead...')

              // Try to login with the provided credentials
              return await login(email, password)
            }

            throw new Error(errorData.message || `Registration token request failed with status ${registrationResponse.status}`)
          } catch (jsonError) {
            if (jsonError instanceof Error && jsonError.message.includes('login')) {
              // This is from the login attempt, just rethrow it
              throw jsonError
            }
            console.error('Failed to parse registration error response as JSON:', responseText)
            throw new Error(`Registration token request failed with status ${registrationResponse.status}`)
          }
        }

        const registerData = await registrationResponse.json()
        const token = registerData.token

        if (!token) {
          throw new Error('No token received from registration endpoint')
        }

        // Step 2: Create customer with the token
        console.log('Step 2: Creating customer with token...')
        const customerResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-publishable-api-key': PUBLISHABLE_API_KEY
          },
          body: JSON.stringify({
            email,
            first_name: firstName || '',
            last_name: lastName || ''
          }),
        })

        console.log('Customer creation response status:', customerResponse.status)

        if (!customerResponse.ok) {
          throw new Error(`Customer creation failed with status ${customerResponse.status}`)
        }

        const customerData = await customerResponse.json()

        // Set the customer and token in the context
        setCustomer(customerData.customer)
        setAccessToken(token)

        // Store the token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('medusa_access_token', token)
        }

        setIsLoading(false)
        return customerData.customer
      } catch (directApiError) {
        console.error('Direct API call failed:', directApiError)
        setIsLoading(false)
        setError('Registration failed: ' + (directApiError instanceof Error ? directApiError.message : 'Unknown error'))
        throw directApiError
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      // Log more detailed error information
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          stack: err.stack
        })
      }
      setError(err.message || 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isLoading,
        error,
        login,
        logout,
        register,
        refresh,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}