# Multi-stage build for production optimization

# Frontend build stage
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Backend build stage
FROM node:20-alpine AS backend-build
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source and build
COPY backend/ ./
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy backend production files
COPY --from=backend-build --chown=nextjs:nodejs /app/backend/dist ./backend/dist
COPY --from=backend-build --chown=nextjs:nodejs /app/backend/package*.json ./backend/
COPY --from=backend-build --chown=nextjs:nodejs /app/backend/sql ./backend/sql

# Copy frontend build files to serve them statically
COPY --from=frontend-build --chown=nextjs:nodejs /app/frontend/dist ./frontend/dist

# Install only production dependencies
WORKDIR /app/backend
RUN npm ci --only=production && npm cache clean --force

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]
