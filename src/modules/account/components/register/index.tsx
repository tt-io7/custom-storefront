"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { useMemo, useState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Transform the error message into a more user-friendly format
  const errorMessage = useMemo(() => {
    if (!message) return null
    
    // Check for the specific "Identity with email already exists" error
    if (typeof message === 'string' && message.includes('Identity with email already exists')) {
      return 'An account with this email already exists. Please sign in instead.'
    }
    
    if (typeof message === 'string' && message.includes('Invalid credentials')) {
      return 'Invalid email or password format. Please check your information and try again.'
    }
    
    if (typeof message === 'string' && message.includes('Connection')) {
      return 'Connection error. The server might be temporarily unavailable. Please try again in a moment.'
    }
    
    return message
  }, [message])
  
  // Handle form submission to show loading state
  const handleSubmit = (formData: FormData) => {
    setIsSubmitting(true)
    return formAction(formData).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        Become a Medusa Store Member
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        Create your Medusa Store Member profile, and get access to an enhanced
        shopping experience.
      </p>
      <form className="w-full flex flex-col" action={handleSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
            disabled={isSubmitting}
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
            disabled={isSubmitting}
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
            disabled={isSubmitting}
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
            disabled={isSubmitting}
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
            disabled={isSubmitting}
          />
        </div>
        <ErrorMessage error={errorMessage} data-testid="register-error" />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          By creating an account, you agree to Medusa Store&apos;s{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton className="w-full mt-6" data-testid="register-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Join"}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
          disabled={isSubmitting}
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default Register
