FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy all files
COPY . .

# Set build-time environment variables to prevent connection errors
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-1aec.up.railway.app
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_BUILD_PRODUCT_FETCH=true
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_14fd58d207ae2de18706dc8fcd42880b7ff798c8e5d066cb07962d419f35669a

# Build application
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production
ENV PORT=8000
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-1aec.up.railway.app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_14fd58d207ae2de18706dc8fcd42880b7ff798c8e5d066cb07962d419f35669a

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/check-env-variables.js ./check-env-variables.js

# Run the application
CMD ["npm", "start"] 