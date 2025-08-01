const c = require("ansi-colors")

// Define our required environment variables
const requiredEnvs = [
  // We're uncommenting this to ensure the publishable key is available
  {
    key: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    description:
      "Learn how to create a publishable key: https://docs.medusajs.com/v2/resources/storefront-development/publishable-api-keys",
  },
]

// Set the Medusa backend URL if it's not already set
if (!process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL = "https://backend-production-1aec.up.railway.app"
  console.log(c.green(`✅ Using Medusa backend URL: ${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}`))
}

// Set the publishable API key if it's not already set
if (!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY = "pk_01HNHNZ3YB04JZQR3YVFP0FC49"
  console.log(c.green(`✅ Using Medusa publishable key: ${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`))
}

function checkEnvVariables() {
  const missingEnvs = requiredEnvs.filter(function (env) {
    return !process.env[env.key]
  })

  if (missingEnvs.length > 0) {
    console.error(
      c.red.bold("\n🚫 Error: Missing required environment variables\n")
    )

    missingEnvs.forEach(function (env) {
      console.error(c.yellow(`  ${c.bold(env.key)}`))
      if (env.description) {
        console.error(c.dim(`    ${env.description}\n`))
      }
    })

    console.error(
      c.yellow(
        "\nPlease set these variables in your .env file or environment before starting the application.\n"
      )
    )

    process.exit(1)
  }
}

module.exports = checkEnvVariables
