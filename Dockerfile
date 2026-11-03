# =========================================================================
# PRODUCTION MULTI-STAGE DOCKERFILE FOR DREAM CATCHER (Postgres edition)
# MCA Trimester 5 - DevOps Lab
# =========================================================================

# Stage 1: install production dependencies (pure JS now - no native toolchain)
FROM node:20-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Stage 2: hardened, minimal, non-root runtime
FROM node:20-alpine AS runner

LABEL org.opencontainers.image.title="Dream Catcher" \
      org.opencontainers.image.description="Dream Journal with AI Interpretation" \
      org.opencontainers.image.version="1.1.0" \
      org.opencontainers.image.authors="Achindra Sharma <2547105>" \
      org.opencontainers.image.licenses="MIT"

ENV NODE_ENV=production \
    PORT=3001

WORKDIR /app

COPY --chown=node:node --from=builder /build/node_modules ./node_modules
COPY --chown=node:node package*.json ./
COPY --chown=node:node app.js server.js ./
COPY --chown=node:node config ./config
COPY --chown=node:node routes ./routes
COPY --chown=node:node utils ./utils
COPY --chown=node:node public ./public

USER node
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

CMD ["node", "server.js"]
