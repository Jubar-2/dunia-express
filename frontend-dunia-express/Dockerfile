# --------------------
# 1. Base Stage
# --------------------
FROM node:24-slim AS base
WORKDIR /app

# --------------------
# 2. Dependencies Stage
# --------------------
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --------------------
# 3. Build Stage
# --------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# --------------------
# 4. Runner Stage
# --------------------
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER node

# Copy public assets and standalone output
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
