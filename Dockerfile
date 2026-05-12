# ── Stage 1: Build the main React frontend ─────────────────────────────────
FROM node:20-alpine AS client-builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build
# Output: /app/client/dist


# ── Stage 2: Build the staff portal React frontend ──────────────────────────
FROM node:20-alpine AS staff-builder

WORKDIR /app/staff-portal/client

COPY staff-portal/client/package*.json ./
RUN npm ci

COPY staff-portal/client/ ./
RUN npm run build
# Output: /app/staff-portal/client/dist


# ── Stage 3: Production Express server ─────────────────────────────────────
FROM node:20-alpine AS server

WORKDIR /app

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ ./

# Copy the built main React app into server/public
COPY --from=client-builder /app/client/dist ./public

# Copy the built staff portal into server/staff-portal (served under /staff/)
COPY --from=staff-builder /app/staff-portal/client/dist ./staff-portal

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "index.js"]
