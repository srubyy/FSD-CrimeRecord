# ====================================================
# Stage 1: Dependency Installation (Production dependencies only)
# ====================================================
FROM node:20-alpine AS deps
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# ====================================================
# Stage 2: Minimal Production Runtime
# ====================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY server/ ./server/

# Expose backend service port (Default 5001)
EXPOSE 5001

# Run as non-root 'node' user for container security
USER node

# Start Express & Socket.IO server
CMD ["node", "server/index.js"]
