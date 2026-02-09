# ======================================
# Stage 1 — Builder (full Node for build tools)
# ======================================
FROM node:20-alpine AS builder

# Install only necessary build dependencies (Alpine style – minimal footprint)
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++ \
    git

WORKDIR /app

# Copy package files first – better layer caching
COPY package*.json ./

# Install dependencies offline-first, legacy-peer-deps for compatibility
RUN npm ci --legacy-peer-deps --prefer-offline --no-audit --no-fund --production=false

# Copy source code
COPY . .

# Production environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Clean cache & build – prevents corruption on slow/unstable networks
RUN npm cache clean --force \
    && npm run build

# Remove build dependencies to reduce image size
RUN apk del .build-deps

# ======================================
# Stage 2 — Production Runner (minimal & secure Alpine runtime)
# ======================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user & group (security best practice)
RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -D -H nextjs

# Copy only necessary production artifacts – correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Reliable healthcheck – uses curl (more robust than wget in Alpine)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:3000 || exit 1

# Start Next.js standalone server directly (reliable, no npm overhead)
CMD ["node", "server.js"]

# Build-time labels – useful for debugging & CI/CD
LABEL org.opencontainers.image.title="Northern Patches Frontend" \
      org.opencontainers.image.description="Next.js frontend for Northern Patches" \
      org.opencontainers.image.source="https://github.com/your-repo" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.licenses="MIT"
