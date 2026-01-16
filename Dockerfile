# ======================================
# Stage 1 — Dependencies
# ======================================
FROM node:20-bullseye AS deps
WORKDIR /app

RUN apt-get update -y && apt-get install -y python3 make g++ curl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# ======================================
# Stage 2 — Builder
# ======================================
FROM node:20-bullseye AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NEXT_DISABLE_POSTCSS_WARNING=true

# Build Next.js AND generate sitemap in one step
RUN npm run build

# ======================================
# Stage 3 — Runner
# ======================================
FROM node:20-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV PATH=/app/node_modules/.bin:$PATH

# Copy production-ready files including public (sitemap)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

 

EXPOSE 3000

CMD ["next", "start", "-p", "3000"]
