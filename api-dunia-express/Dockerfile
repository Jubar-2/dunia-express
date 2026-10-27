# --------------------
# 1. Build Stage
# --------------------
FROM node:24-slim AS builder

WORKDIR /app

# Install compilation tools in case native dependencies (e.g. bcrypt) need to build from source
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Remove development dependencies so only production modules remain
RUN npm prune --omit=dev

# --------------------
# 2. Production Stage
# --------------------
FROM node:24-slim AS runner

WORKDIR /app

# Install dumb-init for proper signal handling (PID 1 graceful shutdown)
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000

# Copy package metadata, pruned node_modules, compiled assets, and migrations
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/drizzle ./drizzle

# Run as non-root user
USER node

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]