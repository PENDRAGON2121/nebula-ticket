FROM node:20-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install OpenSSL (needed for Prisma on some systems, good to have)
RUN apt-get update -y && apt-get install -y openssl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args
ARG POSTGRES_PRISMA_URL
ARG POSTGRES_URL_NON_POOLING
ARG NEXT_PUBLIC_NEBULA_ASSETS_URL

# Set environment variables for build time
ENV POSTGRES_PRISMA_URL=$POSTGRES_PRISMA_URL
ENV POSTGRES_URL_NON_POOLING=$POSTGRES_URL_NON_POOLING
ENV NEXT_PUBLIC_NEBULA_ASSETS_URL=$NEXT_PUBLIC_NEBULA_ASSETS_URL

# Generate Prisma Client (Will now generate for debian-openssl-3.0.x automatically)
RUN pnpm prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

# Production image
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install OpenSSL and CA certificates for Prisma and SSL connections
RUN apt-get update -y && apt-get install -y openssl ca-certificates

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
