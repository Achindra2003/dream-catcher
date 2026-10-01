# =========================================================================
# PRODUCTION-GRADE MULTI-STAGE DOCKERFILE FOR DREAM CATCHER
# MCA Trimester 5 - DevOps Lab
# =========================================================================

# Stage 1: Build & Native Compilation Stage
FROM node:20-slim AS builder

WORKDIR /build

# Install compiler toolchain required for sqlite3 native compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Clean production install with native source compilation
RUN npm ci --omit=dev --build-from-source && \
    npm cache clean --force

# Stage 2: Hardened, Minimal, Non-Root Runtime Stage
FROM node:20-slim AS runner

LABEL org.opencontainers.image.title="Dream Catcher" \
      org.opencontainers.image.description="Dream Journal with AI Interpretation - Full Stack DevOps Container" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.authors="Achindra Sharma <2547105>" \
      org.opencontainers.image.licenses="MIT"

ENV NODE_ENV=production \
    PORT=3001

WORKDIR /app

# Ensure /app ownership by non-root node user
RUN chown -R node:node /app

# Copy production node_modules from builder stage
COPY --chown=node:node --from=builder /build/node_modules ./node_modules
COPY --chown=node:node package*.json ./

# Copy application source code and static assets
COPY --chown=node:node server.js ./
COPY --chown=node:node config ./config
COPY --chown=node:node routes ./routes
COPY --chown=node:node utils ./utils
COPY --chown=node:node public ./public

# Switch to least-privilege non-root user (UID 1000)
USER node

EXPOSE 3001

CMD ["node", "server.js"]
