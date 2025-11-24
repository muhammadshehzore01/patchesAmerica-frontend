# ======================================
# 🏗️ Stage 1 — Dependencies
# ======================================
FROM node:20-bullseye AS deps
WORKDIR /app

# Install system dependencies for building sharp/postcss, etc.
RUN apt-get update -y && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files first
COPY package.json package-lock.json* ./

# Install all dependencies (including dev)
RUN npm install --legacy-peer-deps

# ======================================
# 🧩 Stage 2 — Builder
# ======================================
FROM node:20-bullseye AS builder
WORKDIR /app

# Copy installed node_modules and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set production env and increase memory for Next.js build
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NEXT_DISABLE_POSTCSS_WARNING=true

# Build Next.js app
RUN npm run build

# ======================================
# 🚀 Stage 3 — Runner
# ======================================
FROM node:20-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy production-ready files only
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

# Start the app
CMD ["npm", "start"]
