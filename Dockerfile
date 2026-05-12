# ── Stage 1: Build the React frontend ──────────────────────────────────────
FROM node:20-alpine AS client-builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build
# Output: /app/client/dist


# ── Stage 2: Production Express server ─────────────────────────────────────
FROM node:20-alpine AS server

WORKDIR /app

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ ./

# Copy the built React app into server/public so Express can serve it
COPY --from=client-builder /app/client/dist ./public

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "index.js"]
