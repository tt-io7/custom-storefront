import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { useState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Format error message for better UX
  const formattedMessage = message 
    ? (typeof message === 'string' && message.includes('Connection')) 
      ? "Connection error. The server might be temporarily unavailable. Please try again in a moment."
      : message
    : null

  // Handle the form submission to show loading state
  const handleSubmit = (formData: FormData) => {
    setIsSubmitting(true)
    return formAction(formData).finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Welcome back</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Sign in to access an enhanced shopping experience.
      </p>
      <form className="w-full" action={handleSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
            disabled={isSubmitting}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
            disabled={isSubmitting}
          />
        </div>
        <ErrorMessage error={formattedMessage} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
          disabled={isSubmitting}
        >
          Join us
        </button>
        .
      </span>
    </div>
  )
}

export default Login
