# ======================================
# Stage 1 — Builder (full Node for build tools)
# ======================================
FROM node:20-alpine AS builder

RUN apk add --no-cache --virtual .build-deps \
    python3 make g++ git

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps --prefer-offline --no-audit --no-fund --production=false

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm cache clean --force && npm run build
RUN apk del .build-deps

# ======================================
# Stage 2 — Production Runner (minimal Alpine)
# ======================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -D -H nextjs

# Copy production artifacts
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Install prod dependencies
RUN npm install --production --legacy-peer-deps --omit=dev

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:3000 || exit 1

# ✅ Start standalone server
CMD ["node", "server.js"]

LABEL org.opencontainers.image.title="Northern Patches Frontend" \
      org.opencontainers.image.description="Next.js frontend for Northern Patches" \
      org.opencontainers.image.source="https://github.com/your-repo" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.licenses="MIT"
